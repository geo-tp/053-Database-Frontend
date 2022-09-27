// ############### GLOBAL VARIABLES ##################

const magnifier = document.querySelector("#spawn-map-magnifier");
const kalimdor = document.querySelector("#Kalimdor_map");
const easternKingdom = document.querySelector("#Eastern_Kingdoms_map");
const caroussel = document.querySelector("#spawn-map-caroussel");
const helpBox = document.querySelector("#spawn-map-help-box");
const mapArrows = [
  caroussel.querySelector(".caroussel__left-arrow"),
  caroussel.querySelector(".caroussel__right-arrow"),
];
const spawnPoints = document.querySelectorAll(
  "#spawn-map-caroussel .spawn_point"
);
let actualMapInUse = kalimdor;
let originalSpawnPoints = [];
let modifiedSpawnPoints = [];
const magnifierHeight = 1300;
const magnifierWidth = 1300;
let magnifierZoomLevel = 1;
let magnifierX = 0;
let magnifierY = 0;

let scrollPageX = 0;
let scrollPageY = 0;

// ############### INIT ##################

function cloneSpawnPoints() {
  for (let point of spawnPoints) {
    originalSpawnPoints.push({
      style: { top: point.style.top, left: point.style.left },
    });
  }
}
cloneSpawnPoints();

// ############### EVENT BINDS ##################

caroussel.onwheel = onMouseWheelArea;

// ############### EVENT FUNCS ##################

// Zoom/Dezoom when mouse wheel is triggered
function onMouseWheelArea(e) {
  e.preventDefault();

  // target is <img> here, so we get parentNode map-container
  let container = e.target.parentNode;

  // Update scroll position with cursor
  // TODO: Cursor should stay at exact map position while zooming/dezooming
  const { top, left } = container.getBoundingClientRect();
  container.scrollTop =
    (e.pageY - top - window.pageYOffset) * magnifierZoomLevel;
  container.scrollLeft =
    (e.pageX - left - window.pageXOffset) * magnifierZoomLevel;

  if (e.deltaX != 0) {
    return;
  }

  // Dezoom
  if (e.deltaY > 0) {
    if (magnifierZoomLevel - 0.1 < 1) {
      magnifierZoomLevel = 1;
      _ShowMapUi();
      return;
    }
    magnifierZoomLevel -= 0.1;
  }
  // Zoom
  else {
    if (magnifierZoomLevel > 11) {
      return;
    }

    magnifierZoomLevel += 0.1;
  }
  _hideMapUi();
  _updateSpawnPointsPosition();
  _updateMapSize();
}

function onMouseDownMapContainer(event) {
  event.preventDefault();
  let container = event.target.parentNode;

  container.style.cursor = "grabbing";
  container.onmousemove = onMouseMoveMapContainer;
}

function onMouseMoveMapContainer(event) {
  let container = event.target.parentNode;

  // //deal with the horizontal case
  // if (scrollPageX < event.pageX) {
  //   directionX = "right";
  // } else {
  //   directionX = "left";
  // }

  // //deal with the vertical case
  // if (scrollPageY < event.pageY) {
  //   directionY = "down";
  // } else {
  //   directionY = "up";
  // }

  // scrollPageX = event.pageX;
  // scrollPageY = event.pageY;

  const [directionX, directionY] = _determineDragDirection(event);

  container.scrollLeft += directionX == "right" ? -10 : 10;
  container.scrollTop += directionY == "down" ? -10 : 10;
}

function onMouseUpMapContainer(event) {
  let container = event.target.parentNode;
  container.style.cursor = "unset";
  container.onmousemove = null;
}

function onMouseLeaveMapContainer(event) {
  let container = event.target;

  container.onmousemove = () => {};
  container.style.cursor = "unset";

  // _closeMagnifier();
}

// When mouse leave a point (UNUSED)
function onMouseLeavePoint(e) {
  e;
  return;
}

// ############### PRIVATE FUNCTIONS ##################

function _hideMapUi() {
  for (let arrow of mapArrows) {
    arrow.style.display = "none";
  }

  helpBox.style.display = "none";
}

function _ShowMapUi() {
  for (let arrow of mapArrows) {
    arrow.style.display = "block";
  }

  helpBox.style.display = "block";
}

function _determineDragDirection(event) {
  let directionX = null;
  let directionY = null;

  //deal with the horizontal case
  if (scrollPageX < event.pageX) {
    directionX = "right";
  } else {
    directionX = "left";
  }

  //deal with the vertical case
  if (scrollPageY < event.pageY) {
    directionY = "down";
  } else {
    directionY = "up";
  }

  console.log("SCROLLPAGEX : ", scrollPageX, "EVENT PAGEX : ", event.pageX);

  scrollPageX = event.pageX;
  scrollPageY = event.pageY;

  return [directionX, directionY];
}

function _updateSpawnPointsPosition() {
  for (let i = 0; i < spawnPoints.length; i++) {
    spawnPoints[i].style.left = `${
      parseFloat(originalSpawnPoints[i].style.left) * magnifierZoomLevel
    }px`;
    spawnPoints[i].style.top = `${
      parseFloat(originalSpawnPoints[i].style.top) * magnifierZoomLevel
    }px`;
  }
}

function _updateMapSize() {
  kalimdor.setAttribute(
    "style",
    `width:${345 * magnifierZoomLevel}px; height:${650 * magnifierZoomLevel}px`
  );
}

// Set display to none and reset points to their original location
function _closeMagnifier() {
  magnifier.style.display = "none";
  _resetModifiedSpawnPoints();
}

// Update magnifier top/left and its background img position to new coords
function _updateMagnifierPosition() {
  const widthToAdd = _calculateWidthToAdd();
  magnifier.style.top = `${magnifierY - magnifierHeight / 2}px`;
  magnifier.style.left = `${magnifierX - magnifierHeight / 2}px`;

  magnifier.style.backgroundPositionX = `${
    -magnifierX * magnifierZoomLevel +
    magnifierWidth / 2 +
    widthToAdd * magnifierZoomLevel
  }px`;
  magnifier.style.backgroundPositionY = `${
    -magnifierY * magnifierZoomLevel + magnifierHeight / 2
  }px`;
}

// Magnifier will align its center with point
function _alignMagnifierWithPoint(point) {
  const widthToAdd = _calculateWidthToAdd();
  magnifierX = _domValueToFloat(point.style.left) + widthToAdd;
  magnifierY = _domValueToFloat(point.style.top);

  _updateMagnifierPosition();
}

// Determine if both map are present in caroussel to add the first map width
function _calculateWidthToAdd() {
  let widthToAdd = 0;
  if (
    kalimdor != null &&
    easternKingdom != null &&
    actualMapInUse.target.isEqualNode(easternKingdom)
  ) {
    widthToAdd = kalimdor.width;
  }

  return widthToAdd;
}

// Check if point is in actual map hovered by mouse
function _checkIfPointIsInActualMap(point) {
  if (!actualMapInUse) {
    return;
  }

  const mapContainer = actualMapInUse.parentNode;
  const mapChildren = mapContainer.children;
  for (let element of mapChildren) {
    let mapPoint = element.firstElementChild;
    if (mapPoint && mapPoint.isEqualNode(point)) {
      return true;
    }
  }

  return false;
}

// Return float value of DOM style property : 45.12% -> 45.12
function _domValueToFloat(value) {
  return parseFloat(value.split("px")[0]);
}

// Calculate distance between coords
function _calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

// Calculate distance between 2 points and return result
// function _calculateDistanceBetweenPoints(point1, point2) {
//   const point1Y = _domValueToFloat(point1.style.top);
//   const point1X = _domValueToFloat(point1.style.left);
//   const point2Y = _domValueToFloat(point2.style.top) + magnifierHeight / 2;
//   const point2X = _domValueToFloat(point2.style.left) + magnifierHeight / 2;

//   return _calculateDistance(point1X, point1Y, point2X, point2Y);
// }

// Check if point is in magnifier radius
// function _checkIfPointIsInMagnifier(point) {
//   const widthToAdd = _calculateWidthToAdd();
//   // we had point width/2 to be sure that point cant be in between magnifier border
//   const radius = magnifierHeight / 2 + point.width.animVal.value / 2;
//   const pointX = _domValueToFloat(point.style.left) + widthToAdd;
//   const pointY = _domValueToFloat(point.style.top);
//   const distance = _calculateDistance(magnifierX, magnifierY, pointX, pointY);
//   return distance < radius;
// }

// function onClickLeftMapContainer(e) {
//   e.preventDefault();
//   kalimdor.setAttribute(
//     "style",
//     `width:${kalimdor.width + 345}px; height:${kalimdor.height + 650}px`
//   );

//   for (let point of spawnPoints) {
//     point.style.top = `${_domValueToFloat(point.style.top) * 2}px`;
//     point.style.left = `${_domValueToFloat(point.style.left) * 2}px`;
//   }

//   kalimdor.width += 345;
//   kalimdor.height += 650;
//   console.log("ONCLICK", actualMapInUse.width);
// }

// function onClickRightMapContainer(e) {
// e.preventDefault();
// kalimdor.setAttribute(
//   "style",
//   `width:${kalimdor.width - 345}px; height:${kalimdor.height - 650}px`
// );

// kalimdor.width += 345;
// kalimdor.height += 650;
// console.log("ONCLICK", actualMapInUse.width);
// }

// function onDragStartMapContainer(e) {
//   console.log("START DRAG");
// e.preventDefault();

// const elem = e.currentTarget;
// const { top, left } = elem.getBoundingClientRect();

// dragOffSetX = e.clientX;
// dragOffSetY = e.clientY;
// dragOffSetX = parseFloat(e.target.style.left);
// dragOffSetY = parseFloat(e.target.style.top);
// dragIsActivated = true;
// e.onmousemove = onDragMoveImg;
// return false;
// // calculate cursor position on the image
// const x = e.pageX - left - window.pageXOffset;
// const y = e.pageY - top - window.pageYOffset;
// startY = y;
// }

// function onDragMoveImg(e) {
// if (!dragIsActivated) {
//   return;
// }
//   console.log("DRAG MOVE");

//   actualMapInUse.style.left =
//     (dragCoordX + e.clientX - dragOffSetX) * magnifierZoomLevel * -1;
//   actualMapInUse.style.top =
//     (dragCoordY + e.clientY - dragCoordY) * magnifierZoomLevel * -1;
//   return false;
// }

// function onDragEndMapContainer(e) {
//   console.log("END DRAG");
//   dragIsActivated = false;
//   e.onmousedown = onDragStartMapContainer;
//   e.onmouseup = onDragEndMapContainer;
//   const elem = e.currentTarget;
//   const { top, left } = elem.getBoundingClientRect();

//   // calculate cursor position on the image
//   const x = e.pageX - left - window.pageXOffset;
//   const y = e.pageY - top - window.pageYOffset;
//   endY = y;
//   console.log(e.target.scrollTop);
//   e.target.scrollTop = e.target.scrollTop + 100;
// }

// When mouse hover on image, we initialise magnifier without display it
// function onMouseEnterImg(e) {
// actualMapInUse = e.target;
// const map = e.target;
// // actualMapInUse = e;
// const { width, height } = map;
// map.style.width = `${width + 345}px`;
// map.style.height = `${height + 650}px`;
// // Prevent display to be a empty string
// if (magnifier.style.display == "") {
//   magnifier.style.display = "none";
// }
// magnifier.style.height = `${magnifierHeight}px`;
// magnifier.style.width = `${magnifierWidth}px`;
// magnifier.style.backgroundImage = `url(${map.src})`;
// magnifier.style.backgroundSize = `${width * magnifierZoomLevel}px ${
//   height * magnifierZoomLevel
// }px`;
// }

// When mouse hover a point and magnifier is not open, we display magnifier
// function onMouseEnterPoint(e) {
// const svg = e.target.childNodes[1];
// // if magnifier is already open, we do nothing
// if (magnifier.style.display != "none") {
//   return;
// }
// _resetModifiedSpawnPoints();
// magnifier.style.display = "block";
// e.target.style.zIndex = "1001";
// _alignMagnifierWithPoint(svg);
// for (let point of spawnPoints) {
//   if (!point.isEqualNode(svg) && _checkIfPointIsInActualMap(point)) {
//     _correctMagnifiedPointPosition(svg, point);
//   }
// }
// }

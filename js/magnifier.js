// ############### GLOBAL VARIABLES ##################

const magnifier = document.querySelector(".magnifier");
const kalimdor = document.querySelector("#Kalimdor_map");
const easternKingdom = document.querySelector("#Eastern_Kingdoms_map");
let actualMapInUse = kalimdor;
// actualMapInUse.addEventListener("click", onClickLeftMapContainer);
// actualMapInUse.addEventListener("contextmenu", onClickRightMapContainer);
const spawnPoints = document.querySelectorAll(".spawn_point");
let modifiedSpawnPoints = [];
const magnifierHeight = 1300;
const magnifierWidth = 1300;
const magnifierZoomLevel = 1;
let magnifierX = 0;
let magnifierY = 0;
let dragOffSetX = null;
let dragOffSetY = null;
let dragCoordX = null;
let dragCoordY = null;
let dragIsActivated = false;

// ############### EVENT BINDS ##################

const caroussel = document.querySelector(".caroussel");
caroussel.onwheel = onMouseWheelArea;

// ############### EVENT FUNCS ##################

// Zoom/Dezoom when mouse wheel is triggered
function onMouseWheelArea(e) {
  e.preventDefault();

  if (e.deltaY > 0) {
    if (magnifierZoomLevel > 11) {
      return;
    }

    magnifierZoomLevel += 0.5;
  }
  // it's a dezoom
  else {
    if (magnifierZoomLevel - 0.5 < 1) {
      magnifierZoomLevel = 1;
      return;
    }
    magnifierZoomLevel -= 0.5;
  }

  for (let point of spawnPoints) {
    if (_checkIfPointIsInActualMap(actualMapInUse)) {
      point.style.left = `${parseFloat(point.style.left) * magnifierZoomLevel}`;
      point.style.top = `${parseFloat(point.style.top) * magnifierZoomLevel}`;
    }
  }

  actualMapInUse.setAttribute(
    "style",
    `width:${actualMapInUse.width * magnifierZoomLevel}px; height:${
      actualMapInUse.height * magnifierZoomLevel
    }px`
  );

  console.log(actualMapInUse.style.width);
}

function onClickLeftMapContainer(e) {
  e.preventDefault();
  // kalimdor.setAttribute(
  //   "style",
  //   `width:${kalimdor.width + 345}px; height:${kalimdor.height + 650}px`
  // );

  // for (let point of spawnPoints) {
  //   point.style.top = `${_domValueToFloat(point.style.top) * 2}px`;
  //   point.style.left = `${_domValueToFloat(point.style.left) * 2}px`;
  // }

  // kalimdor.width += 345;
  // kalimdor.height += 650;
  console.log("ONCLICK", actualMapInUse.width);
}

function onClickRightMapContainer(e) {
  e.preventDefault();
  // kalimdor.setAttribute(
  //   "style",
  //   `width:${kalimdor.width - 345}px; height:${kalimdor.height - 650}px`
  // );

  // kalimdor.width += 345;
  // kalimdor.height += 650;
  console.log("ONCLICK", actualMapInUse.width);
}

function onDragStartMapContainer(e) {
  console.log("START DRAG");
  // e.preventDefault();

  // const elem = e.currentTarget;
  // const { top, left } = elem.getBoundingClientRect();

  dragOffSetX = e.clientX;
  dragOffSetY = e.clientY;
  dragOffSetX = parseFloat(e.target.style.left);
  dragOffSetY = parseFloat(e.target.style.top);
  dragIsActivated = true;
  // e.onmousemove = onDragMoveImg;
  return false;
  // // calculate cursor position on the image
  // const x = e.pageX - left - window.pageXOffset;
  // const y = e.pageY - top - window.pageYOffset;
  // startY = y;
}

function onDragMoveImg(e) {
  // if (!dragIsActivated) {
  //   return;
  // }
  console.log("DRAG MOVE");

  actualMapInUse.style.left = dragCoordX + e.clientX - dragOffSetX;
  actualMapInUse.style.top = dragCoordY + e.clientY - dragCoordY;
  return false;
}

function onDragEndMapContainer(e) {
  console.log("END DRAG");
  dragIsActivated = false;
  e.onmousedown = onDragStartMapContainer;
  e.onmouseup = onDragEndMapContainer;
  const elem = e.currentTarget;
  const { top, left } = elem.getBoundingClientRect();

  // calculate cursor position on the image
  const x = e.pageX - left - window.pageXOffset;
  const y = e.pageY - top - window.pageYOffset;
  endY = y;
  console.log(e.target.scrollTop);
  e.target.scrollTop = e.target.scrollTop + 100;
}

function onMouseDownMapContainer(event) {
  event.preventDefault();
  console.log(event.target);
  let container = event.target.parentNode;
  console.log(container.scrollTop);
  container.onmousemove = onMouseMoveMapContainer;
  return;
  // event.onmousemove = onMouseMoveImg;
  // event = event.target;
  // _startX = event.clientX;
  // _startY = event.clientY;
  // _offsetX = event.offsetLeft;
  // _offsetY = event.offsetTop;
  // console.log(event);
  // // actualMapInUse = event.target;
}

function onMouseMoveMapContainer(event) {
  console.log("ON MOVE");
  console.log(event.clientX);
  // console.log(event.clientY);
  let container = event.target.parentNode;
  const { top, left } = container.getBoundingClientRect();

  console.log(
    "SCROLLTOP  : ",
    event.pageY - event.clientY - window.pageYOffset
  );
  console.log("SCROLLLEFT  : ", container.scrollLeft);
  container.scrollTop = event.pageY - top - window.pageYOffset;
  container.scrollLeft = event.pageX - left - window.pageXOffset;
  // console.log(event);
  // console.log(event.target.scrollLeft);
  // actualMapInUse.style.left = _offsetX + event.clientX - _startX + "px";
  // actualMapInUse.style.top = _offsetY + event.clientY - _startY + "px";
  return;
}

function onMouseUpMapContainer(event) {
  let container = event.target.parentNode;
  container.onmousemove = null;
  return;
  // event.onmousemove = null;
  // actualMapInUse = null;
}

// Zoom/Dezoom when mouse wheel is triggered
function onMouseWheelArea(e) {
  e.preventDefault();
  console.log(e.deltaY);

  const { top, left } = e.target.getBoundingClientRect();

  // calculate cursor position on the image
  let cursorX = e.pageX - left - window.pageXOffset;
  let cursorY = e.pageY - top - window.pageYOffset;

  // if (actualReferencePoint) {
  //   const distance = _calculateDistance(
  //     cursorX,
  //     cursorY,
  //     actualReferencePoint.cursorX,
  //     actualReferencePoint.cursorY
  //   );

  //   cursorX = cursorX - distance/magnifierZoomLevel;
}

// ############### EVENT FUNCTIONS ##################

// When mouse leave caroussel, we close magnifier
function onMouseLeaveArea(e) {
  e;
  _closeMagnifier();
}

// When mouse hover on image, we initialise magnifier without display it
function onMouseEnterImg(e) {
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
}

// When mouse hover a point and magnifier is not open, we display magnifier
function onMouseEnterPoint(e) {
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
}

// When mouse leave a point (UNUSED)
function onMouseLeavePoint(e) {
  e;
  return;
}

// ############### PRIVATE FUNCTIONS ##################

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

  const mapContainer = actualMapInUse.target.parentNode;
  const mapChildren = mapContainer.children;
  for (let element of mapChildren) {
    let mapPoint = element.firstElementChild;
    if (mapPoint && mapPoint.isEqualNode(point)) {
      return true;
    }
  }

  return false;
}

// Update spawn point location to fit zoom
function _correctMagnifiedPointPosition(referencePoint, point) {
  // distance difference X between points
  let diffX =
    (_domValueToFloat(referencePoint.style.left) -
      _domValueToFloat(point.style.left)) *
    magnifierZoomLevel;

  // distance difference Y between points
  let diffY =
    (_domValueToFloat(referencePoint.style.top) -
      _domValueToFloat(point.style.top)) *
    magnifierZoomLevel;

  let updatedPoint = point.cloneNode();
  updatedPoint.style.top = `${
    _domValueToFloat(referencePoint.style.top) - diffY
  }px`;
  updatedPoint.style.left = `${
    _domValueToFloat(referencePoint.style.left) - diffX
  }px`;

  // we push point into array to be able to reset its location later
  modifiedSpawnPoints.push({
    point,
    originalY: point.style.top,
    originalX: point.style.left,
  });

  point.style.top = updatedPoint.style.top;
  point.style.left = updatedPoint.style.left;
}

// We set original point location when magnifier is closed
function _resetModifiedSpawnPoints() {
  for (let elem of modifiedSpawnPoints) {
    elem.point.style.top = elem.originalY;
    elem.point.style.left = elem.originalX;
    elem.point.style.display = "block";
  }
  modifiedSpawnPoints = [];
}

// Return float value of DOM style property : 45.12% -> 45.12
function _domValueToFloat(value) {
  return parseFloat(value.split("%")[0]);
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

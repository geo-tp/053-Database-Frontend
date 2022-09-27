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
let actualMapInUse = null;
let originalSpawnPoints = [];
let magnifierZoomLevel = 1;

let scrollPageX = 0;
let scrollPageY = 0;
let zoomPositionX = 0;
let zoomPositionY = 0;

// ############### INIT ##################

// Save original points coords to be able to calculate zoomed positions
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
function onMouseWheelArea(event) {
  event.preventDefault();

  // target is <img> here, so we get parentNode map-container
  let container = event.target.parentNode;

  if (event.deltaX != 0) {
    return;
  }

  // Dezoom
  if (event.deltaY > 0) {
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

  // Update scroll position with cursor
  const [cursorX, cursorY] = _getCursorPosition(container, event);
  container.scrollTop = cursorY * (magnifierZoomLevel - 1);
  container.scrollLeft = cursorX * (magnifierZoomLevel - 1);

  _hideMapUi();
  _updateSpawnPointsPosition();
  _updateMapSize();
}

function onMouseEnterImg(event) {
  actualMapInUse = event.target;
}

function onMouseDownMapContainer(event) {
  event.preventDefault();
  let container = event.target.parentNode;

  container.style.cursor = "grabbing";
  container.onmousemove = onMouseMoveMapContainer;
}

function onMouseMoveMapContainer(event) {
  let container = event.target.parentNode;

  const [directionX, directionY] = _determineDragDirection(event);
  _applyDragMove(container, directionX, directionY);
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
}

// ############### PRIVATE FUNCS ##################

// Calculate cursor position
function _getCursorPosition(container, event) {
  const { top, left } = container.getBoundingClientRect();

  const cursorX = event.pageX - left - window.pageXOffset;
  const cursorY = event.pageY - top - window.pageYOffset;

  return [cursorX, cursorY];
}

// Hide map UI elements when Zoom is activated
function _hideMapUi() {
  for (let arrow of mapArrows) {
    arrow.style.display = "none";
  }

  helpBox.style.display = "none";
}

// Hide map UI elements when Zoom is at 1.0
function _ShowMapUi() {
  for (let arrow of mapArrows) {
    arrow.style.display = "block";
  }

  helpBox.style.display = "block";
}

// Determine if user drag to left/right and down/up
function _determineDragDirection(event) {
  let directionX = null;
  let directionY = null;

  let diffX = event.pageX - scrollPageX;
  let diffY = event.pageY - scrollPageY;

  //deal with the horizontal case
  if (scrollPageX < event.pageX) {
    directionX = "right";
  } else if (diffX) {
    directionX = "left";
  }

  //deal with the vertical case
  if (scrollPageY < event.pageY) {
    directionY = "down";
  } else if (diffY) {
    directionY = "up";
  }

  scrollPageX = event.pageX;
  scrollPageY = event.pageY;

  return [directionX, directionY];
}

// Apply drag move to update map scrolling position
function _applyDragMove(container, directionX, directionY) {
  const step = 7;
  if (directionX) {
    container.scrollLeft += directionX == "right" ? step * -1 : step;
  }
  if (directionY) {
    container.scrollTop += directionY == "down" ? step * -1 : step;
  }
}

// Update coords of points when Zoom occurs
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

// Update map width and height when Zoom occurs
function _updateMapSize() {
  if (!actualMapInUse) {
    return;
  }
  actualMapInUse.setAttribute(
    "style",
    `width:${345 * magnifierZoomLevel}px; height:${650 * magnifierZoomLevel}px`
  );
}

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

const minZoomLevel = 1;
const maxZoomLevel = 15;
const defaultMapWidth = 345;
const defaultMapHeight = 650;

let actualZoomLevel = minZoomLevel;
let actualMapInUse = kalimdor ? kalimdor : easternKingdom;
let originalSpawnPoints = [];

// Save scroll pos of map-container for comparing it during drag event
let mapScrollPageX = 0;
let mapScrollPageY = 0;

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

// Zoom/Dezoom when mouse wheel is triggered on Caroussel
function onMouseWheelArea(event) {
  event.preventDefault();
  // step for zooming/dezooming
  const zoomStep = 0.1;

  // target is <img> here, so we get parentNode map-container
  const container = event.target.parentNode;

  // prevent wheel X axis
  if (event.deltaX != 0) {
    return;
  }

  // Dezoom
  if (event.deltaY > 0) {
    if (actualZoomLevel - zoomStep < minZoomLevel) {
      actualZoomLevel = minZoomLevel;
      _ShowMapUi();
      return;
    }
    actualZoomLevel -= zoomStep;
  }
  // Zoom
  else {
    if (actualZoomLevel > maxZoomLevel) {
      actualZoomLevel = maxZoomLevel;
      return;
    }

    actualZoomLevel += zoomStep;
  }

  // Update scroll position with cursor
  const [cursorX, cursorY] = _getCursorPosition(container, event);
  container.scrollTop = cursorY * (actualZoomLevel - 1);
  container.scrollLeft = cursorX * (actualZoomLevel - 1);

  _hideMapUi();
  _updateSpawnPointsPosition();
  _updateMapSize();
}
// When user hover a map
function onMouseEnterImg(event) {
  actualMapInUse = event.target;
}

// When user move cursor on MapContainer, only activated when user drag map
function onMouseMoveMapContainer(event) {
  let container = event.target.parentNode;

  const [directionX, directionY] = _determineDragDirection(event);
  _applyDragMove(container, directionX, directionY);
}

// When user click down (grab)
function onMouseDownMapContainer(event) {
  event.preventDefault();
  let container = event.target.parentNode;

  container.style.cursor = "grabbing";
  // we initialise onmousemove when user grabs map
  container.onmousemove = onMouseMoveMapContainer;
}

// When user releases click
function onMouseUpMapContainer(event) {
  let container = event.target.parentNode;
  container.style.cursor = "unset";

  // we unset mousemove
  container.onmousemove = null;
}

// When user is out of MapContainer area
function onMouseLeaveMapContainer(event) {
  let container = event.target;
  container.style.cursor = "unset";

  // prevent to remains in grab status when user leave area with mousedown activated
  container.onmousemove = () => {};
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

// Show map UI elements when Zoom is at min value
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

  // Delta between saved scroll position and new one
  let diffX = event.pageX - mapScrollPageX;
  let diffY = event.pageY - mapScrollPageY;

  // deal with the horizontal case
  if (mapScrollPageX < event.pageX) {
    directionX = "right";
  } else if (diffX) {
    directionX = "left";
  }

  // deal with the vertical case
  if (mapScrollPageY < event.pageY) {
    directionY = "down";
  } else if (diffY) {
    directionY = "up";
  }

  // we store event to compare it later
  mapScrollPageX = event.pageX;
  mapScrollPageY = event.pageY;

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
      parseFloat(originalSpawnPoints[i].style.left) * actualZoomLevel
    }px`;
    spawnPoints[i].style.top = `${
      parseFloat(originalSpawnPoints[i].style.top) * actualZoomLevel
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
    `width:${defaultMapWidth * actualZoomLevel}px; height:${
      defaultMapHeight * actualZoomLevel
    }px`
  );
}

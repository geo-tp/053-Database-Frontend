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

// Save map position to comparing it during zoom event
let mapZoomPositionX = 0;
let mapZoomPositionY = 0;
let mapZoomIsActivated = false;
let mapZoomHasbeenCorrected = false;

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

// When user move on map-container
function onMouseMoveArea(event) {
  // When mouse move, we need to apply correction
  mapZoomHasbeenCorrected = false;
}

// When user wheel on map-container (zoom/dezoom)
function onMouseWheelArea(event) {
  event.preventDefault();

  // target is <img> here, so we get parentNode map-container
  let container = event.target.parentNode;

  // at this point, target can be a SVG (user hovering a point)
  while (container.classList[0] != "map-container") {
    container = container.parentNode;
  }

  // prevent wheel X axis
  if (event.deltaX != 0) {
    return;
  }

  _updateActualZoomLevel(event);

  // Update scroll position with cursor
  let [cursorX, cursorY] = _getCursorPosition(container, event);
  _updateScrollBarsPosition(container, cursorX, cursorY);

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

function _updateActualZoomLevel(event) {
  // step for zooming/dezooming
  const zoomStep = 0.1;

  // dezoom
  if (event.deltaY > 0) {
    if (actualZoomLevel - zoomStep < minZoomLevel) {
      actualZoomLevel = minZoomLevel;
      _ShowMapUi();
      return;
    }
    actualZoomLevel -= zoomStep;
  }
  // zoom
  else {
    if (actualZoomLevel > maxZoomLevel) {
      actualZoomLevel = maxZoomLevel;
      return;
    }
    _hideMapUi();
    actualZoomLevel += zoomStep;
  }
}

// Calculate cursor position
function _getCursorPosition(container, event) {
  const { top, left } = container.getBoundingClientRect();
  const cursorX = event.pageX - left - window.pageXOffset;
  const cursorY = event.pageY - top - window.pageYOffset;

  return [cursorX, cursorY];
}

// Correct scroll bars with cursor to prevent offcentering
function _updateScrollBarsPosition(container, cursorX, cursorY) {
  let diffX = parseInt(cursorX - mapZoomPositionX);
  let diffY = parseInt(cursorY - mapZoomPositionY);

  // Init cursor for first zoom event
  if (!mapZoomIsActivated) {
    mapZoomPositionY = cursorY;
    mapZoomPositionX = cursorX;
    container.scrollTop = cursorY * (actualZoomLevel - 1);
    container.scrollLeft = cursorX * (actualZoomLevel - 1);
    mapZoomIsActivated = true;
  } else {
    // We correct detla between cursor and map
    let totalDiffX = diffX - diffX / actualZoomLevel;
    let totalDiffY = diffY - diffY / actualZoomLevel;

    // Correction is already applied and mouse dont moved since last correction
    // We just apply diffX diffY, so cursor stay at exact same pos while zooming
    if (mapZoomHasbeenCorrected) {
      totalDiffX = diffX;
      totalDiffY = diffY;
    }

    cursorX = cursorX - totalDiffX;
    cursorY = cursorY - totalDiffY;
    container.scrollLeft = cursorX * (actualZoomLevel - 1);
    container.scrollTop = cursorY * (actualZoomLevel - 1);

    // Map is now recentered and we dont need scroll correction until mouse move
    mapZoomHasbeenCorrected = true;
  }

  // We store actual cursor pos to calculate delta with new pos later
  mapZoomPositionY = cursorY;
  mapZoomPositionX = cursorX;
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
    const calculatedStepX = directionX == "right" ? step * -1 : step;
    container.scrollLeft += calculatedStepX;
    mapZoomPositionX += calculatedStepX / (actualZoomLevel - 1);
    mapZoomHasbeenCorrected = true;
  }
  if (directionY) {
    const calculatedStepY = directionY == "down" ? step * -1 : step;
    container.scrollTop += calculatedStepY;
    mapZoomPositionY += calculatedStepY / (actualZoomLevel - 1);
    mapZoomHasbeenCorrected = true;
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

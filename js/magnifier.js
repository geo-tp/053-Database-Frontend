// Global Variables
const magnifier = document.querySelector(".magnifier");
const kalimdor = document.querySelector("#Kalimdor_map");
const easternKingdom = document.querySelector("#Eastern_Kingdoms_map");
const spawnPoints = document.querySelectorAll(".spawn_point");
let modifiedSpawnPoints = [];
let actualMapInUse = null;

const magnifierHeight = 200;
const magnifierWidth = 200;
const magnifierZoomLevel = 3;
let magnifierX = 0;
let magnifierY = 0;

// When mouse hover on image, we initialise magnifier without display it
function onMouseEnterImg(e) {
  const map = e.target;
  magnifier.style.height = `${magnifierHeight}px`;
  magnifier.style.width = `${magnifierWidth}px`;
  magnifier.style.backgroundImage = `url(${map.src})`;
  actualMapInUse = e;
}

// When mouse hover a point, we display magnifier
function onMouseEnterPoint(e) {
  magnifier.style.display = "block";
  e.target.style.zIndex = "1001";
  _alignMagnifierWithPoint(e);

  for (let point of spawnPoints) {
    if (!point.isEqualNode(e.target) && _checkIfPointIsInMagnifier(point)) {
      _correctMagnifiedPointPosition(e.target, point);
    }
  }
  console.log("M X", magnifierX);
  console.log("M Y", magnifierY);
}

// When mouse leave a point, we hide magnifier
function onMouseLeavePoint(e) {
  magnifier.style.display = "none";
  e.target.style.zIndex = "1000";
  _resetModifiedSpawnPoints();
}

async function _updateMagnifierPosition(width, height, widthToAdd) {
  magnifier.style.top = `${magnifierY - magnifierHeight / 2}px`;
  magnifier.style.left = `${magnifierX - magnifierHeight / 2}px`;
  magnifier.style.backgroundSize = `${width * magnifierZoomLevel}px ${
    height * magnifierZoomLevel
  }px`;
  magnifier.style.backgroundPositionX = `${
    -magnifierX * magnifierZoomLevel +
    magnifierWidth / 2 +
    widthToAdd * magnifierZoomLevel
  }px`;
  magnifier.style.backgroundPositionY = `${
    -magnifierY * magnifierZoomLevel + magnifierHeight / 2
  }px`;
}

function _alignMagnifierWithPoint(e) {
  const { width, height } = actualMapInUse.target;
  const widthToAdd = _calculateWidthToAdd();
  magnifierX = _domValueToInt(e.target.style.left) + widthToAdd;
  magnifierY = _domValueToInt(e.target.style.top);
  _updateMagnifierPosition(width, height, widthToAdd);
}

function _calculateWidthToAdd() {
  // Used when both map are in caroussel
  // we need to add 272px (width of Eastern Kingdom)
  let widthToAdd = 0;
  if (
    kalimdor != null &&
    easternKingdom != null &&
    actualMapInUse.target.isEqualNode(kalimdor)
  ) {
    widthToAdd = easternKingdom.width;
  }

  return widthToAdd;
}

function _domValueToInt(value) {
  return parseInt(value.split("px")[0]);
}

function _calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function _calculateDistanceBetweenPoints(point1, point2) {
  const point1Y = _domValueToInt(point1.style.top);
  const point1X = _domValueToInt(point1.style.left);
  const point2Y = _domValueToInt(point2.style.top) + magnifierHeight / 2;
  const point2X = _domValueToInt(point2.style.left) + magnifierHeight / 2;

  return _calculateDistance(point1X, point1Y, point2X, point2Y);
}

function _checkIfPointIsInMagnifier(point) {
  const radius = magnifierHeight / 2 + 5;
  const pointX = _domValueToInt(point.style.left);
  const pointY = _domValueToInt(point.style.top);
  const distance = _calculateDistance(magnifierX, magnifierY, pointX, pointY);
  return distance < radius;
}

function _correctMagnifiedPointPosition(referencePoint, point) {
  let diffX =
    (_domValueToInt(referencePoint.style.left) -
      _domValueToInt(point.style.left)) *
    magnifierZoomLevel;

  let diffY =
    (_domValueToInt(referencePoint.style.top) -
      _domValueToInt(point.style.top)) *
    magnifierZoomLevel;
  let updatedPoint = point.cloneNode();
  // We had width of spawn point
  diffY = diffY < 0 ? diffY + 9 : diffY - 9;
  diffX = diffX < 0 ? diffX + 9 : diffX - 9;
  updatedPoint.style.top = `${_domValueToInt(point.style.top) - diffY}px`;
  updatedPoint.style.left = `${_domValueToInt(point.style.left) - diffX}px`;

  modifiedSpawnPoints.push({
    point,
    originalY: point.style.top,
    originalX: point.style.left,
  });

  // We verify if point is still in magnifier after updating coords
  if (_checkIfPointIsInMagnifier(updatedPoint)) {
    point.style.top = updatedPoint.style.top;
    point.style.left = updatedPoint.style.left;
  } else {
    point.style.display = "none";
  }
}

function _resetModifiedSpawnPoints() {
  for (let elem of modifiedSpawnPoints) {
    elem.point.style.top = elem.originalY;
    elem.point.style.left = elem.originalX;
    elem.point.style.display = "block";
  }

  modifiedSpawnPoints = [];
}

// Global Variables
const magnifier = document.querySelector(".magnifier");
const magnifierHeight = 150;
const magnifierWidth = 150;
const magnifierZoomLevel = 3;
let magnifierX = 0;
let magnifierY = 0;
let magnifierIsSpawned = false;
let pointRadius = 10;

// When mouse hover on image, we initialise magnifier without display it
function onMouseEnterImg(e) {
  const elem = e.target;

  magnifier.style.height = `${magnifierHeight}px`;
  magnifier.style.width = `${magnifierWidth}px`;
  magnifier.style.backgroundImage = `url(${elem.src})`;
}

// When mouse move on image, we update magnifier position to be centered around cursor without display it
function onMouseMoveImg(e) {
  const elem = e.currentTarget;
  const { top, left } = elem.getBoundingClientRect();
  const { width, height } = elem.getBoundingClientRect();

  magnifierX = e.pageX - left - window.pageXOffset;
  magnifierY = e.pageY - top - window.pageYOffset;

  magnifier.style.top = `${magnifierY - magnifierHeight / 2}px`;
  magnifier.style.left = `${magnifierX - magnifierHeight / 2}px`;
  magnifier.style.backgroundSize = `${width * magnifierZoomLevel}px ${
    height * magnifierZoomLevel
  }px`;
  magnifier.style.backgroundPositionX = `${
    -magnifierX * magnifierZoomLevel + magnifierWidth / 2
  }px`;
  magnifier.style.backgroundPositionY = `${
    -magnifierY * magnifierZoomLevel + magnifierHeight / 2
  }px`;
}

// When mouse hover a point, we display magnifier
function onMouseEnterPoint(e) {
  magnifier.style.display = "block";
}

// When mouse leave a point, we hide magnifier
function onMouseLeavePoint(e) {
  magnifier.style.display = "none";
}

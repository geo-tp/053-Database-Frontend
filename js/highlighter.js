// Apply highlight if there is only one point on maps
function applyHighLightOnFirstPoint() {
  const spawnPoints = document.querySelectorAll(".spawn_point");
  const highlighter = document.querySelector("#spawn-map-highlighter");
  if (!spawnPoints.length || spawnPoints.length > 1) {
    return;
  }

  const firstPoint = spawnPoints[0];
  // we had 1px stroke
  const pointRadius = (firstPoint.width.animVal.value + 1) / 2;
  //   we display it before taking his width
  highlighter.style.display = "block";
  const highlighterRadius = highlighter.clientWidth / 2;
  const totalRadius = highlighterRadius - pointRadius;
  highlighter.style.top = `${parseFloat(firstPoint.style.top) - totalRadius}px`;
  highlighter.style.left = `${
    parseFloat(firstPoint.style.left) - totalRadius
  }px`;
}
applyHighLightOnFirstPoint();

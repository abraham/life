var BGL = (function(THREE){
  'use strict';

  return {
  };
}(THREE));

function onMessage(data) {
  if (data.result === 'coordinates') {
    renderTick(data.data);
  }
}

function renderTick(data) {
  // TODO: remove
  BGL.view.clearScene();

  var cells = BGL.cells.processCell(data);
  BGL.view.addToGrid(cells);

  BGL.view.renderScene();
  setTimeout(requestTick, 500);
}

function startLife() {
  BGL.view.prepareLife();
  requestStart();
}

function stopLife() {
  BGL.view.stopLife();
  BGL.ws.push({ action: 'stop' });
}

function toggleState() {
  if (this.active) {
    startLife();
  } else {
    stopLife();
  }
}

function togglePause() {
  if (!this.active) {
    requestTick();
  }
}

function requestStart() {
  var settings = BGL.view.getSettings();
  BGL.ws.push({
    action: 'start',
    layers: settings.layers,
    fillPercent: settings.fillPercent
  });
}

function requestTick() {
  if (!BGL.view.isPaused()) {
    BGL.ws.push({action: 'tick'});
  }
}

document.addEventListener("DOMContentLoaded", function() {
  BGL.view.init();
  BGL.ws.connect();
  BGL.ws.setOnMessage(onMessage);

  document.getElementById('start').addEventListener('transitionend', toggleState);
  document.getElementById('pause').addEventListener('transitionend', togglePause);
});

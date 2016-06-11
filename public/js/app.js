var BGL = (function(){
  'use strict';

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

  function stateTransition(event) {
    if (event.target.active) {
      startLife();
    } else {
      stopLife();
    }
  }

  function pauseTransition(event) {
    if (!event.target.active) {
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

  return {
    stateTransition: stateTransition,
    pauseTransition: pauseTransition,
    onMessage: onMessage
  };

}());


document.addEventListener("DOMContentLoaded", function() {
  BGL.view.init();
  BGL.view.renderScene();
  BGL.ws.connect();
  BGL.ws.setOnMessage(BGL.onMessage);

  document.getElementById('start').addEventListener('transitionend', BGL.stateTransition);
  document.getElementById('pause').addEventListener('transitionend', BGL.pauseTransition);
});

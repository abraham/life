var BGL = (function(){
  'use strict';

  function onMessage(data) {
    console.log('onMessage', data.result);
    if (data.result === 'coordinates') {
      renderTick(data.data);
    }
  }

  function renderTick(data) {
    var results = BGL.cells.processCells(data);
    BGL.view.addToGrid(results[0]);
    BGL.view.removeFromGrid(results[1]);

    setTimeout(requestTick, 1 * 1000);
  }

  function startLife() {
    BGL.view.prepareLife();
    BGL.view.setStateToPlaying();
    requestStart();
  }

  function playLife() {
    BGL.view.setStateToPlaying();
    requestTick();
  }

  function resetLife() {
    BGL.view.stopLife();
    BGL.view.resetState();
    BGL.ws.push({ action: 'stop' });
    BGL.view.clearScene();
    BGL.view.resetControls();
  }

  function pauseLife() {
    BGL.view.setStateToPaused();
  }

  function onStateChange(event) {
    var state = event.currentTarget.parentNode.dataset.state;
    var callbacks = {
      stopped: startLife,
      playing: pauseLife,
      paused: playLife
    };
    callbacks[state]();
  }

  function onReset(event) {
    resetLife();
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

  function setColor(event) {
    BGL.cells.setColor(event.currentTarget.color);
    BGL.view.setColor(event.currentTarget.color);
  }

  return {
    onMessage: onMessage,
    onReset: onReset,
    onStateChange: onStateChange,
    requestTick: requestTick,
    setColor: setColor
  };

}());

document.addEventListener("DOMContentLoaded", function() {
  BGL.view.init();
  BGL.view.renderScene();
  BGL.ws.connect();
  BGL.ws.setOnMessage(BGL.onMessage);

  document.getElementById('state').addEventListener('click', BGL.onStateChange);
  document.getElementById('reset').addEventListener('click', BGL.onReset);
  document.getElementById('color').addEventListener('color-picker-selected', BGL.setColor);
});

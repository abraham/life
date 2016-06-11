BGL.view = (function(THREE) {
  'use strict';

  var scene, grid, _renderer,
    _cells = {};

  function createRenderer() {
    _renderer = new THREE.WebGLRenderer({ alpha: true });
    _renderer.setSize(window.innerWidth - 100, window.innerHeight - 100);
  }

  function addRenderer() {
    createRenderer();
    document.getElementById('canvas').appendChild(_renderer.domElement);
  }

  function getValue(id, defaultValue) {
    return document.getElementById(id) ? document.getElementById(id).value : defaultValue;
  }

  function isPaused() {
    var pauseButton = document.getElementById('pause');
    return pauseButton && pauseButton.active;
  }

  function formData() {
    return {
      layers: getValue('layers', 0),
      fillPercent: getValue('fill-percent', 0)
    };
  }

  function stopLife() {
    BGL.ws.push({action: 'stop'});

    enableStartButton();
    disablePauseButton();
  }

  function prepareLife() {
    clearScene();
    enableStopButton();
    enablePauseButton();
    BGL.controls.positionCamera(calculateCameraPosition());
  }

  function clearScene() {
    scene.children[1].children = [];
  }

  function enableStartButton() {
    var start = document.getElementById('start');
    start.textContent = 'Start';
    start.classList.remove('red');
    start.classList.add('green');
  }

  function enableStopButton() {
    var start = document.getElementById('start');
    start.textContent = 'Stop';
    start.classList.remove('green');
    start.classList.add('red');
  }

  function disablePauseButton() {
    var pauseButton = document.getElementById('pause');
    pauseButton.disabled = true;
    pauseButton.active = false;
  }

  function enablePauseButton() {
    var pauseButton = document.getElementById('pause');
    pauseButton.disabled = false;
  }

  function calculateCameraPosition() {
    return getValue('layers', 0) * 2.5;
  }

  function addToGrid(items) {
    items.forEach(function(item) {
      // item = [key, cube]
      grid.add(item[1]);
      _cells[item[0]] = item[1];
    });
  }

  function removeFromGrid(items) {
    items.forEach(function(key) {
      grid.remove(_cells[key]);
      delete _cells[key];
    });
  }

  function init() {
    scene = new THREE.Scene();
    BGL.controls.createCamera();
    addRenderer();
    scene.add(BGL.cells.createCenter());
    grid = new THREE.Object3D();
    scene.add(grid);
    BGL.controls.positionCamera(calculateCameraPosition());
    BGL.controls.create();
  }

  function renderer() {
    return _renderer || createRenderer();
  }

  function renderScene() {
    requestAnimationFrame(renderScene);
    BGL.controls.update();
    _renderer.render(scene, BGL.controls.camera());
  }

  return {
    clearScene: clearScene,
    getSettings: formData,
    init: init,
    isPaused: isPaused,
    prepareLife: prepareLife,
    stopLife: stopLife,
    renderer: renderer,
    addToGrid: addToGrid,
    removeFromGrid: removeFromGrid,
    renderScene: renderScene
  };
}(THREE));

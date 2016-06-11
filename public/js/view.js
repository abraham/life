BGL.view = (function(THREE) {
  // 'use strict';

  var scene, grid, _renderer;

  function createRenderer() {
    _renderer = new THREE.WebGLRenderer({ alpha: true });
    _renderer.setSize(window.innerWidth - 100, window.innerHeight - 100);
    appendToCanvas(_renderer.domElement);
    return _renderer;
  }

  function appendToCanvas(element) {
    document.getElementById('canvas').appendChild(element);
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
    return getValue('layers', 0).layers * 2.5;
  }

  function animate() {
    requestAnimationFrame(renderScene);
    BGL.controls.update();
    renderScene();
  }

  function renderScene() {
    requestAnimationFrame(renderScene);
    _renderer.render(scene, BGL.controls.camera());
  }

  function addToGrid(items) {
    items.forEach(function(item) {
      grid.add(item);
    });
  }

  function init() {
    scene = new THREE.Scene();
    // BGL.controls.create();
    createRenderer();
    scene.add(BGL.cells.createCenter());
    grid = new THREE.Object3D();
    scene.add(grid);
    // animate();
  }

  function renderer() {
    return _renderer || createRenderer();
  }

  return {
    animate: animate,
    clearScene: clearScene,
    getSettings: formData,
    init: init,
    isPaused: isPaused,
    prepareLife: prepareLife,
    stopLife: stopLife,
    renderer: renderer,
    addToGrid: addToGrid
  };
}(THREE));

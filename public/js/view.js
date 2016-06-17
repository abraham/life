BGL.view = (function(THREE) {
  'use strict';

  var _renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  var _cells = {};
  var _scene = new THREE.Scene();
  var _grid = new THREE.Object3D();

  function createRenderer() {
    _renderer.setSize(window.innerWidth - 260, window.innerHeight - 100);
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

  function isStarted() {
    var startButton = document.getElementById('start');
    return startButton && startButton.active;
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
    _scene.children[1].children = [];
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
      _grid.add(item[1]);
      _cells[item[0]] = item[1];
    });
  }

  function removeFromGrid(items) {
    items.forEach(function(key) {
      _grid.remove(_cells[key]);
      delete _cells[key];
    });
  }

  function buildAxes(length) {
    var axes = new THREE.Object3D();

    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0x9E9E9E));
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(- length, 0, 0), 0x9E9E9E));
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x9E9E9E));
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, - length, 0), 0x9E9E9E));
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x9E9E9E));
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - length), 0x9E9E9E));

    return axes;
  }

  function buildAxis(src, dst, colorHex) {
    var geom = new THREE.Geometry();
    var mat = new THREE.LineBasicMaterial({ linewidth: 2, color: colorHex });

    geom.vertices.push(src.clone());
    geom.vertices.push(dst.clone());

    return new THREE.Line(geom, mat, THREE.LinePieces);
  }

  function init() {
    BGL.controls.createCamera();
    addRenderer();
    _scene.add(BGL.cells.createCenter());
    _scene.add(_grid);
    _scene.add(buildAxes(getValue('layers', 0) * 2));
    BGL.controls.positionCamera(calculateCameraPosition());
    BGL.controls.create();
  }

  function renderer() {
    return _renderer || createRenderer();
  }

  function renderScene() {
    requestAnimationFrame(renderScene);
    BGL.controls.update();
    _renderer.render(_scene, BGL.controls.camera());
  }

  return {
    addToGrid: addToGrid,
    clearScene: clearScene,
    getSettings: formData,
    init: init,
    isPaused: isPaused,
    isStarted: isStarted,
    prepareLife: prepareLife,
    removeFromGrid: removeFromGrid,
    renderer: renderer,
    renderScene: renderScene,
    stopLife: stopLife
  };
}(THREE));

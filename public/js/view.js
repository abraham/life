BGL.view = (function(THREE) {
  'use strict';


  var DEFAULT_LAYERS = 10;
  var DEFAULT_FILL_PERCENT = 42;
  var _stateButton, _resetButton;
  var _renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  var _cells = {};
  var _scene = new THREE.Scene();
  var _grid;

  function createRenderer() {
    _renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function addRenderer() {
    createRenderer();
    document.getElementById('canvas').appendChild(_renderer.domElement);
  }

  function getValue(id, defaultValue) {
    return document.getElementById(id) ? document.getElementById(id).value : defaultValue;
  }

  function setValue(id, value) {
    document.getElementById(id).value = value;
  }

  function isPaused() {
    return _stateButton.parentNode.dataset.state === 'paused';
  }

  function formData() {
    return {
      layers: getValue('layers', DEFAULT_LAYERS),
      fillPercent: getValue('fill-percent', 0)
    };
  }

  function stopLife() {
    BGL.ws.push({action: 'stop'});
  }

  function prepareLife() {
    clearScene();
    createGrid();
    BGL.controls.positionCamera(calculateCameraPosition());
  }

  function createGrid() {
    _grid = new THREE.Object3D();
    _scene.add(_grid);
  }

  function clearScene() {
    _scene.remove(_grid);
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
    return getValue('layers', DEFAULT_LAYERS) * 2.5;
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

  function setStateToPlaying() {
    _stateButton.textContent = 'Pause';
    _stateButton.parentNode.dataset.state = 'playing';
    document.getElementById('layers').setAttribute('disabled', 'disabled');
    document.getElementById('fill-percent').setAttribute('disabled', 'disabled');
  }

  function setStateToPaused() {
    _stateButton.textContent = 'Resume';
    _stateButton.parentNode.dataset.state = 'paused';
  }

  function resetState() {
    _stateButton.textContent = 'Start';
    _stateButton.parentNode.dataset.state = 'stopped';
    document.getElementById('layers').removeAttribute('disabled');
    document.getElementById('fill-percent').removeAttribute('disabled');
}

  function buildAxis(src, dst, colorHex) {
    var geom = new THREE.Geometry();
    var mat = new THREE.LineBasicMaterial({ linewidth: 2, color: colorHex });

    geom.vertices.push(src.clone());
    geom.vertices.push(dst.clone());

    return new THREE.Line(geom, mat, THREE.LinePieces);
  }

  function init() {
    _stateButton = document.getElementById('state');
    _resetButton = document.getElementById('reset');
    BGL.controls.createCamera();
    addRenderer();
    createGrid();
    _scene.add(buildAxes(getValue('layers', DEFAULT_LAYERS) * 2));
    BGL.controls.positionCamera(calculateCameraPosition());
    BGL.controls.create();
  }

  function clear() {
    _scene.remove(_grid);
  }

  function renderer() {
    return _renderer || createRenderer();
  }

  function resetControls() {
    setValue('layers', DEFAULT_LAYERS);
    setValue('fill-percent', DEFAULT_FILL_PERCENT);
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
    prepareLife: prepareLife,
    removeFromGrid: removeFromGrid,
    renderer: renderer,
    renderScene: renderScene,
    resetControls: resetControls,
    resetState: resetState,
    setStateToPaused: setStateToPaused,
    setStateToPlaying: setStateToPlaying,
    stopLife: stopLife
  };
}(THREE));

BGL.view = (function(THREE) {
  'use strict';

  var _renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  var _cells = {};
  var _scene = new THREE.Scene();
  var _grid;
  var _axes;

  function createRenderer() {
    _renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function addRenderer() {
    createRenderer();
    document.getElementById('canvas').appendChild(_renderer.domElement);
  }



  function stopLife() {
    BGL.ws.push({action: 'stop'});
  }

  function prepareLife() {
    clearScene();
    createGrid();
    createAxes();
  }

  function createGrid() {
    _grid = new THREE.Object3D();
    _scene.add(_grid);
  }

  function clearScene() {
    _scene.remove(_grid);
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

  function buildAxis(src, dst, colorHex) {
    var geom = new THREE.Geometry();
    var mat = new THREE.LineBasicMaterial({ linewidth: 2, color: colorHex });

    geom.vertices.push(src.clone());
    geom.vertices.push(dst.clone());

    return new THREE.Line(geom, mat, THREE.LineSegments);
  }

  function createAxes() {
    if (_axes) {
      _scene.remove(_axes);
    }
    _axes = buildAxes(getValue('layers', DEFAULT_LAYERS));
    _scene.add(_axes);
  }

  function clear() {
    _scene.remove(_grid);
  }

  function renderer() {
    return _renderer || createRenderer();
  }

  function renderScene() {
    requestAnimationFrame(renderScene);
    BGL.controls.update();
    _renderer.render(_scene, BGL.controls.camera());
  }

  function init() {
    BGL.controls.createCamera();
    addRenderer();
    createGrid();
    createAxes();
    BGL.controls.positionCamera(calculateCameraPosition());
    BGL.controls.create();
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
    setColor: setColor,
    setStateToPaused: setStateToPaused,
    setStateToPlaying: setStateToPlaying,
    stopLife: stopLife
  };
}(THREE));

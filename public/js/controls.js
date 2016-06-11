BGL.controls = (function(THREE) {
  'use strict';
  var _camera;
  var _controls;

  var positionCamera = function(position) {
    _camera.position.z = position;
  };

  var createCamera = function() {
    var zoom = window.innerWidth / window.innerHeight;
    _camera = new THREE.PerspectiveCamera(90, zoom, 1, 1000);
    return _camera;
  };

  var create = function() {
    _controls = new THREE.OrbitControls(_camera, BGL.view.renderer().domElement);
    _controls.enableDamping = true;
    _controls.dampingFactor = 0.25;
  };

  var update = function() {
    _controls.update();
  };

  var getCamera = function() {
    return _camera;
  };

  return {
    create: create,
    update: update,
    positionCamera: positionCamera,
    camera: getCamera,
    createCamera: createCamera
  };
}(THREE));

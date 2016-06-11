BGL.controls = (function() {
  'use strict';
  var camera;
  var controls;

  var positionCamera = function(position) {
    camera.position.z = position;
  };

  var createCamera = function() {
    var zoom = window.innerWidth / window.innerHeight;
    return new THREE.PerspectiveCamera(90, zoom, 1, 1000);
  };

  var create = function() {
    camera = createCamera();
    controls = new THREE.OrbitControls(camera, BGL.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
  };

  var update = function() {
    controls.update();
  };

  var getCamera = function() {
    return camera;
  };

  return {
    create: create,
    update: update,
    positionCamera: positionCamera,
    camera: getCamera
  };
}());

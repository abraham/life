BGL.cells = (function(THREE){
  'use strict';

  var processCell = function(coordinates) {
    var cells = [];
    for (var key in coordinates) {
      if (coordinates[key] === 'true') {
        cells.push(create(key, coordinates[key]));
      }
    }
    return cells;
  };

  var build = function(cell) {
    var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = cell.x;
    cube.position.y = cell.y;
    cube.position.z = cell.z;
    return cube;
  };

  var create = function(key) {
    var indexes = key.split(':');
    var coordinates = {
      x: Number(indexes[0]),
      y: Number(indexes[1]),
      z: Number(indexes[2])
    };
    return build(coordinates);
  };

  var createCenter = function() {
    var geometry = new THREE.SphereGeometry(0.25, 16, 16);
    var material = new THREE.MeshBasicMaterial({ color: 0xF44336 });
    return new THREE.Mesh(geometry, material);
  };

  return {
    processCell: processCell,
    createCenter: createCenter
  };
}(THREE));

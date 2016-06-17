BGL.cells = (function(THREE){
  'use strict';

  var _geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  var _material = new THREE.MeshBasicMaterial({ color: 0x2196F3 });

  var processCells = function(coordinates) {
    var add = [];
    var remove = [];
    for (var key in coordinates) {
      if (coordinates[key] === 'true') {
        add.push([key, create(key, coordinates[key])]);
      } else {
        remove.push(key);
      }
    }
    return [add, remove];
  };

  var create = function(key) {
    var cell = parseCoordinates(key);
    var cube = new THREE.Mesh(_geometry, _material);
    cube.position.x = cell.x;
    cube.position.y = cell.y;
    cube.position.z = cell.z;
    return cube;
  };

  function parseCoordinates(key) {
    var indexes = key.split(':');
    return {
      x: Number(indexes[0]),
      y: Number(indexes[1]),
      z: Number(indexes[2])
    };
  }

  return {
    processCells: processCells
  };
}(THREE));

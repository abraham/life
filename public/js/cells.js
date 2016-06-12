BGL.cells = (function(THREE){
  'use strict';

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
    var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    var material = new THREE.MeshBasicMaterial({ color: 0x2196F3 });
    var cube = new THREE.Mesh( geometry, material );
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

  var createCenter = function() {
    var geometry = new THREE.SphereGeometry(0.25, 16, 16);
    var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    return new THREE.Mesh(geometry, material);
  };

  return {
    processCells: processCells,
    createCenter: createCenter
  };
}(THREE));

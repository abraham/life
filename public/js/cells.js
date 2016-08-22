BGL.cells = (function(THREE){
  'use strict';

  var COLORS = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7',
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#009688', '#8BC34A', '#CDDC39',
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
  ];
  var colorIndex = 0;
  var _geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

  var processCells = function(coordinates) {
    var material = new THREE.MeshBasicMaterial({ color: nextColor() });
    var add = [];
    var remove = [];
    for (var key in coordinates) {
      if (coordinates[key] === 'true') {
        add.push([key, create(key, coordinates[key], material)]);
      } else {
        remove.push(key);
      }
    }
    return [add, remove];
  };

  function nextColor() {
    if (colorIndex >= COLORS.length) {
      colorIndex = 0;
    }
    return COLORS[colorIndex++];
  }

  var create = function(key, coordinate, material) {
    var cell = parseCoordinates(key);
    var cube = new THREE.Mesh(_geometry, material);
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

  function setColor(colors) {
    _material.color.set(colors[0]);
  }

  return {
    processCells: processCells,
    setColor: setColor,
    nextColor: nextColor
  };
}(THREE));

var camera, controls, scene, renderer, ws;

var gridOptions = {
  layers: 10,
  color: 0x0000ff
};

function renderScene(cells) {
  console.log('Initing');

  // define
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true });

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  var cube = new THREE.Mesh( geometry, material );

  // configure
  camera.position.z = 25;
  renderer.setSize(window.innerWidth - 100, window.innerHeight - 100);

  // add
  document.body.appendChild(renderer.domElement);
  scene.add(cube);
  gridOptions['cells'] = cells;
  scene.add(createAGrid(gridOptions));

  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;

  console.log('Inited');
}

function animate() {
  requestAnimationFrame(render);
  controls.update();
  render();
}

function render(){
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

function createAGrid(opts) {
  var config = opts || {
    layers: 100,
    color: 0xDD006C
  };
  var layers = config.layers + 1;

  var material = new THREE.LineBasicMaterial({
    color: config.color,
    opacity: 0.8,
    linewidth: 2
  });

  var gridObject = new THREE.Object3D(),
    step = 1;

    opts.cells.forEach(function(cell) {
      gridObject.add(cell);
    });

  // for (var x = -layers; x <= layers; x += step) {
  //   for (var y = -layers; y <= layers; y += step) {
  //     for (var z = -layers; z <= layers; z += step) {
  //       // console.log('x', i, 'y', layers, 'step', step, 'height', layers);
  //       // [{"x:y:z": true}, {"x:y:z": false}]
  //
  //       if ((Math.floor(Math.random() * 100) + 1) > 75) {
  //         var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  //         var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  //         var cube = new THREE.Mesh( geometry, material );
  //         cube.position.x = x;
  //         cube.position.y = y;
  //         cube.position.z = z;
  //         gridObject.add(cube)
  //       }
  //     }
  //   }
  // }

  return gridObject;
}

function push(msg) {
  console.log('pushing', msg);
  ws.send(JSON.stringify(msg));
}

function onMessage(m) {
  var data = JSON.parse(m.data)
  console.log('Recieved message', m);
  if (data.result === 'coordinates') {
    renderScene(processCell(data.data))
    animate();
    // var gridObject = createAGrid(gridOptions);
  }
}

function processCell(coordinates) {
  var cells = [];
  for (var key in coordinates) {
    if (coordinates[key] === 'true') {
      cells.push(createCell(key, coordinates[key]));
      // gridObject.add(cell);
    }
  }
  return cells;
}

function buildCell(cell) {
  var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  var cube = new THREE.Mesh( geometry, material );
  cube.position.x = cell.x;
  cube.position.y = cell.y;
  cube.position.z = cell.z;
  return cube;
}

function createCell(key) {
  var indexes = key.split(':');
  var coordinates = {
    x: Number(indexes[0]),
    y: Number(indexes[1]),
    z: Number(indexes[2])
  }
  return buildCell(coordinates);
}

function connectToSocket(openCallback) {
  ws = new WebSocket('ws://' + window.location.host + '/live');
  ws.onopen = openCallback;
  ws.onmessage = onMessage;
  ws.onclose = function()  { console.log('websocket closed'); }
}

function requestCells() {
  push({action: 'start'});
}

function onOpen() {
  console.log('websocket opened');
}

document.addEventListener("DOMContentLoaded", function() {
  connectToSocket(requestCells);

  // init();
  // animate();
});

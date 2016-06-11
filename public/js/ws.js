BGL.ws = (function() {
  var ws;
  var callbacks = [];
  var PATH = '/live';

  function push(message) {
    ws.send(JSON.stringify(message));
  }

  var protocol = function() {
    return location.protocol === 'https:' ? 'wss://' : 'ws://';
  };

  var connect = function() {
    ws = new WebSocket(protocol() + window.location.host + PATH);
    ws.onmessage = onMessage;
    ws.onclose = onClose;
  };

  var onMessage = function(message) {
    // TODO: catch invalid JSON
    var data = JSON.parse(message.data);
    callbacks.forEach(function(callback) {
      callback(data);
    });
  };

  var onClose = function() {
    console.log('websocket closed');
  };

  var setOnMessage = function(callback) {
    callbacks.push(callback);
  };

  return {
    push: push,
    connect: connect,
    setOnMessage: setOnMessage
  };
}());

// function subscribeToSensor(sensor) {
//  var socket = new WebSocket('ws://devices.webofthings.io/pi/sensors/' + sensor,'wot'); //#A

//  socket.onmessage = function (event) { //#B
//      var result = JSON.parse(event.data);
//      console.log(result.value)
//      startButton(event)

//  };
//  socket.onerror = function (error) { //#C
//      console.log('An error occured while trying to connected to a Websocket!');
//      console.log(error);
//  };
// };
// subscribeToSensor('pir');

function motionSensor(sensor) {
  const ws = new WebSocket('ws://localhost:8080');

  // Browser WebSockets have slightly different syntax than `ws`.
  // Instead of EventEmitter syntax `on('open')`, you assign a callback
  // to the `onopen` property.
  socket.onopen = function() {
    document.querySelector('#send').disabled = false;

    document.querySelector('#send').addEventListener('click', function() {
      socket.send(document.querySelector('#message').value);
    });
  };

  socket.onmessage = function(msg) {
    document.querySelector('#messages').innerHTML += `<div>${msg.data}</div>`;
  };
}
motionSensor('pir');


// function startButton(event) {
//   if (recognizing) {
//     recognition.stop();
//     return;
//   }
//   final_transcript = '';
//   recognition.lang = select_dialect.value;
//   recognition.start();
//   ignore_onend = false;
//   final_span.innerHTML = '';
//   interim_span.innerHTML = '';
//   start_img.src = 'assets/common/images/mic-slash.gif';
//   showInfo('info_allow');
//   showButtons('none');
//   start_timestamp = event.timeStamp;
// }
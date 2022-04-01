const WebSocket = require('ws');
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const server = new WebSocket.Server({ port: 8080});

function motion() {

var LED = new Gpio(4, 'out'); //use GPIO pin 4 as output
var motion = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled

motion.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  server.on('connection', function(socket) {
  socket.send(`motion on ${value}`);
  });


  LED.writeSync(value); //turn LED on or off depending on the button state (0 or 1)
});

function unexportOnClose() { //function to run when exiting program
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  motion.unexport(); // Unexport Button GPIO to free resources
};

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c
}
module.exports = { motion };
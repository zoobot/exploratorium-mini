// const { promisify } = require('util');
// const exec = promisify(require('child_process').exec);
const { exec } = require('child_process');
function motionSensor(wsServer) {

  const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
  const LED = new Gpio(4, 'out'); //use GPIO pin 4 as output
  const motion = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled

  motion.watch((err, value) => { //Watch for hardware interrupts on pushButton GPIO, specify callback function
    LED.writeSync(value); //turn LED on or off depending on the button state (0 or 1)
    console.log('motion detected', value)
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }   
    wsServer.on('connection', function connection(ws) {
      ws.on('msg', function message(data) {
        console.log('received: %s', data);
      });
    
      if (value === 1) {
        ws.send(ws.send(JSON.stringify({
          motion: value,
          timeStamp: new Date().toISOString(),
        })))
        
        // exec('echo -n 1 > /sys/class/backlight/rpi_backlight/bl_power', (err, stdout, stderr) => {
        //   if (err) {
        //     console.error(err)
        //   } else {
        //   console.log(`stdout: ${stdout}`);
        //   console.log(`stderr: ${stderr}`);
        //   }
        // });
      } else {
        // exec('echo -n 0 > /sys/class/backlight/rpi_backlight/bl_power', (err, stdout, stderr) => {
        //   if (err) {
        //     console.error(err)
        //   } else {
        //   console.log(`stdout: ${stdout}`);
        //   console.log(`stderr: ${stderr}`);
        //   }
        // });
      }
    });  
  });

  function unexportOnClose(LED, motion) { //function to run when exiting program
    LED.writeSync(0); // Turn LED off
    LED.unexport(); // Unexport LED GPIO to free resources
    motion.unexport(); // Unexport Button GPIO to free resources
  };

  process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c
}

function motionSensorFake(wsServer) {
  console.log('FAKE motion detected')

  wsServer.on('connection', function connection(ws) {
    ws.on('msg', function message(data) {
      console.log('received: %s', data);
    });
  
    ws.send(JSON.stringify({
      fake: true,
      motion: 1,
      timeStamp: new Date().toISOString(),
    }));
  }); 

}




module.exports = { motionSensor, motionSensorFake };
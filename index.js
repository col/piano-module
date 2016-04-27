var awsIot = require('aws-iot-device-sdk');
var Gpio = require('chip-gpio').Gpio;

var button1 = new Gpio(6, 'in', 'both', {
  debounceTimeout: 500
});

var button2 = new Gpio(5, 'in', 'both', {
  debounceTimeout: 500
});

var button3 = new Gpio(4, 'in', 'both', {
  debounceTimeout: 500
});

var device = awsIot.device({
  keyPath: '/home/chip/.piano-chip/private.pem.key',
  certPath: '/home/chip/.piano-chip/certificate.pem.crt',
  caPath: '/home/chip/piano-module/root-CA.pem',
  clientId: 'piano-chip',
  region: 'ap-southeast-1',
  reconnectPeriod: 5000
});

device.subscribe('mozart');

button1.watch(function(err, value) {
  if (err) {
    throw err;
  }
  console.log('Button1 pressed - Disarmed');
  device.publish('mozart', JSON.stringify({ event: 'disarmed' }));
});

button2.watch(function(err, value) {
  if (err) {
    throw err;
  }
  console.log('Button2 pressed - Boom!');
  device.publish('mozart', JSON.stringify({ event: 'boom' }));
});

button3.watch(function(err, value) {
  if (err) {
    throw err;
  }
  console.log('Button3 pressed - no nothing');
});

device.on('message', function(topic, payload) {
    console.log('Message Received');
    console.log('Topic: ' + topic);
    console.log('Payload: ' + payload.toString());

    payload = JSON.parse(payload);
    switch (payload.event) {
      case "arm":
        // TODO: change state to armed
        console.log('Armed!');
        device.publish('mozart', JSON.stringify({ event: 'armed', device: "piano-chip" }));
        break;
      default:
        console.log("Unhandled event: " + payload.event);
    }
});

function exit() {
  button1.unexport();
  button2.unexport();
  button3.unexport();
  process.exit();
}

process.on('SIGINT', exit);

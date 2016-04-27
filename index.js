var awsIot = require('aws-iot-device-sdk');
var Gpio = require('chip-gpio').Gpio;

var button = new Gpio(6, 'in', 'both', {
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

button.watch(function(err, value) {
  if (err) {
    throw err;
  }
  console.log('Button pressed');
  device.subscribe('mozart');
  device.publish('piano-chip/button', JSON.stringify({ event: 'click' }));
});

device.on('message', function(topic, payload) {
    console.log('Message Received');
    console.log('Topic: ' + topic);
    console.log('Payload: ' + payload.toString());
});

function exit() {
  button.unexport();
  process.exit();
}

process.on('SIGINT', exit);

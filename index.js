var fs = require('fs');
const deviceModule = require('./device');

const device = deviceModule({
    keyPath: "./certs/xxx-private.pem.key",
    certPath: "./certs/xxx-certificate.pem.crt",
    caPath: "./certs/root-CA.crt",
    clientId: "desktoparbeit",
    region: "eu-central-1", baseReconnectTimeMs: 4000,
    keepalive: 180, protocol: "mqtts", debug: false
});

device.on('close', function () { console.log('close'); });
device.on('reconnect', function () { console.log('reconnect'); });
device.on('offline', function () { console.log('offline'); });
device.on('error', function (error) { console.log('error', error); });
device.on('connect', function () {
    console.log('Connected to MQTT!');
    device.subscribe('test');
    runFunction();
});
device.on('message', function (topic, payload) {
    console.log(topic, payload.toString());
});

function sendMQTT(temp, device) {
    console.log('Sending Message!');
    let params = { "id": "raspberrytemp", "ctemp": temp };
    device.publish("test", JSON.stringify(params));
}

function getTemp() {
    let temp = (fs.readFileSync('/sys/class/thermal/thermal_zone0/temp').toString())/1000;
    return Math.round(temp);
}

function runFunction() {
    let temp = getTemp();
    sendMQTT(temp, device);
};

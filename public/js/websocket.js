const local = (window.location.hostname.includes('localhost')) ? true : false;
console.log('local', local)
const host = (local) 
? 'localhost:3003'
: 'f1dec3061b9de6ea43671d57d05b0e6a.balena-devices.com'

const myWebSocket = new WebSocket(`wss://${host}`);
myWebSocket.onmessage = (event) => {
    const { phone, message, timestamp, motion } = JSON.parse(event.data);
    if (phone) {
        console.log('event sms', event.data)
        fetchImagesToServer(message, 'dalle', false, phone);
    }
    if (motion) {
        console.log('event motion', event.data)
        startButton()
    }
};

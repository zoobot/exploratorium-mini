const local = (window.location.hostname.includes('localhost')) ? true : false;
console.log('local', local)
const host = (local) 
? 'ws://localhost:3003'
: 'wss://f1dec3061b9de6ea43671d57d05b0e6a.balena-devices.com'

const myWebSocket = new WebSocket(host);
myWebSocket.onmessage = (event) => {
    console.log('event', event)
    if (event?.data) {
        const { phone, body, timeStamp, motion } = JSON.parse(event.data);
        if (phone) {
            console.log('event sms', phone, body, timeStamp)
            fetchImagesToServer(body, 'dalle', false, phone);
        }
        if (motion) {
            console.log('event motion', motion)
            location.reload();
            startButton({timeStamp})
        }
    }

};

var myWebSocket = new WebSocket("ws://localhost:3003");
myWebSocket.onmessage = (event) => {
    console.log('event', event.data)
    startButton(event)
    // event.data("A spanner has been updated. Please refresh the page to see changes.");
};

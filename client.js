const WebSocket = require('ws')
const url = 'ws://localhost:8080'
const connection = new WebSocket(url)

// const readline = require('readline');
// readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);

const iohook = require('iohook');
 
connection.onopen = () => {
	iohook.on('keypress', (key) => {
		connection.send(JSON.stringify(key));
	});
	iohook.start();
};
 
connection.onerror = (error) => {
	console.log(`WebSocket error: ${error}`)
};
 
connection.onmessage = (e) => {
	let key = JSON.parse(e.data);
	console.log(key.rawcode);
};
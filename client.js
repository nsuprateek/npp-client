const WebSocket = require('ws')
const iohook = require('iohook');
var ks = require('node-key-sender');

const PORT = process.env.PORT || 8080;
const url = 'ws://npp-app.herokuapp.com:80/ws'

var reconnect_time = 0.01 //sec

function connect() {

	const connection = new WebSocket(url);
	 
	connection.onopen = () => {
		console.log("Connection started");

		iohook.on('keypress', (key) => {
			connection.send(JSON.stringify(key));
		});
		iohook.start();
	};

	connection.onclose = (e) => {
		console.log(`Socket is closed. Attempting to reconnect in ${reconnect_time} second...`, e.reason);
		setTimeout(function() {
	        if (reconnect_time <= 5*60*1000) { // 5 minutes
	        	connect();
	        	reconnect_time *= 1.25;
	    		console.clear();
	        }
	        else {
	        	connection.close();
	        }

	    }, reconnect_time * 1000);
	};
	 
	connection.onerror = (error) => {
		err = JSON.stringify(error);
		console.log(`WebSocket error: ${err}`)
	};

	connection.onmessage = (e) => {
		let key = JSON.parse(e.data);
		console.log(key.rawcode);

		if (key.rawcode === 65363) {
			ks.sendKey('a');

		// if ()
		// 	ks.sendKey('left');
		// 	ks.sendKey('right');
		// 	ks.sendKey('up');
		// 	ks.sendKey('q');
		}
	};
}

connect();
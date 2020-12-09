import tmi from 'tmi.js';

import { parseCommands } from './commands.js';

const {
	DB_HOST,
	DB_USER,
	DB_PASSWORD,
	DB_NAME,
	BOT_COMMAND_SYMBOL
} = process.env;

console.log('susurrus initialized');

// This is the one library we'll use 'require' for, specficially to maintain parity with the knex docs
const knex = require('knex')({
	client: 'pg',
	connection: {
	  host: DB_HOST,
	  user: DB_USER,
	  password: DB_PASSWORD,
	  database: DB_NAME,
	}
});

const clientOptions = {
	options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: 'susurrusbot',
		password: `oauth:${process.env.OAUTH_TOKEN}`
	},
	channels: [ 'faithlessfew' ]
}

const client = new tmi.Client(clientOptions);

client.connect().catch(console.error);

client.on('message', (channel, userstate, message, self) => {
    if (self) return;
	
	message = message.toLowerCase();

	console.log('message first letter', message[0])
	// Fundamentally, the bot should only pay attention if the message is prefaced with the bot command symbol (default '!')
	if (message[0] !== BOT_COMMAND_SYMBOL) return;

	parseCommands({ client, channel, userstate, message });
});

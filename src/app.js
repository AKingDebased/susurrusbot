import tmi from 'tmi.js';

import { hello, swearJar, bang} from './commands.js';

const {
	DB_HOST,
	DB_USER,
	DB_PASSWORD,
	DB_NAME
} = process.env;

console.log('susurrus initialized');
console.log({
	DB_HOST,
	DB_USER,
	DB_PASSWORD,
	DB_NAME
});

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

knex.schema.createTable('users', table => { 
	table.increments('id');
	table.string('name');
}).then(() => {
	console.log('table created!');
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
    console.log({
        userstate,
    });

    message = message.toLowerCase();

    if (self) return;
    
	if (message === '!hello') hello(client, channel, userstate)

        // client.deletemessage(channel, userstate.id).then(() => console.log('messaged deleted')).catch(err => console.log('problem deleting message', err));
    // if (message === '!bang') bang(client, channel, userstate)
});

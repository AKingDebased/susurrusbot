console.log('susurrus initialized');

import tmi from 'tmi.js';

const BLOCKED_WORDS = ['cats'];

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

    if (self) return;
    
    // if (userstate.username === 'faithlessfew') {
    //     console.log('master does as he pleases').
    //     return;
    // }

	if (message.toLowerCase() === '!hello') {
		client.say(channel, `@${userstate.username} world!`);
    }
    
    const shouldDeleteMessage = BLOCKED_WORDS.some(blockedWord => message.toLowerCase().includes(blockedWord.toLowerCase()));

    if (shouldDeleteMessage) {
        client.say(channel, `Sorry @${userstate['display-name']}, your message contained content not consistent with this stream's rules, and has been deleted!`);

        client.deletemessage(channel, userstate.id).then(() => console.log('messaged deleted')).catch(err => console.log('problem deleting message', err));
    }
});
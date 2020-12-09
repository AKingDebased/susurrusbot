import { client } from "tmi.js";

const commands = {
    hello: ({ client, channel, userstate }) => {
        client.say(channel, `@${userstate['display-name']} hello to you too, dear!`);
    },
    swearJar: ({ client, channel, userstate }) => {
        // console.log('swear jar!')
        // client.say()
    
        return true;
    }, 
    commands: () => {}
}

const parseCommands = ({ client, channel, userstate, message }) => {
    const splitMessage = message.split(' '),
        fullCommand = splitMessage[0],
        userCommandSymbol = fullCommand[0],
        userCommandName = fullCommand.slice(1);

    // Verify that command starts with '!' and is a recognized command
    if (userCommandSymbol && Object.keys(commands).includes(userCommandName)) {
        commands[userCommandName]({ client, channel, userstate, message });
    } else {
        client.say(channel, `@${userstate['display-name']} sorry, dear, that was not a valid command. you can say '!commands' to me to get a list of all the things i can help you with.`);
    }
};

export {
    parseCommands,
}
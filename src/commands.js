import { client } from "tmi.js";

const hello = (client, channel, userstate) => {
    client.say(channel, `@${userstate['display-name']} hello to you too!`);
}

const swearJar = (client, channel) => {
    // console.log('swear jar!')
    // client.say()
}

const bang = () => {
    client.say(channel, `@${userstate['display-name']} hello to you too!`);
}

const commands = () => {

}

export {
    hello,
    swearJar,
    bang,
    commands,
}
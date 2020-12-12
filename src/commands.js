// TODO: A system to keep track of people's favorite triggers

/* 
Friday triggers:
    * shout out (!so)
    * tip & donation trigger menu (!menu)
    * tip & donation command (!tip & !donate, explaining how to donate and tip)
    * !bang
    * holiday video command/commands
*/

import axios from 'axios';

const commands = {
    susu: ({ client, channel, userstate }) => {
        client.say(channel, `/me smiles warmly at you. “Why hello there, ${userstate['display-name']}, my love. I'm Susu! I was created by faithlessfew to be Rileyrozez's assistant, and a friend to her community. There's a great many things I can help you with. Why don't you type !commands to get started?”`);
    },
    hello: ({ client, channel, userstate }) => {
        client.say(channel, `${userstate['display-name']} Hello to you too, my love!`);
    },
    swearJar: ({ client, channel, userstate }) => {
        // console.log('swear jar!')
        // client.say()
    
        return true;
    }, 
    so: ({ client, channel, userstate, userCommandArgs }) => {
        if (userCommandArgs.length > 1) client.say(channel, `${userstate['display-name']} Sorry, my love, that was an invalid command! You can type "!so help" to get, well, help with this command.`)

        const soUser = userCommandArgs[0];

        axios.get(`${process.env.TWITCH_API_URL}/users`, {
            headers: { 
                'Authorization': `Bearer ${process.env.OAUTH_TOKEN}`,
                'Client-Id': process.env.CLIENT_ID 
            },
            params: {
                login: soUser
            }
        }).then(res => {
            const { id } = res.data.data[0];

            axios.get(`${process.env.TWITCH_API_URL}/videos`, {
                headers: { 
                    'Authorization': `Bearer ${process.env.OAUTH_TOKEN}`,
                    'Client-Id': process.env.CLIENT_ID 
                },
                params: {
                    user_id: id,
                    type: 'archive'
                }
            }).then(res => {
                // TODO: Is it possible to get a game id from the video request, so that we can report the "game type" they last streamed?
                const latestVideo = res.data.data[0];

                if (latestVideo) {
                    client.say(channel, `/me pulls out a megaphone. “Let's give a big shout out to ${soUser}! Their most recent stream was "${latestVideo.title}". Go check them out at twitch.tv/${soUser} today!"`);
                } else {
                    client.say(channel, `/me pulls out a megaphone. “Let's give a big shout out to ${soUser}! They haven't streamed any videos recently. Looks like they could use your support! Go check them out at twitch.tv/${soUser} today!"`);
                }
            }).catch(err => {
                console.log('error finding user videos', { err })
            });
        }).catch(err => {
            console.log('error finding user', { err });

            client.say(channel, `/me flips through her notebook, frowning. “Sorry, ${userstate['display-name']}, but I can't find a user by the name. It's the thought that counts!"`);
        });
    },
    holidays: ({ client, channel, userstate }) => {
        client.say(channel, `/me pulls a pamphlet from a pocket on her notebook, and hands it to ${userstate['display-name']}. "Want a personalized Holiday video? Check out the prices and fill out an order form here!" https://forms.gle/dVm1kDLobBDBCDai9`);
    },
    commands: ({ client, channel, userstate }) => {
        client.say(channel, `/me flips through her notebook. "!hello, !holidays, !swearJar, !so, !susu. You can also type "help" after any command name for more info. E.g. !swearJar help."`);
    },
    // mod commands
    susutime: ({ client, channel, userstate }) => {
        if (userCommandArgs.length > 1) client.say(channel, `${userstate['display-name']} Sorry, my love, that was an invalid command! You can type "!so help" to get, well, help with this command.`)

        const timeoutUser = userCommandArgs[0];

        client.say(channel, `/timeout ${timeoutUser}`);
        client.say(channel, `/me twirls her pen with a florish, before pressing it firmly over your mouth. "Now, now, ${userstate['display-name']}, I'm going to have to ask you to not do that again. Why don't you take a moment?"`);
    },
}

const parseCommands = ({ client, channel, userstate, message }) => {
    const splitCommand = message.split(' '),
        userCommand = splitCommand[0],
        userCommandSymbol = userCommand[0],
        userCommandName = userCommand.slice(1),
        userCommandArgs = [...splitCommand].splice(1);

    // Verify that command starts with '!' and is a recognized command
    if (userCommandSymbol && Object.keys(commands).includes(userCommandName)) {
        commands[userCommandName]({ client, channel, userstate, message, userCommandArgs });
    } else {
        // TODO: Uncomment this once Susu is the only bot in town
        // client.say(channel, `@${userstate['display-name']} Sorry, my love, that was not a valid command. you can say '!commands' to see all the things i can help you with.`);
    }
};

export {
    parseCommands,
}
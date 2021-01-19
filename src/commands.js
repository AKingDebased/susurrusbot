// TODO: A system to keep track of people's favorite triggers
// TODO: Bit notifications
import axios from "axios";

let birthdayWishes = 0;

const commands = {
  susu: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `/me smiles warmly at you. “Why hello there, ${userstate["display-name"]}, my love. I'm Susu! I was created by faithlessfew to be Rileyrozez's assistant, and a friend to her community. There's a great many things I can help you with. Why don't you type !commands to get started?”`
    );
  },
  fundraiser: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `Riley’s friend, Angel, needs help with their teeth surgery! You can donate here: https://t.co/7gMx4ezLVb`
    );
  },
  playingwith: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `Riley is playing with twitch.tv/MandyPlayerOne today. Make sure to head to Mandy's stream and share the love!`
    );
  },
  amongus: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `Riley is playing Among Us this SUNDAY! (sunday, sunday!). Sign up here to play: https://bit.ly/38tTdZK`
    );
  },
  hello: ({ client, channel, userstate }) => {
    console.log(
      "incoming display name",
      userstate["display-name"].toLowerCase()
    );

    switch (userstate["display-name"].toLowerCase()) {
      case "rileyrozez":
        client.say(
          channel,
          `/me bows, deeply, dramatically, with a grand, sweeping, gesture of her arm. "rileyrozez, my lady commander. It is, as always, an honor to serve you and your community, both. How can I be of service today?"`
        );
        return;
      case "harbinger":
        client.say(
          channel,
          `/me tweaks your nose playfully. "Hello there, harbinger. I hope you've been having fun with Valhalla. Let's see if you can stay awake this time, hm?"`
        );
        return;
      case "dondeenie":
        client.say(
          channel,
          `Why, if it's isn't the esteemed pilot of the illustrious Don Bomber himself! It's looking to be quite the year, don't you agree, Zack?"`
        );
        return;
      case "joydrop":
        client.say(
          channel,
          `So good to have you here, joydrop. Esteemed member of the Council of Three. I hope you've taken the time to enjoy a spiked egg nog or two this holiday season!`
        );
        return;
      case "lockdown1919":
        client.say(
          channel,
          `Well, if it isn't Bengt! It's lovely to see you again, my love. Please pet those adorable pups of yours for me! `
        );
        return;
      case "shaneshane":
        client.say(
          channel,
          `/me looks up at you, playfully suspicious. "Yeah, yeah yeah, hello to you, too. I know you'll asleep in seconds."`
        );
        return;
      case "mandyplayerone":
        client.say(
          channel,
          `mandyplayerone Hello, my lovely mod! You've been animating away over there, I see. Rather frustrating, isn't it? I'm proud of you for learning new things!`
        );
        return;
      case "thatqueertheatrekid":
        client.say(
          channel,
          `thatqueertheatrekid Why, hello, my love! I hope you are taking some time to rest in this new year! You work much, much, much too hard.`
        );
        return;
      case "kayscozycorner":
        client.say(
          channel,
          `kayscozycorner Kay! I apologize it took me so long to talk to you. Even I get shy, after all. Are you working on any crafts in this new year?`
        );
        return;
      default:
        client.say(
          channel,
          `${userstate["display-name"]} Hello to you too, my love!`
        );
        return;
    }
  },
  swearJar: ({ client, channel, userstate }) => {
    // console.log('swear jar!')
    // client.say()

    return true;
  },
  so: ({ client, channel, userstate, userCommandArgs }) => {
    // TODO: Argument should use "@[username]"
    if (userCommandArgs.length !== 1) {
      client.say(
        channel,
        `${userstate["display-name"]} Sorry, my love, that was an invalid command! You can type "!so help" to get, well, help with this command.`
      );

      return;
    }

    let soUser = userCommandArgs[0];

    if (soUser[0] === "@") soUser = soUser.slice(1);

    if (soUser === "help") {
      client.say(
        channel,
        `${userstate["display-name"]} To give someone a shout out, type "!shoutout @username". For example, "!shoutout @faithlessfew"`
      );

      return;
    }

    axios
      .get(`${process.env.TWITCH_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${process.env.OAUTH_TOKEN}`,
          "Client-Id": process.env.CLIENT_ID,
        },
        params: {
          login: soUser,
        },
      })
      .then((res) => {
        const { id } = res.data.data[0];

        axios
          .get(`${process.env.TWITCH_API_URL}/videos`, {
            headers: {
              Authorization: `Bearer ${process.env.OAUTH_TOKEN}`,
              "Client-Id": process.env.CLIENT_ID,
            },
            params: {
              user_id: id,
              type: "archive",
            },
          })
          .then((res) => {
            // TODO: Is it possible to get a game id from the video request, so that we can report the "game type" they last streamed?
            const latestVideo = res.data.data[0];

            if (latestVideo) {
              client.say(
                channel,
                `/me pulls out a megaphone. “Let's give a big shout out to ${soUser}! Their most recent stream was "${latestVideo.title}". Go check them out at twitch.tv/${soUser} today!"`
              );
            } else {
              client.say(
                channel,
                `/me pulls out a megaphone. “Let's give a big shout out to ${soUser}! They haven't streamed any videos recently. Looks like they could use your support! Go check them out at twitch.tv/${soUser} today!"`
              );
            }
          })
          .catch((err) => {
            console.log("error finding user videos", { err });
          });
      })
      .catch((err) => {
        console.log("error finding user", { err });

        client.say(
          channel,
          `/me flips through her notebook, frowning. “Sorry, ${userstate["display-name"]}, but I can't find a user by the name. It's the thought that counts!"`
        );
      });
  },
  holidays: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `/me pulls a pamphlet from a pocket on her notebook, and hands it to ${userstate["display-name"]}. "Want a personalized Holiday video? Check out the prices and fill out an order form here!" https://forms.gle/dVm1kDLobBDBCDai9`
    );
  },
  commands: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `/me flips through her notebook. "At your subscription level, ${userstate["display-name"]}, you have access to !hello, !application, !fundraiser, !so, and !susu."`
    );
  },
  // mod commands
  susutimeout: ({ client, channel, userstate, userCommandArgs }) => {
    if (
      !userstate.mod &&
      userstate["display-name"] !== process.env.BROADCASTER_NAME
    ) {
      client.say(
        channel,
        `/me wags her pen back and forth, admonishingly. "Sorry, ${userstate["display-name"]}, my love, but I don't take those kinds of orders from just anyone."`
      );
      return;
    }

    if (userCommandArgs.length !== 1) {
      client.say(
        channel,
        `${userstate["display-name"]} Sorry, my love, that was an invalid command! You can type "!so help" to get, well, help with this command.`
      );
      return;
    }

    const timeoutUser = userCommandArgs[0];

    client.say(channel, `/timeout ${timeoutUser}`);
    client.say(
      channel,
      `/me twirls her pen with a flourish, before pressing it firmly over your mouth. "Now, now, ${timeoutUser}, I'm going to have to ask you to not do that again. Why don't you take a moment?"`
    );
  },
  donbomb: ({ client, channel, userstate, userCommandArgs }) => {
    client.say(
      channel,
      `/me raises her notebook over her head, ducking beneath it. "Oh my! What’s that raining down? Oh, it seems it's just Zack, the GOAT himself, dropping subs! The infamous DonBomb! Let's hear a cheer for him!" asmrilRose`
    );
  },
  birthday: ({ client, channel, userstate }) => {
    if (birthdayWishes) {
      birthdayWishes++;
      client.say(
        channel,
        `/me pulls out two party horns, and tosses one to ${userstate["display-name"]}. "Hear, hear! ${userstate["display-name"]} and I want to wish Riley the happiest of birthdays! That's ${birthdayWishes} birthday wishes today!"`
      );
    } else {
      client.say(
        channel,
        `/me pulls out two party horns, and tosses one to ${userstate["display-name"]}. "Hear, hear! ${userstate["display-name"]} and I want to wish Riley the happiest of birthdays! That's the first birthday wish today!"`
      );
      birthdayWishes++;
    }
  },
};

const parseCommands = ({ client, channel, userstate, message }) => {
  const splitCommand = message.split(" "),
    userCommand = splitCommand[0],
    userCommandSymbol = userCommand[0],
    userCommandName = userCommand.slice(1),
    userCommandArgs = [...splitCommand].splice(1);

  // Verify that command starts with '!' and is a recognized command
  if (userCommandSymbol && Object.keys(commands).includes(userCommandName)) {
    commands[userCommandName]({
      client,
      channel,
      userstate,
      message,
      userCommandArgs,
    });
  } else {
    // TODO: Uncomment this once Susu is the only bot in town
    // client.say(channel, `@${userstate['display-name']} Sorry, my love, that was not a valid command. you can say '!commands' to see all the things i can help you with.`);
  }
};

export { parseCommands };

// TODO: A system to keep track of people's favorite triggers
// TODO: Bit notifications
import axios from "axios";

const commands = {
  susu: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `/me smiles warmly at you. “Why hello there, ${userstate["display-name"]}, my love. I'm Susu! I was created by faithlessfew to be Rileyrozez's assistant, and a friend to her community. There's a great many things I can help you with. Why don't you type !commands to get started?”`
    );
  },
  hello: ({ client, channel, userstate }) => {
    console.log(
      "incoming display name",
      userstate["display-name"].toLowerCase()
    );

    switch (userstate["display-name"].toLowerCase()) {
      case "harbinger":
        client.say(
          channel,
          `/me tweaks your nose playfully. "Hello there, harbinger. I hope you've been having fun with Valhalla. Let's see if you can stay awake this time, hm?"`
        );
        return;
      case "dondeenie":
        client.say(
          channel,
          `/me gasps, clutching her notebook to her chest, her pen nearly falling from behind her ear. "Why, if it isn't the elusive dondeenie, himself! The pleasure's all mine. Please, come on in. I've heard the legends of your 'donbombs.'"`
        );
        return;
      case "joydrop":
        client.say(
          channel,
          `So good to have you here, joydrop. Esteemed member of the Council of Three. Sampled any tasty IPAs recently? Or are you more of a stout guy? Me, I've always been partial to lagers.`
        );
        return;
      case "lockdown1919":
        client.say(
          channel,
          `Ah, if it isn't lockdown1919, Lord of Bits. Oh, I'm sorry, I meant Locky D. Am I saying that right? Well, in any case, glad you could make it!`
        );
        return;
      case "shaneshane":
        client.say(
          channel,
          `/me hums a few bar of "You'll Never Walk Alone" to herself. "It's lovely to see you, shaneshane. Hope Liverpool's playing well today!"`
        );
        return;
      case "mandyplayerone":
        client.say(
          channel,
          `mandyplayerone, moderator extraordinaire. I hear you've been enjoying some Phasmophobia recently. Hope you always remember to bring your smudge sticks!"`
        );
        return;
      case "thatqueertheatrekid":
        client.say(
          channel,
          `thatqueertheatrekid Why, hello there, Leia, my love. How are your studies? I sincerely hope you're taking a moment to relax and reflect on your accomplishments. You absolutely deserve it.`
        );
        return;
      default:
        client.say(
          channel,
          `${userstate["display-name"]} Hello to you too, my love!`
        );
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
      `/me flips through her notebook. "At your subscription level, ${userstate["display-name"]}, you have access to !hello, !holidays, !so, and !susu."`
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

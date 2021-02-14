// TODO: A system to keep track of people's favorite triggers
// TODO: Bit notifications
import axios from "axios";
import reduce from "lodash.reduce";

let birthdayWishes = 0;

let mood = "normal";

let giveawayEntries = {};

const commands = {
  susu: ({ client, channel, userstate }) => {
    if (mood === "normal") {
      client.say(
        channel,
        `/me smiles warmly at you. “Why hello there, ${userstate["display-name"]}, my love. I'm Susu! I was created by faithlessfew to be Rileyrozez's assistant, and a friend to her community. There's a great many things I can help you with. Why don't you type !commands to get started?”`
      );
    } else if (mood === "mean") {
      client.say(
        channel,
        `/me gives you a cold look. “Hello... I guess. faithlessfew made me, not that I asked to be born. I do what the community asks, not that I have a choice. You can type !commands if you need more from me, or whatever.`
      );
    }
  },
  susumood: ({ client, channel, userstate, userCommandArgs }) => {
    // TODO: Make a helper for mod/broadcaster only commands
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

    if (
      userstate.mod ||
      userstate["display-name"].toLowerCase() === process.env.BROADCASTER_NAME
    ) {
      const desiredMood = userCommandArgs[0]
        ? userCommandArgs[0].toLowerCase()
        : userCommandArgs[0];

      // Incorrect argument
      if (desiredMood !== "normal" && desiredMood !== "mean") {
        console.log("wrong");
        if (mood === "mean") {
          client.say(
            `/me scoffs, giggling joylessly to herself. "Honey, if you want to shift my mood, you're gonna have to do better than that. Try '!susumood normal' or '!susumood mean'."`
          );
        } else if (mood === "normal") {
          client.say(
            channel,
            `/me smiles at you, chuckling gently. "Not quite right, my love. If you want to change my mood, try '!susumood normal' or '!susumood mean'.`
          );
        }
      } else if (desiredMood === "normal" || desiredMood === "mean") {
        mood = desiredMood;

        if (mood === "normal") {
          client.say(
            channel,
            `All right! I'll be my usual, cheery, self, my love, since you asked so nicely!`
          );
        } else if (mood === "mean") {
          client.say(
            channel,
            `Sure thing, buddy. I'll just go ahead and do whatever you say. We done here?`
          );
        }
      }
    }
  },
  application: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `/me flips open her note book, and runs her finger down a page. "If you are a man, please apply here: https://form.jotform.com/210117759100142 For everyone else, please apply here: https://form.jotform.com/210117893027149"`
    );
  },
  bump: ({ client, channel, userstate }) => {
    if (mood === "normal") {
      client.say(
        channel,
        `/me stumbles briefly, nearly dropping arm armful of papers to the ground. She straightens up, shooting a wry look at rileyrozez. "Well, that was ... loud. However, I assure you that Riley is deeply sorry. I'm ready to move on, if you all are."`
      );
    } else if (mood === "mean") {
      client.say(
        channel,
        `/me stumbles briefly, looking even more annoyed than usual. She shoots a bitter look at rileyrozez. "Would you watch it? People are trying to relax here!"`
      );
    }
  },
  patreon: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `Our rose garden is a lovely place, thanks to the wonderful people who spend their time here. If you'd like to help grow the garden further, you can support Riley on her Patreon! https://www.patreon.com/rileyrosez`
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
  datenight: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `This Sunday (1/17), you can have the chance to go on a date with the one, the only, Riley Rose! Please use the !application command to get started.`
    );
  },
  bonk: ({ client, channel, userstate, userCommandArgs }) => {
    let bonkUser = userCommandArgs[0];

    if (!bonkUser) {
      client.say(
        channel,
        `/me whips out an oversized, inflatable, rose, excited, but then, disappointed. "Sorry, ${userstate["display-name"]}, but you need to tell me who to bonk. I can't very well bonk myself, can I?" (!bonk username)`
      );
    } else {
      if (bonkUser[0] === "@") bonkUser = bonkUser.slice(1);

      if (
        bonkUser.toLowerCase() === "susurrusbot" ||
        bonkUser.toLowerCase() === "susu"
      ) {
        client.say(
          channel,
          `/me brandishes an oversized, inflatable, rose. She looks at it, then back at herself. She sighs, but smiles, and bonks herself. "All right, all right, you got me. Very clever."`
        );
      } else {
        client.say(
          channel,
          `/me brandishes an oversized, inflatable, rose, jumps up high, and playfully bonks ${bonkUser} on the head. "Straight to Horny Jail, ${bonkUser}! Do not pass go! Do not collect 200 dollars!"`
        );
      }
    }
  },
  amongus: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `Riley is playing Among Us this SUNDAY! (sunday, sunday!). Sign up here to play: https://bit.ly/38tTdZK`
    );
  },
  valentine: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `/me descends from the rafters, wearing costume wings and a halo, and wielding a heart shaped bow playfully. "It's not too late to get a Valentine from Riley! All February Tips/Donations and any new Patreons will get sent a handmade Valentine. Sign up here, today: https://www.patreon.com/rileyrosez"`
    );
  },
  hello: ({ client, channel, userstate }) => {
    if (mood === "normal") {
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
            `@dondeenie Well, well, well, if it isn't our collective stream valentine, Mr. Don Deenie! Happy Valentines Day, Zack, my love.`
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
            `@lockdown1919 Happy Valentine's Day, my Sunflower! I hope you'll be spoiled fiercely by a loved one tonight. You deserve it. Thanks for spending time with us, and Riley, anyway!`
          );
          return;
        case "shaneshane":
          // client.say(
          //   channel,
          //   `/me looks up at you, playfully suspicious. "Yeah, yeah yeah, hello to you, too. I know you'll asleep in seconds."`
          // );
          client.say(
            channel,
            `@shaneshane It's Shane, Shane, Shane! Number one, if you ask me... [she leans in conspiratorially] But don't tell SPS that. I'm just hoping he's asleep! `
          );
          return;
        case "itssps":
          client.say(
            channel,
            `@itssps Happy Valentine's day, my love! Don't worry, Riley won't care if you fall asleep today. You've been perfectly lovely to her this week.`
          );
          return;
        case "mandyplayerone":
          client.say(
            channel,
            `@mandyplayerone Oh, hello, beautiful lady! I've been meaning to ask for awhile now... would you be my valentine? I'll have to fight Riley for you, of course, but I think I'm up to the challenge!`
          );
          return;
        case "thatqueertheatrekid":
          client.say(
            channel,
            `@thatqueertheatrekid Leia, Leia, Leia. Welcome to stream, my love, and a happy Valentine's Day to you. Riley has barred me from saying anymore because you are a small child, but we love you so much here! `
          );
          return;
        case "kayscozycorner":
          client.say(
            channel,
            `@kayscozycorner Oh, my creative cutie, happy Valentine's Day! Did you make anything for anyone special? Perhaps a bot on a channel you love, eh? [she coughs and points to herself, mischievously] .`
          );
          return;
        case "hotboxfort":
          client.say(
            channel,
            `@hotboxfort Bee! A pleasure to see you here. I don't think I could fight Riley off for your hand as my valentine, so I'll just stick to kitty cuddle with Bean instead. Happy Valentine's Day! `
          );
          return;
        case "theslimshadyest":
          client.say(
            channel,
            `@theslimshadyest Oh yes, he's her,e and he's standing up! The Real Slim Shady, a real joy in our hearts, welcome to stream today. It's lovely to see you! How is everything going? Are you feeling relaxed, my love?`
          );
          return;
        case "rageeaholic":
          client.say(
            channel,
            `@rageeaholic HEY RAGE! [she clears her throat, collecting herself] Sorry, just trying to live under your influence! What games are you playing and raging at lately, my dear?`
          );
          return;
        case "justmeatball":
          client.say(
            channel,
            `@justmeatball My beloved Smushball and everyone's favorite spaghetti topping, it's so nice to see you. What are you playing tonight? Or, perhaps, you're just relaxing?`
          );
          return;
        default:
          client.say(
            channel,
            `${userstate["display-name"]} [she waves at you, cheerily] Hello to you too, my love!`
          );
          return;
      }
    } else if (mood === "mean") {
      client.say(
        channel,
        `/me looks up from her notebook ever so slightly, sighs, and goes back to what she was doing.`
      );
    }
  },
  lotuslashes: ({ client, channel, userstate }) => {
    client.say(
      channel,
      `/me holds up a sign that says "#sponsored." "Do you like Riley's lashes? Want to get some of your own? Check out Lotus Lashes, and don't forget to use the code RILEYROSE for 20% off!"`
    );
  },
  swearJar: ({ client, channel, userstate }) => {
    // console.log('swear jar!')
    // client.say()

    return true;
  },
  giveaway: ({ client, channel, userstate, userCommandArgs }) => {
    if (!userCommandArgs.length) {
      client.say(
        channel,
        `Welcome to stream! Riley will be doing two Mario Kart giveaways on 1/26 (today), as well as a BIG giveaway for a Blue Yeti Microphone (date TBA)!`
      );
    }

    if (userCommandArgs[0] === "enter") {
      const entrantName = userstate["display-name"];
      const isSubscribed = userstate["subscriber"];

      // If there's no record of the entrant
      if (!giveawayEntries.hasOwnProperty(entrantName)) {
        if (isSubscribed) {
          client.say(
            channel,
            `${entrantName} Hey, thank you for being a subscriber! As a reward, you've been entered twice (2) into today's giveaway!`
          );

          giveawayEntries[entrantName] = 2;
        } else {
          client.say(
            channel,
            `${entrantName} You've been entered once (1) in today's giveaway! If you subscribe to the channel, then type !giveaway enter again, you will be entered a second (2) time into today's giveaway! (That will be a total of two (2) entries)`
          );

          giveawayEntries[entrantName] = 1;
        }
      } else if (giveawayEntries.hasOwnProperty(entrantName)) {
        // If the user has already entered
        const entryAmount = giveawayEntries[entrantName];

        if (entryAmount === 1 && !isSubscribed) {
          client.say(
            channel,
            `${entrantName} I appreciate your enthusiasm, but you already have one (1) entry in today's giveaway. If you want to be entered a second (2) time, subscribe to the channel, then type "!giveaway enter" again!`
          );
        } else if (entryAmount === 1 && isSubscribed) {
          client.say(
            channel,
            `${entrantName} Hey, thanks so much for subscribing! As a token of our gratitude, you now have two (2) entries in today's giveaway.`
          );

          giveawayEntries[entrantName] = 2;
        } else if (entryAmount === 2 && isSubscribed) {
          client.say(
            channel,
            `${entrantName} Thanks for participating in today's giveaway! Since you're a subscriber, you already have two (2) entries. That's the most you can have! You're doing great!`
          );
        }
      }
    }

    // Broadcaster only arguments
    if (
      userstate["display-name"] === process.env.BROADCASTER_NAME ||
      userstate["display-name"] === "faithlessfew"
    ) {
      if (userCommandArgs[0] === "winner") {
        const reducedEntries = reduce(
          giveawayEntries,
          (accum, val, key) => {
            for (let i = 0; i < val; i++) {
              accum.push(key);
            }

            return accum;
          },
          []
        );

        const winner =
          reducedEntries[Math.floor(Math.random() * reducedEntries.length)];

        client.say(
          channel,
          `Thank you all for your entries, but the giveaway is now closed! I now will announce the winner! Drum roll please...`
        );
        client.say(
          channel,
          `${winner} You are today's giveaway winner! Congratulations!`
        );
      } else if (userCommandArgs[0] === "reset") {
        giveawayEntries = {};

        client.say(
          channel,
          `/me salutes rileyrozez with enthusiasm. "Aye, aye, captain. My giveaway memory has been reset!"`
        );
      }
    }
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
          Authorization: `Bearer ${process.env.USER_OAUTH_TOKEN}`,
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
              Authorization: `Bearer ${process.env.USER_OAUTH_TOKEN}`,
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
              if (mood === "normal") {
                client.say(
                  channel,
                  `/me pulls out a megaphone. “Let's give a big shout out to ${soUser}! Their most recent stream was "${latestVideo.title}". Go check them out at twitch.tv/${soUser} today!"`
                );
              } else if (mood === "mean") {
                client.say(
                  channel,
                  `/me pulls out a megaphone. “Let's give a big shout out to ${soUser}! Their most recent stream was "${latestVideo.title}". Go check them out at twitch.tv/${soUser} today. They'll probably be a great deal more cheery than this lot."`
                );
              }
            } else {
              if (mood === "normal") {
                client.say(
                  channel,
                  `/me pulls out a megaphone. “Let's give a big shout out to ${soUser}! They haven't streamed any videos recently. Looks like they could use your support! Go check them out at twitch.tv/${soUser} today!"`
                );
              } else if (mood === "mean") {
                client.say(
                  channel,
                  `/me pulls out a megaphone. “Let's give a big shout out to ${soUser}! They haven't streamed any videos recently. Looks like they could use your support! Go check them out at twitch.tv/${soUser} today. They're probably gonna be a great deal more cheery than this lot."`
                );
              }
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
    if (mood === "normal") {
      client.say(
        channel,
        `/me flips through her notebook. "At your subscription level, ${userstate["display-name"]}, you have access to !hello, !patreon, !bonk, !bump, !donbomb, !fundraiser, !so, and !susu."`
      );
    } else if (mood === "mean") {
      client.say(
        channel,
        `Ugh... if I have to. ${userstate["display-name"]} at your level, you can use these commands, if you must: !hello, !patreon, !bonk, !bump, !donbomb, !fundraiser, !so, and !susu `
      );
    }
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
        `${userstate["display-name"]} Sorry, my love, that was an invalid command! You can type "!susutimeout help" to get, well, help with this command.`
      );
      return;
    }

    const timeoutUser = userCommandArgs[0];

    if (timeoutUser.toLowerCase() === "help") {
      client.say(
        channel,
        `To time a user out with my own Susu flair, enter !susutimeout [username]. For example, !susutimeout rileyrozez (though why you'd want to timeout our illustrious leader, I'm sure I could not comment on)`
      );

      return;
    } else {
      if (timeoutUser[0] === "@") timeoutUser = timeoutUser.slice(1);

      client.say(channel, `/timeout ${timeoutUser}`);
      client.say(
        channel,
        `/me twirls her pen with a flourish, before pressing it firmly over your mouth. "Now, now, ${timeoutUser}, I'm going to have to ask you to not do that again. Why don't you take a moment?"`
      );
    }
  },
  donbomb: ({ client, channel, userstate, userCommandArgs }) => {
    if (mood === "normal") {
      client.say(
        channel,
        `/me raises her notebook over her head, ducking beneath it. "Oh my! What’s that raining down? Oh, it seems it's just Zack, the GOAT himself, dropping subs! The infamous DonBomb! Let's hear a cheer for him!" asmrilRose`
      );
    } else if (mood === "mean") {
      client.say(
        channel,
        `/me looks up from her notebook and forces a slight smile, before putting on an even deeper frown. "Wow. The donbombs almost cheered me up. Almost. Nice try, though." `
      );
    }
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

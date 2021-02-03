## running locally

`npm start` will spin up a server on your machine. the bot will immediately be avaible in [faithlessfew's twitch chat](https://www.twitch.tv/faithlessfew).

## deloying

- tbd

## connecting (local SSH)

the `ssh` command (on mac/unix, anyway), is `ssh -i [directoryOfPrivateKey] [username]@[publicIp]`

## running a background process (the Daemon)

- a quirk of AWS Lightsail is that, by default, an `npm` process (like, say, `npm run`) will only run if you are actively SSHed into the lightsail instance. so, you'd either need to always have a terminal on a physical machine SSHed in (which somewhat defeats the purpose of running this in the cloud in the first place), or always keep the AWS browser console window open.
- for this project, i use [pm2](https://www.npmjs.com/package/pm2) to, instead, keep the process running in the background of the virtual server. in short, pm2 will allow the lightsail instance to keep a given process or processess running until otherwise shut down.
- right now, there's no github actions or anything slick set up to automatically spin up or spin down pm2 processes, so, one still needs to SSH into lightsail as part of the app flow.

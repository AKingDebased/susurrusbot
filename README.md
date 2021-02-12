## running locally

`npm start` will spin up a server on your machine. the bot will immediately be avaible in [faithlessfew's twitch chat](https://www.twitch.tv/faithlessfew).

## authenticating

from what i can tell so far, this process is a little silly. to get a user scoped oauth token, you have to send a `GET` request in the following format:

```
GET https://id.twitch.tv/oauth2/authorize
    ?client_id=<your client ID>
    &redirect_uri=<your registered redirect URI>
    &response_type=code
    &scope=<space-separated list of scopes>
```

- for security, `client_id` will not be specified here, but can be found in the twitch developer account associated with this bot
- `redirect_uri=http://localhost/`
- `response_type=token`
- `scope=channel:moderate+chat:edit+chat:read`

however, as far as i can tell, this request will open a browser window that must be interacted with. so, this token cannot be (easily) retrieved progamatically. might merit future investigation.

the authentication docs can be found [here](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-authorization-code-flow)

## deloying

- simply, `npm start`, and an instance of the bot will spin up. note that the bot is not a singleton, so another bot will be spun up for each `npm` process (could be interesting if ever there was a need to have multiple concurrent bots)
- right now, susu lives in an AWS lightsail instance (as detailed below). one day, i'll make a fun little flow that allows an end user to enable & disable susu from a friendly web interface. today is not that day.

## connecting (local SSH)

the `ssh` command (on mac/unix, anyway), is `ssh -i [directoryOfPrivateKey] [username]@[publicIp]`

## running a background process (the Daemon)

- a quirk of AWS Lightsail is that, by default, an `npm` process (like, say, `npm run`) will only run if you are actively SSHed into the lightsail instance. so, you'd either need to always have a terminal on a physical machine SSHed in (which somewhat defeats the purpose of running this in the cloud in the first place), or always keep the AWS browser console window open.
- for this project, i use [pm2](https://www.npmjs.com/package/pm2) to, instead, keep the process running in the background of the virtual server. in short, pm2 will allow the lightsail instance to keep a given process or processess running until otherwise shut down.
- right now, there's no github actions or anything slick set up to automatically spin up or spin down pm2 processes, so, one still needs to SSH into lightsail as part of the app flow.

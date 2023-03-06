# Description

CodeCollab is a platform for practicing DSA with other people (think two-player leetcode). Check it out [here](https://code-collab.org). It has the following features:

- collaborative text editing using webRTC and CRDTs
- javascript frontend nterpreter
- video chat using webRTC
- (coming soon) v-tubing using tensorflow.js

## Instructions

You need to first set up your environment variables. Rename .env.dev --> .env and fill in your Google Oauth credentials and your database URI. If you don't have these, that is okay you will still be able to test the collaborative features (text editing and video chat).

Next, you can run the app via:

```
npm install
npm start
```

## Other ways to run the app

You can run the dev environment (where Google Oauth doesn't work properly because of the callback url) with:

```
npm install
npm run dev
```

You can also run the app with Docker.

```
- `docker build -t <IMAGE_NAME> .`
- `docker run -p 8080:8080 -p 4444:4444 <IMAGE_NAME>`
```

You should now be able to access the app on localhost:8080. This Docker environment is the closest thing to production; it is what is deployed on AWS

## Tech Stack

Frontend: React, Redux, webRTC
Backend: Express, websockets
Database: postgreSQL
CICD: Docker, AWS Codepipeline, AWS CodeBuild, AWS EC2

# socket.io and nginx

https://socket.io/docs/v4/reverse-proxy/

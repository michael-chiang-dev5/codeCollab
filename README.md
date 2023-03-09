# Demo

1. Go to [https://code-collab.org](https://code-collab.org).
2. Make sure your webcam is not being used by Zoom / another browser. This is necessary if you want to demo video chat.
3. Open a second tab with the same url: https://code-collab.org
4. You should now be collaborating with yourself! You should see two webcam streams on the bottom, and when you type into the code editor it should appear in the other browser tab.

# Description

CodeCollab is a platform for practicing DSA with other people (think two-player leetcode). Check it out [here](https://code-collab.org). It has the following features:

- collaborative text editing using webRTC and CRDTs
- javascript frontend nterpreter
- video chat using webRTC
- (coming soon) v-tubing using tensorflow.js

# Setup

You need to first set up your environment variables. Rename .env.dev --> .env and fill in your Google Oauth credentials and your database URI. If you don't have these, that is okay you will still be able to test the collaborative features (text editing and video chat), you just won't have authentication and anything involving a database.

Next, you can run the app via:

```
npm install
npm start
```

## Dockerization

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
CI/CD: Docker, AWS Codepipeline, AWS ECS

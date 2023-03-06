# Description

This is a minimal template for integrating Docker as a way to deploy your production code.

## Instructions

To run normally:

- `npm install`
- `npm run dev`

To run with Docker:

- `docker build -t <IMAGE_NAME> .`
- `docker run -p 8080:8080 <IMAGE_NAME>`
- prod should now be served on localhost:8080

# For students

git archive -v -o myapp.zip --format=zip HEAD

```
npx typedoc --entryPointStrategy expand src/
```

# Notes

Default port is :80 on EBS
Example:
`codecollab-env.eba-mxadhirz.us-west-1.elasticbeanstalk.com:80/api`

TODO: get proc.env working on frontend
make signal server code editor not harded coded
open up multiple ports in docker

# socket.io and nginx

https://socket.io/docs/v4/reverse-proxy/

WEBSITE_URL=https://code-collab.org/
EDITOR_SIGNAL_SERVER_URL=wss://code-collab.org/signalServerEditor/
ZOOM_SIGNAL_SERVER_URL=wss://code-collab.org/

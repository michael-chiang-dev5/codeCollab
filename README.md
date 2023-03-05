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

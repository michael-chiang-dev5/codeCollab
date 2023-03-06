# ZoomClone

Zoom functionality in React Apps

## How it works

ZoomClone is composed of a React component Zoom.tsx and a backend signaling server zoomSignalServer.ts. Really, we should move zoomSignalServer.ts to the backend folder
for better organization, but eventually if we spin this off into its own npm package
it's better that we keep things together for now.

On component mount, Zoom.js does several thing

- It gets access to a webcam MediaStream and stores a reference to this stream on `userStream`.
- It opens a websocket connection the the signal server and stores a reference to the websocket on `socketRef`.
- It sets up the following listeners on the signaling server websocket:

  - "connect"
  - "user left"
  - "other user"
  - "user joined"
  - "offer"
  - "answer"
  - "ice-candidate"

- It emits the event "join room" to the signal server.

On connection, the signal server sets up the following listeners

- "disconnect"
- "join room"
- "offer"
- "answer"
- "ice-candidate"

## More comments

HOW:
On component load for peer1
navigator.mediaDevices.getUserMedia loads webcam stream
This stream is stored in userVideo (mirror for peer1) and userStream (which is sent to peer2)

// peer1
websocket connects to signal server.
Peer1 sends event "join room" with argument 'roomID' to signal server. Each socket emit also has a socket id.

// server
When signal server receives "join room" event, it stores the socket.id of peer1's connection with socket id's from other peers
It then sends the socket.id of the other user (if it exists) to peer1. It does so by emitting event 'other user' with the socket id of the other user

// peer1
peer1 has a listener for 'other user'. When it receives this event, it does two things:
(1) It "calls" the other user
(2) it stores the socket id of the other user in "other user"

## TODO

### Bug fix

When you use react router to click out, no disconnect signal is sent to the signal server. Then when you re-enter the room, the signal server considers you a new person.

Either disconnect when clicking out, or don't create a new peer when re-entering.

Best way is to disconnect when clicking out, otherwise you may have webcam on without knowing.

One way to do this is to force reload when navigating out.

###

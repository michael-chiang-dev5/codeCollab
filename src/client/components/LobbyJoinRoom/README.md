## Rooms where people don't share their webcam do not show up in lobby

Currently, users must share their webcam to make a connection with the zoom signal server.
The rooms database table is populated from the signal server. Thus, when people do not share their webcam, they do not show up in the rooms database
Is this desired behavior?

- Does it make sense for another user to join a room where the host does not have a webcam?
  - This may degrade the user experience. users will join rooms where they can share text but not talk, which is an important part of pair programming

### Possible improvements

Right now, the zoom signal server is also being used to populate the rooms database. This is bad design, we should have one function for the zoom signal server to make it easier to spec out.

- We should write a separate signal server that takes care of rooms. This does not necessarily have to be on a separate port, just attach different events to the httpServer.

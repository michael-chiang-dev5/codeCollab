import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as io from 'socket.io-client';
import styles from './Zoom.module.css';
import { RootState } from '../../redux/store';
import { v4 as uuid } from 'uuid';

const Zoom = ({ roomId }: { [key: string]: string }) => {
  const userData = useSelector((state: RootState) => state.user);

  // useRef is used to access the DOM
  const [streams, setStreams] = useState<{ [key: string]: MediaStream }>({}); // array of objects. objs contain stream, userId

  // useRef is used to persist across re-renders
  // For example, if the component is re-rendered we don't want to re-establish web-rtc connections
  const peerRefs = useRef<{ [key: string]: RTCPeerConnection }>({}); // RTCPeerConnection
  const socketRef = useRef<io.Socket>(); // websocket from self to server
  const userStream = useRef<MediaStream>(); // peer1 sends this to others
  const senders = useRef([]); // this stores track, used to switch between webcam and screenshare  TODO: remove this

  useEffect(() => {
    navigator.mediaDevices // this requires either localhost, or https
      .getUserMedia({ audio: false, video: true }) // TODO: audio turned off due to feedback for the time being
      .then((stream) => {
        userStream.current = stream; // this reference is used to send a video to other peer

        socketRef.current = io.connect(process.env.ZOOM_SIGNAL_SERVER_URL);
        console.log('emitting "join room" to server');
        console.log(roomId);
        const payload = {
          roomId: roomId,
          email: userData.email,
        };
        socketRef.current.emit('join room', payload);
        socketRef.current.on('connect', () => {
          console.log('connected');
          setStreams((streams) =>
            Object.assign({}, streams, { [socketRef.current.id]: stream })
          );
        });

        socketRef.current.on('user left', (userId: string) => {
          console.log(`${userId} left the room`);
          setStreams((streams) => {
            const newStreams = { ...streams };
            delete newStreams[userId];
            return newStreams;
          });
        });

        socketRef.current.on('other user', (userId: string) => {
          console.log('other user');
          callUser(userId);
        });

        // this function doesn't actually do anything
        socketRef.current.on('user joined', (userId: string) => {
          console.log('user joined', userId);
        });

        socketRef.current.on('offer', handleRecieveCall);

        socketRef.current.on('answer', handleAnswer);

        socketRef.current.on('ice-candidate', (payload: IceCandidateType) => {
          handleNewICECandidateMsg(payload);
        });
      });
  }, []);

  // suppose you join a room with people already inside
  // You will invoke callUser() for each user inside the room
  function callUser(userId: string) {
    console.log('calling user', userId);
    peerRefs.current[userId] = createPeer(userId); // peerRefs = array of rtc connections
    userStream.current // this is your webcam stream (with video and audio track)
      .getTracks() // there should be two tracks in production: 1 audio and 1 video. In development, we disable audio due to feedback so there is one track
      .forEach((track) =>
        senders.current.push(
          peerRefs.current[userId].addTrack(track, userStream.current) // the second argument is a way for the other peer to group tracks together
        )
      );
  }

  function createPeer(userId: string) {
    console.log('creating peer');
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.stunprotocol.org',
        },
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com',
        },
      ],
    });

    // When an RTCIceCandidate has been identified, execute callback
    // The callback has access to RTCPeerConnectionIceEvent
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/icecandidate_event
    // TODO: refactor and bring handleICECandidateEvent logic into callback
    peer.onicecandidate = (e: RTCPeerConnectionIceEvent) =>
      handleICECandidateEvent(e, userId);

    //
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/track_event
    peer.ontrack = (e: RTCTrackEvent) => handleTrackEvent(e, userId);
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userId);

    return peer;
  }

  // Type for payload used to send sdp between sender and receiver
  interface SdpType {
    target: string;
    caller: string;
    sdp: RTCSessionDescription;
  }
  function handleNegotiationNeededEvent(userId: string) {
    peerRefs.current[userId]
      .createOffer()
      .then((offer) => {
        return peerRefs.current[userId].setLocalDescription(offer);
      })
      .then(() => {
        const payload: SdpType = {
          target: userId,
          caller: socketRef.current.id,
          sdp: peerRefs.current[userId].localDescription,
        };
        socketRef.current.emit('offer', payload);
      })
      .catch((e) => console.log(e));
  }

  function handleRecieveCall(incoming: SdpType) {
    console.log('receiving call');
    const userId = incoming.caller;
    peerRefs.current[userId] = createPeer(userId);
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRefs.current[userId]
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track) =>
            senders.current.push(
              peerRefs.current[userId].addTrack(track, userStream.current)
            )
          );
      })
      .then(() => {
        return peerRefs.current[userId].createAnswer();
      })
      .then((answer) => {
        return peerRefs.current[userId].setLocalDescription(answer);
      })
      .then(() => {
        const payload: SdpType = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRefs.current[userId].localDescription,
        };
        socketRef.current.emit('answer', payload);
      });
  }

  function handleAnswer(message: SdpType) {
    const desc = new RTCSessionDescription(message.sdp);
    const userId = message.caller;
    peerRefs.current[userId]
      .setRemoteDescription(desc)
      .catch((e) => console.log(e));
  }

  interface IceCandidateType {
    target: string;
    candidate: RTCIceCandidate;
    caller: string;
  }

  function handleICECandidateEvent(
    e: RTCPeerConnectionIceEvent,
    otherId: string
  ) {
    if (e.candidate) {
      const payload: IceCandidateType = {
        target: otherId,
        candidate: e.candidate,
        caller: socketRef.current.id,
      };
      socketRef.current.emit('ice-candidate', payload);
    }
  }

  function handleNewICECandidateMsg(payload: IceCandidateType) {
    const incoming = payload.candidate;
    const candidate = new RTCIceCandidate(incoming);
    const userId = payload.caller;
    peerRefs.current[userId]
      .addIceCandidate(candidate)
      .catch((e) => console.log(e));
  }

  function handleTrackEvent(e: RTCTrackEvent, userId: string) {
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/track_event
    // by the time onTrack fires, the new track has already been added
    setStreams((streams) =>
      Object.assign({}, streams, { [userId]: e.streams[0] })
    );
  }

  return (
    <>
      <div className={styles.column}>
        {Object.entries(streams).map((entry) => {
          const [userId, stream] = entry;
          return (
            <video
              autoPlay
              key={uuid()}
              ref={(e) => {
                if (e === null) return e;
                e.srcObject = stream as MediaProvider; // TODO: clumsy
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default Zoom;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  View
} from "react-native";
import {
  mediaDevices, MediaStream, RTCPeerConnection, RTCSessionDescription, RTCView
} from "react-native-webrtc";

// See https://ossrs.io/lts/en-us/docs/v5/doc/webrtc#http-api
const WHIPUrl = 'http://192.168.1.100:1985/rtc/v1/whip/?app=live&stream=livestream';

function App(): React.JSX.Element {
  const [pc, setPC] = React.useState<RTCPeerConnection>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  const startPublishing = React.useCallback(async () => {
    const peerConnection = new RTCPeerConnection(null);
    console.log('peerConnection', peerConnection);
    setPC(peerConnection);

    // See https://github.com/react-native-webrtc/react-native-webrtc/blob/master/Documentation/BasicUsage.md#creating-a-peer-connection
    peerConnection.addEventListener('iceconnectionstatechange', event => {
      console.log(`event iceconnectionstatechange: ${JSON.stringify(event)}`);
    });

    peerConnection.addTransceiver('audio', { direction: 'sendonly' });
    peerConnection.addTransceiver('video', { direction: 'sendonly' });

    const mediaStream = await mediaDevices.getUserMedia({ video: true, audio: true });
    console.log(`localStream ${mediaStream.id} created, url: ${mediaStream.toURL()}`);
    setStream(mediaStream);

    mediaStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track);
      console.log(`track ${track.id} ${track.kind} added to pc ${peerConnection._pcId}`);
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log(`offer ${offer.type} created, sdp: ${offer.sdp}`);

    const response = await fetch(
      WHIPUrl, {
        method: 'POST', headers: {'Content-Type': 'application/sdp'},
        body: offer.sdp,
      },
    );
    if (!response.ok) {
      console.error(`failed to publish: ${response.status} ${response.statusText}`);
      return;
    }

    const answerSDP = await response.text();
    console.log(`answer sdp: ${answerSDP}`);

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription({type: 'answer', sdp: answerSDP})
    );
    console.log(`set answer sdp ok`);
  }, [setStream, setPC]);

  const stopPublishing = React.useCallback(async () => {
    if (pc) {
      pc.close();
      console.log(`pc ${pc._pcId} closed`);
    }

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log(`track ${track.id} ${track.kind} stopped`);
      });
      console.log(`stream ${stream.id} closed`);
    }

    setStream(null);
    setPC(null);
  }, [stream, setStream, pc, setPC]);

  return (
    <SafeAreaView>
        <View>
          {!stream && <Button title='Start' onPress={startPublishing}></Button>}
          {stream && <Button title='Stop' onPress={stopPublishing}></Button>}
          {stream && <View style={{width: 300, height: 400, borderWidth: 1}}>
            <RTCView
              streamURL={stream.toURL()}
              objectFit="cover"
              style={{width: '100%', height: '100%'}}
            />
          </View>}
        </View>
    </SafeAreaView>
  );
}

export default App;

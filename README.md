# srs-rn

Example for https://github.com/react-native-webrtc/react-native-webrtc

## Prerequisites

You must have a WHIP service, you can build one by following tutorial 
[Effortlessly Create a Public Internet WHIP Service for OBS: A Comprehensive Guide to Sub-Second Streaming](https://blog.ossrs.io/effortlessly-create-a-public-internet-whip-service-for-obs-a-guide-for-sub-second-streaming-bb19c2a3bb7a)

For more information about WebRTC streaming, WHIP, and WHEP, please read
[WebRTC Streaming](https://ossrs.io/lts/en-us/docs/v5/doc/webrtc#http-api)

## Usage: WHIPPublisher for iOS

Make sure you have completed the [React Native - Setting up the development environment](https://reactnative.dev/docs/environment-setup?guide=native) 
instructions till `Creating a new application` step, before proceeding.

Clone code and change to directory:

```bash
git clone https://github.com/ossrs/srs-rn.git
cd srs-rn/WHIPPublisher
```

Install dependencies:

```bash
npm install
```

Install pods for iOS:

```bash
pod install --project-directory=ios
```

Open the `ios/WHIPPublisher.xcworkspace` and setup the development team by `Signing & Capabilities > Team`:

```bash
open ios/WHIPPublisher.xcworkspace
```

Start application:

```bash
npm start ios
```

Press `i` to run on iOS. Click the `Start` button, which publish stream via [WHIP](https://ossrs.io/lts/en-us/docs/v5/doc/webrtc#http-api)
and view stream by browser via WHEP:

* WHIP: `http://192.168.1.100:1985/rtc/v1/whip/?app=live&stream=livestream`
* WHEP: [http://192.168.1.100:1985/rtc/v1/whep/?app=live&stream=livestream](http://192.168.1.100:8080/players/whep.html)

> Note: Please change the IP address `192.168.1.100` to your own WebRTC service IP address.

You can also use other WHEP player to view the steam.

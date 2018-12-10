
// 外部のSTUNサーバを利用
const rtcConf = {
    iceServers: [
        {urls: ["stun:stun.l.google.com:19302"]}
    ]
}

// RTCPeerConnection から、DataChannel と自前の Offer を作成する
let pc = new RTCPeerConnection(rtcConf);
let dataChannel = pc.createDataChannel("test");

pc.onicecandidate = (event) => {
    if (event.candidate) {
        console.log("onicecandidate fired");
        console.log(event);
    } else {
        console.log("All ICE candidates are available");
        console.log(pc.localDescription);
    }
};

// Offer SDP を作成し、LocalDescription に設定する
// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
pc.createOffer()
    .then((sdp) => {
        console.log("Offer created");
        return pc.setLocalDescription(sdp);
    })
    .then(() => {
        console.log("LocalDescription set");
    })
    .catch((error) => {
        console.log("Error occured: " + error);
    });



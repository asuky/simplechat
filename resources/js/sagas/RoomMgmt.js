import axios from 'axios';
import { put, call, select } from 'redux-saga/effects';
import { waitingAnswer, openChatForm } from '../actions/actions';

import { pinging } from '../actions/actions';

const rtcConf = {
    iceServers: [
        {urls: ["stun:stun.l.google.com:19302"]}
    ]
}

export function* initConnection(callbackChannel, action) {
    console.log("initConnection runs");
    console.log(callbackChannel);

    // RTCPeerConnection を作成、
    // Channel 名は roomid とする
    let peerConnection = new RTCPeerConnection(rtcConf);
    let dataChannel;
    peerConnection.payload = action.payload;
    
    //console.log(roomStatus);
    const response = yield call(getRoomState,
                            action.payload.roomid,
                            action.payload.nickname,
                            action.payload.csrf);
    
    // status が 0 のとき
    // offer 側となるので、datachannel を作り Offer を揃えてPOST
    // status が 4 になるまで待機
    if (response.data.status === 0) {
        dataChannel = peerConnection.createDataChannel(action.payload.roomid);
        console.log("DataChannel created");
        console.log(dataChannel);
        // 諸々テスト用
        dataChannel.onerror = function (error) {
            console.log("Data Channel Error:", error);
        };
        
        dataChannel.onmessage = function (event) {
            console.log("Got Data Channel Message:", event.data);
        };
        
        dataChannel.onopen = (event) => {
            console.log("Channel opened!");
            console.log(callbackChannel);
            callbackChannel.put(openChatForm(event.srcElement));
        }
        
        dataChannel.onclose = function () {
            console.log("The Data Channel is Closed");
        };
        
        yield call(createRoom, action.payload);
        yield call(prepareOffer, peerConnection);

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("New ICE candidate arrived");
                console.log(event.candidate);
            } else {
                console.log("All ICE candidates are obtained");
                updateRoomState(peerConnection.payload, peerConnection);
            }
        }
        // Answer SDP が到着するのを待つ
        yield put(waitingAnswer(peerConnection, dataChannel));
    // status が 2 のとき
    // Answer 側となるので、Offer を remoteDescription に設定し、
    // answer SDP を作って PUT しつつ datachannel を作る
    } else if (response.data.status === 2) {
        
        yield call(updateRoom, action.payload);
        yield call(prepareAnswer, peerConnection, response.data.sdp);

        // Answer 側は Offer 側から DataChannel が到着するので
        // 到着時の対応を記載する
        peerConnection.ondatachannel = (event) => {
            console.log("DataChannel arrived");
            console.log(event);
            dataChannel = event.channel;
            
            dataChannel.onerror = function (error) {
                console.log("Data Channel Error:", error);
            };
            
            dataChannel.onmessage = function (event) {
                console.log("Got Data Channel Message:", event.data);
            };
            
            dataChannel.onopen = function (event) {
                console.log("Channel opened!");
                callbackChannel.put(openChatForm(event.srcElement));
            };
            
            dataChannel.onclose = function () {
                console.log("The Data Channel is Closed");
            };

            
        }

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("New ICE candidate arrived");
                console.log(event.candidate);
            } else {
                console.log("All ICE candidates are obtained");
                updateRoomState(peerConnection.payload, peerConnection);
            }
        }

    }

}

export function* checkAnswer(action) {
    console.log("checkAnswer called");
    // 3秒待つ
    yield call(wait, 3);
    const state = yield select();
    const response = yield call(getRoomState,
        state.ChatUI.roomid,
        state.ChatUI.nickname,
        state.ChatUI.csrf);

    console.log("DataChannel State");
    console.log(state.App.dc.readyState);
    // Answer 側が出揃うまで待機
    if (response.data.status !== 4) {
        console.log("Answer SDP is preparing: " + response.data.status);
        yield put(waitingAnswer(state.App.pc, state.App.dc));
    } else {
        console.log("Answer SDP is available");
        yield call(receiveAnswer, state.App.pc, state.App.dc, response.data.sdp);
        
    }
}

// sec 秒待つ非同期処理
// 後でsetTimeoutなりsetIntervalなりで書き直すこと
async function wait(sec) {
    
    return new Promise((resolve, reject)=>{
        let startTime = new Date().getTime();
        while(true) {
            let curTime = new Date().getTime();
            if (curTime - startTime > (sec*1000)) {
                break;
            }
        }
        resolve();
    });
}

async function getRoomState(roomid, nickname, csrf) {
    console.log("getRoomState called: " + roomid + " / " + nickname);
    return axios({
        method: "GET",
        url: "/room/" + roomid + "?nick=" + nickname,
        headers: {'X-CSRF-TOKEN': csrf }
    })
    .then((response) => { return response; })
    .catch((error) => { console.log(error); });
}

async function createRoom(payload) {
    console.log("createRoom called: " + payload.roomid + " / " + payload.nickname);
    return axios({
        method: "POST",
        url: "/room/" + payload.roomid,
        data: {
            nickname: payload.nickname
        }
    });
}

async function updateRoom(payload) {
    console.log("updateRoom called: " + payload.roomid + " / " + payload.nickname);
    return axios({
        method: "PUT",
        url: "/room/" + payload.roomid,
        data: {
            nickname: payload.nickname
        }
    });
}

async function updateRoomState(payload, peerConnection) {
    console.log("updateRoomState called: " + payload.roomid + " / " + payload.nickname);
    console.log(peerConnection);
    return axios({
        method: "PUT",
        url: "/room/" + payload.roomid,
        data: {
            sdp: peerConnection.localDescription.sdp
        }
    });
}

async function prepareOffer(peerConnection) {
    console.log("prepareOffer called");
    return peerConnection.createOffer()
    .then((sdp) => {
        console.log("Offer created");
        console.log(sdp);
        return peerConnection.setLocalDescription(sdp)
    })
}

async function prepareAnswer(peerConnection, sdp) {
    console.log("prepareAnswer called");
    console.log(sdp);
    // どうもSDP文字列の末尾の改行コードが外れてると
    // parse error で setRemoteDescription が失敗する様子
    // 改行コードを付与し正しい RTCSessionDescription を作る
    peerConnection.setRemoteDescription(
        new RTCSessionDescription({
            type: "offer",
            sdp: sdp + "\r\n"
        })
    ).then(()=>{
        console.log("RemoteDescription set");
    });

    return peerConnection.createAnswer()
    .then((sdp) => {
        console.log("Answer created");
        console.log(sdp);
        return peerConnection.setLocalDescription(sdp)
    })
}

async function receiveAnswer(peerConnection, dataChannel, sdp) {
    console.log("receiveAnswer called");
    console.log(sdp);

    return peerConnection.setRemoteDescription(
        new RTCSessionDescription({
            type: "answer",
            sdp: sdp + "\r\n"
        })
    ).then(()=>{
        console.log("RemoteDescription set");
        console.log(peerConnection);
        console.log(dataChannel);
    });
}

export function* pinger() {
    yield put(pinging());
}
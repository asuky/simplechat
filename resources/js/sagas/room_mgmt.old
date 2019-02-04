import axios from 'axios';
import { put, call, select } from 'redux-saga/effects';

import { waitingAnswer } from '../actions/actions';

const rtcConf = {
    iceServers: [
        {urls: ["stun:stun.l.google.com:19302"]}
    ]
}

let peerConnection, dataChannel;

async function checkRoomState(payload) {
    console.log("checkRoomState called: " + payload.roomid + " / " + payload.nickname);
    return axios({
        method: "GET",
        url: "/room/" + payload.roomid + "?nick=" + payload.nickname,
        headers: {'X-CSRF-TOKEN': payload.csrf }
    });
}

async function postRoomState(payload, peerConnection) {
    console.log("postRoomState called: " + payload.roomid + " / " + payload.nickname);
    return axios({
        method: "POST",
        url: "/room/" + peerConnection.srcElement.roomid,
        data: {
            sdp: peerConnection.srcElement.localDescription.sdp
        }
    });
}

async function prepareOffer(peerConnection) {
    console.log("prepareOffer called");
    return peerConnection.createOffer()
    .then((sdp) => {
        return peerConnection.setLocalDescription(sdp)
    })
}

export function* getRoomState(action) {
    console.log("getRoomState called");
    console.log(action);
    // Offer か Answer かは未定として、
    // まず RTCPeerConnection だけは作っておく
    peerConnection = new RTCPeerConnection(rtcConf);
    dataChannel = peerConnection.createDataChannel(action.payload.roomid);
    peerConnection.roomid = action.payload.roomid;
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {

        } else {
            console.log("All ICE candidates obtained");
            console.log(event);
            axios({
                method: "POST",
                url: "/room/" + event.srcElement.roomid,
                data: {
                    sdp: event.srcElement.localDescription.sdp
                }
            }).then((response) => {
                console.log(response);
            });
            
        }
    }

    // 指定された Room ID の部屋の状態を確認
    try {
        const roomState = yield call(checkRoomState, action.payload);
        console.log("Status: " + roomState.data.status);
        // 指定された room id が存在しない場合 (status:0) のときは、SDP を POST する
        switch (roomState.data.status) {
            case 0:
                console.log("Status case: 0");
                const postData = yield call(prepareOffer, peerConnection);
                // 相手方の Answer を待つ
                yield put(waitingAnswer(peerConnection));
                break;
                
        // 1: A側の Offer SDP のみあり のとき
        // SDPを受け取り、Answer を作成して POST する
            case 1:
                console.log("Status case: 1");
                // yield call(answer作成してpostするfunction);
                //
                break;

        // 2: B側の Answer SDP があるときとき
        // Answer SDP を取得するループを止める
            case 2:
                console.log("Status case: 2");
                break;
                
            default:
                console.log("Status case: default");
                break;
        }



        // 上記に引っかからない場合はエラーとして -1 を返す




    } catch (error) {

    }

}

export function* routineCheck(action) {
    console.log("routineCheck called");
    const pc = yield select();
    // 3秒待つ
    yield call(async function(){
        console.log("waiting 3sec");
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve();
            }, 3000);
        });
    });

    const retCode = yield call(checkRoomState, {
        roomid: pc.ChatUI.roomid,
        nickname: pc.ChatUI.nickname,
        csrf: ApplicationCache.csrf
    });

}
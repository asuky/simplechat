export const UPDATE_FIELD='UPDATE_FIELD';
export const INIT_ROOM_STATE='INIT_ROOM_STATE';
export const PINGING='PINGING';

export const SEND_RESPONSE='SEND_RESPONSE';
export const WAITING_ANSWER='WAITING_ANSWER';
export const OPEN_CHATFORM='OPEN_CHATFORM';

export function pinging() {
    return {
        type: PINGING
    }
}

export function updateField(property, value) {
    return {
        type: UPDATE_FIELD,
        payload: {
            [property]: value
        }
    }
}

export function initRoomState(roomid, nickname, csrf) {
    return {
        type: INIT_ROOM_STATE,
        payload: {
            "csrf": csrf,
            "roomid": roomid,
            "nickname": nickname
        }
    }
}

export function sendResponse() {
    return {
        type: SEND_RESPONSE
    }
}

export function waitingAnswer(peerConnection, dataChannel) {
    return {
        type: WAITING_ANSWER,
        payload: {
            "pc": peerConnection,
            "dc": dataChannel
        }
    }
}

export function openChatForm(dc) {
    console.log("openChatForm called");
    console.log(dc);
    return {
        type: OPEN_CHATFORM,
        payload: {
            "dc": dc
        }
    }
}
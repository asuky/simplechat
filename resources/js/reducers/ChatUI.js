import { UPDATE_FIELD, INIT_ROOM_STATE } from '../actions/actions';

const initialState = {
    roomid: "",
    nickname: "",
    button_label: "Join Room"
};

export function ChatUI (state = initialState, action) {
    
    switch (action.type) {
        
        case UPDATE_FIELD:
            return Object.assign({}, state, action.payload);
        case INIT_ROOM_STATE:
            return Object.assign({}, state, {
                button_label: "Connecting"
            });
        default:
            return state;
    }
}
import { combineReducers } from 'redux';

import { App } from './App';
import { ChatUI } from './ChatUI';

export const rootReducer = combineReducers({
    App,
    ChatUI
});

export default rootReducer;
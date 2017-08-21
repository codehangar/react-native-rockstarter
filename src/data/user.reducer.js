import * as types from './action-types';

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.SET_USER:
            return action.user;
        default:
            return state;
    }
}

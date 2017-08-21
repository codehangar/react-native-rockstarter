import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './root';
import thunk from 'redux-thunk';

let enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunk)
);

const initialState = {};
export default createStore(
    rootReducer,
    initialState,
    enhancer
);


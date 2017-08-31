import { API_PROTOCOL, API_HOST, API_VERSION } from '../utils/config';
import { getItem, storageKeys } from './async-storage';

function checkStatus(response) {
    if (response.ok && response.status >= 200 && response.status < 400) {
        return response;
    }
    console.log('response.status ', response.status); // eslint-disable-line no-console
    return new Promise((resolve, reject) => {
        const catchUnknown = (err) => {
            const error = new Error(err);
            error.status = response.status;
            error.message = 'An unknown error occurred';
            error.errors = { unknown: 'An unknown error occurred' };
            error.body = err;
            error.response = response;
            reject(error);
        };
        const contentType = response.headers.get('content-type');
        console.log('contentType', contentType); // eslint-disable-line no-console
        if (contentType && contentType.includes('application/json')) {
            response.json()
                .then((data) => {
                    console.log('data', data); // eslint-disable-line no-console
                    const error = new Error(data.message);
                    error.status = data.status;
                    error.message = data.message;
                    error.errors = data.errors;
                    error.body = data.data;
                    error.response = response;
                    reject(error);
                }).catch(catchUnknown);
        } else {
            response.text().then((data) => {
                const error = new Error(data);
                error.status = response.status;
                error.body = data;
                error.response = response;
                switch (error.status) {
                    case 401:
                        error.message = 'You are not authorized for this operation';
                        error.errors = { authentication: 'You are not authorized for this operation' };
                        break;
                    case 403:
                        error.message = 'You do not have permission for this operation';
                        error.errors = { forbidden: 'You do not have permission for this operation' };
                        break;
                    case 404:
                        error.message = 'The requested resource was not found';
                        error.errors = { notFound: 'The requested resource was not found' };
                        break;
                    default:
                        error.errors = { unknown: 'An unknown error occurred' };
                }
                reject(error);
            }).catch(catchUnknown);
        }
    });
}

function parseJSON(response) {
    return response.json();
}

export default function (path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = `${API_PROTOCOL}${API_HOST}${API_VERSION}${path}`;
        console.log((options.method || 'GET'), url); // eslint-disable-line no-console

        getItem(storageKeys.AUTH_TOKEN).then((token) => {
            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                    'x-auth-token': token
                }
                // mode: 'cors',
                // mode: 'no-cors',
                // credentials: 'same-origin'
                // credentials: 'include'
            };

            // Stringify the body
            options.body = options.body ? JSON.stringify(options.body) : void 0;

            // Combine and overriding defaults
            const opts = { ...defaultOptions, ...options };
            console.log('opts', opts); // eslint-disable-line no-console
            fetch(url, opts)
                .then(checkStatus)
                .then(parseJSON)
                .then(resolve)
                .catch(reject);
        });
    });
}

import { __awaiter } from "tslib";
import axios from 'axios';
import { setTranslations } from './translate';
export const redirectLogin = () => {
    if (window.location.href.includes('popout')) {
        window.location.assign(window.location.origin + '/login#error=popout+must+be+logged');
    }
    else {
        window.location.assign(window.location.origin + '/login');
    }
};
const authorizedSocket = new Map();
const unauthorizedSocket = new Map();
export function getSocket(namespace, continueOnUnauthorized = false) {
    if (authorizedSocket.has(namespace)) {
        return authorizedSocket.get(namespace);
    }
    if (unauthorizedSocket.has(namespace) && continueOnUnauthorized) {
        return unauthorizedSocket.get(namespace);
    }
    const socket = window.io(namespace, {
        transports: ['websocket'],
        auth: (cb) => {
            cb({ token: localStorage.getItem('accessToken') });
        },
    });
    if (!continueOnUnauthorized) {
        authorizedSocket.set(namespace, socket);
    }
    else {
        unauthorizedSocket.set(namespace, socket);
    }
    socket.on('connect_error', (error) => {
        if (error.message.includes('websocket error')) {
            return;
        }
        if (error.message.includes('jwt expired') || error.message.includes('JsonWebTokenError')) {
            console.debug('Using refresh token to obtain new access token');
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken === '' || refreshToken === null) {
                localStorage.setItem('userType', 'unauthorized');
                if (!continueOnUnauthorized) {
                    console.debug(window.location.href);
                    redirectLogin();
                }
            }
            else {
                axios.get(`${window.location.origin}/socket/refresh`, { headers: { 'x-twitch-token': refreshToken } }).then(validation => {
                    localStorage.setItem('accessToken', validation.data.accessToken);
                    localStorage.setItem('refreshToken', validation.data.refreshToken);
                    localStorage.setItem('userType', validation.data.userType);
                    socket.disconnect();
                    console.debug('Reconnecting with new token');
                    socket.connect();
                }).catch(() => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('code');
                    localStorage.removeItem('clientId');
                    localStorage.setItem('userType', 'unauthorized');
                    if (continueOnUnauthorized) {
                        location.reload();
                    }
                    else {
                        redirectLogin();
                    }
                });
            }
        }
        else {
            if (error.message.includes('Invalid namespace')) {
                throw new Error(error.message + ' ' + namespace);
            }
            if (!continueOnUnauthorized) {
                redirectLogin();
            }
            else {
                localStorage.setItem('userType', 'unauthorized');
            }
        }
    });
    socket.on('forceDisconnect', () => {
        if (localStorage.getItem('userType') === 'viewer' || localStorage.getItem('userType') === 'admin') {
            console.debug('Forced disconnection from bot socket.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('code');
            localStorage.removeItem('clientId');
            localStorage.setItem('userType', 'unauthorized');
            if (continueOnUnauthorized) {
                location.reload();
            }
            else {
                redirectLogin();
            }
        }
    });
    return socket;
}
export const getTranslations = () => __awaiter(void 0, void 0, void 0, function* () {
    getSocket('/', true).emit('translations', (translations) => {
        if (process.env.IS_DEV) {
            console.groupCollapsed('GET=>Translations');
            console.debug({ translations });
            console.groupEnd();
        }
        setTranslations(translations);
    });
});
export const getConfiguration = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        getSocket('/core/ui', true).emit('configuration', (err, configuration) => {
            if (err) {
                return console.error(err);
            }
            if (process.env.IS_DEV) {
                console.groupCollapsed('GET=>Configuration');
                console.debug({ configuration });
                console.groupEnd();
            }
            resolve(configuration);
        });
    });
});
//# sourceMappingURL=socket.js.map
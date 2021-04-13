import type { Socket } from 'socket.io-client';
export declare const redirectLogin: () => void;
export declare function getSocket(namespace: string, continueOnUnauthorized?: boolean): Socket;
export declare const getTranslations: () => Promise<void>;
declare type Configuration = {
    [x: string]: Configuration | string;
};
export declare const getConfiguration: () => Promise<Configuration>;
export {};

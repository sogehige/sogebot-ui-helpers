import type { Socket } from 'socket.io-client';
import type { Fn, ClientToServerEventsWithNamespace } from '../backend/d.ts/src/helpers/socket';
export declare const redirectLogin: () => void;
export declare function getSocket<K0 extends keyof O, O extends Record<PropertyKey, Record<PropertyKey, Fn>> = ClientToServerEventsWithNamespace>(namespace: K0, continueOnUnauthorized?: boolean): Socket<O[K0]>;
export declare const getTranslations: () => Promise<void>;
declare type Configuration = {
    [x: string]: Configuration | string;
};
export declare const getConfiguration: () => Promise<Configuration>;
export {};

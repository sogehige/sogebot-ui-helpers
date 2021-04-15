export interface getListOfReturn {
    systems: {
        name: string;
        enabled: boolean;
        areDependenciesEnabled: boolean;
        isDisabledByEnv: boolean;
    }[];
    core: {
        name: string;
    }[];
    integrations: {
        name: string;
        enabled: boolean;
        areDependenciesEnabled: boolean;
        isDisabledByEnv: boolean;
    }[];
    overlays: {
        name: string;
        enabled: boolean;
        areDependenciesEnabled: boolean;
        isDisabledByEnv: boolean;
    }[];
    games: {
        name: string;
        enabled: boolean;
        areDependenciesEnabled: boolean;
        isDisabledByEnv: boolean;
    }[];
}
declare type possibleLists = 'systems' | 'core' | 'integrations' | 'overlays' | 'games';
export declare const populateListOf: <P extends possibleLists>(type: P) => Promise<void>;
export declare const getListOf: <P extends possibleLists>(type: P) => getListOfReturn[P];
export {};

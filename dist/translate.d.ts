export declare let translations: {};
export default function (key: string, asObject?: false): string;
export default function (key: string, asObject: true): {
    [x: string]: any;
};
export declare const setTranslations: (_translations: any) => void;

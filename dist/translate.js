import { at, isNil } from 'lodash-es';
export let translations = {};
function castObject(key, value) {
    if (typeof value === 'string') {
        return { [key]: value };
    }
    else {
        return value;
    }
}
export default function (key, asObject = false) {
    return isNil(at(translations, key)[0])
        ? `{${key}}`
        : asObject
            ? castObject(key, at(translations, key)[0])
            : at(translations, key)[0];
}
export const setTranslations = (_translations) => {
    translations = _translations;
};
//# sourceMappingURL=translate.js.map
import { defaultTokenReferences as references } from './token-references.generated';

export const token = {
  var(path: keyof typeof references): string {
    const value = references[path];
    if (!value) throw new Error(`Unknown token: ${path}`);
    return value;
  },
};


import {classes as divisionsClasses, meta as divisions, exclude as divisionsExclude} from './divisions/meta';
import {classes as nomKindsClasses, meta as nomKinds, exclude as nomKindsExclude} from './nomKinds/meta';

export const meta = {
  divisions,
  nomKinds,
};

export const exclude = [...divisionsExclude, nomKindsExclude];

export const classes = [
  divisionsClasses,
  nomKindsClasses,
];

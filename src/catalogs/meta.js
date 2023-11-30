
import {classes as divisionsClasses, meta as divisions, exclude as divisionsExclude} from './divisions/meta';
import {classes as nomKindsClasses, meta as nomKinds, exclude as nomKindsExclude} from './nomKinds/meta';
import {classes as insertsClasses, meta as inserts, exclude as insertsExclude} from './inserts';

export const meta = {
  divisions,
  nomKinds,
  inserts,
};

export const exclude = [...divisionsExclude, ...nomKindsExclude, ...insertsExclude];

export const classes = [
  divisionsClasses,
  nomKindsClasses,
  insertsClasses,
];

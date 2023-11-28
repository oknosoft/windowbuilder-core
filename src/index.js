import paper from 'paper/dist/paper-core';
import {EditorInvisible} from './geometry/paper/EditorInvisible';

import {classes as catClasses, meta as cat, exclude as catExclude} from './catalogs/meta';
import {meta as enm} from './enums/meta';

export const meta = Object.assign({cat}, enm);

export const exclude = [...catExclude];

export const classes = [...catClasses];

export {paper, EditorInvisible};

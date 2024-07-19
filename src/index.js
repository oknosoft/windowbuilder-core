import paper from 'paper/dist/paper-core';
import {EditorInvisible} from './geometry/paper/EditorInvisible';

import {classes as enmClasses, meta as enm, exclude as enmExclude} from './enums/meta';
import {classes as catClasses, meta as cat, exclude as catExclude} from './catalogs/meta';
import {meta as dp} from './dataprocessors/meta';

export const meta = Object.assign({cat}, {enm}, {dp});

export const exclude = [...enmExclude, ...catExclude];

export const classes = [enmClasses, ...catClasses];

export {paper, EditorInvisible};

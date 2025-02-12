import paper from 'paper/dist/paper-core';
import {EditorInvisible} from './geometry/paper/EditorInvisible';

import {classes as enmClasses, meta as enm, exclude as enmExclude} from './enums/meta';
import {classes as catClasses, meta as cat, exclude as catExclude} from './catalogs';
import {classes as cchClasses, meta as cch} from './chartscharacteristics';
import {classes as docClasses, meta as doc, exclude as docExclude} from './documents';
import {meta as dp} from './dataprocessors/meta';

export const meta = Object.assign({cat}, {cch}, {enm}, {doc}, {dp});

export const exclude = [...enmExclude, ...catExclude, ...docExclude];

export const classes = [enmClasses, ...catClasses, ...cchClasses, ...docClasses];

export {paper, EditorInvisible};

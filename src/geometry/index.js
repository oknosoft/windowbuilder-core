
import paper from 'paper/dist/paper-core';

import './paper';
import {Scheme} from './Scheme';
import {EditorInvisible} from './editor/EditorInvisible';
import {BuilderElement} from './BuilderElement';
import {Contour} from './Contour';

const geometry = {
  Scheme,
  EditorInvisible,
  BuilderElement,
  Contour,
};
Object.assign(paper.constructor.prototype, geometry);
export default geometry;

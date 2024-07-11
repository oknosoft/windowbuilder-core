
import paper from 'paper/dist/paper-core';

import './paper';
import {Scheme} from './Scheme';
import {EditorInvisible} from './paper/EditorInvisible';
import {BuilderElement} from './BuilderElement';
import {Contour} from './Contour';
import {DimensionLine} from './DimensionLine';
import {DimensionLineCustom} from './DimensionLineCustom';
import {Filling} from './Filling';
import {GeneratrixElement} from './GeneratrixElement';

const geometry = {
  Scheme,
  EditorInvisible,
  BuilderElement,
  GeneratrixElement,
  Contour,
  DimensionLine,
  DimensionLineCustom,
  Filling,
};
Object.assign(paper.constructor.prototype, geometry);
export default geometry;

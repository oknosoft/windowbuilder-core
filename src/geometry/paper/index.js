

import paper from 'paper/dist/paper-core';

import point from './Point';
import path from './Path';
import view from './View';
import rectangle from './Rectangle';
import unselectable from './Unselectable';

point(paper.Point.prototype);
path(paper);
rectangle(paper);
view(paper.View.prototype);
unselectable(paper);

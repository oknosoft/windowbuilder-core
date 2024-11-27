import paper from 'paper/dist/paper-core';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
export const loader = new SVGLoader();

export const svgStubs = [
  `<svg xmlns="http://www.w3.org/2000/svg"><path d="%" stroke="#000000"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg">%</svg>`,
];
const svgStub = svgStubs[0];

const fakePath = new paper.Path({
  insert: false,
  project: {
    _insertItem(){},
    _changed(){},
  }});
let pathData = `M 20.6,-20.5
H 2.5
v 13.2
h 18.1
v -5.4
l 1.1,-0.4
c 1.6,-0.6 1.6,-1.4 0,-2
l -1.1,-0.4
z

m 39.4,0
H 46.6
v 5.5
c 0,0 -0.8,0.3 -1.1,0.6 -0.5,0.5 -0.5,0.6 0,1.1 0.2,0.3 1.1,0.6 1.1,0.6
v 5.4
H 60
Z

m -18.1,1.6 -1.6,-1.6
H 29.7
l -1.6,1.6
v 1.7
H 27
v 6.2
h 1.1
v 2.1
l 1.6,1.6
h 10.6
l 1.6,-1.6
V -11
H 43
v -6.2
H 41.9
Z

M 2.2,-5.1
v 3
h 2
v 0.6
l -0.8,1.4
h -3
L 0.1,-0.4
v -26.5
l 0.3,-0.3
h 3
l 0.8,1.4
v 0.6
h -2
v 3
H 10
l 0.2,0.2 0.2,-0.2
h 9.2
v -3
h -2
v -0.6
l 0.8,-1.4
h 4.1
l 0.6,1
v 0.6
h -1.8
v 3.4
h 2.5
l 0.3,0.3 3.3,0.2 0.2,-0.2
h 1.8
l 0.3,-0.3
v -4.6
h 2
l 0.6,0.6
v 0.5
h -1.1
v 3.1
l 0.3,0.3
h 7
l 0.3,-0.3
v -3.1
h -1.1
v -0.5
l 0.6,-0.6
h 2
v 4.6
l 0.3,0.3
h 1.8
l 0.2,0.2 3.4,-0.1 0.3,-0.3
H 52
l 0.2,0.2 0.2,-0.2
h 7.5
l 0.3,-0.3
V -26
h -1.6
l -0.3,-0.3
v -0.8
l 0.3,-0.3
h 1.8
v -14.4
h -2
v 1.3
l -0.3,0.3
h -0.6
l -0.3,-0.3
v -2.9
l 0.2,-0.2 0.9,-0.8
h 0.6
v 1.2
h 1.7
v -5
h -1.7
v 1.2
h -0.6
l -0.9,-0.8 -0.2,-0.2
v -1.2
l 0.3,-0.3
h 4.2
l 0.3,0.3
v 48.6
l -0.3,0.3
h -3.2
l -0.6,-1
v -0.6
h 2.4
V -5.3
H 52.4
L 52.2,-5.5 52,-5.3
h -5.7
l -0.2,-0.2 -3.9,0.1 -0.4,0.2
H 29.3
l -0.4,-0.2 -3.8,0.1 -0.2,0.2
h -2.5
v 3.4
h 1.8
v 0.6
l -0.6,1
h -4.1
l -0.8,-1.4
v -0.6
h 2
v -3
h -9.2
l -0.2,-0.2 -0.2,0.2
z`;
let svg = loader.parse(svgStub.replace('%', pathData));
export const rama = svg.paths[0].toShapes(true)[0];
fakePath.pathData = pathData;
rama.bounds = fakePath.bounds;

pathData = `m 70.348683,-40.981074
h -4.6
v 1.7
h 2.9
v 4.5
h -2.9
l 3.17e-4,1.7
h 2.9
l -3.17e-4,14.100001
h -1.2
l 3.17e-4,1.2
h 1.199683
v 3.8
h -50
v -4.6
h -1.7
v 4.6
H 2.0486845
v -4.6
H 0.34868451
v 4.6 1.7
H 8.3486845
v 22.6
H 0.34868451
v 6.6
H 2.0486845
v -5
H 17.048683
v 4.6
h 1.7
v -4.7
l 49.9,0.2 3.17e-4,3.829167
h -1.2
v 1.170833
l 1.2,0.0027
v 24.266176
l -2.899998,6.68e-4
v 2.18348
l 4.599679,0.0053
z`;
svg = loader.parse(svgStub.replace('%', pathData));
export const impost = svg.paths[0].toShapes(true)[0];
fakePath.pathData = pathData;
impost.bounds = fakePath.bounds;

pathData = `m 80.7,-74.9
h -4.6
v 1.7
h 2.9
v 4.5
h -2.9
v 1.7
h 2.9
v 10.4
h -1.2
v 1.2
h 1.2
v 3.8
H 18.5
v -4.6
h -1.7
v 4.6
l -11.6,0.1 0.1,4.8 -5,-0
c -0.1,8.7 -0.1,38 -0.1,46.7
H 6.1
l 0,-2 -3.7,-0.1 -0,-4 1.9,-0 0,-1.8 -1.9,0 -0,-17.7
h 54.7
v 4.6
h 1.7
v -4.7
l 20.3,0.2
v 3.3
h -1.7
v 1.7
h 3.4
z`;
svg = loader.parse(svgStub.replace('%', pathData));
export const flap = svg.paths[0].toShapes(true)[0];
fakePath.pathData = pathData;
flap.bounds = fakePath.bounds;

pathData = `M 58.6,-63.9
H 6.6
v 7
h -7
v 52
H 58.6
Z

m 4,-32.1 0.3,0.3
v 95.6
h -95.9
l -0.3,-0.3
v -4.2
l 0.3,-0.3
h 1.2
l 0.2,0.2 0.8,0.9
v 0.6
h -1.2
v 1.7
h 5
v -1.7
h -1.1
v -0.6
l 0.8,-0.9 0.2,-0.2
h 2.8
l 0.3,0.3
V -4
l -0.3,0.3
h -1.3
v 2
h 14.4
v -1.8
l 0.3,-0.3
h 0.8
l 0.3,0.3
v 1.6
h 3.6
l 0.3,-0.3
v -7.5
l 0.2,-0.2 -0.2,-0.2
v -6
h -0.3
v -0.1
l -0.5,-1.4
v -0.5
h 0.4
l 2.4,0.2 -1.6,-1.4 -0.2,-0.2
v -1.8
l -0.3,-0.3
h -4.6
v -2.3
l 0.6,-0.6
h 0.6
v 1.1
h 3.1
l 0.3,-0.3
v -7.1
l -0.3,-0.3
h -3.1
v 1.1
h -0.6
l -0.6,-0.6
v -2.3
h 4.6
l 0.3,-0.3
V -35
l 0.2,-0.2 1,-0.4 -2.4,0.2
h -0.4
v -0.5
l 0.5,-1.4
v -0.1
h 0.3
v -2.8
h -3
v 1.8
h -0.7
l -1,-0.6
v -4.1
l 1.4,-0.8
h 0.6
v 2
h 3
v -9.2
l 0.2,-0.2 -0.2,-0.2
v -7.8
h -3
v 2
h -0.6
l -1.4,-0.8
v -3
l 0.3,-0.3
H 0.9
v -11.8
l 0.3,-0.3
h 3
l 0.8,1.4
v 0.6
h -2.2
v 3
h 7.8
l 0.2,0.2 0.2,-0.2
h 9.2
v -3
h -0.2 -1.2
v -0.6
l 0.8,-1.4
h 4.1
l 0.6,1
v 0.6
h -1.7
v 3.4
h 2.8
v -0.3
h 0.1
l 1.4,-0.5
h 0.5
v 0.4
l -0.2,2.4 1.4,-1.6 0.2,-0.2
h 1.8
l 0.3,-0.3
v -4.6
h 2
l 0.6,0.6
v 0.6
h -1.1
v 3.1
l 0.3,0.3
h 7.1
l 0.3,-0.3
V -72
h -1.1
v -0.7
l 0.6,-0.6
h 2
v 4.6
l 0.3,0.3
h 1.8
l 0.2,0.2 1.4,1.6 -0.2,-2.4
v -0.4
h 0.5
l 1.4,0.5
h 0.1
v 0.3
h 6
l 0.2,0.2 0.2,-0.2
h 7.5
l 0.3,-0.3
v -3.6
h -1.6
l -0.3,-0.3
v -0.8
l 0.3,-0.3
h 1.8
v -14.4
h -2.2
v 1.3
l -0.3,0.3
h -0.6
l -0.3,-0.3
v -2.9
l 0.2,-0.2 0.9,-0.8
h 0.6
v 1.2
h 1.7
v -5
h -1.7
v 1.2
h -0.6
l -0.9,-0.8 -0.2,-0.2
v -1.2
l 0.3,-0.3
z`;
svg = loader.parse(svgStub.replace('%', pathData));
export const connective = svg.paths[0].toShapes(true)[0];
fakePath.pathData = pathData;
connective.bounds = fakePath.bounds;

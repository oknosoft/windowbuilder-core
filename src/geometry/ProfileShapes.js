
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
export const loader = new SVGLoader();

export const svgStub = '<svg xmlns="http://www.w3.org/2000/svg"><g>\n<path d="%" stroke="#000000"></path>\n</g></svg>';

const ramaSvg = loader.parse(svgStub.replace('%', `m 70.164399,-58.102802
h -4.6
v 1.7
h 2.9
v 4.5
h -2.9
v 1.7
h 2.9
v 14.1
h -1.2
v 1.2
h 1.2
v 3.8
h -50
v -4.6
h -1.7
v 4.6
H 1.8643996
v -4.6
H 0.16439974
v 6.3
H 8.1643996
V -6.8028003
H 0.16439974
v 6.59999942
H 1.8643996
V -5.2028003
H 16.864399
v 4.59999942
h 1.7
V -5.3028003
l 49.9,0.2
v 3.2999995
h -1.7
v 1.69999992
h 3.4
z`));
export const rama = ramaSvg.paths[0].toShapes(true)[0];

const impostSvg = loader.parse(svgStub.replace('%', `m 70.348683,-40.981074
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
z`));
export const impost = impostSvg.paths[0].toShapes(true)[0];

const flapSvg = loader.parse(svgStub.replace('%', `m 80.7,-74.9
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
z`));
export const flap = flapSvg.paths[0].toShapes(true)[0];

const cnnSvg = loader.parse(svgStub.replace('%', `M 69.6,-69.7
H 0.5
v 4.3
H 2.3
v -2.4
l 2.5,0 -0.2,48.1 -4,-0.1
v 1.8
l 4,-0 0,13.1 13.3,0 -0.1,4.8
h 2.2
V -4.8
l 47.8,0.2
v 2.8
h -1.7
v 1.7
h 3.4
z`));
export const connective = cnnSvg.paths[0].toShapes(true)[0];

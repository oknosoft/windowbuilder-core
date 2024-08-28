
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

const flapSvg = loader.parse(svgStub.replace('%', `m 80.747732,-74.936133
h -4.6
v 1.7
h 2.9
v 4.5
h -2.9
v 1.699999
h 2.9
v 10.395831
h -1.2
v 1.2
h 1.2
v 3.799999
H 18.464398
v -4.599999
h -1.7
v 4.599999
l -11.6146327,0.12636 0.12636,4.750659 -4.985366,-0.01801
c -0.06555,8.680327 -0.12636,37.997952 -0.12636,46.6784947
H 6.097733
l 0.01186,-1.9865017 -3.65285,-0.05937 -0.015795,-4.0458227 1.8620931,-0.025755 0.00149,-1.8294573 -1.8755566,0.019981 -0.035409,-17.7105698
h 54.687502
v 4.599999
h 1.7
v -4.699999
l 20.266667,0.2
v 3.299999
h -1.7
v 1.7
h 3.4
z`));

export const flap = flapSvg.paths[0].toShapes(true)[0];


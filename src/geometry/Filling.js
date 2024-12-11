import paper from 'paper/dist/paper-core';
import {ContainerBlank} from './ContainerBlank';

export class Filling extends ContainerBlank {
    
  get path() {
    return this.children.path;
  }
  set path(outer) {
    const {path, project: {root}} = this;
    const ribs = outer.map((src, index) => {
      const {edge} = src;
      const curr = src.clone();
      const next = (index === outer.length - 1 ? outer[0] : outer[index + 1]).clone();
      const cnns = root.cat.cnns.iiCnns(this, edge.profile).filter(v => v.art1glass);
      const size = cnns.length ? cnns[0].size(this, edge.profile) : 0;
      const rib = new paper.Path({insert: false, segments: [curr, next]})
        .equidistant(size, (size + 20) * 2);
      return rib;
    });
    
    path.removeSegments();
    path.addSegments(ribs.map((curr, index) => {
      const prev = (index === 0 ? ribs[outer.length - 1] : ribs[index - 1]).clone();
      const pt = curr.intersectPoint(prev);
      return pt;
    }));
    path.closePath();
    const {bounds} = path;
    path.fillColor = new paper.Color({
      stops: ['#def', '#d0ddff', '#eff'],
      origin: bounds.bottomLeft,
      destination: bounds.topRight,
    });
  }
  
  redraw() {
    super.redraw();
    const {children: {text}, project: {props}} = this;
    this.path.opacity = props.carcass === 'normal' ? 0.9: 0.4;
    text.content = 'Заполнение';
  }
}

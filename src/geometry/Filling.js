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

  get defaultClrStr() {
    return '#def,#d0ddff,#eff';
  }
  
  redraw() {
    super.redraw();
    const {children: {text}, project: {props}} = this;
    this.path.opacity = props.carcass === 'normal' ? 0.9: 0.4;
    text.content = 'Заполнение';
  }

  /**
   * @summary Дополняет спецификацию информацией об ошибках
   * @desc Проверяет допустимую длину, изогнутость, применимость концевых соединений
   */
  checkErr() {
    const {container, inset, thickness, specification} = this;
    let error = false;
    return {container, inset, thickness, specification, error};
  }

  /**
   * @summary Вклад заполнения в спецификацию слоя
   */
  calculateSpec() {
    const {clr, layer, project} = this;
    if(clr.is('ignored')) {
      return;
    }
    const {container, inset, thickness, specification, error} = this.checkErr();
    const {perimeter} = container;
    const other = {elm: this, layer, specification};
    for (let i = 0; i < perimeter.length; i++) {
      const curr = perimeter[i];
      if(curr.profile.clr.is('ignored')) {
        return;
      }
      const prev = (i == 0 ? perimeter[perimeter.length - 1] : perimeter[i - 1]);
      const next = (i == perimeter.length - 1 ? perimeter[0] : perimeter[i + 1]);
      const cnns = project.root.cat.cnns.iiCnns(this, curr.profile).filter(v => v.art1glass);
      if(cnns.length) {
        //cnns[0].calculateSpec({...other, elm2: curr.profile});
      }
    }
    
  }
}

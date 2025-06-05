import paper from 'paper/dist/paper-core';
import {ContainerBlank} from './ContainerBlank';
import {FillingRib} from './FillingRib';

export class Filling extends ContainerBlank {
  
  afterCreate() {
    Object.defineProperty(this, 'ribs', {value: []});
  }
    
  get path() {
    return this.children.path;
  }
  set path(outer) {
    const {path, ribs, project: {root}, container, hash, thickness} = this;
    const currentHash = `${thickness}${container.hash}`;
    if(!hash || currentHash !== hash) {
      const paths = outer.map((src, index) => {
        const {edge} = src;
        const rib = ribs[index] || new FillingRib(this, edge);
        rib.edge = edge;
        const curr = src.clone();
        const next = (index === outer.length - 1 ? outer[0] : outer[index + 1]).clone();
        const cnns = root.cat.cnns.iiCnns(this, edge.profile).filter(v => v.art1glass);
        const {size} = rib;
        const ribPath = new paper.Path({insert: false, segments: [curr, next]})
          .equidistant(size, (size + 20) * 2);
        return ribPath;
      });

      path.removeSegments();
      path.addSegments(paths.map((curr, index) => {
        const prev = (index === 0 ? paths[outer.length - 1] : paths[index - 1]).clone();
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
      this.hash = currentHash;
    }
  }

  get hash() {
    return this.raw('hash') || '';
  }
  set hash(v) {
    return this.raw('hash', v);
  }

  get defaultClrStr() {
    return '#def,#d0ddff,#eff';
  }
  
  rib(elm2) {
    for(const rib of this.ribs) {
      if(elm2 === rib.edge.profile) {
        return rib;
      }
    }
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
    const {inset, thickness, specification} = this;
    let error = false;
    return {inset, thickness, specification, error};
  }

  /**
   * @summary Вклад заполнения в спецификацию слоя
   */
  calculateSpec() {
    const {clr, layer, project} = this;
    if(clr.is('ignored')) {
      return;
    }
    const {inset, thickness, specification, error} = this.checkErr();
    const other = {elm2: this, layer, specification};
    for (const rib of this.ribs) {
      rib.cnn?.calculateSpec({...other, elm: rib.edge.profile, rib});
    }

    inset.calculateSpec({elm: this, layer, specification});
    
  }
}

Filling.Rib = FillingRib;

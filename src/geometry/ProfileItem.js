import paper from 'paper/dist/paper-core';
import {GeneratrixElement} from './GeneratrixElement';

export class Profile extends GeneratrixElement {
  
  constructor(attr) {
    super(attr);
    this.raw('inner', new paper.Path({insert: false}));
    this.raw('outer', new paper.Path({insert: false}));
    if(!this.project.props.loading) {
      this.skeleton.addProfile(this);
      this.layer.recalcFillings();
    }
  }

  checkActual() {
    if(!this.isActual) {
      this.raw('inner').removeSegments();
      this.raw('outer').removeSegments();
    }
    return super.checkActual();
  }

  tuneRays() {
    const [inner, outer] = this.raw(['inner', 'outer']);
    if(!inner.segments.length || !outer.segments.length) {
      const {b, e, d1, d2, generatrix} = this;
      const nb = generatrix.getNormalAt(0);
      const ne = generatrix.getNormalAt(generatrix.length);
      outer.add(b.point.add(nb.multiply(d1)));
      inner.add(b.point.add(nb.multiply(d2)));
      outer.add(e.point.add(ne.multiply(d1)));
      inner.add(e.point.add(ne.multiply(d2)));
    }
    return this;
  }

  /**
   * @summary Путь внешнего ребра элемента
   * @type {paper.Path}
   */
  get outer() {
    this.checkActual();
    const outer = this.raw('outer');
    if(!outer.segments.length) {
      this.tuneRays();
    }
    return outer;
  }

  /**
   * @summary Путь внутреннего ребра элемента
   * @type {paper.Path}
   */
  get inner() {
    this.checkActual();
    const inner = this.raw('inner');
    if(!inner.segments.length) {
      this.tuneRays();
    }
    return inner;
  }

  redraw() {
    this.checkActual();
    const {path} = this;
    if(!path.segments.length) {
      const {b, e} = this;
      const points = {b: b.points(), e: e.points()};
      path.addSegments([points.b.outer, points.e.outer, points.e.inner, points.b.inner]);
      path.closePath(); 
    }    
  }
}

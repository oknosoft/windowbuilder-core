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

  /**
   * @summary Путь внешнего ребра элемента
   * @type {paper.Path}
   */
  get outer() {
    this.checkActual();
    const outer = this.raw('outer');
    if(!outer.segments.length) {

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

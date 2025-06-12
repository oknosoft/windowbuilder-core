import {OwnerObj} from '@oknosoft/metadata/core/src/meta/metaObjs';
import {own} from '@oknosoft/metadata/core/src/meta/symbols';
import paper from 'paper/dist/paper-core';
import {FillingRibParams} from './BuilderParams';

export class FillingRib extends OwnerObj {

  constructor(owner, edge) {
    super(owner);
    this.params = new FillingRibParams(this);
    this.edge = edge;
    if(!owner.ribs.includes(this)) {
      owner.ribs.push(this);
    }
  }
  
  remove() {
    const {index} = this;
    if(index > -1) {
      this[own].ribs.splice(index, 1);
    }
  }
  
  get index() {
    return this[own].ribs.indexOf(this);
  }
  
  get next() {
    const {index} = this;
    const {ribs} = this[own];
    return index < ribs.length - 1 ? ribs[index + 1] : ribs[0];  
  }

  get prev() {
    const {index} = this;
    const {ribs} = this[own];
    return index === 0 ? ribs[ribs.length - 1] : ribs[index - 1];
  }
  
  get cnn() {
    const cnns = this[own].project.root.cat.cnns.iiCnns(this[own], this.edge.profile).filter(v => v.art1glass);
    return cnns[0] || null;
  }
  
  get size() {
    const {cnn, edge: {profile}} = this;
    return (cnn?.size?.(this[own], profile) || 0) - profile.szc;
  }
  
  get curve() {
    const {path} = this[own];
    return path.curves[this.index];
  }

  get b() {
    return this.curve.point1;
  }

  get e() {
    return this.curve.point2;
  }
  
  get length() {
    return this.curve.length;
  }
  
  get angle() {
    const {curve, prev: {curve: prev}, next: {curve: next}} = this;
    const hor = paper.Point.angleHor(curve.point1, curve.point2);
    const anglePrev = paper.Point.angleHor(prev.point1, prev.point2);
    const angleNext = paper.Point.angleHor(next.point1, next.point2);
    let b = anglePrev - hor;
    if(b < 0) {
      b += 360;
    }
    let e = hor - angleNext;
    if(e < 0) {
      e += 360;
    }
    return {
      hor,
      cut: {b, e},
      elm: {b, e},
    };    
  }
}

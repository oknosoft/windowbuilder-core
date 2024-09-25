import paper from 'paper/dist/paper-core';
import {epsilon} from './paper/Point';
import {GeneratrixElement} from './GeneratrixElement';

export class ProfileConnective extends GeneratrixElement {
  
  constructor({loading, ...attr}) {
    super(attr);
    this.raw('nearests', []);
    this.raw('rotate3D', 0);
    const {props} = this.project;
    if(!(loading || props.loading)) {
      this.skeleton.addProfile(this);
      // ищем и расталкиваем примыкания
      if(this.findNearests().length) {
        this.hustleNearests();
        props.registerChange();
      }      
    }
  }

  /**
   * @summary Ищет примыкающие профили
   * @return {Array.<Profile>}
   */
  findNearests() {
    const nearests = this.raw('nearests');
    const {generatrix, width, project} = this;
    const w2 = width * width;
    for(const contour of project.contours) {
      for(const profile of contour.profiles) {
        if(generatrix.isNearest(profile.b.point, w2) && generatrix.isNearest(profile.e.point, w2)) {
          if(!nearests.includes(profile)) {
            nearests.push(profile);
          }
          profile.raw('nearest', this);
        }
      }
    }
    return nearests;
  }

  /**
   * @summary Смещает примыкающие профили к границам текущего
   */
  hustleNearests() {
    const {b, e, inner, outer} = this;
    const nearests = this.raw('nearests');
    const line = new paper.Line(b.point, e.point);
    let res;
    for(const profile of nearests) {
      // выясним сторону
      const {bounds} = profile.layer;
      const side = line.getSide(bounds.center, true);
      const ray = side > 0 ? outer : inner;
      for(const node of 'be') {
        const pt = ray.getNearestPoint(profile[node].point);
        const delta = pt.subtract(profile[node].point);
        if(delta.length > epsilon) {
          profile[node].vertex.point = pt;
          res = true;
        }
      }       
    }
    return res;
  }
  
  unhustleNearests() {
    const {b, e, generatrix} = this;
    const nearests = this.raw('nearests');
    let res;
    for(const profile of nearests) {
      // выясним сторону
      const {bounds} = profile.layer;
      for(const node of 'be') {
        const pt = generatrix.getNearestPoint(profile[node].point);
        const delta = pt.subtract(profile[node].point);
        if(delta.length > epsilon) {
          profile[node].vertex.point = pt;
          res = true;
        }
      }
      profile.raw('nearest', null);
    }
    return res; 
  }

  get elmType() {
    return this.project.root.enm.elmTypes.linking;
  }

  get width() {
    return 50;
  }

  get sizeb() {
    const {sizeb} = this.inset;
    if(sizeb === -1100) {
      const {nom} = this;
      return nom ? nom.sizeb : 0;
    }
    else if(!sizeb || sizeb === -1200) {
      return this.width / 2;
    }
    return sizeb || 0;
  }
  
  layers3D() {
    const {b, e, inner, outer} = this;
    const line = new paper.Line(b.point, e.point);
    const res = {base: [], rotate: []};
    const bySide = new Map();
    for(const {layer} of this.raw('nearests')) {
      const {bounds} = layer;
      const side = line.getSide(bounds.center, true);
      if(!bySide.has(side)) {
        bySide.set(side, []);
      }
      bySide.get(side).push(layer);
    }
    // будем поворачивать слой с бОльшим индексом
    if(bySide.has(-1) && bySide.has(1)) {
      if(bySide.get(-1)[0]._index > bySide.get(1)[0]._index) {
        res.base = bySide.get(1);
        res.rotate = bySide.get(-1);
      }
      else {
        res.base = bySide.get(-1);
        res.rotate = bySide.get(1);
      }
    }
    return res;
  }
  
  get rotate3D() {
    return this.orientation.is('vert') ? this.raw('rotate3D') : undefined;
  }
  set rotate3D(v) {
    this.applyRotate3D(v);
  }
  
  applyRotate3D(v) {
    this.raw('rotate3D', v);
    const {base, rotate} = this.layers3D();
    const {three: bthree, bounds: bbounds} = base[0]; 
    for(const layer of rotate) {
      const {three, bounds} = layer;
      three.parent = bthree.owner;
      if(!bthree.children.includes(layer)) {
        bthree.children.push(layer);
      }
      three.degree.y = bthree.degree.y + v;
    }
    if(!this.project.props.loading) {
      this.project.props.registerChange();
      this.project.redraw();
    }
  }

  remove() {
    this.unhustleNearests();
    super.remove();
  }
  
}

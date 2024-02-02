import paper from 'paper/dist/paper-core';

const clear = {
  inner: null,
  outer: null,
  middle: null,
  cut: null,
  interior: null,
};

export class CnnPoint {

  #raw = {};
  
  constructor({owner, name, cnn = null, cnnOuter = null, profile = null, profileOuter = null}) {
    // на случай, если передали соседей и соединение
    Object.assign(this.#raw, {
      owner,
      name,
      cnn,
      cnnOuter, 
      profile,
      profileOuter,
      sname: name === 'b' ? 'firstSegment' : 'lastSegment',
      stamp: owner.project.props.stamp,
      inner: new paper.Path({insert: false}),
      outer: new paper.Path({insert: false}),
      pts: Object.assign({}, clear),
    });
  }
  
  checkActual() {
    const {stamp} = this.owner.project.props;
    if(stamp !== this.#raw.stamp) {
      this.#raw.profile = null;
      this.#raw.isT = null;
      this.#raw.stamp = stamp;
      Object.assign(this.#raw.pts, clear);
    }
  }

  tuneRays() {
    const {point, owner, name, inner, outer} = this;
    const {d1, d2, width, generatrix} = owner;
    const ds = 5 * (width > 30 ? width : 30) * (name === 'b' ? 1 : -1);
    const {offset, tangent, normal} = generatrix.otn(point);
    outer.removeSegments();
    inner.removeSegments();
    outer.add(point.add(normal.multiply(d1)).add(tangent.multiply(-ds)));
    inner.add(point.add(normal.multiply(d2)).add(tangent.multiply(-ds)));
    outer.add(point.add(normal.multiply(d1)).add(tangent.multiply(ds)));
    inner.add(point.add(normal.multiply(d2)).add(tangent.multiply(ds)));
    this.#raw.pts.interior = point.add(normal.multiply((d1 + d2) / 2)).add(tangent.multiply(ds/2));
    return this;
  }
  
  get name() {
    return this.#raw.name;
  }
  
  get owner() {
    return this.#raw.owner;
  }

  get inner() {
    return this.#raw.inner;
  }

  get outer() {
    return this.#raw.outer;
  }

  get points() {
    const {pts} = this.#raw;
    if(!pts.inner || !pts.outer) {
      const {point, isT, cnn, cnno, profile, profileOuter, inner, outer} = this.tuneRays();
    }
    return pts;
  }
  
  get point() {
    const {owner, sname} = this.#raw; 
    return owner.generatrix[sname].point;
  }
  set point(v) {
    const {owner, sname} = this.#raw;
    owner.generatrix[sname].point = v;
  }
  
  get selected() {
    return this.point.selected;
  }
  
  get vertex() {
    return this.#raw.vertex;
  }
  set vertex(v) {
    this.#raw.vertex = v;
  }
  
  get cnn() {
    return this.#raw.cnn;
  }
  set cnn(v) {
    this.#raw.cnn = cnn;
  }

  get cnno() {
    return this.#raw.cnno;
  }
  set cnno(v) {
    this.#raw.cnno = v;
  }

  /**
   * @summary Второй профиль изнутри
   * @type {null|GeneratrixElement}
   */
  get profile() {
    this.checkActual();
    if(this.#raw.profile === null) {
      const {point, owner} = this;
      const profiles = [];
      for(const profile of owner.layer.profiles) {
        if(profile !== owner && profile.generatrix.isNearest(point)) {
          profiles.push(profile);
        }
      }
      if(profiles.length > 1) {
        
      }
      this.#raw.profile = profiles[0]; 
    }
    return this.#raw.profile;
  }

  /**
   * @summary Второй профиль снаружи
   * @type {null|GeneratrixElement}
   */
  get profileOuter() {

  }

  /**
   * Признак Т-соединения
   * @type {Boolean}
   */
  get isT() {
    this.checkActual();
    if(typeof this.#raw.isT !== 'boolean') {
      const {profile, point} = this;
      this.#raw.isT = profile && !profile.b.point.isNearest(point) && !profile.e.point.isNearest(point);
    }
    return this.#raw.isT;
  }
  
  get hasOuter() {
    return false;
  }
}

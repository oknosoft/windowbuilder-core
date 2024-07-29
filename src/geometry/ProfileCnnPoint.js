import paper from 'paper/dist/paper-core';

/**
 * @typedef IOPaths
 * @prop {paper.Path} outer
 * @prop {paper.Path} inner
 */

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
      const raw = this.#raw;
      raw.profile = null;
      raw.profileOuter = null;
      raw.isT = null;
      raw.stamp = stamp;
      raw.outer.removeSegments();
      raw.inner.removeSegments();
      Object.assign(raw.pts, clear);
    }
  }

  tuneRays() {
    const {inner, outer} = this.#raw;
    if(!inner.segments.length || !outer.segments.length) {
      const {point} = this;
      const {owner, name, pts} = this.#raw;
      const {d1, d2, width, generatrix} = owner;
      const ds = 5 * (width > 30 ? width : 30) * (name === 'b' ? 1 : -1);
      const {offset, tangent, normal} = generatrix.getLocationOf(point);
      outer.add(point.add(normal.multiply(d1)).add(tangent.multiply(-ds)));
      inner.add(point.add(normal.multiply(d2)).add(tangent.multiply(-ds)));
      outer.add(point.add(normal.multiply(d1)).add(tangent.multiply(ds)));
      inner.add(point.add(normal.multiply(d2)).add(tangent.multiply(ds)));
      pts.interior = point.add(normal.multiply((d1 + d2) / 2)).add(tangent.multiply(ds/2));
    }
    return this;
  }

  /**
   * @summary Умолчания при изменении окружения
   * @desc Уточняет соединение и параметры
   */
  defaults() {
    const {owner, profile, profileOuter, hasOuter, cnn, cnnOuter} = this;
    if(cnn.empty()) {
      const {cnns} = this;
      if(cnns.length) {
        this.cnn = cnns[0];
      }
    }
    if(hasOuter && cnnOuter.empty()) {
      const {cnnsOuter} = this;
      if(cnnsOuter.length) {
        this.cnnOuter = cnnsOuter[0];
      }
    }
  }
  
  get name() {
    return this.#raw.name;
  }

  /**
   * @summary Профиль-владелец
   * @type {Profile}
   */
  get owner() {
    return this.#raw.owner;
  }

  /**
   * @summary Путь внутренних лучей
   * @type {paper.Path}
   */
  get inner() {
    this.checkActual();
    this.tuneRays();
    return this.#raw.inner;
  }

  /**
   * @summary Путь внешних лучей
   * @type {paper.Path}
   */
  get outer() {
    this.checkActual();
    this.tuneRays();
    return this.#raw.outer;
  }

  /**
   * @summary CnnPoint с тругой стороны профиля
   * @type {CnnPoint}
   */
  get other() {
    const {owner, name} = this.#raw;
    return name === 'b' ? owner.e : owner.b; 
  }

  /**
   * @summary выясняет, какой из лучей ближе
   * @param {paper.Path} inner
   * @param {paper.Path} outer
   * @return {IOPaths}
   */
  checkNearest({inner, outer}) {
    const {pts} = this.#raw;
    if(inner.getDistance(pts.interior) > outer.getDistance(pts.interior)) {
      [inner, outer] = [outer, inner];
    }
    return {inner, outer};
  }

  /**
   * @summary Лучи основного профиля
   * @type {IOPaths}
   */
  get prays() {
    const {isT, profile} = this;
    if(isT) {       
      return this.checkNearest(profile);
    }
    for(const cnnPoint of this.vertex.cnnPoints) {
      if(cnnPoint !== this) {
        return this.checkNearest(cnnPoint);
      }
    }
  }

  /**
   * @summary Лучи профиля с обратной стороны
   * @desc если таковой существует (разрыв)
   * @type {IOPaths}
   */
  get orays() {

  }

  /**
   * @summary Лучи профиля в продолжение текущего
   * @desc если таковой существует (крест)
   * @type {IOPaths}
   */
  get irays() {

  }

  points(mode) {
    const {pts} = this.#raw;
    this.checkActual();
    if(!pts.inner || !pts.outer) {
      const {owner, point, isT, cnn, cnno, profile, profileOuter, inner, outer} = this.tuneRays();
      const {cnnTypes} = owner.root.enm;
      const cnnType = (!cnn || cnn.empty()) ? (profile ? (isT ? cnnTypes.t : cnnTypes.ad) : cnnTypes.i) : cnn.cnn_type;
      let prays, orays;
      switch (cnnType) {
        case cnnTypes.i: {
          pts.inner = inner.getNearestPoint(point);
          pts.outer = outer.getNearestPoint(point);
          break;
        }
        case cnnTypes.t:
        case cnnTypes.short:{
          const {prays} = this;
          pts.inner = prays.inner.intersectPoint(inner);
          pts.outer = prays.inner.intersectPoint(outer);
          break;
        }
        case cnnTypes.long: {
          const {prays} = this;
          pts.inner = prays.outer.intersectPoint(inner);
          pts.outer = prays.outer.intersectPoint(outer);
          break;
        }
        case cnnTypes.ad: {
          const {prays} = this;
          pts.inner = prays.inner.intersectPoint(inner);
          pts.outer = prays.outer.intersectPoint(outer);
          break;
        }
      }
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
    return this.owner.root.cat.cnns.get(this.#raw.cnn);
  }
  set cnn(v) {
    if(this.#raw.cnn != v) {
      const {project, layer} = this.owner;
      this.#raw.cnn = v;
      project.props.registerChange();
      if(!project.props.loading && !layer._removing) {
        project.redraw();
      }
    }
  }

  get cnnOuter() {
    return this.hasOuter ? this.owner.root.cat.cnns.get(this.#raw.cnnOuter) : null;
  }
  set cnnOuter(v) {
    if(this.#raw.cnnOuter != v) {
      const {project, layer} = this.owner;
      this.#raw.cnnOuter = v;
      project.props.registerChange();
      if(!project.props.loading && !layer._removing) {
        project.redraw();
      }
    }
  }

  /**
   * @summary Второй профиль изнутри
   * @type {null|GeneratrixElement}
   */
  get profile() {
    this.checkActual();
    if(this.#raw.profile === null) {
      const {point, owner, vertex} = this;
      const profiles = [];
      for(const cnnPoint of vertex.cnnPoints) {
        if(cnnPoint !== this) {
          profiles.push(cnnPoint.owner);
        }
      }
      // если это соединение T, смотрим на рёбра
      if(!profiles.length) {
        // for(const profile of vertex.profiles) {
        //   if(profile !== owner) {
        //     profiles.push(profile);
        //   }
        // }
        for(const profile of owner.layer.profiles) {
          if(profile !== owner && profile.generatrix.isNearest(point)) {
            profiles.push(profile);
          }
        }
      }
      if(profiles.length === 1) {
        this.#raw.profile = profiles[0];
      }
      else {
        for(const profile of profiles) {
          if(owner.generatrix.pointPos(profile.generatrix.interiorPoint, point) < 0) {
            this.#raw.profile = profile;
            break;
          }
        }
        
      }       
    }
    return this.#raw.profile;
  }

  /**
   * @summary Второй профиль снаружи
   * @type {null|GeneratrixElement}
   */
  get profileOuter() {
    if(!this.hasOuter) {
      return null;
    }
    this.checkActual();
    if(this.#raw.profileOuter === null) {
      const {point, owner, profile: main, vertex} = this;
      for(const profile of vertex.profiles) {
        if(profile !== owner && profile !== main && owner.generatrix.pointPos(profile.generatrix.interiorPoint, point) > 0) {
          this.#raw.profileOuter = profile;
          break;
        }
      }
    }
    return this.#raw.profileOuter;
  }

  get profilePoint() {
    const {profile, vertex} = this;
    for(const cnnPoint of vertex.cnnPoints) {
      if(cnnPoint.owner === profile) {
        return cnnPoint;
      }
    }
  }

  get profilePointOuter() {
    const {profileOuter, vertex} = this;
    for(const cnnPoint of vertex.cnnPoints) {
      if(cnnPoint.owner === profileOuter) {
        return cnnPoint;
      }
    }
  }

  /**
   * @summary Признак Т-соединения
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

  /**
   * @summary Признак соединения с пустотой
   * @type {Boolean}
   */
  get isI() {
    return !this.profile;
  }
  
  get hasOuter() {
    return this.vertex.cnnPoints.length > 2;
  }
  
  get cnns() {
    return this.owner.root.cat.cnns.nodeCnns(this, this.profile);
  }
  
  get cnnsOuter() {
    return this.hasOuter ? this.owner.root.cat.cnns.nodeCnns(this, this.profileOuter) : [];
  }
}

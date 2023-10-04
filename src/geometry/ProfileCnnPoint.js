
export class CnnPoint {

  #raw = {};
  
  constructor({owner, name, cnn = null, cnnOuter = null, profile = null, profileOuter = null}) {
    Object.assign(this.#raw, {owner, name, cnn, cnnOuter, profile, profileOuter});
    this.#raw.sname = name === 'b' ? 'firstSegment' : 'lastSegment';
    // на случай, если передали соседей и соединение
    this.#raw.stamp = owner.project.props.stamp;
  }
  
  get owner() {
    return this.#raw.owner;
  }
  
  checkActual() {
    const {stamp} = this.owner.project.props;
    if(stamp !== this.#raw.stamp) {
      this.#raw.profile = null;
      this.#raw.isT = null;
      this.#raw.stamp = stamp;
    }
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

  get profileOuter() {

  }
  
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

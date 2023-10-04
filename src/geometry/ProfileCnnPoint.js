
export class CnnPoint {

  #raw = {};
  
  constructor({owner, name, cnn, cnnOuter}) {
    Object.assign(this.#raw, {owner, name, cnn, cnnOuter});
    this.#raw.sname = name === 'b' ? 'firstSegment' : 'lastSegment';
  }
  
  get point() {
    const {owner, sname} = this.#raw; 
    return owner.generatrix[sname].point;
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
    
  }

  get profileOuter() {

  }
  
  get isT() {
    return false;
  }
  
  get hasOuter() {
    return false;
  }
}

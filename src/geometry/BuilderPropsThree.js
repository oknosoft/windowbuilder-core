import {Vector3, Quaternion, MathUtils} from 'three';

const {degToRad, radToDeg} = MathUtils;

class Degree {
  constructor(owner) {
    this.owner = owner;
  }

  fromArray(v) {
    this.owner.rotation.fromArray(v.map(degToRad));
  }
  
  get x() {
    return radToDeg(this.owner.rotation.x).round(3);
  }
  set x(v) {
    this.owner.rotation.x = degToRad(v);
  }

  get y() {
    return radToDeg(this.owner.rotation.y).round(3);
  }
  set y(v) {
    this.owner.rotation.y = degToRad(v);
  }

  get z() {
    return radToDeg(this.owner.rotation.z).round(3);
  }
  set z(v) {
    this.owner.rotation.z = degToRad(v);
  }
}

export class Props3D {

  #raw = {};
  
  constructor(raw) {
    Object.assign(this.#raw, {
      position: new Vector3(),
      rotation: new Vector3(),
      degree: new Degree(this),
      parent: null,
    });
    this.children = [];
    if(raw) {
      this.fill(raw);
    }    
  }
  
  fill({position, rotation, parent, children, owner, bind}) {
    if(position) {
      this.#raw.position.fromArray(position);
    }
    if(rotation) {
      this.#raw.rotation.fromArray(rotation);
    }
    if(parent) {
      this.parent = parent;
    }
    if(owner) {
      this.owner = owner;
      this._manager = new owner.project.root.classes.MetaEventEmitter();
      if(bind) {
        this.#raw.bind = bind;
      }
    }
    if(children) {
      this.children.length = 0;
      this.children.push(...children);
    }
    
  }

  clear() {
    const {children, parent, owner} = this;
    if(parent && owner) {
      this.parent = null;
      const index = parent.three.children.indexOf(owner);
      if(index !== -1) {
        parent.three.children.splice(index, 1);
      }
    }
    for(const {three} of children) {
      three.parent = null;
    }
    children.length = 0;
    this.owner = null;
  }
  
  get parent() {
    return this.#raw.parent;
  }
  set parent(v) {
    const {parent, owner} = this;
    if(parent && v !== parent) {
      const index = parent.three.children.indexOf(owner);
      if(index !== -1) {
        parent.three.children.splice(index, 1);
      }
    }
    this.#raw.parent = v;
    if(v?.three && !v.three.children.includes(owner)) {
      v.three.children.push(owner);
    }
  }
  
  get bindable() {
    return paper.project.contours.length > 1;
  }
  
  get bind() {
    const {positions} = this.owner.project.root.enm; 
    return positions.get(this.#raw.bind);
  }
  set bind(v) {
    this.#raw.bind = v;
    this._manager.emit('update', this, {bind: v});
  }
  
  get position() {
    return this.#raw.position;
  }
  set position(v) {
    if(Array.isArray(v)) {
      this.#raw.position.fromArray(v);
    }
    else {
      Object.assign(this.#raw.position, v);
    }
  }
  
  get calculatedPosition() {
    const {position, bind, owner, parent} = this;
    const {positions} = owner.project.root.enm;
    let pos = position.clone();
    if(parent) {
      switch (bind) {
        case positions.right:
          pos.x += parent.bounds.width;
          break;
        case positions.left:
          pos.x -= owner.bounds.width;
          break;
        case positions.top:
          pos.y += parent.bounds.height;
          break;
        case positions.bottom:
          pos.y -= owner.bounds.height;
          break;
        case positions.top:
          return pos;
      }
    }
    return pos;
  }

  get rotation() {
    return this.#raw.rotation;
  }
  set rotation(v) {
    if(Array.isArray(v)) {
      this.#raw.rotation.fromArray(v);
    }
    else {
      Object.assign(this.#raw.rotation, v);
    }
  }

  get degree() {
    return this.#raw.degree;
  }
  set degree(v) {
    if(Array.isArray(v)) {
      this.#raw.degree.fromArray(v);
    }
    else {
      Object.assign(this.#raw.degree, v);
    }
  }
  
}

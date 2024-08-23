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
    });
    this.parent = null;
    this.children = [];
    if(raw) {
      this.fill(raw);
    }    
  }
  
  fill({position, rotation, parent, children, owner}) {
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
    }
    if(children) {
      this.children.length = 0;
      this.children.push(...children);
    }
  }

  clear() {
    const {children, parent, owner} = this;
    if(parent && owner) {
      const index = parent.three.children.indexOf(owner);
      if(index !== -1) {
        parent.three.children.splice(index, 1);
      }
    }
    for(const child of children) {
      child.parent = null;
    }
    children.length = 0;
    this.parent = null;
    this.owner = null;
  }
  
  get pos() {
    const {owner, parent} = this;
    if(owner && parent) {
      const obounds = owner.bounds;
      const pbounds = parent.bounds;
      if(obounds.right <= pbounds.left) {
        return 'left';
      }
      if(obounds.left >= pbounds.right) {
        return 'right';
      }
      if(obounds.bottom <= pbounds.top) {
        return 'top';
      }
      if(obounds.top >= pbounds.bottom) {
        return 'bottom';
      }
    }
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

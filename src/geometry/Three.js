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
    return radToDeg(this.owner.rotation.x);
  }
  set x(v) {
    this.owner.rotation.x = degToRad(v);
  }

  get y() {
    return radToDeg(this.owner.rotation.y);
  }
  set y(v) {
    this.owner.rotation.y = degToRad(v);
  }

  get z() {
    return radToDeg(this.owner.rotation.z);
  }
  set z(v) {
    this.owner.rotation.z = degToRad(v);
  }
}

export class Three {

  #raw = {};
  
  constructor(raw) {
    Object.assign(this.#raw, {
      position: new Vector3(),
      rotation: new Vector3(),
      degree: new Degree(this),
    });
    if(raw) {
      this.fill(raw);
    }
    
  }
  
  fill({position, rotation}) {
    if(position) {
      this.#raw.position.fromArray(position);
    }
    if(rotation) {
      this.#raw.rotation.fromArray(rotation);
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

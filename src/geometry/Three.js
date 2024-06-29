import {Vector3, Quaternion} from 'three';

export class Three {

  #raw = {};
  
  constructor(raw) {
    Object.assign(this.#raw, {
      position: new Vector3(),
      rotation: new Vector3(),
      quaternion: new Quaternion(),
    });
    if(raw) {
      this.fill(raw);
    }
  }
  
  fill({position, rotation, quaternion}) {
    if(position) {
      this.#raw.position.fromArray(position);
    }
    if(rotation) {
      this.#raw.rotation.fromArray(rotation);
    }
    if(quaternion) {
      this.#raw.quaternion.fromArray(quaternion);
    }
  }
  
  get position() {
    return this.#raw.position;
  }
  set position(v) {
    if(array.isArray(v)) {
      this.#raw.position.fromArray(v);
    }
    else {
      Object.assign(this.#raw.position, v);
    }
  }

  get quaternion() {
    return this.#raw.quaternion;
  }
  set quaternion(v) {
    if(array.isArray(v)) {
      this.#raw.quaternion.fromArray(v);
    }
    else {
      Object.assign(this.#raw.quaternion, v);
    }
  }

  get rotation() {
    return this.#raw.rotation;
  }
  set rotation(v) {
    if(array.isArray(v)) {
      this.#raw.rotation.fromArray(v);
    }
    else {
      Object.assign(this.#raw.rotation, v);
    }
  }
  
}


export class BuilderProps  {
  #raw = {};
  
  constructor(scheme) {
    this.#raw.scheme = scheme;
  }
  
  get flipped() {
    return Boolean(this.#raw.flipped);
  }
  set flipped(v) {
    this.#raw.flipped = Boolean(v);
  }

  get carcass() {
    return Boolean(this.#raw.carcass);
  }
  set carcass(v) {
    this.#raw.carcass = Boolean(v);
  }

  get loading() {
    return Boolean(this.#raw.loading);
  }
  set loading(v) {
    this.#raw.loading = Boolean(v);
  }

  get saving() {
    return Boolean(this.#raw.saving);
  }
  set saving(v) {
    this.#raw.saving = Boolean(v);
  }
  
}

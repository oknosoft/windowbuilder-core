
export class BuilderProps  {
  #raw = {};
  
  constructor(project) {
    this.#raw.project = project;
    this.#raw.stamp = Date.now();
    this.#raw.carcass = true;
  }
  
  get stamp() {
    return this.#raw.stamp;
  }
  registerChange() {
    this.#raw.stamp = Date.now();
    this.#raw?.registerChange?.();
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
    v = Boolean(v);
    const change = this.#raw.carcass !== v;
    this.#raw.carcass = v;
    if(change) {
      this.#raw.project.redraw(true);
    }
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

  fontFamily() {
    return 'GOST type B';
  }
  
  fontSize() {
    return 60;
  }
  
}

import {Three} from './Three';

export class BuilderProps  {
  #raw = {sticking: 4};
  
  constructor(project) {
    this.#raw.project = project;
    this.#raw.stamp = Date.now();
    this.#raw.three = new Three();
    this.#raw.carcass = 'carcass'; // carcass|normal|plane
    project._scope.settings.handleSize = 14;
  }
  
  get stamp() {
    return this.#raw.stamp;
  }
  registerChange() {
    this.#raw.stamp = Date.now();
    this.#raw?.registerChange?.();
  }
  
  get three() {
    return this.#raw.three;
  }

  get carcass() {
    return this.#raw.carcass;
  }
  set carcass(v) {
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

  get sticking() {
    return Boolean(this.#raw.sticking);
  }
  set sticking(v) {
    this.#raw.sticking = Boolean(v);
  }

  

  fontFamily() {
    return 'GOST type B';
  }
  
  fontSize() {
    return 60;
  }
  
}

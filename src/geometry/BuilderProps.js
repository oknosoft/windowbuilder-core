import {Three} from './Three';

export class BuilderProps  {
  #raw = {sticking: 4};
  
  constructor(project) {
    this.#raw.project = project;
    this.#raw.stamp = Date.now();
    this.#raw.three = new Three();
    const {settings} = project._scope;
    if(!settings.carcass) {
      settings.carcass = 'carcass'; // carcass|normal|plane
      settings.handleSize = 14;
      settings.gridStep = 50;
    }
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
    return this.#raw.project._scope.settings.carcass;
  }
  set carcass(v) {
    const change = this.carcass !== v;
    const {_scope} = this.#raw.project;
    _scope.settings.carcass = v;
    if(change) {
      for(const project of _scope.projects) {
        project.redraw(true);
      }
    }
  }
  
  get gridStep() {
    return this.#raw.project._scope.settings.gridStep;
  }
  set gridStep(v) {
    this.#raw.project._scope.settings.gridStep = parseInt(v, 10) || 10;
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

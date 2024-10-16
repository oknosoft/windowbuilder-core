import {Props3D} from './BuilderPropsThree';
import defaults from './BuilderPropsDefaults';

export class BuilderProps  {
  #raw = {sticking: 4};
  
  constructor(project) {
    this.#raw.project = project;
    this.#raw.stamp = Date.now();
    this.#raw.three = new Props3D();
    defaults(project, this);
  }
  
  get project() {
    return this.#raw.project;
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
    const {project} = this;
    project._scope.settings.carcass = v;
    if(change) {
      project.root.jobPrm.set('carcass', v);
      project.redraw(true);
    }
  }
  
  get gridStep() {
    return this.#raw.project._scope.settings.gridStep;
  }
  set gridStep(v) {
    this.#raw.project._scope.settings.gridStep = parseInt(v, 10) || 10;
  }

  get snapAngle() {
    return this.#raw.project._scope.settings.snapAngle;
  }
  set snapAngle(v) {
    this.#raw.project._scope.settings.snapAngle = parseInt(v, 10) || 45;
  }
  
  get showGrid() {
    return Boolean(this.#raw.project._scope.settings.showGrid);
  }
  set showGrid(v) {
    this.#raw.project._scope.settings.showGrid = v;
  }

  get snap() {
    return this.#raw.project._scope.settings.snap || 'none';
  }
  set snap(v) {
    this.#raw.project._scope.settings.snap = v;
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

  get sys() {
    const {project, sys} = this.#raw;
    return project.root.cat.productionParams.get(sys);
  }
  set sys(v) {
    this.#raw.sys = this.#raw.project.root.cat.productionParams.get(v);
  }
  
  fontFamily() {
    return 'GOST type B';
  }
  
  fontSize() {
    return 60;
  }
  
}

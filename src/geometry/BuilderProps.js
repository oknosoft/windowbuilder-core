import {Props3D} from './BuilderPropsThree';
import defaults from './BuilderPropsDefaults';
import {BuilderParams} from './BuilderParams';
import {own} from '@oknosoft/metadata/core/src/meta/symbols';

/**
 * @summary Runtime свойства проекта
 * @desc Такие как, модифицированность, режим рисовалки, шаг и привязка к сетке и т.д.
 */
export class BuilderProps extends BuilderParams {
  #raw = {sticking: 4};
  
  constructor(project) {
    super(project);
    this.#raw.stamp = Date.now();
    this.#raw.three = new Props3D();
    const base_sys = project.root?.cch.predefinedElmnts.find({synonym: "base_sys"});
    if(base_sys) {
      this.#raw.sys = base_sys.elmnts.find({elm: "window"}).value;
    }
    defaults(project, this);
  }
  
  get project() {
    return this[own];
  }
  
  get settings() {
    return this.project._scope.settings;
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
    return this.settings.carcass;
  }
  set carcass(v) {
    const change = this.carcass !== v;
    const {project, settings} = this;
    settings.carcass = v;
    if(change) {
      project.root.jobPrm.set('carcass', v);
      project.redraw(true);
    }
  }
  
  get gridStep() {
    return this.settings.gridStep;
  }
  set gridStep(v) {
    this.settings.gridStep = parseInt(v, 10) || 10;
  }

  get snapAngle() {
    return this.settings.snapAngle;
  }
  set snapAngle(v) {
    this.settings.snapAngle = parseInt(v, 10) || 45;
  }
  
  get showGrid() {
    return Boolean(this.settings.showGrid);
  }
  set showGrid(v) {
    this.settings.showGrid = v;
  }

  get showVertexes() {
    return Boolean(this.settings.showVertexes);
  }
  set showVertexes(v) {
    this.settings.showVertexes = v;
  }

  get snap() {
    return this.settings.snap || 'none';
  }
  set snap(v) {
    this.settings.snap = v;
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
    return this.project.root.cat.productionParams.get(this.#raw.sys);
  }
  set sys(v) {
    const sys = this.project.root.cat.productionParams.get(v);
    if(this.#raw.sys !== sys) {
      this.#raw.sys = sys;
      this.project.resetDefaults();
    }
  }
  
  fontFamily() {
    return 'GOST type B';
  }
  
  fontSize() {
    return 62;
  }

  get list() {
    const res = new Map();
    return this.appendList(res, this.sys.product_params);
  }

  eigenvalue(param, context, origin) {
    const {sys} = this;
    const prow = sys.product_params.find({param}); // sys.params.find({param})
    return prow ? prow.value : param.type.fetchType();
  }
  
}

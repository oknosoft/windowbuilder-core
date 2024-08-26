
import paper from 'paper/dist/paper-core';
import {BuilderProps} from './BuilderProps';
import {Contour} from './Contour';
import {ContourRoot} from './ContourRoot';
import {StandardForms} from './StandardForms';
import {load21} from './loaders/load21';

export class Scheme extends paper.Project {
  
  constructor(attr, root) {
    super(attr);
    if(root) {
      Object.defineProperty(this, 'root', {value: root});
    }
    Object.defineProperties(this, {
      rootLayer: {value: new ContourRoot({project: this, insert: true})},
      props: {value: new BuilderProps(this)},
      standardForms: {value: new StandardForms(this)},
    });
  }

  get activeLayer() {
    const {_activeLayer, rootLayer} = this;
    if(_activeLayer && _activeLayer !== rootLayer) {
      return _activeLayer;
    }
    for(const layer of this.layers) {
      if(layer instanceof Contour && layer !== rootLayer) {
        layer.activate();
        return layer;
      }
    }
    return this.addLayer();
  }
  
  get dimensions() {
    return this.rootLayer.children.dimensions;
  }

  get dots() {
    return this.rootLayer.children.dots;
  }

  get bounds() {
    return this.layers.reduce((sum, {bounds}) => {
      if(!bounds.width || !bounds.height) {
        return sum;
      }
      return sum ? sum.unite(bounds) : bounds;
    }, null);
  }
  
  get strokeBounds() {
    return this.layers.reduce((sum, curr) => sum.unite(curr.strokeBounds), new paper.Rectangle());
  }
  
  get dimensionBounds() {
    return [...this.layers, this.dimensions].reduce((sum, curr) => sum.unite(curr.bounds), new paper.Rectangle());
  }

  /**
   * @summary Вписывает канвас в указанные размеры
   * @desc Используется при создании проекта и при изменении размеров области редактирования
   *
   * @param w {Number} - ширина, в которую будет вписан канвас
   * @param h {Number} - высота, в которую будет вписан канвас
   */
  resizeCanvas(w, h) {
    const {viewSize} = this.view;
    viewSize.width = w;
    viewSize.height = h;
  }

  /**
   * @summary Вписывает изделие в размеры канваса
   */
  zoomFit(bounds) {
    if(!bounds) {
      bounds = this.dimensionBounds;
    }
    const space = 180;
    const min = 900;
    let {width, height, center} = bounds;
    if (width < min) {
      width = min;
    }
    if (height < min) {
      height = min;
    }
    width += space;
    height += space;
    const {view} = this;
    const zoom = (Math.min(view.viewSize.height / height, view.viewSize.width / width)) * 0.9;
    const {scaling} = view._decompose();
    view.scaling = [Math.sign(scaling.x) * zoom, Math.sign(scaling.y) * zoom];

    let dx = (view.viewSize.width - width * zoom) / 2;
    let dy = (view.viewSize.height - height * zoom) / 2;
    view.center = center.add([-Math.sign(scaling.x) * dx, -Math.sign(scaling.y) * dy]);

    this._scope?.tool?.onZoomFit?.();
  }

  get contours() {
    const {rootLayer, layers} = this;
    return layers.filter(v => v instanceof Contour && v !== rootLayer);
  }
  
  clear() {
    const {contours, dimensions, props} = this;
    for(const contour of contours) {
      contour.remove();
    }
    dimensions.clear();
    dimensions.removeChildren();
  }
  
  activate() {
    const {_scope, _view} = this;
    if(_scope.project !== this) {
      _scope.project?.deselectAll?.();
      super.activate();
      this.deselectAll();
      if(_view) {
        _scope.View._viewsById[_view._id] = _view;
      }
    }
  }

  addLayer() {
    const layer = new Contour({project: this, insert: true});
    this.props.registerChange();
    return layer;
  }

  /**
   * @summary Перерисовывает все слои изделия
   */
  redraw(silent) {
    this.rootLayer.redraw();
    for(const item of this.contours) {
      item.redraw?.();
    }
    this.dimensions.redraw();
    this.dots.redraw();
    if(!silent) {
      this.root.md.emit_promise('redraw', this);
    }
  }

  load21(raw) {
    return load21.call(this, raw);
  }
  
  // deprecated
  /**
   * @summary Заглушка для совместимости с v2.1
   */
  value_mgr(obj, fld, type) {
    const meta = this.root.md.get(type.types.find(v => v.includes('.'))); 
    return meta?.mgr;
  }
}

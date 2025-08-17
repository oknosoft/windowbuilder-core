
/*
 * ### Разрез
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * Created 24.07.2015
 *
 * @module geometry
 * @submodule sectional
 */

class EditableText extends paper.PointText {

  constructor(props) {
    props.justification = 'center';
    props.fontFamily = consts.font_family;
    super(props);
    this._edit = null;
    this._owner = props._owner;

    !this.project._attr._from_service && this.on({
      mouseenter: this.mouseenter,
      mouseleave: this.mouseleave,
      mousedrag: this.mousedrag,
      mouseup: this.mouseup,
      click: this.click,
    });
  }

  mouseenter(event) {
    this.project._scope.canvas_cursor('cursor-arrow-ruler-light');
  }

  mouseleave(event) {
    this.project._scope.canvas_cursor('cursor-arrow-white');
  }

  mousedrag(event) {
    const {point, curve, prefix} = this;
    this.point = point.add(event.delta);
    if(!curve.positions) {
      curve.positions = {};
    }
    curve.positions[prefix] = this.point.clone();
    this._dragged = true;
  }

  mouseup(event) {
    if(this._dragged) {
      event.stop();
      delete this._dragged;
    }
  }
  

  click(event) {
    if(!this._edit) {
      const {view, bounds, content} = this;
      const point = view.projectToView(bounds.topLeft);
      const edit = this._edit = document.createElement('INPUT');
      view.element.parentNode.appendChild(edit);
      edit.style = `left: ${(point.x - 4).toFixed()}px; top: ${(point.y).toFixed()
      }px; width: ${60 + (content.length > 6 ? content.length - 6 : 0) * 6}px; border: none; position: absolute;`;
      edit.onblur = () => setTimeout(() => this.edit_remove());
      edit.onkeydown = this.edit_keydown.bind(this);
      edit.value = content.replace(/\D$/, '');
      setTimeout(() => {
        edit.focus();
        edit.select();
      });
    }
  }

  edit_keydown(event) {
    switch (event.code) {
    case 'Escape':
    case 'Tab':
      return this.edit_remove();
    case 'Enter':
    case 'NumpadEnter': {
      const parts = this._edit.value.split('-')
        .map(parseFloat)
        .filter(v => typeof v === 'number' && !isNaN(v))
        .map(v => v.round());
      this.apply(...parts);
      return this.edit_remove();
    }
    case 'Digit0':
    case 'Digit1':
    case 'Digit2':
    case 'Digit3':
    case 'Digit4':
    case 'Digit5':
    case 'Digit6':
    case 'Digit7':
    case 'Digit8':
    case 'Digit9':
    case 'Numpad0':
    case 'Numpad1':
    case 'Numpad2':
    case 'Numpad3':
    case 'Numpad4':
    case 'Numpad5':
    case 'Numpad6':
    case 'Numpad7':
    case 'Numpad8':
    case 'Numpad9':
    case '.':
    case 'Period':
    case 'NumpadDecimal':
    case 'NumpadSubtract':
    case 'Minus':
    case 'Delete':
    case 'Backspace':
      break;
    case 'Comma':
    case ',':
      event.code = '.';
      break;
    case 'ArrowRight':
      if(event.target.selectionStart < event.target.selectionEnd) {
        event.target.selectionStart = event.target.selectionEnd;
        event.stopPropagation();
        return false;
      }
    case 'ArrowLeft':
      if(event.target.selectionStart < event.target.selectionEnd) {
        event.target.selectionEnd = 0;
        event.stopPropagation();
        return false;
      }
      break;
    default:
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }

  edit_remove() {
    if(this._edit){
      this._edit.parentNode && this._edit.parentNode.removeChild(this._edit);
      this._edit = null;
    }
  }

  remove() {
    this.edit_remove();
    super.remove();
  }
  
  get curve() {
    return this._owner;
  }

  get prefix() {
    return 'l';
  }
}

class AngleText extends EditableText {

  constructor(props) {
    props.fillColor = new paper.Color(0, 0, 0.9, 0.9);
    super(props);
    this._ind = props._ind;
  }

  apply(value) {

    const {project, generatrix, _attr} = this._owner;
    const {zoom} = _attr;
    const {curves, segments} = generatrix;
    const c1 = curves[this._ind - 1];
    const c2 = curves[this._ind];
    const loc1 = c1.getLocationAtTime(0.9);
    const loc2 = c2.getLocationAtTime(0.1);
    const center = c1.point2;
    let angle = loc2.tangent.angle - loc1.tangent.negate().angle;
    if(angle < 0){
      angle += 360;
    }
    const invert = angle > 180;
    if(invert){
      angle = 360 - angle;
    }
    const ray0 = new paper.Point([c2.point2.x - c2.point1.x, c2.point2.y - c2.point1.y]);
    const ray1 = ray0.clone();
    ray1.angle += invert ? angle - value : value - angle;
    const delta = ray1.subtract(ray0);

    let start;
    for(const segment of segments) {
      if(segment.point.equals(c2.point2)) {
        start = true;
      }
      if(start) {
        segment.point = segment.point.add(delta);
      }
    }
    for(const curve of generatrix.curves) {
      delete curve.positions;
    }
    project.register_change(true);

  }

  get curve() {
    const {_owner: {generatrix}, _ind} = this;
    const {curves} = generatrix;
    return curves[_ind];
  }
  
  get prefix() {
    return 'a';
  }
}

class LenText extends EditableText {

  constructor(props) {
    props.fillColor = new paper.Color(0.1, 0.9);
    super(props);
  }

  apply(l0, l1, a0, a1) {
    const {path, segment1, segment2, length} = this._owner;
    const {parent: {_attr, project, generatrix}, segments} = path;
    const {zoom} = _attr;
    const delta = segment1.curve.getTangentAtTime(1).multiply(l0 * zoom - length);
    let start;
    for(const segment of segments) {
      if(segment === segment2) {
        start = true;
      }
      if(start) {
        segment.point = segment.point.add(delta);
      }
    }
    if(l1 && Math.abs(l0 - l1) > 1) {
      this._owner.lengths = [l0, l1];
    }
    else if(this._owner.lengths) {
      delete this._owner.lengths;
    }
    for(const curve of generatrix.curves) {
      delete curve.positions;
    }
    if(a0) {
      this._owner.angles = (a1 && Math.abs(a0 - a1) > 1) ? [a0, a1] : [a0];
    }
    else {
      delete this._owner.angles;
    }
    project.register_change(true);
  }
}

/**
 * Вид в разрезе. например, водоотливы
 * @extends GeneratrixElement
 */
class Sectional extends GeneratrixElement {
  
  static FakeRays = class FakeRays {
    constructor() {
      this.b = {};
      this.e = {};
    }
    clear() {}
    recalc() {}
  };

  /**
   * Вызывается из конструктора - создаёт пути и лучи
   * @private
   */
  initialize(attr) {

    const {project, layer, _attr, _row} = this;
    const h = project.bounds.height + project.bounds.y;
    if(this.parent === layer) {
      this.parent = layer.children.sectionals;
    }

    _attr._rays = new Sectional.FakeRays();

    _attr.children = [];

    _attr.zoom = 5;
    _attr.radius = 50;

    if(attr.generatrix) {
      _attr.generatrix = attr.generatrix;
    }
    else {
      if(_row.path_data) {
        _attr.generatrix = new paper.Path(_row.path_data);
      }
      else{
        const first_point = new paper.Point([_row.x1, h - _row.y1]);
        _attr.generatrix = new paper.Path(first_point);
        if(_row.r){
          _attr.generatrix.arcTo(
            first_point.arc_point(_row.x1, h - _row.y1, _row.x2, h - _row.y2,
              _row.r + 0.001, _row.arc_ccw, false), [_row.x2, h - _row.y2]);
        }
        else{
          _attr.generatrix.lineTo([_row.x2, h - _row.y2]);
        }
      }
    }

    _attr.generatrix.strokeColor = 'black';
    _attr.generatrix.strokeWidth = 1;
    _attr.generatrix.strokeScaling = false;
    this.clr = _row.clr.empty() ? $p.job_prm.builder.base_clr : _row.clr;

    this.addChild(_attr.generatrix);

    const {lengths, positions, angles} = _row.dop;
    if(Array.isArray(lengths)) {
      lengths.forEach((part, index) => {
        if(Array.isArray(part)) {
          const curve = _attr.generatrix.curves[index];
          if(curve) {
            curve.lengths = part;
          }
        }
      });
    }
    if(Array.isArray(angles)) {
      angles.forEach((part, index) => {
        if(Array.isArray(part)) {
          const curve = _attr.generatrix.curves[index];
          if(curve) {
            curve.angles = part;
          }
        }
      });
    }
    if(Array.isArray(positions)) {
      positions.forEach((pos, index) => {
        if(pos && typeof pos === 'object') {
          const curve = _attr.generatrix.curves[index];
          if(curve) {
            curve.positions = {};
            for(const key in pos) {
              curve.positions[key] = new paper.Point(pos[key]);
            }            
          }
        }
      });
    }

  }

  /**
   * Формирует путь разреза
   *
   * @return {Sectional}
   */
  redraw() {
    const {layer, generatrix, _attr, radius, visible} = this;
    const {children, zoom} = _attr;
    const {segments, curves} = generatrix;

    // чистим углы и длины
    for(let child of children){
      child.remove();
    }
    children.length = 0;

    if(visible) {
      // рисуем углы
      for(let i = 1; i < segments.length - 1; i++){
        this.draw_angle(i);
      }

      // рисуем длины
      curves.forEach((curve, ind) => {
        const {lengths, length, angles} = curve;
        let content = lengths ? lengths.join('-') : (length / zoom).toFixed(0);
        if(angles?.length) {
          if(!content.includes('-')) {
            content += `-${content}`;
          }
          angles?.forEach(angle => content += `-${angle}`);
        }
        const loc = curve.getLocationAtTime(0.5);
        const normal = loc.normal.normalize(radius);
        const point = curve.positions?.l || loc.point.add(normal).add([0, normal.y < 0 ? 0 : normal.y / 2]);
        children.push(new LenText({
          point,
          content,
          fontSize: radius * 1.2,
          parent: layer.children.text,
          _owner: curve
        }));
      });
    }


    return this;
  }

  beforeRemove() {
    for(const elm of this._attr.children) {
      elm.remove?.();
    }    
    return true;
  }

  /**
   * @summary Рисует развёртку в слое визуализации
   */
  draw_unfolding() {
    const {layer, generatrix: {curves, bounds}, width, radius, _attr: {zoom}} = this;
    const {l_visualization, children: {text}} = layer;
    const curr = {
      bottom: text.bounds.bottomRight.add([80 * zoom, 0]),
    };
    curr.top =  curr.bottom.add([0, -width / 2]);
    curr.initial = {
      bottom: curr.bottom.clone(),
      top: curr.top.clone(),
    };
    // del--находим самую широкую--
    // тупо слева направо
    if(curves.length) {
      const curve = curves[0];
      const {length, lengths, angles} = curve;
      const first = {curve, length, lengths, angles};
      curves.forEach(step);
    }
    
    function step(curve) {
      const angle = 90;
      const {lengths, angles} = curve;
      const last = curves.indexOf(curve) === curves.length - 1;
      const dx0 = lengths?.[0] ? lengths?.[0] * zoom : curve.length;
      const dx1 = lengths?.[1] ? lengths?.[1] * zoom : dx0;
      const vector = curr.top.subtract(curr.bottom).normalize();
      const vect0 = vector.rotate(angles?.[0] || angle);
      const vect1 = angles?.[0] ? vector.rotate(180 - (angles?.[1] || angles?.[0])) : vect0;

      const top = curr.top.add(vect1.multiply(dx1));
      const bottom = curr.bottom.add(vect0.multiply(dx0));
      const path = new paper.Path({
        parent: l_visualization.by_insets,
        segments: [curr.bottom, curr.top, top, bottom],
        strokeColor: 'black',
        strokeScaling: false,
      });
      path.closePath();
      if(!curr.widthDrawed) {
        curr.widthDrawed = true;
        new paper.PointText({
          parent: l_visualization.by_insets,
          point: curr.bottom.add(curr.top).divide(2).add([-radius * 2, 0]),
          content: width.toFixed(),
          fontSize: radius,
          rotation: -90,
          justification: 'center',
        });
      }
      new paper.PointText({
        parent: l_visualization.by_insets,
        point: ((last && dx0 < 150) ? bottom : bottom.add(curr.bottom).divide(2)).add([0, radius * 1.2]),
        content: (dx0 / zoom).toFixed(),
        fontSize: radius,
        justification: 'center',
      });
      if(Math.abs(dx0 - dx1) > 1) {
        new paper.PointText({
          parent: l_visualization.by_insets,
          point: ((last && dx1 < 150) ? top : top.add(curr.top).divide(2)).add([0, -radius * 0.4]),
          content: (dx1 / zoom).toFixed(),
          fontSize: radius,
          justification: 'center',
        });
      }

      curr.top = top;
      curr.bottom = bottom;
    }
    
    // сдвинем при необходимости
    const dx = bounds.unite(text.bounds).bottomRight.x - l_visualization.by_insets.bounds.bottomLeft.x + 100;
    l_visualization.by_insets.translate([dx, 0]);
  }

  /**
   * Рисует дуги и текст в углах
   * @param ind
   */
  draw_angle(ind) {
    const {layer, generatrix, _attr, radius} = this;
    let {children, zoom} = _attr;
    const {curves} = generatrix;
    const c1 = curves[ind - 1];
    const c2 = curves[ind];
    const loc1 = c1.getLocationAtTime(0.9);
    const loc2 = c2.getLocationAtTime(0.1);
    const center = c1.point2;
    let angle = loc2.tangent.angle - loc1.tangent.negate().angle;
    if(angle < 0){
      angle += 360;
    }
    if(angle > 180){
      angle = 360 - angle;
    }

    // радиус зависит от габаритов


    if (c1.length < radius || c2.length < radius || 180 - angle < 1){
      return;
    }

    const from = c1.getLocationAt(c1.length - radius).point;
    const to = c2.getLocationAt(radius).point;
    const end = center.subtract(from.add(to).divide(2)).normalize(radius).negate();
    children.push(new paper.Path.Arc({
      from,
      through: center.add(end),
      to,
      strokeColor: 'grey',
      guide: true,
      parent: layer.children.text,
    }));

    // Angle Label
    const point = c2.positions?.a || center.add(end.multiply(-2.2));
    children.push(new AngleText({
      point,
      content: angle.toFixed(0) + '°',
      fontSize: radius * 1.2,
      parent: layer.children.text,
      _owner: this,
      _ind: ind,
    }));

  }

  /**
   * Вычисляемые поля в таблице координат
   */
  save_coordinates() {

    const {_row, generatrix} = this;

    if(!generatrix){
      return;
    }

    _row.x1 = this.x1;
    _row.y1 = this.y1;
    _row.x2 = this.x2;
    _row.y2 = this.y2;
    _row.path_data = generatrix.pathData;
    _row.nom = this.nom;


    // добавляем припуски соединений
    _row.len = this.length.round(1);

    // устанавливаем тип элемента
    _row.elm_type = this.elm_type;
    
    // длины с обратной стороны, углы и положения надписей
    _row.dop = {
      lengths: generatrix.curves.map(curve => curve.lengths || 0),
      angles: generatrix.curves.map(curve => curve.angles || 0),      
      positions: generatrix.curves.map(({positions}) => {
        if(positions) {
          const res = {};
          for(const key in positions) {
            res[key] = [positions[key].x, positions[key].y];
          }
          return res;
        }
        return 0;
      })
    };

  }

  /**
   * заглушка для совместимости с профилем
   * @override
   */
  cnn_point() {

  }

  setSelection(selection) {
    const {generatrix} = this._attr;
    if (!generatrix) {
      return;
    }
    super.setSelection(selection);
    generatrix.setSelection(selection);
  }

  /**
   * Длина разреза
   * @return {number}
   */
  get length() {
    const {generatrix, zoom} = this._attr;
    return (2 * generatrix.length / zoom).round() / 2;
  }
  
  get width() {
    const {length} = $p.job_prm.properties;
    const {project, layer} = this
    return length.extract_pvalue({ox: project.ox, cnstr: 0, layer, elm: this});
  }

  /**
   * Виртуальные лучи для совместимости с профилем
   * @return {{b: {}, e: {}, clear: (function())}|*|ProfileRays}
   */
  get rays() {
    return this._attr._rays;
  }

  /**
   * Возвращает тип элемента (Водоотлив)
   */
  get elm_type() {
    return $p.enm.elm_types.drainage;
  }

  /**
   * радиус с учетом габаритов
   */
  get radius() {
    let {generatrix, radius} = this._attr;
    const {height, width} = generatrix.bounds;
    const size = Math.max(width - consts.cutoff, height - consts.cutoff);
    if(size > 0) {
      radius += size / 60;
    }
    return radius;
  }
  
}

EditorInvisible.Sectional = Sectional;
EditorInvisible.EditableText = EditableText;
EditorInvisible.AngleText = AngleText;

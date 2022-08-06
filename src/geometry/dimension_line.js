
/*
 * ### Размерные линии на эскизе
 *
 * Created 21.08.2015
 *
 * @module geometry
 * @submodule dimension_line
 */

/**
 * ### Размерная линия на эскизе
 * Унаследована от [paper.Group](http://paperjs.org/reference/group/)<br />
 * См. так же, {{#crossLink "DimensionLineCustom"}}{{/crossLink}} - размерная линия, устанавливаемая пользователем
 *
 * @class DimensionLine
 * @extends paper.Group
 * @param attr {Object} - объект с указанием на строку координат и родительского слоя
 * @constructor
 * @menuorder 46
 * @tooltip Размерная линия
 */

class DimensionLine extends paper.Group {

  constructor(attr) {

    super({parent: attr.parent, project: attr.project});

    const _attr = this._attr = {};

    this._row = attr.row;

    if(this._row && this._row.path_data){
      attr._mixin(JSON.parse(this._row.path_data));
      if(attr.elm1){
        attr.elm1 = this.project.getItem({elm: attr.elm1});
      }
      if(attr.elm2){
        attr.elm2 = this.project.getItem({elm: attr.elm2});
      }
    }
    if(!attr.elm2) {
      attr.elm2 = attr.elm1;
    }
    if(!attr.p1) {
      attr.p1 = 'b';
    }
    if(!attr.p2) {
      attr.p2 = 'e';
    }
    Object.assign(_attr, attr);

    if(attr.contour){
      _attr.contour = true;
    }

    if(!_attr.pos && (!_attr.elm1 || !_attr.elm2)){
      this.remove();
      return;
    }

    // создаём детей
    new paper.Path({parent: this, name: 'callout1', strokeColor: 'black', guide: true});
    new paper.Path({parent: this, name: 'callout2', strokeColor: 'black', guide: true});
    new paper.Path({parent: this, name: 'scale', strokeColor: 'black', guide: true});
    new paper.PointText({
      parent: this,
      name: 'text',
      justification: 'center',
      fillColor: 'black',
      fontFamily: consts.font_family,
      fontSize: this._font_size()});

    !this.project._attr._from_service && this.on({
      mouseenter: this._mouseenter,
      mouseleave: this._mouseleave,
      click: this._click
    });

  }

  _font_size() {
    const {width, height} = this.project.bounds;
    const {cutoff, font_size} = consts;
    const size = Math.max(width - cutoff, height - cutoff) / 60;
    return font_size + (size > 0 ? size : 0);
  }

  // виртуальные метаданные для автоформ
  _metadata(fld) {
    return $p.dp.builder_size.metadata(fld);
  }

  // виртуальный датаменеджер для автоформ
  get _manager() {
    return $p.dp.builder_size;
  }

  /**
   *
   * @return {boolean}
   */
  is_disabled() {
    const {project, layer, _attr: {elm1, elm2}} = this;
    if(project._attr.elm_fragment > 0 || (layer instanceof DimensionLayer && project.rootLayer() instanceof ContourParent)) {
      return true;
    }
    if(elm1 instanceof ProfileParent && elm2 instanceof ProfileParent) {
      return true;
    }
    return false;
  }

  _mouseenter() {
    const {children: {text}, project: {_scope}} = this;
    const dis = this.is_disabled();
    _scope.canvas_cursor(`cursor-arrow-ruler${dis ? '-dis' : ''}`);
    if(!dis) {
      text.fontWeight = 'bold';
      text.shadowBlur = 10;
      text.shadowOffset = 10;
    }
  }

  _mouseleave() {
    const {text} = this.children;
    text.fontWeight = 'normal';
    text.shadowBlur = 0;
    text.shadowOffset = 0;
  }

  _click(event) {
    event.stop();
  }

  correct_move_name({event, p1, p2}) {
    const {pos, _attr: {elm1, elm2}} = this;
    const e1 = elm1 instanceof ProfileParent;
    const e2 = elm2 instanceof ProfileParent;
    if(!e1 && !e2) {
      return;
    }

    if(pos == 'top' || pos == 'bottom') {
      const dir = p1.x < p2.x;
      if(event.name == 'left' && dir && e1) {
        event.name = 'right';
      }
      if(event.name == 'right' && dir && e2) {
        event.name = 'left';
      }
    }
    else {
      const dir = p1.y > p2.y;
      if(event.name == 'bottom' && dir && e1) {
        event.name = 'top';
      }
      if(event.name == 'top' && dir && e2) {
        event.name = 'bottom';
      }
    }
  }

  _move_points(event, xy) {

    let _bounds, delta;

    const {_attr, pos, project} = this;
    const {Point} = project._scope;

    // получаем дельту - на сколько смещать
    if(_attr.elm1){

      // в _bounds[event.name] надо поместить координату по x или у (в зависисмости от xy), которую будем двигать
      _bounds = {};

      const p1 = (_attr.elm1._sub || _attr.elm1)[_attr.p1];
      const p2 = (_attr.elm2._sub || _attr.elm2)[_attr.p2];
      this.correct_move_name({event, p1, p2, _attr});

      if(pos == 'top' || pos == 'bottom') {
        const size = Math.abs(p1.x - p2.x);
        if(event.name == 'right') {
          delta = new Point(event.size - size, 0);
          _bounds[event.name] = Math.max(p1.x, p2.x);
        }
        else {
          delta = new Point(size - event.size, 0);
          _bounds[event.name] = Math.min(p1.x, p2.x);
        }
      }
      else{
        const size = Math.abs(p1.y - p2.y);
        if(event.name == 'bottom') {
          delta = new Point(0, event.size - size);
          _bounds[event.name] = Math.max(p1.y, p2.y);
        }
        else {
          delta = new Point(0, size - event.size);
          _bounds[event.name] = Math.min(p1.y, p2.y);
        }
      }
    }
    else {
      _bounds = this.layer.bounds;
      if(pos == 'top' || pos == 'bottom') {
        if(event.name == 'right') {
          delta = new Point(event.size - _bounds.width, 0);
        }
        else {
          delta = new Point(_bounds.width - event.size, 0);
        }
      }
      else{
        if(event.name == 'bottom') {
          delta = new Point(0, event.size - _bounds.height);
        }
        else {
          delta = new Point(0, _bounds.height - event.size);
        }
      }
    }

    if(delta.length){
      // помещаем в move_shapes и move_points, элементы и узлы к сдвигу
      const move_shapes = [], move_points = [];
      let start;

      project.deselectAll();
      project.getItems({class: ProfileItem})
        .forEach((profile) => {
          let {b, e, generatrix, width} = profile;
          if(!start) {
            start = b.add(e).divide(2);
          }
          width /= 2 + 1;
          if(Math.abs(b[xy] - _bounds[event.name]) < width && Math.abs(e[xy] - _bounds[event.name]) < width){
            move_shapes.push(profile);
            //generatrix.segments.forEach((segm) => segm.selected = true)
          }
          else if(Math.abs(b[xy] - _bounds[event.name]) < width){
            move_points.push({profile, node: 'b'});
          }
          else if(Math.abs(e[xy] - _bounds[event.name]) < width){
            move_points.push({profile, node: 'e'});
          }
      });

      // двигаем целые профили
      if(move_shapes.length) {
        for(const profile of move_shapes) {
          profile.selected = true;
        }
        const vertexes = project.mover.snap_to_edges({
          start,
          mode: consts.move_shapes,
          event: {point: start.add(delta), modifiers: {shift: true}},
        });
        project.mover.move_shapes(vertexes);
        project.deselectAll();
        project.register_change(true);
      }

      // двигаем отдельные узлы
      for(const {profile, node} of move_points) {
        const cnn = profile.cnn_point(node);
        if(move_shapes.includes(cnn.profile)) {
          continue;
        }
        profile[node].selected = true;

        const mdelta = project.mover.snap_to_edges({
          start: profile[node],
          mode: consts.move_points,
          event: {point: profile[node].add(delta), modifiers: {shift: true}},
        });
        project.move_points(mdelta);
        project.deselectAll();
        project.register_change(true);
      }

      project.redraw();

    }

  }

  /**
   * Обрабатывает сообщение окна размеров
   * @param event
   */
  sizes_wnd(event) {

    if(event.wnd == this || (this.wnd && event.wnd == this.wnd.wnd)){

      switch (event.name) {
      case 'close':
        if(this.children.text) {
          this.children.text.selected = false;
        }
        this.wnd = null;
        break;

      case 'left':
      case 'right':
        if(this.pos == 'top' || this.pos == 'bottom') {
          this._move_points(event, 'x');
        }
        break;

      case 'top':
      case 'bottom':
        if(this.pos == 'left' || this.pos == 'right') {
          this._move_points(event, 'y');
        }
        break;

      case 'auto':
        const {_attr: {impost, pos, elm1, elm2}, project, layer}  = this;
        const {positions} = $p.enm;
        if(pos == 'top' || pos == 'bottom') {
          event.name = 'right';
          if(impost && elm2.pos === positions.right) {
            event.name = 'left';
          }
          else if(project.contours.length > 1 && layer.is_pos && layer.is_pos('left')) {
            event.name = 'left';
          }
          this._move_points(event, 'x');
        }
        if(pos == 'left' || pos == 'right') {
          event.name = 'top';
          if(impost && elm2.pos === positions.top) {
            event.name = 'bottom';
          }
          else if(project.contours.length > 1) {
            const other = project.contours.find((v) => v !== layer);
            if(layer.bounds.top === other.bounds.top || layer.bounds.height < other.bounds.height) {
              event.name = 'bottom';
            }
          }
          this._move_points(event, 'y');
        }
        break;

      }
    }
  }

  redraw() {

    const {children, path, align, project: {builder_props}} = this;
    if(!children.length){
      return;
    }
    if(!path){
      this.visible = false;
      return;
    }

    // прячем крошечные размеры
    const length = path.length;
    if(length < 1){
      this.visible = false;
      return;
    }
    this.visible = true;

    const b = path.firstSegment.point;
    const e = path.lastSegment.point;
    const normal = path.getNormalAt(0).multiply(this.offset + path.offset);
    const nl = normal.length;
    const ns = nl > 30 ? normal.normalize(nl - 10) : normal;
    const bs = b.add(ns);
    const es = e.add(ns);

    if(children.callout1.segments.length){
      children.callout1.firstSegment.point = b;
      children.callout1.lastSegment.point = b.add(normal);
    }
    else{
      children.callout1.addSegments([b, b.add(normal)]);
    }

    if(children.callout2.segments.length){
      children.callout2.firstSegment.point = e;
      children.callout2.lastSegment.point = e.add(normal);
    }
    else{
      children.callout2.addSegments([e, e.add(normal)]);
    }

    if(children.scale.segments.length){
      children.scale.firstSegment.point = bs;
      children.scale.lastSegment.point = es;
    }
    else{
      children.scale.addSegments([bs, es]);
    }

    children.callout1.visible = !this.hide_c1;
    children.callout2.visible = !this.hide_c2;
    children.scale.visible = !this.hide_line;

    children.text.content = length.round(builder_props.rounding).toString();
    children.text.rotation = e.subtract(b).angle;
    children.text.justification = align.ref;

    const font_size = this._font_size();
    const {isNode} = $p.wsql.alasql.utils;
    children.text.fontSize = font_size;
    if(align == $p.enm.text_aligns.left) {
      children.text.position = bs
        .add(path.getTangentAt(0).multiply(font_size))
        .add(path.getNormalAt(0).multiply(font_size / (isNode ? 1.9 : 2)));
    }
    else if(align == $p.enm.text_aligns.right) {
      children.text.position = es
        .add(path.getTangentAt(0).multiply(-font_size))
        .add(path.getNormalAt(0).multiply(font_size / (isNode ? 1.9 : 2)));
    }
    else {
      children.text.position = bs.add(es).divide(2).add(path.getNormalAt(0).multiply(font_size / (isNode ? 1.9 : 2)));
      if(length < 20) {
        children.text.position = children.text.position.add(path.getTangentAt(0).multiply(font_size / 3));
      }
    }
  }

  get path() {

    const {parent, children, _attr, pos} = this;
    if(!children.length){
      return;
    }
    const {owner_bounds, dimension_bounds} = parent;
    let offset = 0, b, e;

    if(!pos){
      b = typeof _attr.p1 == "number" ? _attr.elm1.corns(_attr.p1) : _attr.elm1[_attr.p1];
      e = typeof _attr.p2 == "number" ? _attr.elm2.corns(_attr.p2) : _attr.elm2[_attr.p2];
    }
    else if(pos == "top"){
      b = owner_bounds.topLeft;
      e = owner_bounds.topRight;
      offset = owner_bounds[pos] - dimension_bounds[pos];
    }
    else if(pos == "left"){
      b = owner_bounds.bottomLeft;
      e = owner_bounds.topLeft;
      offset = owner_bounds[pos] - dimension_bounds[pos];
    }
    else if(pos == "bottom"){
      b = owner_bounds.bottomLeft;
      e = owner_bounds.bottomRight;
      offset = owner_bounds[pos] - dimension_bounds[pos];
    }
    else if(pos == "right"){
      b = owner_bounds.bottomRight;
      e = owner_bounds.topRight;
      offset = owner_bounds[pos] - dimension_bounds[pos];
    }

    // если точки профиля еще не нарисованы - выходим
    if(!b || !e){
      return;
    }

    const path = new paper.Path({ insert: false, segments: [b, e] });

    if(_attr.elm1 && pos){
      b = path.getNearestPoint(_attr.elm1[_attr.p1]);
      e = path.getNearestPoint(_attr.elm2[_attr.p2]);
      if(path.getOffsetOf(b) > path.getOffsetOf(e)){
        [b, e] = [e, b]
      }
      path.firstSegment.point = b;
      path.lastSegment.point = e;
    }
    if(_attr.faltz) {
      b = path.getPointAt(_attr.faltz);
      e = path.getPointAt(path.length - _attr.faltz);
      path.firstSegment.point = b;
      path.lastSegment.point = e;
    }
    path.offset = offset;

    return path;
  }

  get eve() {
    return this.project._scope.eve;
  }

  // размер
  get size() {
    return (this.children.text && parseFloat(this.children.text.content)) || 0;
  }
  set size(v) {
    this.children.text.content = parseFloat(v).round(1);
  }

  // расположение относительно контура $p.enm.pos
  get pos() {
    return this._attr.pos || "";
  }
  set pos(v) {
    this._attr.pos = v;
    this.redraw();
  }

  // отступ от внешней границы изделия
  get offset() {
    return this._attr.offset || 90;
  }
  set offset(v) {
    const offset = (parseInt(v) || 90).round();
    if(this._attr.offset != offset){
      this._attr.offset = offset;
      this.project.register_change(true);
    }
  }

  // расположение надписи
  get align() {
    return (!this._attr.align || this._attr.align == '_') ? $p.enm.text_aligns.center : this._attr.align;
  }
  set align(v) {
    this._attr.align = v;
    this.redraw();
  }

  // сокрытие первой выноски
  get hide_c1() {
    return !!this._attr.hide_c1;
  }
  set hide_c1(v) {
    const {children, _attr} = this
    _attr.hide_c1 = v;
    v && children.callout1.setSelection(false);
    this.redraw();
  }

  // сокрытие второй выноски
  get hide_c2() {
    return !!this._attr.hide_c2;
  }
  set hide_c2(v) {
    const {children, _attr} = this
    _attr.hide_c2 = v;
    v && children.callout2.setSelection(false);
    this.redraw();
  }

  // сокрытие линии
  get hide_line() {
    return !!this._attr.hide_line;
  }
  set hide_line(v) {
    const {children, _attr} = this
    _attr.hide_line = v;
    v && children.scale.setSelection(false);
    this.redraw();
  }

  /**
   * Удаляет элемент из контура и иерархии проекта
   * Одновлеменно, удаляет строку из табчасти табчасти _Координаты_
   */
  remove() {
    if(this._row){
      this._row._owner.del(this._row);
      this._row = null;
      this.project.register_change();
    }
    super.remove();
  }
}


/**
 * ### Размерные линии, определяемые пользователем
 * @class DimensionLineCustom
 * @extends DimensionLine
 * @param attr
 * @constructor
 */
class DimensionLineCustom extends DimensionLine {

  constructor(attr) {

    if(!attr.row){
      attr.row = attr.parent.project.ox.coordinates.add();
    }

    // слой, которому принадлежит размерная линия
    if(!attr.row.cnstr){
      attr.row.cnstr = attr.parent.layer.cnstr;
    }

    // номер элемента
    if(!attr.row.elm){
      attr.row.elm = attr.parent.project.ox.coordinates.aggregate([], ["elm"], "max") + 1;
    }

    super(attr);

  }

  /**
   * Возвращает тип элемента (размерная линия)
   */
  get elm_type() {
    return $p.enm.elm_types.Размер;
  }

  /**
   * Вычисляемые поля в таблице координат
   */
  save_coordinates() {
    const {_row, _attr, elm_type, pos, offset, size, align} = this;

    // сохраняем размер
    _row.len = size;

    // устанавливаем тип элемента
    _row.elm_type = elm_type;

    // сериализованные данные
    const path_data = {
      pos: pos,
      elm1: _attr.elm1.elm,
      elm2: _attr.elm2.elm,
      p1: _attr.p1,
      p2: _attr.p2,
      offset: offset
    };
    if(_attr.fix_angle) {
      path_data.fix_angle = true;
      path_data.angle = _attr.angle;
    }
    if(align == $p.enm.text_aligns.left || align == $p.enm.text_aligns.right) {
      path_data.align = align.ref || align;
    }
    if(_attr.hide_c1) {
      path_data.hide_c1 = true;
    }
    if(_attr.hide_c2) {
      path_data.hide_c2 = true;
    }
    if(_attr.hide_line) {
      path_data.hide_line = true;
    }
    if(_attr.by_curve) {
      path_data.by_curve = true;
    }
    _row.path_data = JSON.stringify(path_data);
  }

  get is_ruler() {
    const {_scope} = this._project;
    const {constructor: {ToolRuler}, tool} = _scope;
    return typeof ToolRuler === 'function' && tool instanceof ToolRuler;
  }

  // выделяем подключаем окно к свойствам
  setSelection(selection) {
    super.setSelection(selection);
    const {project, children, hide_c1, hide_c2, hide_line, is_ruler} = this
    const {tool} = project._scope;
    if(selection) {
      hide_c1 && children.callout1.setSelection(false);
      hide_c2 && children.callout2.setSelection(false);
      hide_line && children.scale.setSelection(false);
    }
    is_ruler && tool.wnd.attach(this);
  }

  // выделяем только при активном инструменте
  _click(event) {
    event.stop();
    if(this.is_ruler){
      this.selected = true;
    }
  }

  _mouseenter() {
    const {project: {_scope}, is_ruler} = this;
    if(is_ruler){
      _scope.canvas_cursor('cursor-arrow-ruler');
    }
    else{
      _scope.canvas_cursor('cursor-arrow-ruler-dis');
    }
  }

  // угол к горизонту в направлении размера
  get angle() {
    if(this.fix_angle) {
      return this._attr.angle || 0;
    }
    const {firstSegment, lastSegment} = this.path;
    return lastSegment.point.subtract(firstSegment.point).angle.round(1);
  }
  set angle(v) {
    this._attr.angle = parseFloat(v).round(1);
    this.project.register_change(true);
  }

  // использование фикс угла
  get fix_angle() {
    return !!this._attr.fix_angle;
  }
  set fix_angle(v) {
    this._attr.fix_angle = v;
    this.project.register_change(true);
  }

  get path() {
    if(this.fix_angle) {
      // рисум линию под требуемым углом из точки 1
      // ищем на линии ближайшую от точки 2
      // рисуем остатки, смещаем на offset

      const {children, _attr} = this;
      if(!children.length){
        return;
      }
      let b = typeof _attr.p1 == "number" ? _attr.elm1.corns(_attr.p1) : _attr.elm1[_attr.p1];
      let e = typeof _attr.p2 == "number" ? _attr.elm2.corns(_attr.p2) : _attr.elm2[_attr.p2];
      // если точки профиля еще не нарисованы - выходим
      if(!b || !e){
        return;
      }

      // дельта
      const d = e.subtract(b);
      // касательная
      const t = d.clone();
      t.angle = this.angle;
      // путь по углу
      const path = new paper.Path({insert: false, segments: [b, b.add(t)]});
      // удлиненный путь
      path.lastSegment.point.add(t.multiply(10000));
      // обрезаем ближайшей точкой к 'e'
      path.lastSegment.point = path.getNearestPoint(e);
      path.offset = 0;
      return path;
    }
    else {
      // если угол не задан, рисуем стандартную линию
      return super.path;
    }
  }
}

EditorInvisible.DimensionLine = DimensionLine;
EditorInvisible.DimensionLineCustom = DimensionLineCustom;

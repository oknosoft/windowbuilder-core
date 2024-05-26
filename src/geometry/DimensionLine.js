import paper from 'paper/dist/paper-core';
import {Profile} from './ProfileItem';

export class DimensionLine extends paper.Group {

  #raw = {};
  
  constructor({owner, parent, row, ...attr}) {

    super({parent, project: attr.project});
    
    this.#raw.row = row;
    this.#raw.owner = owner;

    if(row?.path_data){
      Object.assign(attr, JSON.parse(row.path_data));
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
    const {path_data, contour, ...other} = attr;
    Object.assign(this.#raw, other);

    if(contour){
      this.#raw.contour = true;
    }

    if(!attr.pos && (!attr.elm1 || !attr.elm2)){
      this.remove();
      return;
    }

    // создаём детей
    const {props} = this.project;
    new paper.Path({parent: this, name: 'callout1', strokeColor: 'black', guide: true});
    new paper.Path({parent: this, name: 'callout2', strokeColor: 'black', guide: true});
    new paper.Path({parent: this, name: 'scale', strokeColor: 'black', guide: true});
    new paper.PointText({
      parent: this,
      name: 'text',
      justification: 'center',
      fillColor: 'black',
      fontFamily: props.fontFamily(),
      fontSize: props.fontSize(),
    });
    this.szClick = this.szClick.bind(this);
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
    return this.#raw.pos || '';
    const {pos} = this.#raw;
    const {positions} = $p.enm;
    return (!pos || pos == '_') ? positions.center : positions.get(pos);
  }
  set pos(v) {
    this.#raw.pos = v?.valueOf();
    this.project.redraw();
  }

  // отступ от внешней границы изделия
  get offset() {
    return this.#raw.offset || 90;
  }
  set offset(v) {
    const offset = (parseInt(v) || 90).round();
    if(this.#raw.offset != offset){
      this.#raw.offset = offset;
      this.project.redraw();
    }
  }

  // расположение надписи
  get align() {
    const {align} = this.#raw;
    const {textAligns} = $p.enm;
    return (!align || align == '_') ? textAligns.center : textAligns.get(align);
  }
  set align(v) {
    this.#raw.align = v?.valueOf();
    this.redraw();
  }

  get path() {

    const {children, pos} = this;
    const {owner: {dimensionBounds, bounds: ownerBounds}, elm1, elm2, p1, p2, faltz} = this.#raw;
    if(!children.length){
      return;
    }
    let offset = 0, b, e;

    if(!pos){
      b = typeof p1 == "number" ? elm1.corns(p1) : elm1[p1];
      e = typeof p2 == "number" ? elm2.corns(p2) : elm2[p2];
    }
    else if(pos == "top"){
      b = ownerBounds.topLeft;
      e = ownerBounds.topRight;
      offset = ownerBounds[pos] - dimensionBounds[pos];
    }
    else if(pos == "left"){
      b = ownerBounds.bottomLeft;
      e = ownerBounds.topLeft;
      offset = ownerBounds[pos] - dimensionBounds[pos];
    }
    else if(pos == "bottom"){
      b = ownerBounds.bottomLeft;
      e = ownerBounds.bottomRight;
      offset = ownerBounds[pos] - dimensionBounds[pos];
    }
    else if(pos == "right"){
      b = ownerBounds.bottomRight;
      e = ownerBounds.topRight;
      offset = ownerBounds[pos] - dimensionBounds[pos];
    }

    // если точки профиля еще не нарисованы - выходим
    if(!b || !e){
      return;
    }

    const path = new paper.Path({ insert: false, segments: [b, e] });

    if(elm1 && pos){
      b = path.getNearestPoint(elm1[p1].point);
      e = path.getNearestPoint(elm2[p2].point);
      if(path.getOffsetOf(b) > path.getOffsetOf(e)){
        [b, e] = [e, b]
      }
      path.firstSegment.point = b;
      path.lastSegment.point = e;
    }
    if(faltz) {
      b = path.getPointAt(faltz);
      e = path.getPointAt(path.length - faltz);
      path.firstSegment.point = b;
      path.lastSegment.point = e;
    }
    path.offset = offset;

    return path;
  }

  divByPos() {
    const {children, size, pos, project: {view}} = this;
    const point = view.projectToView(children.text.bounds.center);
    const tip = 'Установить размер сдвигом элементов ';
    const div = this.div = document.createElement('DIV');
    div.classList.add('sz_div');
    if(pos === 'left' || pos === 'right') {
      div.innerHTML = `<div id="sz_btn_top" class="sz_btn tb_align_vert" title="${tip}сверху"></div>
<input class="sz_input" type="number" step="10" value="${size.toFixed()}"/>
<div id="sz_btn_bottom" class="sz_btn tb_align_vert" title="${tip}снизу"></div>
<div id="sz_btn_rateably" class="sz_btn tb_align_vert2" title="${tip}пропорционально"></div>`;
      div.style.top = `${point.y - 37}px`;
      div.style.left = `${point.x - 29}px`;
    }
    else if(pos === 'top' || pos === 'bottom') {
      div.innerHTML = `<div class="sz_div2">
    <div id="sz_btn_left" class="sz_btn tb_align_hor" title="${tip}слева"></div>
    <input class="sz_input" type="number" step="10" value="${size.toFixed()}"/>
    <div id="sz_btn_right" class="sz_btn tb_align_hor" title="${tip}справа"></div>
</div>
<div id="sz_btn_rateably" class="sz_btn tb_align_hor2" title="${tip}пропорционально"></div>`;
      div.style.top = `${point.y - 12}px`;
      div.style.left = `${point.x - 59}px`;
    }
    else {
      div.innerHTML = `<div id="sz_btn_top" class="sz_btn tb_align_vert" title="${tip}сверху"></div>
<div class="sz_div2">
    <div id="sz_btn_left" class="sz_btn tb_align_hor" title="${tip}слева"></div>
    <input class="sz_input" type="number" step="10" value="${size.toFixed()}"/>
    <div id="sz_btn_right" class="sz_btn tb_align_hor" title="${tip}справа"></div>
</div>
<div id="sz_btn_bottom" class="sz_btn tb_align_vert" title="${tip}снизу"></div>`;
      div.style.top = `${point.y - 37}px`;
      div.style.left = `${point.x - 49}px`;
    }
    view.element.parentNode.appendChild(div);
    return div;
  }
  
  /**
   * @summary Создаёт поле ввода и кнопки уточнения размера
   */
  szStart(ev) {
    ev?.stop();
    this.szFin();
    Promise.resolve().then(() => {
      const div = this.divByPos();
      const input = this.input = div.querySelector('.sz_input');
      input.focus();
      input.select();
      input.onkeydown = this.szKeydown.bind(this);
      div.parentNode.addEventListener('mousedown', this.szClick);
    });
  }

  /**
   * @summary Обработчик клика кнопок размера
   */
  szClick(ev) {
    const {target} = ev;
    if(target === this.input) {
      return;
    }
    const {id} = target;
    const size = parseFloat(this.input.value);
    this.szFin();
    if(id?.startsWith('sz_btn')) {
      const attr = {wnd: this, size, name: id.substring(7)};
      this.szMsg(attr);
      // const {elm1, elm2} = this.#raw;
      // if(!elm1 && !elm2) {
      //   this._scope.deffered_zoom_fit();
      // }
    }
  }

  /**
   * @summary Обработчик нажатия кнопок в поле ввода
   */
  szKeydown(ev) {
    const {key, altKey} = ev;
    if (key === 'Escape' || key === 'Tab') {
      this.szFin();
    }
    else if (key === 'Enter' || (altKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key))) {
      ev.preventDefault();
      ev.stopPropagation();
      const {input} = this;
      const attr = {
        wnd: this,
        size: parseFloat(input.value),
      };
      switch (key) {
        case 'Enter':
          attr.name = altKey ? 'rateably' : 'auto';
          break;
        case 'ArrowUp':
          attr.name = 'top';
          break;
        case 'ArrowDown':
          attr.name = 'bottom';
          break;
        default:
          attr.name = key.substring(5).toLowerCase();
      }
      this.szFin();
      this.szMsg(attr);
      // const {elm1, elm2} = this.#raw;
      // if(!elm1 && !elm2) {
      //   this._scope.deffered_zoom_fit();
      // }
    }
  }

  /**
   * @summary При окончании ввода размера, удаляем HTMLElement
   */
  szFin() {
    const {div, szClick} = this;
    if (div) {
      div.parentNode.removeEventListener('mousedown', szClick);
      div.parentNode.removeChild(div);
      this.div = null;
      this.input = null;
    }
  }

  /**
   * @summary Обрабатывает сообщение окна размеров
   * @param {Object} ev
   */
  szMsg(ev) {

    if(ev.wnd == this){
      const {pos} = this;

      switch (ev.name) {
        case 'close':
          if(this.children.text) {
            this.children.text.selected = false;
          }
          this.wnd = null;
          break;

        case 'left':
        case 'right':
          if(!pos || pos == 'top' || pos == 'bottom') {
            this.movePoints(ev, 'x');
          }
          break;

        case 'top':
        case 'bottom':
          if(!pos || pos == 'left' || pos == 'right') {
            this.movePoints(ev, 'y');
          }
          break;

        case 'rateably':
          ev.divide = 2;
          if(pos == 'left' || pos == 'right') {
            ev.name = 'top';
            ev.cb = () => {
              delete ev.cb;
              delete ev.divide;
              ev.name = 'bottom';
              this.movePoints(ev, 'y');
            }
            this.movePoints(ev, 'y');
          }
          else if(pos == 'top' || pos == 'bottom') {
            ev.name = 'left';
            ev.cb = () => {
              delete ev.cb;
              delete ev.divide;
              ev.name = 'right';
              this.movePoints(ev, 'x');
            }
            this.movePoints(ev, 'x');
          }
          break;

        case 'auto':
          const {project, layer}  = this;
         const {impost, elm1, elm2}  = this.#raw;
          const {positions} = $p.enm;
          if(pos == 'top' || pos == 'bottom') {
            ev.name = 'right';
            if(impost && elm2.pos === positions.right) {
              ev.name = 'left';
            }
            else if(project.contours.length > 1 && layer.isPos?.('left')) {
              ev.name = 'left';
            }
            this.movePoints(ev, 'x');
          }
          if(pos == 'left' || pos == 'right') {
            ev.name = 'top';
            if(impost && elm2.pos === positions.top) {
              ev.name = 'bottom';
            }
            else if(project.contours.length > 1) {
              const other = project.contours.find((v) => v !== layer);
              if(layer.bounds.top === other.bounds.top || layer.bounds.height < other.bounds.height) {
                ev.name = 'bottom';
              }
            }
            this.movePoints(ev, 'y');
          }
          break;

      }
    }
  }

  correctMoveName({event, p1, p2}) {
    
  }
  
  movePoints(event, xy) {
    let _bounds, delta;

    const {pos, project} = this;
    const {owner, elm1, elm2, ..._attr} = this.#raw;
    const {Point} = paper;

    // получаем дельту - на сколько смещать
    if(elm1){

      // в _bounds[event.name] надо поместить координату по x или у (в зависисмости от xy), которую будем двигать
      _bounds = {};

      const p1 = (elm1._sub || elm1)[_attr.p1].point;
      const p2 = (elm2._sub || elm2)[_attr.p2].point;
      this.correctMoveName({event, p1, p2, _attr});

      if(pos == 'top' || pos == 'bottom' || (!pos && (event.name == 'right' || event.name == 'left'))) {
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
      _bounds = owner.bounds;
      if(!pos || pos == 'top' || pos == 'bottom') {
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
      if(typeof event.divide === 'number') {
        delta = delta.divide(event.divide);
      }
      project.deselectAll();
      for(let {b, e, generatrix, width} of project.getItems({class: Profile})) {
        width = width / 2 + 1;
        if(Math.abs(b.point[xy] - _bounds[event.name]) < width && Math.abs(e.point[xy] - _bounds[event.name]) < width){
          generatrix.segments.forEach((segm) => segm.selected = true)
        }
        else if(Math.abs(b.point[xy] - _bounds[event.name]) < width){
          generatrix.firstSegment.selected = true;
        }
        else if(Math.abs(e.point[xy] - _bounds[event.name]) < width){
          generatrix.lastSegment.selected = true;
        }
      }
      delta._dimln = true;
      owner.mover.prepareMovePoints(true);
      owner.mover.tryMovePoints(new paper.Point, delta);
      if(owner.mover.applyMovePoints()) {
        project.props.registerChange();
      }
      project.deselectAll(true);
      project.redraw();
    }
  }
  
  redraw() {
    const {children, path, align, project: {props}} = this;

    if(!path){
      this.visible = false;
      return;
    }

    // прячем крошечные размеры
    const {length} = path;
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

    children.text.content = length.round(length > 220 ? props.rounding : 0).toString();
    children.text.rotation = e.subtract(b).angle;
    children.text.justification = align.valueOf();

    const fontSize = props.fontSize()
    children.text.fontSize = length < 220 ? fontSize * 0.8 : fontSize;
    if(align.is('left')) {
      children.text.position = bs
        .add(path.getTangentAt(0).multiply(fontSize))
        .add(path.getNormalAt(0).multiply(fontSize / 2));
    }
    else if(align.is('right')) {
      children.text.position = es
        .add(path.getTangentAt(0).multiply(-fontSize))
        .add(path.getNormalAt(0).multiply(fontSize / 2));
    }
    else {
      children.text.position = bs.add(es).divide(2).add(path.getNormalAt(0).multiply(fontSize / 2));
      if(length < 20) {
        children.text.position = children.text.position.add(path.getTangentAt(0).multiply(fontSize / 3));
      }
    }
  }
}

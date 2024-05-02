import paper from 'paper/dist/paper-core';

export class DimensionLine extends paper.Group {

  #raw = {};
  
  constructor(attr) {

    super({parent: attr.parent, project: attr.project});
    
    this.#raw.row = attr.row;

    if(attr.row?.path_data){
      Object.assign(attr, JSON.parse(attr.row.path_data));
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
    const {path_data, row, contour, ...other} = attr;
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

    const {parent: {dimensionBounds, ownerBounds}, children, pos} = this;
    const raw = this.#raw;
    if(!children.length){
      return;
    }
    let offset = 0, b, e;

    if(!pos){
      b = typeof raw.p1 == "number" ? raw.elm1.corns(raw.p1) : raw.elm1[raw.p1];
      e = typeof raw.p2 == "number" ? raw.elm2.corns(raw.p2) : raw.elm2[raw.p2];
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

    if(raw.elm1 && pos){
      b = path.getNearestPoint(raw.elm1[raw.p1].point);
      e = path.getNearestPoint(raw.elm2[raw.p2].point);
      if(path.getOffsetOf(b) > path.getOffsetOf(e)){
        [b, e] = [e, b]
      }
      path.firstSegment.point = b;
      path.lastSegment.point = e;
    }
    if(raw.faltz) {
      b = path.getPointAt(raw.faltz);
      e = path.getPointAt(path.length - raw.faltz);
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

      switch (ev.name) {
        case 'close':
          if(this.children.text) {
            this.children.text.selected = false;
          }
          this.wnd = null;
          break;

        case 'left':
        case 'right':
          if(this.pos == 'top' || this.pos == 'bottom') {
            this.movePoints(ev, 'x');
          }
          break;

        case 'top':
        case 'bottom':
          if(this.pos == 'left' || this.pos == 'right') {
            this.movePoints(ev, 'y');
          }
          break;

        case 'rateably':
          ev.divide = 2;
          if(this.pos == 'left' || this.pos == 'right') {
            ev.name = 'top';
            ev.cb = () => {
              delete ev.cb;
              delete ev.divide;
              ev.name = 'bottom';
              this.movePoints(ev, 'y');
            }
            this.movePoints(ev, 'y');
          }
          else if(this.pos == 'top' || this.pos == 'bottom') {
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
          const {_attr: {impost, pos, elm1, elm2}, project, layer}  = this;
          const {positions} = $p.enm;
          if(pos == 'top' || pos == 'bottom') {
            ev.name = 'right';
            if(impost && elm2.pos === positions.right) {
              ev.name = 'left';
            }
            else if(project.contours.length > 1 && layer.is_pos && layer.is_pos('left')) {
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

  movePoints(ev, xy) {
    
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

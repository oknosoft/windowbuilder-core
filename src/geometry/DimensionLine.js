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

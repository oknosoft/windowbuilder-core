
/*
 * ### Размерная линия угла между лучами
 * Created 19.05.2023
 */

class DimensionAngle extends DimensionLineCustom {

  constructor(attr) {
    super(attr);
    const {p1, p2, o, through, pos, content} = attr;
    const {callout1, callout2, scale, text} = this.children;
    text.content = content;
    text.position = pos;
    callout1.addSegments([o, p1]);
    callout2.addSegments([o, p2]);
    const tmp = new paper.Path.Arc({
      from: p1,
      through: through,
      to: p2,
      insert: false,
    });
    scale.addSegments(tmp.segments);
  }

  /**
   * Возвращает тип элемента (Угол)
   * @type {EnmElm_types}
   */
  get elm_type() {
    return $p.enm.elm_types.Угол;
  }

  save_coordinates() {
    const {_row, _attr, elm_type, children: {callout1, callout2, scale, text}} = this;

    // сохраняем размер
    _row.len = parseFloat(text.content);

    // устанавливаем тип элемента
    _row.elm_type = elm_type;

    // сериализованные данные
    const through = scale.getPointAt(scale.length / 2);
    const path_data = {
      o: [callout1.firstSegment.point.x, callout1.firstSegment.point.y],
      p1: [callout1.lastSegment.point.x, callout1.lastSegment.point.y],
      p2: [callout2.lastSegment.point.x, callout2.lastSegment.point.y],
      through: [through.x, through.y],
      pos: [text.position.x, text.position.y],
      content: text.content,
    };
    _row.path_data = JSON.stringify(path_data);
  }

  is_disabled() {
    return true;
  }

  get path() {
    return this.children.scale;
  }

  redraw() {
    const {children, _attr, path, align} = this;
    if(!path){
      this.visible = false;
      return;
    }
    this.visible = true;
  }

}

EditorInvisible.DimensionAngle = DimensionAngle;

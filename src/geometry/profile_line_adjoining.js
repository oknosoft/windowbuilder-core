
/**
 *
 *
 * @module profile_connective_adjoining
 *
 * Created by Evgeniy Malyarov on 18.03.2021.
 */

/**
 * ### Виртуальный профиль примыкания
 * Класс описывает поведение внешнего примыкания к рамам изделия
 *
 * - у примыкания есть координаты конца и начала, такие же, как у Profile
 * - концы соединяются с пустотой
 * - имеет как минимум одно ii примыкающее соединение
 * - есть путь образующей - прямая или кривая линия, такая же, как у Profile
 * - слвиг и искривление пути передаются примыкающим профилям
 * - живёт в том же слое, что и рамные профили
 * - длина может отличаться от длин профилей, к которым он примыкает
 *
 * @class ProfileAdjoining
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @constructor
 * @extends ProfileConnectiveOuter
 */
class ProfileAdjoining extends BaseLine {

  constructor({row, parent, proto, b, e, side, project}) {
    const generatrix = b && e && parent.rays[side].get_subpath(e.elm[e.point], b.elm[b.point]);
    super({row, generatrix, parent, proto, preserv_parent: true, project});
    Object.assign(this.generatrix, {
      strokeColor: 'black',
      strokeOpacity: 0.7,
      strokeWidth: 10,
      dashArray: [],
      dashOffset: 0,
      strokeScaling: true,
    });
    Object.assign(this.path, {
      strokeColor: 'white',
      strokeOpacity: 1,
      strokeWidth: 0,
      fillColor: 'grey',
      opacity: 0.1,
    });
    this.selected_cnn_ii();
  }

  /**
   * Возвращает тип элемента (соединитель)
   */
  get elm_type() {
    return $p.enm.elm_types.Примыкание;
  }

  /**
   * Описание полей диалога свойств элемента
   */
  get oxml() {
    return ProfileAdjoining.oxml;
  }

  /**
   * Возвращает массив примыкающих рам
   */
  joined_nearests() {
    return [this.parent];
  }

  /**
   * У примыкания, внешний равен родителю
   */
  nearest() {
    return this.parent;
  }

  selected_cnn_ii() {
    const {parent, elm, ox, _attr} = this;
    const find = {elm1: parent.elm, elm2: elm, node1: '', node2: ''};
    const row = ox.cnn_elmnts.find(find) || ox.cnn_elmnts.add(find);
    if(!_attr._nearest_cnn || _attr._nearest_cnn.empty()) {
      if(row.cnn.empty()) {
        const {enm: {cnn_types}, cat: {cnns}} = $p;
        _attr._nearest_cnn = cnns.elm_cnn(parent, this, cnn_types.acn.ii, null, true);
      }
      else {
        _attr._nearest_cnn = row.cnn;
      }
    }
    if(row.cnn.empty() && _attr._nearest_cnn) {
      row.cnn = _attr._nearest_cnn;
    }
    return {elm: parent, row};
  }

  save_coordinates() {
    super.save_coordinates();
    const {_row, parent} = this;
    const {row} = this.selected_cnn_ii();
    _row.parent = parent.elm;
    row.aperture_len = this.generatrix.length.round(1);
  }

  setSelection(selection) {
    super.setSelection(selection);
    const {generatrix, path, children} = this;
    for(const child of children) {
      if(child !== generatrix && child !== path) {
        child.setSelection(0);
      }
    }
  }

  redraw(mode) {
    const {generatrix, path, children} = this;
    for(const child of [].concat(children)) {
      if(child !== generatrix && child !== path) {
        child.remove();
      }
    }
    const {length} = generatrix;
    for(let pos = 25; pos < length - 75; pos += 90) {
      const pt = generatrix.getPointAt(pos);
      const pn = generatrix.getNormalAt(pos).rotate(30).multiply(120);
      const ln = new paper.Path({
        segments: [pt, pt.add(pn)],
        strokeColor: 'black',
        strokeOpacity: 0.7,
        strokeWidth: 2,
        strokeScaling: true,
        guide: true,
        parent: this,
      });
    }
    if(mode !== 'compact') {
      let proto = generatrix.clone({insert: false}).equidistant(10);
      const outer = path.clone();
      //outer.parent = this;
      outer.addSegments(proto.segments)
      proto = proto.equidistant(80);
      proto.reverse();
      outer.addSegments(proto.segments);
      outer.closePath();
    }
  }
}

ProfileAdjoining.oxml = {
  ' ': [
    {id: 'info', path: 'o.info', type: 'ro'},
    'inset',
    //'clr',
  ],
  Начало: ['x1', 'y1'],
  Конец: ['x2', 'y2'],
  Соединение: ['cnn3'],
};

EditorInvisible.ProfileAdjoining = ProfileAdjoining;

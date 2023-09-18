
/*
 *
 *
 * @module profile_adjoining
 *
 * Created by Evgeniy Malyarov on 18.03.2021.
 */

/**
 * @summary Виртуальный профиль примыкания
 * @desc Класс описывает поведение внешнего примыкания к рамам изделия
 *
 * - у примыкания есть координаты конца и начала, такие же, как у Profile
 * - концы соединяются с пустотой
 * - имеет как минимум одно ii примыкающее соединение
 * - есть путь образующей - прямая или кривая линия, такая же, как у Profile
 * - слвиг и искривление пути передаются примыкающим профилям
 * - живёт в том же слое, что и рамные профили
 * - длина может отличаться от длин профилей, к которым он примыкает
 *
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @extends ProfileConnective
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
   * Возвращает массив примыкающих рам
   */
  joined_nearests() {
    return [this.parent];
  }

  /**
   * У примыкания, внешний равен родителю
   * @override
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
    ProfileItem.prototype.save_coordinates.call(this);
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

  get length() {
    return Object.getOwnPropertyDescriptor(ProfileItem.prototype, 'length').get.call(this);
  }

  corns(n) {
    const {_attr} = this;
    if([1, 4, 5, 7].includes(n)) {
      return _attr._corns[1];
    }
    else {
      return _attr._corns[2];
    }
  }

  redraw(mode) {
    const {cat: {cnns}, enm: {cnn_types}} = $p;
    const {generatrix, path, children, _attr, _row, rays, project} = this;
    for(const child of [].concat(children)) {
      if(child !== generatrix && child !== path) {
        child.remove();
      }
    }
    const {length} = generatrix;
    if(!rays.b.cnn) {
      const elm2 = {elm: 0, _row};
      rays.b.cnn = cnns.elm_cnn(this, null, cnn_types.acn.i, project.elm_cnn(this, elm2), false);
    }
    if(!rays.e.cnn) {
      const elm2 = {elm: 0, _row};
      rays.e.cnn = cnns.elm_cnn(this, null, cnn_types.acn.i, project.elm_cnn(this, elm2), false);
    }    
    
    _attr._corns.length = 0;
    const szb = rays.b.cnn?.size(this) || 0;
    const sze = rays.e.cnn?.size(this) || 0;
    _attr._corns[1] = this.b.add(generatrix.getTangentAt(0).negate().normalize(szb));
    _attr._corns[2] = this.e.add(generatrix.getTangentAt(length).normalize(sze));    
    
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

EditorInvisible.ProfileAdjoining = ProfileAdjoining;

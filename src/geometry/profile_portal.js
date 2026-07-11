
/**
 * @summary Профиль проёма
 * @desc Описывает поведение ребра проёма
 *
 * - у него есть координаты конца и начала, такие же, как у Profile
 * - концы соединяются другими профилямитолько по углам - Т и разрывы запрещены
 * - в него встраиваются рамы
 * - есть путь образующей - прямая или кривая линия, такая же, как у Profile
 * - слвиг и искривление пути передаются примыкающим профилям
 * - живёт в том же слое, что и соединители
 *
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @extends BaseLine
 */
class ProfilePortal extends BaseLine {

  constructor({row, proto, b, e, project}) {
    const generatrix = b && e && new paper.Path({insert: false, segments: [b, e]});
    super({row, generatrix, proto, project});
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
    return $p.enm.elm_types.portal;
  }

  /**
   * Возвращает массив примыкающих рам
   */
  joined_nearests() {
    return [];
  }

  /**
   * У проёма, нет внешнего соединения
   * @override
   */
  nearest() {
    return null;
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
    if(rays) {
      if(!rays.b.cnn) {
        const elm2 = {elm: 0, _row};
        rays.b.cnn = cnns.elm_cnn(this, null, cnn_types.acn.i, project.elm_cnn(this, elm2), false);
      }
      if(!rays.e.cnn) {
        const elm2 = {elm: 0, _row};
        rays.e.cnn = cnns.elm_cnn(this, null, cnn_types.acn.i, project.elm_cnn(this, elm2), false);
      }
    }
    
    const szb = rays?.b?.cnn?.size(this) || 0;
    const sze = rays?.e?.cnn?.size(this) || 0;
    if(_attr) {
      _attr._corns.length = 0;
      _attr._corns[1] = this.b.add(generatrix.getTangentAt(0).negate().normalize(szb));
      _attr._corns[2] = this.e.add(generatrix.getTangentAt(length).normalize(sze));
    }
    
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

EditorInvisible.ProfilePortal = ProfilePortal;

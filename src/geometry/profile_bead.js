
/**
 * @summary Штапик
 * @desc Класс описывает поведение штапика
 *
 * - похож в поведении на доборный профиль, но не "толкает" заполнение
 * - у штапика есть координаты конца и начала, такие же, как у Profile
 * - имеет одно ii примыкающее соединение
 * - есть путь образующей - прямая или кривая линия - фрагмент родительской образующей
 * - длина штапика отличается от длины ведущего элемента
 *
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @extends ProfileItem
 */
class ProfileGlBead extends ProfileItem {

  constructor(attr) {

    super(attr);

    const {project, _attr, _row} = this;

    _attr.generatrix.strokeWidth = 0;

    if(!attr.side && _row.parent < 0) {
      attr.side = 'outer';
    }

    _attr.side = attr.side || 'inner';

    if(!_row.parent){
      _row.parent = this.parent.elm;
      if(this.outer){
        _row.parent = -_row.parent;
      }
    }

  }

  /** @override */
  get d0() {
    const nearest = this.nearest();
    return this._attr._nearest_cnn ? -this._attr._nearest_cnn.size(this, nearest) : 0;
  }

  /**
   * К штапикам импосты не крепятся
   * @override
   */
  joined_imposts(check_only) {
    return ProfileConnective.prototype.joined_imposts.call(this, check_only);
  }

  /**
   * Возвращает истина, если соединение с наружной стороны
   */
  get outer() {
    return this._attr.side == 'outer';
  }

  /**
   * Возвращает тип элемента (Штапик)
   */
  get elm_type() {
    return $p.enm.elm_types.glbead;
  }

  /**
   * @summary Заполнение, к которому примыкает штапик
   * @type Filling
   */
  get glass() {
    return this.project.getItem({class: Filling});
  }

  /**
   * @summary Соседние штапики
   * @type Array.<ProfileGlBead>
   */
  get brothers() {
    return this.project.getItems({class: ProfileGlBead});
  }

  /**
   * @summary Примыкающий внешний элемент
   * @desc У штапика, равен родителю
   * @override
   */
  nearest() {
    const {_attr, parent, project} = this;
    const _nearest_cnn = _attr._nearest_cnn || project.elm_cnn(this, parent);
    _attr._nearest_cnn = $p.cat.cnns.elm_cnn(this, parent, $p.enm.cnn_types.acn.ii, _nearest_cnn, true);
    return parent;
  }

  /**
   * @override
   * @return {CnnPoint}
   */
  cnn_point(node, point) {

    const res = this.rays[node];

    const check_distance = (elm) => {

        if(elm == this){
          return;
        }

        const gp = elm.generatrix.getNearestPoint(point);
        let distance;

        if(gp && (distance = gp.getDistance(point)) < consts.sticking){
          if(distance <= res.distance){
            res.point = gp;
            res.distance = distance;
            res.profile = elm;
          }
        }
      };

    if(!point){
      point = this[node];
    }

    // Если привязка не нарушена, возвращаем предыдущее значение
    if(res.profile && res.profile.children.length){
      check_distance(res.profile);
      if(res.distance < consts.sticking){
        return res;
      }
    }

    // TODO вместо полного перебора профилей контура, реализовать анализ текущего соединения и успокоиться, если соединение корректно
    res.clear();
    res.cnn_types = $p.enm.cnn_types.acn.a;
    this.brothers.forEach(check_distance);
    
    return res;
  }
  
}

EditorInvisible.ProfileGlBead = ProfileGlBead;

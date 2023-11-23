
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

    const {layer, _attr, _row} = this;

    _attr.generatrix.strokeWidth = 0;

    // parent
    if(!_row.parent && attr.profile){
      _row.parent = (this.outer ? -1 : 1) * attr.profile.elm;
      _attr.profile = attr.profile;
    }
    
    // side
    if(!attr.side && _row.parent < 0) {
      attr.side = 'outer';
    }
    _attr.side = attr.side || 'inner';
    
    // profile
    _attr.profile = attr.profile || layer.getItem({elm: Math.abs(_row.parent)});
    
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
    const {_attr} = this;
    if(!_attr.glass) {
      for(const filling of this.layer.glasses(false, true)) {
        if(filling.profiles.some(({sub_path}) => {
          if(sub_path.firstSegment.point.is_nearest(this.b, 600) && sub_path.lastSegment.point.is_nearest(this.e, 600)) {
            _attr.glass = filling;
            return true;
          }
        })) {
          break;
        }
      }
    }
    return _attr.glass || this.layer.getItem({class: Filling});
  }

  /**
   * Ведущий профиль
   * @type Profile
   */
  get profile() {
    return this._attr.profile;
  }

  /**
   * Ребро заполнения
   * @type GlassSegment
   */
  get rib() {
    const {glass, profile} = this;
    for(const rib of glass.profiles) {
      if(rib.profile === profile) {
        return rib;
      }
    }
  }

  /**
   * @summary Соседние штапики
   * @type Array.<ProfileGlBead>
   */
  get brothers() {
    return this.glass.glbeads;
  }

  /**
   * @summary Примыкающий внешний элемент
   * @desc У штапика, равен родителю
   * @override
   */
  nearest() {
    const {_attr, profile, project} = this;
    const _nearest_cnn = _attr._nearest_cnn || project.elm_cnn(this, profile);
    _attr._nearest_cnn = $p.cat.cnns.elm_cnn(this, profile, $p.enm.cnn_types.acn.ii, _nearest_cnn, true);
    return profile;
  }

  get glbeads() {
    return [];
  }

  observer() {
    
  }

  do_bind() {
    const {rib, glass, profile, b, e, generatrix, _attr: {side, _rays}} = this;
    const {profiles} = glass;
    const index = profiles.indexOf(rib);
    const prev = index === 0 ? profiles[profiles.length - 1] : profiles[index - 1]; 
    const next = index === (profiles.length - 1) ? profiles[0] : profiles[index + 1]; 
    const ray = profile.rays[side];
    const pray = prev.profile.rays[prev.outer ? 'outer' : 'inner'];
    const nray = next.profile.rays[next.outer ? 'outer' : 'inner'];
    const rb = pray.intersect_point(ray, b);
    const re = nray.intersect_point(ray, e);

    if(!rb.is_nearest(b, 0) || !re.is_nearest(e, 0)) {
      const sub_path = ray.get_subpath(rb, re);
      if(sub_path.length) {
        generatrix.removeSegments();
        generatrix.addSegments(sub_path.segments);
        _rays.clear();
        const {brothers} = this;
        const pglb = brothers.find(({profile}) => profile === prev.profile);
        const nglb = brothers.find(({profile}) => profile === next.profile);
        pglb?.do_bind();
        nglb?.do_bind();
      }
    }
  }

  draw_regions() {
    return this;
  }

  /**
   * @override
   * @return {ProfileGlBead}
   */
  redraw() {
    this.do_bind();
    return super.redraw();
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


/*
 * Created 29.06.2025
 */


/**
 * @summary Дополнительный профиль снаружи
 * @desc Класс описывает поведение расширительного профиля
 *
 * - похож в поведении на соединитель, но расположен в том же слое, что и ведущий элемент
 * - у внешнего добора есть координаты конца и начала, такие же, как у Profile
 * - могут быть Т - соединения, как у импоста
 * - концы соединяются с пустотой или другими внешними доборами
 * - имеет одно ii примыкающее соединение
 * - есть путь образующей - прямая или кривая линия, такая же, как у ведущей рамы или створки
 * - длина дополнительного профиля может отличаться от длины ведущего элемента
 *
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @extends ProfileItem
 */
class ProfileAddlOuter extends ProfileItem {

  constructor(attr) {

    const fromCoordinates = !!attr.row;

    super(attr);

    const {project, _attr, _row} = this;

    _attr.generatrix.strokeWidth = 0;

    if(!attr.side && _row.parent < 0) {
      attr.side = 'outer';
    }

    _attr.side = attr.side || 'inner';
    _attr.old = {};

    if(!_row.parent){
      _row.parent = this.parent.elm;
      if(this.outer){
        _row.parent = -_row.parent;
      }
    }

    // ищем и добавляем доборы к доборам
    if(fromCoordinates){
      const {cnstr, elm} = attr.row;
      project.ox.coordinates.find_rows({cnstr, parent: {in: [elm, -elm]}, elm_type: $p.enm.elm_types.addition_outer}, (row) => new ProfileAddlOuter({row, parent: this}));
    }

  }

  /** @override */
  get d0() {
    const nearest = this.nearest();
    const {_nearest_cnn} = this._attr;
    return _nearest_cnn ? _nearest_cnn.size(this, nearest) : 0;
  }

  /**
   * Возвращает истина, если соединение с наружной стороны
   */
  get outer() {
    return this._attr.side == 'outer';
  }

  /**
   * Возвращает тип элемента (Добор)
   */
  get elm_type() {
    return $p.enm.elm_types.addition_outer;
  }

  /**
   * @summary Примыкающий внешний элемент
   * @desc У добора, равен родителю
   * @override
   */
  nearest() {
    const {_attr, parent, project} = this;
    const _nearest_cnn = _attr._nearest_cnn || project.elm_cnn(this, parent);
    _attr._nearest_cnn = $p.cat.cnns.elm_cnn(parent, this, $p.enm.cnn_types.acn.ii, _nearest_cnn, true);
    return parent;
  }

  get pos() {
    return this.parent.pos;
  }

  /**
   * @override
   * @return {CnnPoint}
   */
  cnn_point(node, point) {

    const res = this.rays[node];

    const check_distance = (elm, with_addl) => {

        if(elm == this || elm == this.parent){
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

        if(with_addl){
          elm.getItems({class: ProfileAddlOuter, parent: elm}).forEach((addl) => {
            check_distance(addl, with_addl);
          });
        }

      };

    if(!point){
      point = this[node];
    }

    // Если привязка не нарушена, возвращаем предыдущее значение
    // if(res.profile?.children?.length){
    //   check_distance(res.profile);
    //   if(res.distance < consts.sticking){
    //     return res;
    //   }
    // }

    // TODO вместо полного перебора профилей контура, реализовать анализ текущего соединения и успокоиться, если соединение корректно
    res.clear();
    //res.cnn_types = $p.enm.cnn_types.acn.i;

    //this.layer.profiles.forEach((addl) => check_distance(addl, true));

    return res;
  }
  
  /**
   * Вспомогательная функция обсервера, выполняет привязку узлов добора
   */
  do_bind(p, bcnn, ecnn, moved) {

    const gen = (this.outer ? this.parent.rays.outer : this.parent.rays.inner).equidistant(this.width);

    const bind_node = (node, cnn) => {
      const old = this._attr.old[node];

      const parent = this.parent.corns(this.outer ? (node === 'b' ? 1 : 2) : (node === 'b' ? 4 : 3)).clone();
      const mpoint = cnn.profile?.generatrix?.intersect_point(gen, cnn.point, 'nearest') ||
        gen.getNearestPoint(old ? parent.add(old.delta) : this[node]);
      if(!mpoint.is_nearest(this[node], 0)) {
        this[node] = mpoint;
      }
      this._attr.old[node] = {point: mpoint, parent, delta: mpoint.subtract(parent)};
    };

    // при смещениях родителя, даигаем образующую
    if(this.parent == p) {
      bind_node('b', bcnn);
      bind_node('e', ecnn);
    }
    if(bcnn.cnn && bcnn.profile == p) {
      bind_node('b', bcnn);
    }
    if(ecnn.cnn && ecnn.profile == p) {
      bind_node('e', ecnn);
    }

  }

  observer(an) {
    const {profiles} = an;
    if(profiles) {
      let binded;
      if(!profiles.includes(this)) {
        for(const profile of profiles) {
          if(profile instanceof Onlay) {
            continue;
          }
          binded = true;
          this.do_bind(profile, this.cnn_point('b'), this.cnn_point('e'), an);
        }
        binded && profiles.push(this);
      }
    }
    else if(an instanceof Profile || an instanceof ProfileAddlOuter) {
      this.do_bind(an, this.cnn_point('b'), this.cnn_point('e'));
    }
  }

  move_points(delta, all_points, start_point) {
    if(delta?.length && !delta._dimln) {
      const gen = this.e.subtract(this.b);
      const projection = delta.project(gen);
      if(projection.length > 0.01) {
        this._attr.old.b = null;
        this._attr.old.e = null;
        return super.move_points(projection, all_points, start_point);
      }
    }
  }
  
  redraw() {
    super.redraw();
    const visible = this.project.builder_props.cnns !== false;
    for(const path of this.children) {
      path.visible = visible;
    }    
    return this.draw_articles();
  }

}

EditorInvisible.ProfileAddlOuter = ProfileAddlOuter;

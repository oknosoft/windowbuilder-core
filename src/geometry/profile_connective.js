
/**
 * Соединительный профиль
 * Класс описывает поведение соединительного профиля
 *
 * - у соединительного профиля есть координаты конца и начала, такие же, как у Profile
 * - концы соединяются с пустотой
 * - имеет как минимум одно ii примыкающее соединение
 * - есть путь образующей - прямая или кривая линия, такая же, как у Profile
 * - слвиг и искривление пути передаются примыкающим профилям
 * - соединительный профиль живёт в слое одного из рамных контуров изделия, но может оказывать влияние на соединёные с ним контуры
 * - длина соединительного профиля может отличаться от длин профилей, к которым он примыкает
 *
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @extends ProfileItem
 */
class ProfileConnective extends ProfileItem {

  /**
   * Возвращает тип элемента (соединитель)
   */
  get elm_type() {
    return $p.enm.elm_types.Соединитель;
  }

  /**
   * С этой функции начинается пересчет и перерисовка соединительного профиля
   * т.к. концы соединителя висят в пустоте и не связаны с другими профилями, возвращаем голый cnn_point
   *
   * @param node {String} - имя узла профиля: "b" или "e"
   * @return {CnnPoint} - объект {point, profile, cnn_types}
   */
  cnn_point(node) {
    return this.rays[node];
  }

  /**
   * Двигает узлы
   * Обрабатывает смещение выделенных сегментов образующей профиля
   *
   * @param delta {paper.Point} - куда и насколько смещать
   * @param [all_points] {Boolean} - указывает двигать все сегменты пути, а не только выделенные
   * @param [start_point] {paper.Point} - откуда началось движение
   */
  move_points(delta, all_points, start_point) {

    super.move_points(delta, all_points, start_point);

    // двигаем примыкающие
    if(all_points !== false && !paper.Key.isDown('control')) {
      const moved = {profiles: []};
      for (const np of this.joined_nearests()) {
        np.do_bind(this, null, null, moved);
        // двигаем связанные с примыкающими
        for(const node of ['b', 'e']) {
          const cp = np.cnn_point(node);
          if(cp.profile) {
            cp.profile.do_bind(np, cp.profile.cnn_point('b'), cp.profile.cnn_point('e'), moved);
          }
        }
      }
    }

    this._attr._corns.length = 0;
    this.project.register_change();
  }

  /**
   * Возвращает массив примыкающих рам
   */
  joined_nearests() {

    const res = [];

    this.project.contours.forEach((contour) => {
      contour.profiles.forEach((profile) => {
        if(profile.nearest(true) === this){
          res.push(profile);
        }
      });
    });

    return res;

  }

  /**
   * К соединителям ипосты не крепятся
   * @override
   */
  joined_imposts(check_only) {
    return check_only ? false : {inner: [], outer: []};
  }

  /**
   * Примыкающий внешний элемент - для соединителя всегда пусто
   * @override
   * @return {void}
   */
  nearest() {}

  /**
   * Положение соединительного профиля
   * @type {EnmPositions}
   */
  get pos() {
    const nearests = this.joined_nearests();
    if(nearests.length > 1) {
      return $p.enm.positions.center;
    }
    return nearests[0].pos;
  }

  /**
   * Вычисляемые поля в таблице координат
   */
  save_coordinates() {

    if(!this._attr.generatrix){
      return;
    }

    const {_row, generatrix} = this;

    _row.x1 = this.x1;
    _row.y1 = this.y1;
    _row.x2 = this.x2;
    _row.y2 = this.y2;
    _row.nom = this.nom;
    _row.path_data = generatrix.pathData;
    _row.parent = 0;

    // добавляем припуски соединений
    _row.len = this.length.round(1);

    // получаем углы между элементами и к горизонту
    _row.angle_hor = this.angle_hor;

    _row.alp1 = Math.round((this.corns(4).subtract(this.corns(1)).angle - generatrix.getTangentAt(0).angle) * 10) / 10;
    if(_row.alp1 < 0){
      _row.alp1 = _row.alp1 + 360;
    }

    _row.alp2 = Math.round((generatrix.getTangentAt(generatrix.length).angle - this.corns(2).subtract(this.corns(3)).angle) * 10) / 10;
    if(_row.alp2 < 0){
      _row.alp2 = _row.alp2 + 360;
    }

    // устанавливаем тип элемента
    _row.elm_type = this.elm_type;

  }

  /**
   * Удаляет элемент из контура и иерархии проекта
   * Одновлеменно, инициирует обновление путей примыкающих элементов
   */
  remove() {
    this.joined_nearests().forEach((rama) => {

      const {inner, outer} = rama.joined_imposts();
      for (const {profile} of inner.concat(outer)) {
        profile.rays.clear();
      }
      for (const {_attr, elm} of rama.joined_nearests()) {
        _attr._rays && _attr._rays.clear();
      }

      const {_attr, layer} = rama;
      _attr._rays && _attr._rays.clear();
      if(_attr._nearest){
        _attr._nearest = null;
      }
      if(_attr._nearest_cnn){
        _attr._nearest_cnn = null;
      }

      layer && layer.notify && layer.notify({profiles: [rama], points: []}, consts.move_points);

    });
    super.remove();
  }

}


/**
 * Служебный слой соединительных профилей
 * Унаследован от [paper.Layer](http://paperjs.org/reference/layer/)
 *
 * @extends paper.Layer
 */
class ConnectiveLayer extends paper.Layer {

  constructor(attr) {
    super(attr);
    this._errors = new paper.Group({parent: this});
  }

  presentation() {
    return 'Соединители';
  }

  get info() {
    return this.presentation;
  }

  get skeleton() {
    return this.project._skeleton;
  }

  get cnstr() {
    return null;
  }

  get flipped() {
    return false;
  }
  set flipped(v) {
    return false;
  }

  get hidden() {
    return !this.visible;
  }
  set hidden(v) {
    this.visible = !v;
  }


  /**
   * Продукция слоя соединителей
   * Совпадает с продукцией проекта
   * @return {CatCharacteristics}
   */
  get _ox() {
    return this.project.ox;
  }

  /**
   * Система слоя соединителей
   * @return {CatProduction_params}
   */
  get sys() {
    return this.project._dp.sys;
  }

  redraw() {
    const {_errors, children} = this;
    children.forEach((elm) => elm !== _errors && elm.redraw());
    _errors.removeChildren();
    _errors.bringToFront();
  }

  save_coordinates() {
    return this.children.reduce((accumulator, elm) => {
      return elm?.save_coordinates ?  accumulator.then(() => elm.save_coordinates()) : accumulator;
    }, Promise.resolve());
  }

  /**
   * Заглушка
   */
  glasses() {
    return [];
  }

  /**
   * Заглушка
   */
  get contours() {
    return [];
  }

  /**
   * Заглушка
   */
  refresh_prm_links() {

  }

  get _manager() {
    return this.project._dp._manager;
  }

  _metadata(fld) {
    return Contour.prototype._metadata.call(this, fld);
  }

  /**
   * Возвращает слой размерных линий проекта
   * @type {DimensionLayer}
   */
  get l_dimensions() {
    return this.project.contours[0].l_dimensions;
  }

  /**
   * Возвращает массив профилей текущего слоя
   * @returns {Array.<ProfileItem>}
   */
  get profiles() {
    return this.children.filter((elm) => elm instanceof ProfileItem);
  }

  /**
   * Возвращает массив раскладок текущего слоя
   * @return {Array}
   */
  get onlays() {
    return [];
  }

  /**
   * Обработчик при изменении системы
   */
  on_sys_changed() {
    this.profiles.forEach((elm) => elm.default_inset(true));
  }

  /**
   * Возвращает значение параметра с учётом наследования
   */
  extract_pvalue({param, cnstr, elm, origin, prm_row}) {
    return param.extract_pvalue({ox: this._ox, cnstr, elm, origin, prm_row});
  }

  /**
   * Формирует оповещение для тех, кто следит за this._noti
   * @param obj
   */
  notify(obj, type = 'update') {
    //Contour.prototype.notify.call(this, obj, type);
  }
}

EditorInvisible.ProfileConnective = ProfileConnective;
EditorInvisible.ConnectiveLayer = ConnectiveLayer;

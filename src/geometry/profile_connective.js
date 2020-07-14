/**
 * ### Соединительный профиль
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
 * @class ProfileConnective
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @constructor
 * @extends ProfileItem
 */
class ProfileConnective extends ProfileItem {

  /**
   * Расстояние от узла до опорной линии, для соединителей и раскладок == 0
   * @property d0
   * @type Number
   */
  get d0() {
    return 0;
  }

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
   * @method cnn_point
   * @for ProfileConnective
   * @param node {String} - имя узла профиля: "b" или "e"
   * @return {CnnPoint} - объект {point, profile, cnn_types}
   */
  cnn_point(node) {
    return this.rays[node];
  }

  /**
   * ### Двигает узлы
   * Обрабатывает смещение выделенных сегментов образующей профиля
   *
   * @method move_points
   * @for ProfileItem
   * @param delta {paper.Point} - куда и насколько смещать
   * @param [all_points] {Boolean} - указывает двигать все сегменты пути, а не только выделенные
   * @param [start_point] {paper.Point} - откуда началось движение
   */
  move_points(delta, all_points, start_point) {

    const nearests = this.joined_nearests();
    const moved = {profiles: []};

    super.move_points(delta, all_points, start_point);

    // двигаем примыкающие
    if(all_points !== false && !paper.Key.isDown('control')){
      nearests.forEach((np) => {
        np.do_bind(this, null, null, moved);
        // двигаем связанные с примыкающими
        ['b', 'e'].forEach((node) => {
          const cp = np.cnn_point(node);
          if(cp.profile){
            cp.profile.do_bind(np, cp.profile.cnn_point("b"), cp.profile.cnn_point("e"), moved);
          }
        });
      });
    }

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
   */
  joined_imposts(check_only) {
    const tinner = [];
    const touter = [];
    return check_only ? false : {inner: tinner, outer: touter};
  }

  /**
   * Примыкающий внешний элемент - для соединителя всегда пусто
   * @property nearest
   */
  nearest() {
    return null;
  }

  /**
   * Вычисляемые поля в таблице координат
   * @method save_coordinates
   * @for ProfileConnective
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
    _row.len = this.length;

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
   * ### Удаляет элемент из контура и иерархии проекта
   * Одновлеменно, инициирует обновление путей примыкающих элементов
   * @method remove
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
 * ### Служебный слой соединительных профилей
 * Унаследован от [paper.Layer](http://paperjs.org/reference/layer/)
 *
 * @class ConnectiveLayer
 * @extends paper.Layer
 * @constructor
 */
class ConnectiveLayer extends paper.Layer {

  get skeleton() {
    return this.project._skeleton;
  }

  redraw() {
    this.children.forEach((elm) => elm.redraw());
  }

  save_coordinates() {
    this.children.forEach((elm) => elm.save_coordinates && elm.save_coordinates());
  }

  glasses() {
    return [];
  }

  /**
   * Возвращает массив профилей текущего слоя
   * @property profiles
   * @returns {Array.<ProfileItem>}
   */
  get profiles() {
    return this.children.filter((elm) => elm instanceof ProfileItem);
  }

  /**
   * Обработчик при изменении системы
   */
  on_sys_changed() {
    this.profiles.forEach((elm) => elm.default_inset(true));
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

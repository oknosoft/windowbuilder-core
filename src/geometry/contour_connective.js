
/**
 * @summary Служебный слой соединительных профилей и проёмов
 *
 * @extends paper.Layer
 */
class ConnectiveLayer extends paper.Layer {

  constructor(attr) {
    super(attr);
    this._errors = new paper.Group({parent: this});
    new GroupVisualization({owner: this, guide: true});
  }

  presentation() {
    return 'Соединители';
  }

  get info() {
    return this.presentation;
  }

  get kind() {
    return 0;
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
    return !this.visible || this.project.builder_props.cnns === false;
  }
  set hidden(v) {
    this.visible = !v;
    this.redraw();
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

  /**
   * Фурнитура слоя соединителей всегда пустая
   * @type {CatFurns}
   */
  get furn() {
    return $p.cat.furns.get();
  }

  redraw() {
    const {_errors, children} = this;
    const visible = !this.hidden;
    children.forEach((elm) => {
      if(elm !== _errors) {
        elm.visible = visible;
        elm.redraw?.();
        if(elm instanceof ProfileItem) {
          elm.path.fillColor = BuilderElement.clr_by_clr.call(elm, elm.clr);
        }
      }
    });
    _errors.removeChildren();
    //_errors.bringToFront();
  }

  /**
   * Рисует дополнительную визуализацию. Данные берёт из спецификации и проблемных соединений
   */
  draw_visualization(rows, region = 0) {

    const {profiles, l_visualization, project: {_attr, builder_props, ox}} = this;
    const {inner, outer, inner1, outer1} = $p.enm.elm_visualization;
    const reflected = _attr._reflected;

    l_visualization.by_insets.removeChildren();
    l_visualization.by_spec.removeChildren();

    // если кеш строк визуализации пустой - наполняем
    const {visualization, workplace} = builder_props;
    if(visualization) {

      function draw(elm) {
        if(this.elm === elm.elm && elm.visible) {
          const {visualization} = this.nom;
          const {attributes} = visualization;
          if(!attributes?.regions || attributes.regions.includes?.(region)) {
            let offset = this.len * 1000;
            if(elm.flipped) {
              offset = elm.length - offset;
            }
            visualization.draw({
              elm,
              layer: l_visualization,
              offset,
              offset0: this.width * 1000 * (this.alp1 || 1),
              clr: this.clr,
              reflected,
            });
            return true;
          }
        }
      }

      const push = (row) => {
        const {sketch_view} = row.nom.visualization;
        if((reflected && !sketch_view.find({kind: outer}) && !sketch_view.find({kind: outer1})) ||
          (!reflected && sketch_view.count() && !sketch_view.find({kind: inner}) && !sketch_view.find({kind: inner1}))) {
          if(!workplace || !sketch_view.find({kind: workplace})) {
            return;
          }
        }
        // визуализация для текущего профиля
        profiles.some(draw.bind(row));
      };

      ox.specification.find_rows({dop: {in: [-1, -5]}}, push);

    }
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

  get profileBounds() {
    return this.bounds;
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
   * Cлужебная группа визуализации допов, петель и ручек
   * @type {paper.Group}
   */
  get l_visualization() {
    return this.project.l_visualization.map.get(this);
  }

  /**
   * Возвращает массив профилей текущего слоя
   * @type {Array.<ProfileItem>}
   */
  get profiles() {
    return this.children.filter((elm) => elm instanceof ProfileItem);
  }

  /**
   * Возвращает массив раскладок текущего слоя
   * @type {Array}
   */
  get onlays() {
    return [];
  }

  /**
   * Площадь профилей слоя соединителей
   * @type {number}
   */
  get area() {
    return (this.profiles.reduce((sum, {path}) => sum + path.area, 0) /1e6).round(4);
  }

  /**
   * @summary Толщина слоя
   * @desc Принимается равной максимальной толщине профиля
   * @param {Boolean} [withChildren]
   * @return {Number}
   */
  thickness() {
    return this.profiles.reduce((sum, {thickness}) =>  thickness > sum ? thickness : sum, 0);
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

EditorInvisible.ConnectiveLayer = ConnectiveLayer;

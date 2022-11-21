
/**
 * Разрыв заполнения  
 * Похож на раскладку, но в отличии от неё, образует новое заполнение внутри своего замкнутого пути
 * и вычитает фрагмент площади из родительского заполнения
 *
 * - у Разрыва заполнения есть координаты конца и начала
 * - есть путь образующей - прямая или кривая линия, такая же, как у Profile
 * - владелец типа Filling
 * - концы должны соединяться с другими разрывами заполнений
 *
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @extends ProfileItem
 */
class ProfileTearing extends ProfileItem {

  /** @inheritdoc */
  constructor(attr) {

    super(attr);

    if(this.parent) {
      const {project: {_scope}, observer} = this;

      // Подключаем наблюдателя за событиями контура с именем _consts.move_points_
      this.observer = observer.bind(this);
      _scope.eve.on(consts.move_points, this.observer);
    }
  }

  observer(an) {
    const {layer} = this;
    if(an?.profiles?.some?.((elm) => elm.layer === layer)) {
      super.observer(an);
      this._attr._corns.length = 0;
    }
  }

  /**
   * Возвращает тип элемента (разрыв заполнения)
   * @type EnmElm_types
   */
  get elm_type() {
    return $p.enm.elm_types.tearing;
  }

  get info() {
    return `разрыв ${super.info}`;
  }

  cnn_point(node, point) {
    return Profile.prototype.cnn_point.call(this, node, point);
  }

  joined_imposts() {
    return {inner: [], outer: []};
  }

  /**
   * У разрыва не бывает внешних профилей
   * @return {null}
   */
  nearest() {
    return null;
  }

  save_coordinates() {
    super.save_coordinates();
    this._row.parent = this.parent.elm;
  }
}

EditorInvisible.ProfileTearing = ProfileTearing;

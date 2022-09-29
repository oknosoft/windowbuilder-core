
/**
 * Опорная линия  
 * Вспомогательная линия для привязки узлов и уравнивания
 *
 * - у линии есть координаты конца и начала
 * - есть путь образующей - прямая или кривая линия, такая же, как у {{#crossLink "Profile"}}{{/crossLink}}
 * - живут линии в слое соединителей изделия
 * - никаких соединений у линии нет
 *
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @extends GeneratrixElement
 */
class BaseLine extends ProfileItem {

  constructor(attr) {
    super(attr);
    if(!attr.preserv_parent) {
      this.parent = this.project.l_connective;
    }
    Object.assign(this.generatrix, {
      strokeColor: 'brown',
      fillColor: new paper.Color(1, 0.1),
      strokeScaling: false,
      strokeWidth: 2,
      dashOffset: 4,
      dashArray: [4, 4],
    });
  }

  get d0() {
    return 0;
  }

  get d1() {
    return 0;
  }

  get d2() {
    return 0;
  }

  /**
   * Путь линии равен образующей
   * @return {paper.Path}
   */
  get path() {
    return this.generatrix;
  }
  set path(v) {
  }

  setSelection(selection) {
    paper.Item.prototype.setSelection.call(this, selection);
  }

  /**
   * Возвращает тип элемента (линия)
   */
  get elm_type() {
    return $p.enm.elm_types.Линия;
  }

  get length() {
    return this.generatrix.length;
  }

  /**
   * У линии не бывает ведущих элементов
   */
  nearest() {
    return null;
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
   * К линиям ипосты не крепятся
   */
  joined_imposts(check_only) {
    const tinner = [];
    const touter = [];
    return check_only ? false : {inner: tinner, outer: touter};
  }

  /**
   * Вычисляемые поля в таблице координат
   */
  save_coordinates() {

    if(!this._attr.generatrix){
      return;
    }

    const {_row} = this;

    _row.x1 = this.x1;
    _row.y1 = this.y1;
    _row.x2 = this.x2;
    _row.y2 = this.y2;
    _row.path_data = this.generatrix.pathData;
    _row.parent = 0;
    _row.len = this.length;
    _row.angle_hor = this.angle_hor;
    _row.elm_type = this.elm_type;
    _row.orientation = this.orientation;
  }

  cnn_point(node) {
    return this.rays[node];
  }

  /**
   * Для перерисовки линии, накаих вычислений не требуется
   */
  redraw() {

  }

  /**
   * Описание полей диалога свойств элемента
   */
  get oxml() {
    return BaseLine.oxml;
  }
}

BaseLine.oxml = {
  ' ': [
    {id: 'info', path: 'o.info', type: 'ro'},
  ],
  'Начало': ['x1', 'y1'],
  'Конец': ['x2', 'y2']
};

EditorInvisible.BaseLine = BaseLine;


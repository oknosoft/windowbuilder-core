
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
class Tearing extends ProfileItem {

  /**
   * Возвращает тип элемента (разрыв заполнения)
   * @type EnmElm_types
   */
  get elm_type() {
    return $p.enm.elm_types.tearing;
  }

  save_coordinates() {
    super.save_coordinates();
    this._row.parent = this.parent.elm;
  }
}

EditorInvisible.Tearing = Tearing;

/**
 * @summary Область разрыва заполнения
 * @desc В ней живут профили разрыва (образуют замкнутую фигуру) и вложенное заполнение
 */
class TearingGroup extends BuilderElement {
  
  get profiles() {
    return this.children.filter((v) => v instanceof Tearing);
  }

  set_inset(v) {
    const {_row, profiles} = this;
    _row.inset = v;
    for(const profile of profiles) {
      profile.inset = _row.inset; 
    }
  }

  /**
   * Возвращает тип элемента (разрыв заполнения)
   * @type EnmElm_types
   */
  get elm_type() {
    return $p.enm.elm_types.tearing;
  }

  save_coordinates() {
    const {_row, project, parent, layer, bounds, area, ox: {cnn_elmnts: cnns}} = this;
    const h = project.bounds.height + project.bounds.y;

    _row.x1 = (bounds.bottomLeft.x - project.bounds.x).round(3);
    _row.y1 = (h - bounds.bottomLeft.y).round(3);
    _row.x2 = (bounds.topRight.x - project.bounds.x).round(3);
    _row.y2 = (h - bounds.topRight.y).round(3);
    _row.s = area;
    _row.elm_type = this.elm_type;
    _row.parent = parent.elm;
  }
  

  /**
   * 
   * @param {Filling} parent - родительское заполнение
   * @param {CatInserts} inset - вставка профиля разрыва
   * @param {paper.Point} point - точка, в которой будет размещён разрыв
   */
  static create({parent, inset, point}) {
    const group = new TearingGroup({parent, inset});
    
  }
}

EditorInvisible.TearingGroup = TearingGroup;

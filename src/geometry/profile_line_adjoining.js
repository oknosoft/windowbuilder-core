/**
 *
 *
 * @module profile_connective_adjoining
 *
 * Created by Evgeniy Malyarov on 18.03.2021.
 */

/**
 * ### Виртуальный профиль примыкания
 * Класс описывает поведение внешнего примыкания к рамам изделия
 *
 * - у примыкания есть координаты конца и начала, такие же, как у Profile
 * - концы соединяются с пустотой
 * - имеет как минимум одно ii примыкающее соединение
 * - есть путь образующей - прямая или кривая линия, такая же, как у Profile
 * - слвиг и искривление пути передаются примыкающим профилям
 * - живёт в том же слое, что и рамные профили
 * - длина может отличаться от длин профилей, к которым он примыкает
 *
 * @class ProfileAdjoining
 * @param attr {Object} - объект со свойствами создаваемого элемента см. {{#crossLink "BuilderElement"}}параметр конструктора BuilderElement{{/crossLink}}
 * @constructor
 * @extends ProfileConnectiveOuter
 */
class ProfileAdjoining extends BaseLine {

  constructor({row, parent, proto, b, e, side}) {
    const generatrix = b && e && parent.rays[side].get_subpath(e.elm[e.point], b.elm[b.point]);
    super({row, generatrix, parent, proto, preserv_parent: true});
    Object.assign(this.generatrix, {
      strokeColor: 'black',
      strokeOpacity: 0.7,
      strokeWidth: 10,
      dashArray: [],
      dashOffset: 0,
      strokeScaling: true,
    });
  }

  /**
   * Возвращает тип элемента (соединитель)
   */
  get elm_type() {
    return $p.enm.elm_types.Примыкание;
  }

  /**
   * Описание полей диалога свойств элемента
   */
  get oxml() {
    return ProfileAdjoining.oxml;
  }

  /**
   * Возвращает массив примыкающих рам
   */
  joined_nearests() {
    return this.layer.profiles.filter((profile) => {
      return profile.nearest(true) === this;
    });
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

  redraw() {
    const {generatrix, path, children} = this;
    for(const child of [].concat(children)) {
      if(child !== generatrix && child !== path) {
        child.remove();
      }
    }
    const {length} = generatrix;
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
  }
}

ProfileAdjoining.oxml = {
  ' ': [
    {id: 'info', path: 'o.info', type: 'ro'},
    'inset',
    'clr',
    'offset',
  ],
  'Начало': ['x1', 'y1'],
  'Конец': ['x2', 'y2']
};

EditorInvisible.ProfileAdjoining = ProfileAdjoining;

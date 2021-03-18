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

  constructor(attr) {
    attr.preserv_parent = true;
    super(attr);
    Object.assign(this.generatrix, {
      strokeColor: 'blue',
      strokeWidth: 4,
      dashOffset: 6,
      dashArray: [6, 6],
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
}

ProfileAdjoining.oxml = {
  ' ': [
    {id: 'info', path: 'o.info', type: 'ro'},
    'inset',
    'clr'
  ],
  'Начало': ['x1', 'y1'],
  'Конец': ['x2', 'y2']
};

EditorInvisible.ProfileAdjoining = ProfileAdjoining;


/**
 * Дополнительные методы перечисления Типы вставок
 *
 * Created 22.02.2018.
 *
 * @module enm_inserts_types
 */


(function(_mgr){

  /**
   * Список групп, задействованных в CalcOrderAdditions
   * - можно изменить состав и порядок
   * - в теории, здесь же можно создать новые значения перечислений и добавить их в состав (эксперимент)
   */
  _mgr.additions_groups = [
    _mgr.sill,      //Подоконник
    _mgr.sectional, //Водоотлив
    _mgr.mosquito,  //МоскитнаяСетка 
    _mgr.jalousie,  //Жалюзи
    _mgr.slope,     //Откос
    _mgr.profile,   //Профиль 
    _mgr.cut,       //Профиль в нарезку 
    _mgr.mount,     //Монтаж 
    _mgr.delivery,  //Доставка
    _mgr.set,       //Набор
  ];


})($p.enm.inserts_types);


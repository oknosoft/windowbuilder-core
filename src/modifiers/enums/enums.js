
/*
 * Модификаторы перечислений
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module enmums
 *
 * Created 22.04.2016
 */

(function({enm}){

	/**
	 * Дополнительные методы перечисления Типы открывания
	 */
	enm.open_types.__define({
    is_opening: {
      value(v) {
        if(!v || v.empty() || v == this.Глухое || v == this.Неподвижное) {
          return false;
        }
        return true;
      }
    }

  });

  enm.plan_detailing.__define({
    eq_product: {
      value: [enm.plan_detailing.get(), enm.plan_detailing.product, enm.plan_detailing.algorithm]
    }
  })


})($p);

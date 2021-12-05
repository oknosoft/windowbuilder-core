
/**
 * Дополнительные методы перечисления Типы соединений
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * Created 23.12.2015
 *
 * @module enm_cnn_types
 */

(function(_mgr){

  const {ad, av, ah, long, short, t, ii, i, xt, xx} = _mgr;

  /**
   * Массивы Типов соединений
   * @type Array.<EnumObj>
   */
	Object.defineProperties(_mgr, {
    acn: {
      value: {
        ii: [ii],
        i: [i],
        a: [av, ad, ah, t, xx, long, short],
        t: [t, xx],
        xsl: [t, xx, long, short],
      }
    },
  });

})($p.enm.cnn_types);

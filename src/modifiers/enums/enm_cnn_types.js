
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

  const {
    УгловоеДиагональное: ad,
    УгловоеКВертикальной: av,
    УгловоеКГоризонтальной: ah,
    Длинное: long,
    Короткое: short,
    ТОбразное: t,
    Наложение: ii,
    НезамкнутыйКонтур: i,
    КрестПересечение: xt,
    КрестВСтык: xx,
  } = _mgr;


	/**
	 * Короткие псевдонимы перечисления "Типы соединений"
	 * @type Object
	 */
	Object.defineProperties(_mgr, {
	  ad: {
	    get() {
        return ad;
      }
    },
    av: {
      get() {
        return av;
      }
    },
    ah: {
      get() {
        return ah;
      }
    },
    long: {
      get() {
        return long;
      }
    },
    short: {
      get() {
        return short;
      }
    },
    t: {
      get() {
        return t;
      }
    },
    ii: {
      get() {
        return ii;
      }
    },
    i: {
      get() {
        return i;
      }
    },
    xt: {
      get() {
        return xt;
      }
    },
    xx: {
      get() {
        return xx;
      }
    },

    /**
     * Массивы Типов соединений
     * @type Object
     */
    acn: {
      value: {
        ii: [ii],
        i: [i],
        a: [av, ad, ah, t, xx, long, short],
        t: [t, xx],
      }
    },

  });

})($p.enm.cnn_types);


/**
 * Дополнительные методы перечисления Типы элементов
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module enm_elm_types
 */

(function(mgr){

	const cache = {};

  /**
   * Массивы Типов элементов
   * @type Object
   */
	mgr.__define({

		profiles: {
			get(){
				return cache.profiles || (cache.profiles = [mgr.rama, mgr.flap, mgr.impost, mgr.shtulp, mgr.tearing, mgr.region]);
			}
		},

		profile_items: {
			get(){
				return cache.profile_items
					|| ( cache.profile_items = [...this.profiles, mgr.addition, mgr.linking, mgr.layout, mgr.bundle]);
			}
		},

		rama_impost: {
			get(){
				return cache.rama_impost || (cache.rama_impost = [mgr.rama, mgr.impost, mgr.shtulp]);
			}
		},

		impost_lay: {
			get(){
        return cache.impost_lay || (cache.impost_lay = [mgr.impost, mgr.layout]);
			}
		},

		stvs: {
			get(){
        return cache.stvs || (cache.stvs = [mgr.flap]);
			}
		},

		glasses: {
			get(){
        return cache.glasses || (cache.glasses = [mgr.glass, mgr.sandwich]);
			}
		}

	});


})($p.enm.elm_types);

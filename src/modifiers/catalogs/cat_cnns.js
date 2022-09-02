
/*
 * Дополнительные методы справочника _Соединения_
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 * @module cat_cnns
 * Created 23.12.2015
 */

$p.cat.cnns.__define({

  sql_selection_list_flds: {
    value(initial_value){
      return "SELECT _t_.ref, _t_.`_deleted`, _t_.is_folder, _t_.id, _t_.name as presentation, _k_.synonym as cnn_type," +
        " case when _t_.ref = '" + initial_value + "' then 0 else 1 end as is_initial_value FROM cat_cnns AS _t_" +
        " left outer join enm_cnn_types as _k_ on _k_.ref = _t_.cnn_type %3 %4 LIMIT 300";
    }
  },

});


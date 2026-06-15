
/*
 * Дополнительные методы справочника _Договоры контрагентов_
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module cat_contracts
 *
 * Created 23.12.2015
 */

$p.cat.contracts.__define({

	sql_selection_list_flds: {
		value(initial_value){
			return "SELECT _t_.ref, _t_.`_deleted`, _t_.is_folder, _t_.id, _t_.name as presentation, _k_.synonym as contract_kind, _m_.synonym as mutual_settlements, _o_.name as organization, _p_.name as partner," +
				" case when _t_.ref = '" + initial_value + "' then 0 else 1 end as is_initial_value FROM cat_contracts AS _t_" +
				" left outer join cat_organizations as _o_ on _o_.ref = _t_.organization" +
				" left outer join cat_partners as _p_ on _p_.ref = _t_.owner" +
				" left outer join enm_mutual_contract_settlements as _m_ on _m_.ref = _t_.mutual_settlements" +
				" left outer join enm_contract_kinds as _k_ on _k_.ref = _t_.contract_kind %3 %4 LIMIT 300";
		}
	},

	by_partner_and_org: {
    value(partner, organization, contract_kind, department) {

      const {enm: {contract_kinds}, cat: {partners, divisions}} = $p;
      const {main_contract} = partners.get(partner);
      
      if(!contract_kind) {
        contract_kind = contract_kinds.СПокупателем;
      }

      //Если у контрагента есть основной договор, и он подходит по виду договора и организации,
      // возвращаем его, не бегая по массиву
      if(main_contract && main_contract.contract_kind == contract_kind && main_contract.organization == organization){
        if(!department || main_contract.department == department) {
          return main_contract;
        }
      }

      const selector = {owner: partner, organization: organization, contract_kind: contract_kind};
      const dep = department && divisions.get(department);
      if(dep) {
        selector.department = dep.empty() ? dep : {in: [dep, divisions.get()]};
      }
      const res = this.find_rows(selector);
      const filtered = dep && res.filter(v => v.department == dep);
      const sort = (a, b) => a.date > b.date;
      if(filtered.length) {
        filtered.sort(sort);
        return filtered[0];
      }
      res.sort(sort);
      return res.length ? res[0] : this.get();
    }
	}


});

// перед записью, устанавливаем код, родителя и наименование
// _mgr.on("before_save", function (attr) {
//
//
//
// });

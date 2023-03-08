
/*
 * Подмешивается в конец init-файла
 *
 */

/**
 * Абстрактная строка табчасти параметров
 * @class
 */
class ParamsRow extends TabularSectionRow{
  get param(){
    return this._getter('param') || $p.cch.properties.get();
  }
  set param(v){this._setter('param',v)}
  get value(){
    const {param} = this;
    return (param && param.fetch_type && !param.empty()) ? param.fetch_type(this._obj.value) : this._getter('value');
  }
  set value(v){
    if(typeof v === 'string' && v.length === 72 && this.param.type?.types?.includes('cat.clrs')) {
      v = $p.cat.clrs.getter(v);
    }
    this._setter('value',v);
  }
}

/**
 * Строка табчасти параметров с уточнением до элемента
 * @class
 */
class ElmParamsRow extends ParamsRow{
  get elm(){return this._getter('elm')}
  set elm(v){this._setter('elm',v)}
}

/**
 * Строка табчасти параметров с признаком сокрытия
 * @class
 */
class HideParamsRow extends ParamsRow{
  get hide(){return this._getter('hide')}
  set hide(v){this._setter('hide',v)}
}

/**
 * Строка табчасти параметров с признаками сокрытия и принудительной установки
 * @class
 */
class HideForciblyParamsRow extends HideParamsRow{
  get forcibly(){return this._getter('forcibly')}
  set forcibly(v){this._setter('forcibly',v)}

  option_value({elm, ...other}) {
    const {value} = this;
    return value instanceof CatValues_options ? value.option_value({elm, ...other}) : value;
  }
}

/**
 * Строка табчасти отбора технологических справочников
 * @class
 */
class SelectionParamsRow extends ElmParamsRow{
  get area(){return this._getter('area')}
  set area(v){this._setter('area',v)}
  get comparison_type(){return this._getter('comparison_type')}
  set comparison_type(v){this._setter('comparison_type',v)}
  get txt_row(){return this._getter('txt_row')}
  set txt_row(v){this._setter('txt_row',v)}
  get origin(){return this._getter('origin')}
  set origin(v){this._setter('origin',v)}
}

/**
 * Строка табчасти допреквизитов
 * @class
 */
class Extra_fieldsRow extends TabularSectionRow{
  get property(){return this._getter('property')}
  set property(v){this._setter('property',v)}
  get value(){
    const {property: param} = this;
    return (param?.fetch_type && !param.empty()) ? param.fetch_type(this._obj.value) : this._getter('value');
  }
  set value(v) {
    if(typeof v === 'string' && v.length === 72 && this.property?.type?.types?.includes('cat.clrs')) {
      v = $p.cat.clrs.getter(v);
    }
    this._setter('value', v);
  }
  get txt_row(){return this._getter('txt_row')}
  set txt_row(v){this._setter('txt_row',v)}
}

/**
 * Строка допреквизитов ключей параметров
 * @class
 */
class CatParameters_keysParamsRow extends Extra_fieldsRow{
  get area(){return this._getter('area')}
  set area(v){this._setter('area',v)}
  get origin(){return this._getter('origin')}
  set origin(v){this._setter('origin',v)}
  get comparison_type(){return this._getter('comparison_type')}
  set comparison_type(v){this._setter('comparison_type',v)}
}

/**
 * Строка табчасти назначения платежа
 * @class
 */
class Payment_detailsRow extends TabularSectionRow{
  get cash_flow_article(){return this._getter('cash_flow_article')}
  set cash_flow_article(v){this._setter('cash_flow_article',v)}
  get trans(){return this._getter('trans')}
  set trans(v){this._setter('trans',v)}
  get amount(){return this._getter('amount')}
  set amount(v){this._setter('amount',v)}
}

/**
 * Строка табчасти параметров формул
 * @class
 */
class CatFormulasParamsRow extends ParamsRow{}

class DpBuyers_orderProduct_paramsRow extends ElmParamsRow{
  get hide(){return this._getter('hide')}
  set hide(v){this._setter('hide',v)}
}

class CatProduction_paramsFurn_paramsRow extends HideForciblyParamsRow{}

class CatProduction_paramsProduct_paramsRow extends HideForciblyParamsRow{
  get elm(){return this._getter('elm')}
  set elm(v){this._setter('elm',v)}
}

class CatInsertsProduct_paramsRow extends HideForciblyParamsRow{
  get pos(){return this._getter('pos')}
  set pos(v){this._setter('pos',v)}
  get list(){return this._getter('list')}
  set list(v){this._setter('list',v)}
}

class CatCnnsSizesRow extends SelectionParamsRow{
  get key(){return this._getter('key')}
  set key(v){this._setter('key',v)}
}

class CatInsertsSelection_paramsRow extends SelectionParamsRow{}

class CatCnnsSelection_paramsRow extends SelectionParamsRow{}

class CatFurnsSelection_paramsRow extends SelectionParamsRow{
  get dop(){return this._getter('dop')}
  set dop(v){this._setter('dop',v)}
}

class CatCharacteristicsParamsRow extends HideParamsRow{
  get cnstr(){return this._getter('cnstr')}
  set cnstr(v){this._setter('cnstr',v)}
  get region(){return this._getter('region')}
  set region(v){this._setter('region',v)}
  get inset(){return this._getter('inset')}
  set inset(v){this._setter('inset',v)}
  get _list() {
    const {param, inset} = this;
    if(!param.empty() && !inset.empty()) {
      const def = inset.product_params.find({param});
      if(def && def.list) {
        let _list;
        try {_list = JSON.parse(def.list)}
        catch (e) {}
        return _list;
      }
    }
  }
}

class DocCredit_card_orderPayment_detailsRow extends Payment_detailsRow{}
class DocDebit_bank_orderPayment_detailsRow extends Payment_detailsRow{}
class DocCredit_bank_orderPayment_detailsRow extends Payment_detailsRow{}
class DocDebit_cash_orderPayment_detailsRow extends Payment_detailsRow{}
class DocCredit_cash_orderPayment_detailsRow extends Payment_detailsRow{}

class CatProjectsExtra_fieldsRow extends Extra_fieldsRow{}
class CatStoresExtra_fieldsRow extends Extra_fieldsRow{}
class CatCharacteristicsExtra_fieldsRow extends Extra_fieldsRow{}
class DocPurchaseExtra_fieldsRow extends Extra_fieldsRow{}
class DocCalc_orderExtra_fieldsRow extends Extra_fieldsRow{}
class DocCredit_card_orderExtra_fieldsRow extends Extra_fieldsRow{}
class DocDebit_bank_orderExtra_fieldsRow extends Extra_fieldsRow{}
class DocCredit_bank_orderExtra_fieldsRow extends Extra_fieldsRow{}
class DocDebit_cash_orderExtra_fieldsRow extends Extra_fieldsRow{}
class DocCredit_cash_orderExtra_fieldsRow extends Extra_fieldsRow{}
class DocSellingExtra_fieldsRow extends Extra_fieldsRow{}
class CatBranchesExtra_fieldsRow extends Extra_fieldsRow{}
class CatPartnersExtra_fieldsRow extends Extra_fieldsRow{}
class CatNomExtra_fieldsRow extends Extra_fieldsRow{}
class CatOrganizationsExtra_fieldsRow extends Extra_fieldsRow{}
class CatDivisionsExtra_fieldsRow extends Extra_fieldsRow{}
class CatUsersExtra_fieldsRow extends Extra_fieldsRow{}
class CatProduction_paramsExtra_fieldsRow extends Extra_fieldsRow{}

class CatCharacteristicsCoordinatesRow extends TabularSectionRow{
  get cnstr(){return this._getter('cnstr')}
  set cnstr(v){this._setter('cnstr',v)}
  get parent(){return this._getter('parent')}
  set parent(v){this._setter('parent',v)}
  get region(){
    const region = this._getter('region');
    return typeof region === "number" ? region : (region.empty() ? 0 : region)}
  set region(v){this._setter('region',v)}
  get elm(){return this._getter('elm')}
  set elm(v){this._setter('elm',v)}
  get elm_type(){return this._getter('elm_type')}
  set elm_type(v){this._setter('elm_type',v)}
  get clr(){return $p.cat.clrs.getter(this._obj.clr)}
  set clr(v){this._setter('clr',v)}
  get inset(){return this._getter('inset')}
  set inset(v){this._setter('inset',v)}
  get path_data(){return this._getter('path_data')}
  set path_data(v){this._setter('path_data',v)}
  get x1(){return this._getter('x1')}
  set x1(v){this._setter('x1',v)}
  get y1(){return this._getter('y1')}
  set y1(v){this._setter('y1',v)}
  get x2(){return this._getter('x2')}
  set x2(v){this._setter('x2',v)}
  get y2(){return this._getter('y2')}
  set y2(v){this._setter('y2',v)}
  get r(){return this._getter('r')}
  set r(v){this._setter('r',v)}
  get arc_ccw(){return this._getter('arc_ccw')}
  set arc_ccw(v){this._setter('arc_ccw',v)}
  get s(){return this._getter('s')}
  set s(v){this._setter('s',v)}
  get angle_hor(){return this._getter('angle_hor')}
  set angle_hor(v){this._setter('angle_hor',v)}
  get alp1(){return this._getter('alp1')}
  set alp1(v){this._setter('alp1',v)}
  get alp2(){return this._getter('alp2')}
  set alp2(v){this._setter('alp2',v)}
  get len(){return this._getter('len')}
  set len(v){this._setter('len',v)}
  get pos(){return this._getter('pos')}
  set pos(v){this._setter('pos',v)}
  get orientation(){return this._getter('orientation')}
  set orientation(v){this._setter('orientation',v)}
  get nom(){return this._getter('nom')}
  set nom(v){this._setter('nom',v)}
  get offset(){return this._getter('offset')}
  set offset(v){this._setter('offset',v)}
  get dop(){return this._getter('dop')}
  set dop(v){this._setter('dop',v)}
}
class CatCharacteristicsInsertsRow extends TabularSectionRow{
  get cnstr(){return this._getter('cnstr')}
  set cnstr(v){this._setter('cnstr',v)}
  get region(){
    const region = this._getter('region');
    return typeof region === "number" ? region : (region.empty() ? 0 : region)}
  set region(v){this._setter('region',v)}
  get inset(){return this._getter('inset')}
  set inset(v){this._setter('inset',v)}
  get clr(){return $p.cat.clrs.getter(this._obj.clr)}
  set clr(v){this._setter('clr',v)}
  get dop(){return this._getter('dop')}
  set dop(v){this._setter('dop',v)}
}

Object.assign($p, {
  CatFormulasParamsRow,
  CatCharacteristicsParamsRow,
  DpBuyers_orderProduct_paramsRow,
  CatProduction_paramsFurn_paramsRow,
  CatProduction_paramsProduct_paramsRow,
  CatInsertsProduct_paramsRow,
  CatCnnsSizesRow,
  CatInsertsSelection_paramsRow,
  CatCnnsSelection_paramsRow,
  CatFurnsSelection_paramsRow,
  DocCredit_card_orderPayment_detailsRow,
  DocDebit_bank_orderPayment_detailsRow,
  DocCredit_bank_orderPayment_detailsRow,
  DocDebit_cash_orderPayment_detailsRow,
  DocCredit_cash_orderPayment_detailsRow,
  CatProjectsExtra_fieldsRow,
  CatStoresExtra_fieldsRow,
  CatCharacteristicsExtra_fieldsRow,
  DocPurchaseExtra_fieldsRow,
  DocCalc_orderExtra_fieldsRow,
  DocCredit_card_orderExtra_fieldsRow,
  DocDebit_bank_orderExtra_fieldsRow,
  DocCredit_bank_orderExtra_fieldsRow,
  DocDebit_cash_orderExtra_fieldsRow,
  DocCredit_cash_orderExtra_fieldsRow,
  DocSellingExtra_fieldsRow,
  CatBranchesExtra_fieldsRow,
  CatPartnersExtra_fieldsRow,
  CatNomExtra_fieldsRow,
  CatOrganizationsExtra_fieldsRow,
  CatDivisionsExtra_fieldsRow,
  CatUsersExtra_fieldsRow,
  CatProduction_paramsExtra_fieldsRow,
  CatParameters_keysParamsRow,
  CatCharacteristicsCoordinatesRow,
  CatCharacteristicsInsertsRow,
});


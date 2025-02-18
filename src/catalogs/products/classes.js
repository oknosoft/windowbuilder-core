
export const exclude = [/*'cat.products'*/];

export function classes({cat, md, classes, symbols}, exclude)  {
  const {CatObj, TabularSectionRow, DataStruct} = classes;
  const {get, set, struct} = symbols;
  const {tabulars} = md.get('p')

  class CatProducts extends CatObj {
    get calc_order(){return this[get]('calc_order')}
    set calc_order(v){this[set]('calc_order',v)}
    get note(){return this[get]('note')}
    set note(v){this[set]('note',v)}
    get obj_delivery_state(){return this[get]('obj_delivery_state')}
    set obj_delivery_state(v){this[set]('obj_delivery_state',v)}
    get route(){return this[get]('route')}
    set route(v){this[set]('route',v)}
    get branch(){return this[get]('branch')}
    set branch(v){this[set]('branch',v)}
    get owner(){return this[get]('owner')}
    set owner(v){this[set]('owner',v)}
    get links(){return this[get]('links')}
    set links(v){this[get]('links').load(v)}
    get struct(){return this[get]('struct')}
    set struct(v){this[get]('struct').load(v)}
  }
  classes.CatProducts = CatProducts;

  class CatProductsLinksRow extends TabularSectionRow {
    get kind(){return this[get]('kind')}
    set kind(v){this[set]('kind',v)}
    get obj(){return this[get]('obj')}
    set obj(v){this[set]('obj',v)}
    get address(){return this[get]('address')}
    set address(v){this[set]('address',v)}
  }
  classes.CatProductsLinksRow = CatProductsLinksRow;

  class CatProductsParamsRow extends TabularSectionRow {
    get param(){return this[get]('param')}
    set param(v){this[set]('param',v)}
    get value(){return this[get]('value')}
    set value(v){this[set]('value',v)}
  }
  classes.CatProductsParamsRow = CatProductsParamsRow;

  class CatProductsStructRow extends TabularSectionRow {
    get kind(){return this[get]('kind')}
    set kind(v){this[set]('kind',v)}
    get region(){return this[get]('region')}
    set region(v){this[set]('region',v)}
    get parent(){return this[get]('parent')}
    set parent(v){this[set]('parent',v)}
    get address(){return this[get]('address')}
    set address(v){this[set]('address',v)}
    get sys(){return this[get]('sys')}
    set sys(v){this[set]('sys',v)}
    get inset(){return this[get]('inset')}
    set inset(v){this[set]('inset',v)}
    get open_type(){return this[get]('open_type')}
    set open_type(v){this[set]('open_type',v)}
    get direction(){return this[get]('direction')}
    set direction(v){this[set]('direction',v)}
    get furn(){return this[get]('furn')}
    set furn(v){this[set]('furn',v)}
    get svg_path(){return this[get]('svg_path')}
    set svg_path(v){this[set]('svg_path',v)}
    get params(){return this[get]('params')}
    set params(v){this[get]('params').load(v)}
    get children(){return this[get]('children')}
    set children(v){this[get]('children').load(v)}
    get profiles(){return this[get]('profiles')}
    set profiles(v){this[get]('profiles').load(v)}
  }
  classes.CatProductsStructRow = CatProductsStructRow;

  class CatProductsVertex extends DataStruct {
    get key(){return this[get]('key')}
    set key(v){this[set]('key',v)}
    get cnnType(){return this[get]('cnnType')}
    set cnnType(v){this[set]('cnnType',v)}
    get x(){return this[get]('x')}
    set x(v){this[set]('x',v)}
    get y(){return this[get]('y')}
    set y(v){this[set]('y',v)}
    get params(){return this[get]('params')}
    set params(v){this[get]('params').load(v)}
  }
  classes.CatProductsVertex = CatProductsVertex;

  class CatProductsCnnPoint extends DataStruct {
    get cnn(){return this[get]('cnn')}
    set cnn(v){this[set]('cnn',v)}
    get cnno(){return this[get]('cnno')}
    set cnno(v){this[set]('cnno',v)}
    get vertex(){return this[struct]('vertex', this, tabulars.vertex, CatProductsVertex)}
  }
  classes.CatProductsCnnPoint = CatProductsCnnPoint;

  class CatProductsProfilesRow extends TabularSectionRow {
    get b(){return this[struct]('b', this, tabulars.cnnpoint, CatProductsCnnPoint)}
    get e(){return this[struct]('e', this, tabulars.cnnpoint, CatProductsCnnPoint)}
    get offset(){return this[get]('offset')}
    set offset(v){this[set]('offset',v)}
    get svg_path(){return this[get]('svg_path')}
    set svg_path(v){this[set]('svg_path',v)}
    get params(){return this[get]('params')}
    set params(v){this[get]('params').load(v)}
    get children(){return this[get]('children')}
    set children(v){this[get]('children').load(v)}
  }
  classes.CatProductsProfilesRow = CatProductsProfilesRow;
  
}

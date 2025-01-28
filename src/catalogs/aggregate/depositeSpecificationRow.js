
export default function depositeSpecificationRow({TabularSectionRow, get, set}) {
  class DepositeSpecificationRow extends TabularSectionRow{
    get elm(){return this[get]('elm')}
    set elm(v){this[set]('elm',v)}
    get nom(){return this[get]('nom')}
    set nom(v){this[set]('nom',v)}
    get algorithm(){return this[get]('algorithm')}
    set algorithm(v){this[set]('algorithm',v)}
    get nom_characteristic(){return this[get]('nom_characteristic')}
    set nom_characteristic(v){this[set]('nom_characteristic',v)}
    get clr(){return this[get]('clr')}
    set clr(v){this[set]('clr',v)}
    get coefficient(){return this[get]('coefficient')}
    set coefficient(v){this[set]('coefficient',v)}
    get sz(){return this[get]('sz')}
    set sz(v){this[set]('sz',v)}
    get quantity(){return this[get]('quantity')}
    set quantity(v){this[set]('quantity',v)}
    //get angle_calc_method(){return this[get]('angle_calc_method')}
    //set angle_calc_method(v){this[set]('angle_calc_method',v)}
    //get count_calc_method(){return this[get]('count_calc_method')}
    //set count_calc_method(v){this[set]('count_calc_method',v)}
    get formula(){return this[get]('formula')}
    set formula(v){this[set]('formula',v)}
    // get lmin(){return this[get]('lmin')}
    // set lmin(v){this[set]('lmin',v)}
    // get lmax(){return this[get]('lmax')}
    // set lmax(v){this[set]('lmax',v)}
    // get ahmin(){return this[get]('ahmin')}
    // set ahmin(v){this[set]('ahmin',v)}
    // get ahmax(){return this[get]('ahmax')}
    // set ahmax(v){this[set]('ahmax',v)}
    // get smin(){return this[get]('smin')}
    // set smin(v){this[set]('smin',v)}
    // get smax(){return this[get]('smax')}
    // set smax(v){this[set]('smax',v)}
    // get rmin(){return this[get]('rmin')}
    // set rmin(v){this[set]('rmin',v)}
    // get rmax(){return this[get]('rmax')}
    // set rmax(v){this[set]('rmax',v)}
    // get for_direct_profile_only(){return this[get]('for_direct_profile_only')}
    // set for_direct_profile_only(v){this[set]('for_direct_profile_only',v)}
    // get step(){return this[get]('step')}
    // set step(v){this[set]('step',v)}
    // get step_angle(){return this[get]('step_angle')}
    // set step_angle(v){this[set]('step_angle',v)}
    // get offsets(){return this[get]('offsets')}
    // set offsets(v){this[set]('offsets',v)}
    // get do_center(){return this[get]('do_center')}
    // set do_center(v){this[set]('do_center',v)}
    // get attrs_option(){return this[get]('attrs_option')}
    // set attrs_option(v){this[set]('attrs_option',v)}
    // get is_main_elm(){return this[get]('is_main_elm')}
    // set is_main_elm(v){this[set]('is_main_elm',v)}
    get is_order_row(){return this[get]('is_order_row')}
    set is_order_row(v){this[set]('is_order_row',v)}
    get stage(){return this[get]('stage')}
    set stage(v){this[set]('stage',v)}
    get inset(){return this[get]('inset')}
    set inset(v){this[set]('inset',v)}
  }
  return DepositeSpecificationRow;
}

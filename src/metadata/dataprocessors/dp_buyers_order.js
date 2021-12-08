/**
 *
 *
 * @module dp_buyers_order
 *
 * Created by Evgeniy Malyarov on 25.11.2021.
 */

exports.DpBuyers_order = class DpBuyers_order extends Object {
  get clr_in() {
    return this.clr.clr_in;
  }
  set clr_in(v) {
    const {clr} = this;
    this.clr = $p.cat.clrs.composite_ref('clr_in', clr.clr_out.empty() ? clr : clr.clr_out, v);
  }

  get clr_out() {
    return this.clr.clr_out;
  }
  set clr_out(v) {
    const {clr} = this;
    this.clr = $p.cat.clrs.composite_ref('clr_out', clr.clr_in.empty() ? clr : clr.clr_in, v);
  }
}

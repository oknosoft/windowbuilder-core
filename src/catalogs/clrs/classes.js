
// если класс не включён в exclude, заготовки конструкторов система создаст автоматически
export const exclude = ['cat.clrs'];

export function classes({cat, enm, classes, symbols}, exclude)  {
    
  const {CatObj, CatManager, TabularSectionRow} = classes;
  const {get, set} = symbols;
  
  class CatClrsManager extends CatManager {

  }

  class CatClrs extends CatObj {
    get ral(){return this[get]('ral')}
    set ral(v){this[set]('ral',v)}
    get machine_tools_clr(){return this[get]('machine_tools_clr')}
    set machine_tools_clr(v){this[set]('machine_tools_clr',v)}
    get clr_str(){return this[get]('clr_str')}
    set clr_str(v){this[set]('clr_str',v)}
    get clr_out(){return this[get]('clr_out')}
    set clr_out(v){this[set]('clr_out',v)}
    get clr_in(){return this[get]('clr_in')}
    set clr_in(v){this[set]('clr_in',v)}
    get grouping(){return this[get]('grouping')}
    set grouping(v){this[set]('grouping',v)}
    get area_src(){return this[get]('area_src')}
    set area_src(v){this[set]('area_src',v)}
    get predefined_name(){return this[get]('predefined_name')}
    set predefined_name(v){this[set]('predefined_name',v)}
    get parent(){return this[get]('parent')}
    set parent(v){this[set]('parent',v)}
    get composition(){return this[get]('composition')}
    set composition(v){this[get]('composition').load(v)}

    is(name) {
      return this._manager.predefined[name] === this;
    }

    color(elm) {
      let {clr_str, clr_in, clr_out} = this;
      let {project, layer}  = elm;

      if(project.props.bw) {
        return new project._scope.Color(1, 1, 1, 0.92);
      }
      if(!layer) {
        layer = project.activeLayer;
      }

      if(project.props._reflected && !layer?.flipped || !project.props._reflected && layer?.flipped){
        if(!clr_out.empty() && clr_out.clr_str) {
          clr_str = clr_out.clr_str;
        }
      }
      else{
        if(!clr_in.empty() && clr_in.clr_str) {
          clr_str = clr_in.clr_str;
        }
      }

      if(!clr_str) {
        clr_str = elm.defaultClrStr || '#fff';
      }

      let clr = clr_str.split(',');
      if(clr.length == 1) {
        if(clr_str[0] != '#') {
          clr_str = '#' + clr_str;
        }
        clr = new paper.Color(clr_str);
        clr.alpha = 0.93;
      }
      else if(clr.length == 4) {
        clr = new paper.Color(clr[0], clr[1], clr[2], clr[3]);
      }
      else if(clr.length == 3) {
        if(elm.path && elm.path.bounds) {
          clr = new paper.Color({
            stops: [clr[0], clr[1], clr[2]],
            origin: elm.path.bounds.bottomLeft,
            destination: elm.path.bounds.topRight,
            alpha: 0.96
          });
        }
        else {
          clr = new paper.Color(clr[0]);
        }
      }
      return clr;
    }
  }

  class CatClrsCompositionRow extends TabularSectionRow {
    get is_supplier(){return this[get]('is_supplier')}
    set is_supplier(v){this[set]('is_supplier',v)}
    get nom(){return this[get]('nom')}
    set nom(v){this[set]('nom',v)}
    get coefficient(){return this[get]('coefficient')}
    set coefficient(v){this[set]('coefficient',v)}
  }

  classes.CatClrsManager = CatClrsManager;
  classes.CatClrs = CatClrs;
  classes.CatClrsCompositionRow = CatClrsCompositionRow;
     
}

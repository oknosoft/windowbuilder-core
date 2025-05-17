
export const exclude = ['cat.elmVisualization'];

export function classes({cat, md, classes, symbols}, exclude)  {
  const {CatObj, CatManager, TabularSectionRow, DataStruct} = classes;
  const {get, set, struct} = symbols;

  class CatElmVisualizationManager extends CatManager {
  }
  classes.CatElmVisualizationManager = CatElmVisualizationManager;

  class CatElmVisualization extends CatObj {
    get svg_path(){return this[get]('svg_path')}
    set svg_path(v){this[set]('svg_path',v)}
    get note(){return this[get]('note')}
    set note(v){this[set]('note',v)}
    get attributes(){return this[get]('attributes')}
    set attributes(v){this[set]('attributes',v)}
    get rotate(){return this[get]('rotate')}
    set rotate(v){this[set]('rotate',v)}
    get offset(){return this[get]('offset')}
    set offset(v){this[set]('offset',v)}
    get side(){return this[get]('side')}
    set side(v){this[set]('side',v)}
    get elm_side(){return this[get]('elm_side')}
    set elm_side(v){this[set]('elm_side',v)}
    get cx(){return this[get]('cx')}
    set cx(v){this[set]('cx',v)}
    get cy(){return this[get]('cy')}
    set cy(v){this[set]('cy',v)}
    get angle_hor(){return this[get]('angle_hor')}
    set angle_hor(v){this[set]('angle_hor',v)}
    get priority(){return this[get]('priority')}
    set priority(v){this[set]('priority',v)}
    get mode(){return this[get]('mode')}
    set mode(v){this[set]('mode',v)}
    get origin(){return this[get]('origin')}
    set origin(v){this[set]('origin',v)}
    get predefined_name(){return this[get]('predefined_name')}
    set predefined_name(v){this[set]('predefined_name',v)}
    get sketch_view(){return this[get]('sketch_view')}
    set sketch_view(v){this[get]('sketch_view').load(v)}
    get params(){return this[get]('params')}
    set params(v){this[get]('params').load(v)}

    /**
     * @summary Рисует визуализацию
     * @param {BuilderElement} elm элемент, к которому привязана визуализация
     * @param {GroupVisualization} parent слой, в который помещаем путь
     * @param {Number|Array.<Number>} offset
     * @param {CatClrs} [clr]
     * @param {Number} [offset0]
     * @param {Boolean} [reflected]
     */
    draw({elm, parent, offset, clr, offset0, reflected}) {
      if(!parent.isInserted()) {
        return;
      }
      // проверим, надо ли рисовать для текущего `reflected`
      let dashArray = undefined;
      let exit = this.sketch_view.count();
      for(const {kind} of this.sketch_view) {
        if(reflected) {
          if(kind.is('outer')) {
            exit = 0;
          }
          if(kind.is('outer1')) {
            exit = 0;
            dashArray = [3, 4];
          }
        }
        else {
          if((kind.is('inner'))) {
            exit = 0;
          }
          if((kind.is('inner1'))) {
            exit = 0;
            dashArray = [3, 4];
          }
        }
      }


      try {
        const {project, generatrix, inner, outer, b, e} = elm;
        const {CompoundPath, PointText, Path, Color} = project._scope;

        let subpath;

        if(this.svg_path.indexOf('{"method":') == 0){

          const attr = JSON.parse(this.svg_path);
          if(attr.dashArray){
            dashArray = attr.dashArray;
          }

          if(['subpath_inner', 'subpath_outer', 'subpath_generatrix', 'subpath_median'].includes(attr.method)) {
            if(attr.method == 'subpath_outer') {
              subpath = outer.getSubPath(b.points().outer, e.points().outer).equidistant(attr.offset || 10);
            }
            else if(attr.method == 'subpath_inner') {
              subpath = inner.getSubPath(e.points().inner, b.points().inner).equidistant(attr.offset || 10);
            }
            else if(attr.method == 'subpath_median') {
              if(elm.isLinear()) {
                subpath = new Path({
                  project,
                  dashArray,
                  segments: [b.points().outer.add(b.points().inner).divide(2), e.points().outer.add(e.points().inner).divide(2)]
                })
                  .equidistant(attr.offset || 0);
              }
              else {
                const inner = inner.getSubPath(e.points().inner, b.points().inner);
                inner.reverse();
                const outer = outer.getSubPath(b.points().outer, e.points().outer);
                const li = inner.length / 50;
                const lo = outer.length / 50;
                subpath = new Path({project, dashArray});
                for(let i = 0; i < 50; i++) {
                  subpath.add(inner.getPointAt(li * i).add(outer.getPointAt(lo * i)).divide(2));
                }
                subpath.simplify(0.8);
                if(attr.offset) {
                  subpath = subpath.equidistant(attr.offset);
                }
              }
            }
            else {
              if(this.mode === 3) {
                const outer = offset0 < 0;
                attr.offset -= -elm.d1 + elm.width;
                if(outer) {
                  offset0 = -offset0;
                  attr.offset = -(attr.offset || 0);
                }
                const b = elm.generatrix.getPointAt(offset0 || 0);
                const e = elm.generatrix.getPointAt((offset0 + offset) || elm.generatrix.length);
                subpath = elm.generatrix.getSubPath(b, e).equidistant(attr.offset || 0);
              }
              else {
                subpath = elm.generatrix.getSubPath(elm.b, elm.e).equidistant(attr.offset || 0);
              }
            }
            subpath.parent = parent;
            subpath.strokeWidth = attr.strokeWidth || 4;
            subpath.strokeColor = attr.strokeColor || 'red';
            subpath.strokeCap = attr.strokeCap || 'round';
          }
        }
        else if(this.svg_path){

          if(this.mode === 1) {
            //const attr = JSON.parse(this.attributes || '{}');
            const {fontFamily, fontSize, ...attributes} = this.attributes;
            subpath = new PointText(Object.assign({
              project,
              parent,
              fillColor: 'black',
              dashArray,
              fontFamily: fontFamily || project.props.fontFamily,
              fontSize: fontSize || project.props.fontSize,
              content: this.svg_path,
            }, attributes, this.origin.empty() ? null : {_visualization: true, guide: false}));
          }
          else {
            const fillColor = new Color('white'); // elm.constructor.clr_by_clr.call(elm, clr.empty() ? elm.clr : clr);
            if(dashArray && reflected) {
              fillColor.alpha = 0.12;
            }
            subpath = new CompoundPath(Object.assign({
              project,
              parent,
              pathData: this.svg_path,
              strokeColor: 'black',
              fillColor,
              strokeScaling: false,
              dashArray,
              pivot: [0, 0],
              opacity: elm.opacity
            }, this.origin.empty() ? null : {_visualization: true, guide: false}));
          }

          if(elm.is('Filling')) {
            subpath.position = elm.bounds.topLeft.add(offset);
          }
          else {
            
            // угол касательной
            let angle_hor;
            if(elm.isLinear() || offset < 0) {
              angle_hor = generatrix.getTangentAt(0).angle;
            }
            else if(offset > generatrix.length) {
              angle_hor = generatrix.getTangentAt(generatrix.length).angle;
            }
            else {
              angle_hor = generatrix.getTangentAt(offset).angle;
            }

            if((this.rotate != -1 || elm.orientation.is('hor')) && angle_hor != this.angle_hor){
              subpath.rotation = angle_hor - this.angle_hor;
            }

            offset += generatrix.getOffsetOf(generatrix.getNearestPoint(b.points().outer));

            const p0 = generatrix.getPointAt(offset > generatrix.length ? generatrix.length : offset || 0);

            if(this.elm_side == -1){
              // в середине элемента
              const p1 = inner.getNearestPoint(p0);
              const p2 = outer.getNearestPoint(p0);
              subpath.position = p1.add(p2).divide(2);
            }
            else if(!this.elm_side){
              // изнутри
              subpath.position = inner.getNearestPoint(p0);
            }
            else{
              // снаружи
              subpath.position = outer.getNearestPoint(p0);
            }
          }
        }
        if(!this.origin.empty()) {
          subpath.on({
            mouseenter(event) {
              this.strokeWidth = 1.4;
              this.project._scope.tool.canvasCursor(`cursor-text-select`);
            },
            mouseleave(event) {
              this.strokeWidth = 1;
              this.project._scope.tool.canvasCursor('cursor-arrow-white');
            },
            mousedown(event) {
              event.stop();
            },
            click(event) {
              event.stop();
            },
          });
        }
      }
      catch (e) {
        console.error(e);
      }

    }
  }
  classes.CatElmVisualization = CatElmVisualization;

  class CatElmVisualizationParamsRow extends TabularSectionRow{
    get param(){return this[get]('param')}
    set param(v){this[set]('param',v)}
  }
  classes.CatElmVisualizationParamsRow = CatElmVisualizationParamsRow;

  class CatElmVisualizationSketchViewRow extends TabularSectionRow{
    get kind(){return this[get]('kind')}
    set kind(v){this[set]('kind',v)}
  }
  classes.CatElmVisualizationSketchViewRow = CatElmVisualizationSketchViewRow;


  
}


/*
 * Дополнительные методы справочника Визуализация элементов
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * Created 08.04.2016
 *
 * @module cat_elm_visualization
 */

exports.CatElm_visualization = class CatElm_visualization extends Object {

  /**
   * Рисует визуализацию
   * @param elm {BuilderElement} элемент, к которому привязана визуализация
   * @param layer {Contour} слой, в который помещаем путь
   * @param offset {Number|Array.<Number>}
   * @param clr {CatClrs}
   * @param [offset0] {Number}
   * @param [reflected] {Boolean}
   */
  draw({elm, layer, offset, clr, offset0, reflected}) {
    if(!layer.isInserted()) {
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
      const {project} = layer;
      const {CompoundPath, PointText, Path, constructor} = project._scope;

      let subpath;

      if(this.svg_path.indexOf('{"method":') == 0){

        const attr = JSON.parse(this.svg_path);
        if(attr.dashArray){
          dashArray = attr.dashArray;
        }

        if(['subpath_inner', 'subpath_outer', 'subpath_generatrix', 'subpath_median'].includes(attr.method)) {
          const {rays} = elm;
          if(!rays) {
            return;
          }
          if(attr.method == 'subpath_outer') {
            subpath = rays.outer.get_subpath(elm.corns(1), elm.corns(2)).equidistant(attr.offset || 10);
          }
          else if(attr.method == 'subpath_inner') {
            subpath = rays.inner.get_subpath(elm.corns(3), elm.corns(4)).equidistant(attr.offset || 10);
          }
          else if(attr.method == 'subpath_median') {
            if(elm.is_linear()) {
              subpath = new Path({
                project,
                dashArray,
                segments: [elm.corns(1).add(elm.corns(4)).divide(2), elm.corns(2).add(elm.corns(3)).divide(2)]
              })
                .equidistant(attr.offset || 0);
            }
            else {
              const inner = rays.inner.get_subpath(elm.corns(3), elm.corns(4));
              inner.reverse();
              const outer = rays.outer.get_subpath(elm.corns(1), elm.corns(2));
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
              subpath = elm.generatrix.get_subpath(b, e).equidistant(attr.offset || 0);
            }
            else {
              subpath = elm.generatrix.get_subpath(elm.b, elm.e).equidistant(attr.offset || 0);
            }
          }
          subpath.parent = layer._by_spec;
          subpath.strokeWidth = attr.strokeWidth || 4;
          subpath.strokeColor = attr.strokeColor || 'red';
          subpath.strokeCap = attr.strokeCap || 'round';
        }
      }
      else if(this.svg_path){

        if(this.mode === 1) {
          const attr = JSON.parse(this.attributes || '{}');
          subpath = new PointText(Object.assign({
            project,
            layer,
            parent: layer._by_spec,
            fillColor: 'black',
            dashArray,
            fontFamily: $p.job_prm.builder.font_family,
            fontSize: attr.fontSize || 60,
            content: this.svg_path,
          }, attr, this.origin.empty() ? null : {_visualization: true, guide: false}));
        }
        else {
          subpath = new CompoundPath(Object.assign({
            project,
            layer,
            parent: layer._by_spec,
            pathData: this.svg_path,
            strokeColor: 'black',
            fillColor: elm.constructor.clr_by_clr.call(elm, clr.empty() ? elm._row.clr : clr),
            strokeScaling: false,
            dashArray,
            pivot: [0, 0],
            opacity: elm.opacity
          }, this.origin.empty() ? null : {_visualization: true, guide: false}));
        }

        if(elm instanceof constructor.Filling) {
          subpath.position = elm.bounds.topLeft.add(offset);
        }
        else {
          const {generatrix, rays: {inner, outer}} = elm;
          // угол касательной
          let angle_hor;
          if(elm.is_linear() || offset < 0) {
            angle_hor = generatrix.getTangentAt(0).angle;
          }           
          else if(offset > generatrix.length) {
            angle_hor = generatrix.getTangentAt(generatrix.length).angle;
          }
          else {
            angle_hor = generatrix.getTangentAt(offset).angle;
          }

          if((this.rotate != -1 || elm.orientation == $p.enm.orientations.Горизонтальная) && angle_hor != this.angle_hor){
            subpath.rotation = angle_hor - this.angle_hor;
          }

          offset += generatrix.getOffsetOf(generatrix.getNearestPoint(elm.corns(1)));

          const p0 = generatrix.getPointAt(offset > generatrix.length ? generatrix.length : offset || 0);

          if(this.elm_side == -1){
            // в середине элемента
            const p1 = inner.getNearestPoint(p0);
            const p2 = outer.getNearestPoint(p0);

            subpath.position = p1.add(p2).divide(2);

          }else if(!this.elm_side){
            // изнутри
            subpath.position = inner.getNearestPoint(p0);

          }else{
            // снаружи
            subpath.position = outer.getNearestPoint(p0);
          }
        }
      }
      if(!this.origin.empty()) {
        subpath.on({
          mouseenter(event) {
            this.strokeWidth = 1.4;
            project._scope.canvas_cursor(`cursor-text-select`);
          },
          mouseleave(event) {
            this.strokeWidth = 1;
            project._scope.canvas_cursor('cursor-arrow-white');
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
      console.log(e);
    }

  }
};

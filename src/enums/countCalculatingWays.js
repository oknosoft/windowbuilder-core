
export function countCalculatingWays({enm, classes, symbols, utils}) {

  const {EnumManager, EnumObj} = classes;

  class EnmCountCalculatingWaysManager extends EnumManager {
    
  }
  classes.EnmCountCalculatingWaysManager = EnmCountCalculatingWaysManager;
  
  const methods = {
    element(attr) {
      const {specification, basis, stack, elm, layer, ...other} = attr;
      const {quantity, nom} = basis;
      if(!quantity && !nom.is_procedure) {
        return;
      }
      const specRow = specification.specRow({elm, layer});
      specRow.nom = nom;
      return specRow
        .qtyLen(attr)
        .angleAreaMass(attr);
    },

    cnn(attr) {
      const {specification, basis, stack, elm, elm2, rib, node, rawLength, layer, cnnOther, art1, curr, ...other} = attr;
      const {quantity, nom, owner: {coordinates, cnn_type}, algorithm} = basis;
      const sign = cnn_type.is('ii') ? -1 : 1;
      const len = rib?.length || rawLength || elm?.length || elm2?.length || 0;
      
      const specRow = specification.specRow({elm, layer});
      specRow.nom = nom;

      // рассчитаем количество
      const procedure = nom.is_procedure && coordinates.find({elm: basis.elm}) && cnn_type.is('t');
      if(procedure) {
        const {Path} = elm.project._scope;
        specRow.elm = elm2.elm;
        let ray;
        if(elm2.cnn_side(elm).is('outer')) {
          ray = elm2.outer;
        }
        else {
          ray = elm2.inner.clone({insert: false, deep: false});
          ray.reverse();
        }
        const ept = (node?.name === 'b' ? elm.corns(1).add(elm.corns(4)) : elm.corns(2).add(elm.corns(3))).divide(2);
        const pt = ray.getNearestPoint(ept);
        const offset1 = ray.getOffsetOf(ray.getNearestPoint(elm2.corns(1)));
        const offset4 = ray.getOffsetOf(ray.getNearestPoint(elm2.corns(4)));
        const offset7 = elm2.corns(7) && ray.getOffsetOf(ray.getNearestPoint(elm2.corns(7)));
        let offset = offset1 < offset4 ? offset1 : offset4;
        if(offset7 && offset7 < offset) {
          offset = offset7;
        }
        const pt0 = ray.getPointAt(offset);
        const path = ray.get_subpath(pt0, pt);
        specRow.len = path.length * (basis.coefficient || 0.001);
      }
      else if(nom.is_pieces) {
        if(!basis.coefficient) {
          specRow.qty = basis.quantity;
        }
        else {
          specRow.qty = ((len - sign * 2 * basis.sz) * basis.coefficient * basis.quantity - 0.5)
            .round(nom.rounding_quantity);
        }
      }
      else {
        specRow.qty = basis.quantity;

        // если указано cnnOther, берём не размер соединения, а размеры предыдущего и последующего
        if(!algorithm.is('gb_short') && !algorithm.is('gb_long') && (basis.sz || basis.coefficient)) {
          let sz = basis.sz, finded, qty;
          if(cnnOther) {
            cnnOther.specification.findRows({nom}, (row) => {
              sz += row.sz;
              qty = row.quantity;
              return !(finded = true);
            });
          }
          if(!finded) {
            if(algorithm.is('w2') && elm2) {
              ;
            }
            else {
              sz *= 2;
            }
          }
          if(!specRow.qty && finded && art1) {
            specRow.qty = qty;
          }
          specRow.len = (((len - sign * sz) * 2).round() / 2) * (basis.coefficient || 0.001);
        }
      }

      // если указана формула - выполняем
      if(!basis.formula.empty()) {
        const qty = basis.formula.execute(attr);
        // если формула является формулой условия, используем результат, как фильтр
        if(basis.formula.condition_formula && !qty){
          specRow.qty = 0;
        }
      }

      // визуализация svg-dx
      if(specRow.dop === -1 && nom.visualization.mode === 3 && curr) {
        const {sub_path, outer, profile: {generatrix}} = curr;
        const pt = generatrix.getNearestPoint(sub_path[outer ? 'lastSegment' : 'firstSegment'].point);
        specRow.width = generatrix.getOffsetOf(pt) / 1000;
        if(outer) {
          specRow.alp1 = -1;
        }
      }
      else {
        specRow.angleAreaMass(attr);
      }
      return specRow.angleAreaMass(attr);
    },

    furn(attr) {
      return methods[attr.basis.is_procedure_row ? 'furnProcedure' : 'element'].call(this, attr);
    },

    furnProcedure(attr) {
      const {layer, cache, basis, specification} = attr;
      // для правого открывания, инвертируем координату
      const invert = layer.direction.is('right');
      // получаем элемент через сторону фурнитуры
      const elm = layer.profileByFurnSide(basis.side, cache);
      // profile._len - то, что получится после обработки
      // row_spec.len - сколько взять (отрезать)
      // len - геометрическая длина без учета припусков на обработку
      // свойство номенклатуры размер до фурнпаза
      const {length, nom: {sizefurn}, b, e} = elm;
      // в зависимости от значения константы add_d, вычисляем dx1
      const dx1 = sizefurn; // $p.job_prm.builder.add_d ? sizefurn : 0;
      // длина с поправкой на фурнпаз
      const faltz = length - 2 * sizefurn;

      let coordin = 0;

      const {offset_option: offset, transfer_option: transfer, overmeasure} = basis;
      if(offset.is('formula')){
        if(!basis.formula.empty()){
          coordin = basis.formula.execute({elm, layer, contour: layer, len: length, sizefurn, dx1, faltz, invert, dop_row: basis});
        }
      }
      else if(offset.is('faltz')){
        coordin = faltz + basis.contraction;
      }
      else if(offset.is('handle')){
        // строим горизонтальную линию от нижней границы контура, находим пересечение и offset
        const {generatrix} = elm;
        const hor = layer.handleLine(elm, cache.profiles);
        coordin = generatrix.getOffsetOf(generatrix.intersectPoint(hor)) -
          generatrix.getOffsetOf(generatrix.getNearestPoint(b.points().outer)) +
          (invert ? basis.contraction : -basis.contraction);
      }
      else if(offset.is('center')){
        // не мудрствуя, присваиваем половину длины
        coordin = length / 2 + (invert ? basis.contraction : -basis.contraction);
      }
      else{
        if(invert){
          if(offset.is('e')){
            coordin = basis.contraction;
          }
          else{
            coordin = length - basis.contraction;
          }
        }
        else{
          if(offset.is('e')){
            coordin = length - basis.contraction;
          }
          else{
            coordin = basis.contraction;
          }
        }
      }

      const procRow = specification.procedures.add({elm: elm?.index, procedure: basis.nom});
      
      if(['nea','through','inverse'].some(name => transfer.is(name))) {
        let nearest = elm.nearest();
        if(transfer.is('through')){
          const joined = nearest.joined_nearests().reduce((acc, cur) => {
            if(cur !== elm){
              acc.push(cur);
            }
            return acc;
          }, []);
          if(joined.length){
            nearest = joined[0];
          }
        }
        procRow.elm = nearest.index;
        const {outer} = elm;
        const nouter = nearest.outer;
        const point = outer.getPointAt(outer.getOffsetOf(outer.getNearestPoint(b.points().outer)) + coordin);
        if(transfer.is('inverse')){
          procRow.len = nouter.getOffsetOf(nouter.getNearestPoint(nearest.e.points().outer)) - nouter.getOffsetOf(nouter.getNearestPoint(point));
        }
        else {
          procRow.len = nouter.getOffsetOf(nouter.getNearestPoint(point)) - nouter.getOffsetOf(nouter.getNearestPoint(nearest.b.points().outer));
        }
        // если сказано учесть припуск - добавляем dx0
        if(overmeasure){
          procRow.len += nearest.dx0;
        }
      }
      else {
        procRow.len = coordin;
        if(overmeasure){
          procRow.len += elm.dx0;
        }
      }
      procRow.len = (procRow.len * 5).round() / 5;
    },
    
    coloring(attr) {
      
    },
    
    area(attr) {
      return methods.element.call(this, attr);
    },
    
    len_prm(attr) {
      
    },

    formulas(attr) {
      const {specification, basis, stack, elm, layer, ...other} = attr;
      const {formula} = basis;
      if(!formula.empty()) {
        const specRow = methods.element.call(this, attr);
        const qty = formula.execute({...attr, row_ins: basis, row_spec: specRow, specRow});
        if(formula.condition_formula && !specRow.qty) {
          specRow.del();
        }
      }
    },
    
    not_found() {
      throw new Error(`Способ расчёта '${this.synonym}' не поддержан`);
    }
  };

  class EnmCountCalculatingWays extends EnumObj {
    calculate({specification, basis, stack, ...other}) {
      return (methods[this.latin] || methods.not_found).call(this, {specification, basis, stack, ...other});
    }
  }
  classes.EnmCountCalculatingWays = EnmCountCalculatingWays;
}

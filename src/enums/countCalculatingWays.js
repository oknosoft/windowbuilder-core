
export function countCalculatingWays({enm, classes, symbols, utils}) {

  const {EnumManager, EnumObj} = classes;

  class EnmCountCalculatingWaysManager extends EnumManager {
    
  }
  classes.EnmCountCalculatingWaysManager = EnmCountCalculatingWaysManager;
  
  const methods = {
    element({specification, basis, stack, elm, layer, ...other}) {
      const {quantity, nom} = basis;
      if(!quantity && !nom.is_procedure) {
        return;
      }
      const specRow = specification.specRow({elm, layer});
      specRow.nom = nom;
      return specRow;
    },

    cnn(attr) {
      return methods.element.call(this, attr);
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
      const specRow = methods.element.call(this, attr);
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

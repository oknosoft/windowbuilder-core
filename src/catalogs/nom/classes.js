
export const exclude = [/*'cat.nom'*/];

export function classes({cat, classes, symbols}, exclude)  {
  const {CatNom: CatObj} = classes;
  const {get, set} = symbols;

  class CatNom extends CatObj{
    get presentation(){
      const {article} = this;
      return article ? `${article} ${super.presentation}` : super.presentation; 
    }

    /**
     * Возвращает значение допреквизита минимальный объём
     */
    get minVolume() {
      if(!this.hasOwnProperty('_min_volume')){
        const {extra_fields, _manager} = this;
        if(!_manager.hasOwnProperty('_min_volume')) {
          _manager._min_volume = _manager.root.cch.properties.predefined('min_volume');
        }
        if(_manager._min_volume) {
          const row = extra_fields.find({property: _manager._min_volume});
          this._min_volume = row ? row.value : 0;
        }
        else {
          this._min_volume = 0;
        }
      }
      return this._min_volume;
    }
  }
  classes.CatNom = CatNom;
}

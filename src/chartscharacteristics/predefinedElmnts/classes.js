
// если класс не включён в exclude, заготовки конструкторов система создаст автоматически
export const exclude = [/*'cch.properties'*/];

export function classes({cat, enm, classes, symbols}, exclude)  {
    
  const {CchPredefinedElmntsManager: CchManager} = classes;
  
  class CchPredefinedElmntsManager extends CchManager {

    load(aattr, force){
      const objs = super.load(aattr, force);
      const {predefined} = cat.nom.index;
      for(const obj of objs) {
        const {parent, synonym} = obj;
        if(parent.synonym === 'nom') {
          predefined[synonym] = obj.value;
        }
      }
    }
  }
  classes.CchPredefinedElmntsManager = CchPredefinedElmntsManager;
  
     
}

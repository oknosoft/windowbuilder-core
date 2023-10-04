
export class History {

  #raw = {};

  constructor(owner) {
    this.#raw.owner = owner;
  }
  
  get editor() {
    return this.#raw.owner;
  }
  
  get project() {
    return this.editor.project;
  }

  /**
   * Выделяет элемент или узел
   */
  select(items) {
    const {project, editor} = this;
    let deselect;
    for(const {item, node, shift} of items) {
      if(item) {
        if(node) {
          item.generatrix[node === 'b' ? 'firstSegment' : 'lastSegment'].selected = true;
        }
        else if(item.cnstr) {
          item.activate();
          //editor.eve.emit('elm_activated', item);
        }
        else {
          deselect = true;
          item.selected = true;
          if(item.layer){
            // editor.eve.emit_async('layer_activated', item.layer);
            // editor.eve.emit_async('elm_activated', item, shift);
          }
        }
      }
    }
    //deselect && project.deselect_all_points();
  }

  /**
   * Снимает выделение элемента или узла
   */
  deselect(items) {
    const {project} = this;
    if(!items || !items.length || items.some(({item}) => !item)) {
      project.deselectAll();
      //return editor.eve.emit('elm_deactivated', null);
    }
    else {
      for(const {item, node} of items) {
        if(item) {
          if(node) {
            item.generatrix[node === 'b' ? 'firstSegment' : 'lastSegment'].selected = false;
          }
          else {
            item.selected = false;
          }
        }
      }
    }
  }
  
}

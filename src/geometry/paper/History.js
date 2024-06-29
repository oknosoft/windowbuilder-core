
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
    const {project, editor: {eve}} = this;
    let deselect;
    for(const {item, node, shift} of items) {
      if(item) {
        item.layer.activate();
        if(node) {
          item.generatrix[node === 'b' ? 'firstSegment' : 'lastSegment'].selected = true;
          eve.emit_promise('select', {type: 'elm', project, elm: item, node, layer: item.layer, shift});
        }
        else if(item.cnstr) {
          item.activate();
          eve.emit_promise('select', {type: 'layer', project, layer: item, shift});
        }
        else {
          deselect = true;
          item.selected = true;
          eve.emit_promise('select', {type: 'elm', project, elm: item, layer: item.layer, shift});
        }
      }
    }
    //deselect && project.deselect_all_points();
  }

  /**
   * Снимает выделение элемента или узла
   */
  deselect(items) {
    const {project, editor: {eve}} = this;
    if(!items || !items.length || items.some(({item}) => !item)) {
      project.deselectAll();
      eve.emit_promise('deselect', {type: 'all', project});
    }
    else {
      for(const {item, node} of items) {
        if(item) {
          if(node) {
            item.generatrix[node === 'b' ? 'firstSegment' : 'lastSegment'].selected = false;
            eve.emit_promise('deselect', {type: 'node', project, elm: item, node});
          }
          else {
            item.selected = false;
            eve.emit_promise('deselect', {type: 'elm', project, elm: item});
          }
        }
      }
    }
    
  }
  
}

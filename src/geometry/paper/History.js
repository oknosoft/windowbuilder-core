import {Contour} from '../Contour';
import {DimensionLine} from '../DimensionLine';

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
    const events = {};
    for(const {item, node, shift} of items) {
      if(item instanceof Contour) {
        item.activate();
        events.layer = {project, layer: item, shift};
        events.last = 'layer';
      }
      else if(item instanceof DimensionLine) {
        item.selected = true;
        events.dimension = {project, elm: item, layer: null, shift};
        events.last = 'dimension';
      }
      else if(item) {
        item.layer?.activate?.();
        if(node) {
          item[node].point.selected = true;
          events.node = {project, elm: item, node: item[node], layer: item.layer, shift};
          events.last = 'node';
        }
        else {
          item.selected = true;
          const {selectedElements} = project;
          events.elm = {project, elm: selectedElements?.length > 1 ? selectedElements : item, layer: item.layer, shift};
          events.last = 'elm';
        }
      }
    }
    eve.emit_promise('select', {type: events.last, ...events[events.last]});
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
            item[node].point.selected = false;
            eve.emit_promise('deselect', {type: 'node', project});
          }
          else {
            item.selected = false;
            eve.emit_promise('deselect', {type: 'elm', project});
          }
        }
      }
    }
    
  }
  
}

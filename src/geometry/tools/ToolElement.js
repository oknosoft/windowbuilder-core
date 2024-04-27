
import paper from 'paper/dist/paper-core';

export class ToolElement extends paper.Tool {

  /**
   * Общие действия при активизации инструмента
   */
  onActivate(cursor) {
    this.canvasCursor = this.canvasCursor.bind(this);
    this.canvasCursor(cursor);
    this.eve?.emitAsync?.('tool_activated', this);
  }
  
  onRedraw() {
    
  }

  canvasCursor(name) {
    const {classList} = this.project?.view?.element || {};
    for(let i=0; i<classList.length; i++){
      const class_name = classList[i];
      if(class_name == name) {
        return;
      }
      else if((/\bcursor-\S+/g).test(class_name)) {
        classList.remove(class_name);
      }
    }
    classList.add(name);
  }

  get eve() {
    return this._scope.eve;
  }

  get project() {
    return this._scope.project;
  }

  get mover() {
    return this._scope._mover;
  }
  
}

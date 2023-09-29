
import paper from 'paper/dist/paper-core';

class EditorInvisible extends paper.PaperScope {

  #canvas = null;
  
  /**
   * Создаёт проект с заданным типом канваса
   * @param format
   */
  create_scheme() {
    const {Scheme, projects} = this;
    if(!this.#canvas) {
      this.#canvas = document.createElement('CANVAS');
      this.#canvas.height = 480;
      this.#canvas.width = 480;
      this.setup(this.#canvas);
    }
    if(projects.length && !(projects[0] instanceof Scheme)) {
      projects[0].remove();
    }
    return new Scheme(this.#canvas, this, true);
  }
}

export default EditorInvisible;

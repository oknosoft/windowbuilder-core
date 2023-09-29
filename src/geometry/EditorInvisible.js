
import paper from 'paper/dist/paper-core';
import Scheme from './Scheme';

class EditorInvisible extends paper.PaperScope {
  
  /**
   * Создаёт проект с заданным типом канваса
   * @param format
   */
  createScheme(canvas) {
    const {view, projects} = this;
    if(!canvas) {
      canvas = document.createElement('CANVAS');
      canvas.height = 480;
      canvas.width = 480;
    }
    while(projects.length && !(projects[0] instanceof Scheme)) {
      projects[0].remove();
    }
    return projects.length ? projects[0] : new Scheme(canvas);
  }
}

export default EditorInvisible;

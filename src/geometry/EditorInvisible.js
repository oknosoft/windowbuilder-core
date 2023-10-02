
import paper from 'paper/dist/paper-core';
import {Scheme} from './Scheme';
import {ToolSelect} from './tools/ToolSelect';

export class EditorInvisible extends paper.PaperScope {
  
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
    const project = projects.length ? projects[0] : new Scheme(canvas);
    if(!this.tool) {
      const tool = new ToolSelect();
      tool.activate();
    }
    return project;
  }
}

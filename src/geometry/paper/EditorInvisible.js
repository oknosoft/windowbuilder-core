
import paper from 'paper/dist/paper-core';
import {Scheme} from '../Scheme';
import {ToolSelect} from '../tools/ToolSelect';
import {History} from './History';

export class EditorInvisible extends paper.PaperScope {
  
  constructor(...attr) {
    super(...attr);
    this.settings.handleSize = 12;
    this.history = new History(this);
  }


  /**
   * Создаёт проект с заданным типом канваса
   * @param {HTMLCanvasElement} canvas
   * @param {MetaEngine} root - ссылка на $p
   * @return {Scheme}
   */
  createScheme(canvas, root) {
    const {view, projects} = this;
    if(!canvas) {
      canvas = document.createElement('CANVAS');
      canvas.height = 480;
      canvas.width = 480;
    }
    while(projects.length && !(projects[0] instanceof Scheme)) {
      projects[0].remove();
    }
    const project = projects.length ? projects[0] : new Scheme(canvas, root);
    if(!this.tool) {
      const tool = new ToolSelect();
      tool.activate();
    }
    return project;
  }
  
  cmd(name, attr) {
    this.history[name](attr);
  }
}

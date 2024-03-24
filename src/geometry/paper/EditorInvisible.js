
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
  
  createTestProduct() {
    const {activeLayer, props} = this.project;
    props.loading = true;
    for(const profile of activeLayer.profiles.reverse()) {
      profile.remove();
    }
    const profiles = [
      activeLayer.createProfile({b: [1400, 1000], e: [100, 1000]}),
      activeLayer.createProfile({b: [100, 1000], e: [100, 0]}),
      activeLayer.createProfile({b: [100, 0], e: [1400, 0]}),
      activeLayer.createProfile({b: [1400, 0], e: [1400, 1000]}),
      activeLayer.createProfile({b: [500, 1000], e: [500, 0]}),
      activeLayer.createProfile({b: [700, 1000], e: [800, 0]}),
      activeLayer.createProfile({b: [750, 500], e: [1400, 600]}),
    ];
    for(const profile of profiles) {
      activeLayer.skeleton.addProfile(profile);
    }
    props.loading = false;
    this.project.zoomFit(activeLayer.bounds);
    this.project.redraw();
  }
  
  cmd(name, attr) {
    this.history[name](attr);
  }
}

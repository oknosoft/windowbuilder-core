import paper from 'paper/dist/paper-core';
import {GeneratrixElement} from './GeneratrixElement';

export class ProfileLine extends GeneratrixElement.Profile {

  get elmType() {
    return this.project.root.enm.elmTypes.line;
  }
  
}

GeneratrixElement.Line = ProfileLine;

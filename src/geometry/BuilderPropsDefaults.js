
export default function defaults(project, props) {

  const {_scope: {settings}, root} = project;
  if(!settings.carcass) {
    settings.carcass = root.jobPrm.get('carcass') || 'carcass'; // carcass|normal|plane
    settings.handleSize = 14;
    settings.gridStep = 50;
    settings.showGrid = true;    
    settings.snapAngle = 45;
    settings.snap = 'grid'; //angle,grid,none 
  }
}


export default function defaults(project, props) {

  const {settings} = project._scope;
  if(!settings.carcass) {
    settings.carcass = 'carcass'; // carcass|normal|plane
    settings.handleSize = 14;
    settings.gridStep = 50;
  }
  
  const base_sys = project.root?.cch.predefinedElmnts.find({synonym: "base_sys"});
  if(base_sys) {
    props.sys = base_sys.value;
  }
}

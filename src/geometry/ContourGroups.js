
import paper from 'paper/dist/paper-core';

class GroupVisualization extends paper.Group {}
class GroupLayers extends paper.Group {}
class GroupProfiles extends paper.Group {}
class GroupFillings extends paper.Group {}

export function contourGroups(parent) {
  new GroupVisualization({parent, name: 'visualization', guide: true});
  new GroupLayers({parent, name: 'topLayers'});
  new GroupProfiles({parent, name: 'profiles'});
  new GroupFillings({parent, name: 'fillings'});
  new GroupLayers({parent, name: 'bottomLayers'});
}

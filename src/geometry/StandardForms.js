import paper from 'paper/dist/paper-core';

export class StandardForms {

  constructor(project) {
    this.project = project;
  }

  prepare({layer, profiles}) {
    const {project} = this;
    const {props, root: {enm: {positions}, ui}} = project;
    const list = [positions.left, positions.right, positions.top, positions.bottom];
    const offset = new paper.Point();
    const profilesBounds = this.bounds(profiles);
    props.loading = true;

    layer.clear();
    const {bounds} = project;
    // спросить привязку
    if(bounds?.area && profilesBounds.area) {
      return ui.dialogs.input_value({
        title: 'Положение элементов',
        text: 'С какой стороны расположить новые элементы по отношению к нарисованным ранее?',
        list,
        initialValue: positions.right,
      })
        .then((pos) => {
          offset.pos = pos || 'right';
          const light = 360;
          switch (pos) {
            case 'left':
              offset.x = bounds.bottomLeft.x - profilesBounds.width - light;
              break;
            case 'top':
              offset.y = -bounds.topLeft.y - profilesBounds.height - light;
              break;
            case 'bottom':
              offset.y = bounds.bottomLeft.y + light;
              break;
            default:
              offset.x = bounds.bottomRight.x + light;
          }
          layer.three.rotation = [0, 0, 0];
          layer.three.position = [offset.x, 0, 0];
          return {project, offset, profilesBounds};
        });
    }
    return Promise.resolve({project, offset, profilesBounds});
  }
  
  bounds(profiles) {
    if(Array.isArray(profiles)) {
      let left = Infinity, right = -Infinity, top = -Infinity, bottom = Infinity;
      for(const {b, e} of profiles) {
        if(b[0] < left) {
          left = b[0];
        }
        if(e[0] < left) {
          left = e[0];
        }
        if(b[0] > right) {
          right = b[0];
        }
        if(e[0] > right) {
          right = e[0];
        }
        
        if(b[1] < bottom) {
          bottom = b[1];
        }
        if(e[1] < bottom) {
          bottom = e[1];
        }
        if(b[1] > top) {
          top = b[1];
        }
        if(e[1] > top) {
          top = e[1];
        }
      }
      return new paper.Rectangle({from: [left, bottom], to: [right, top]});
    }
    return new paper.Rectangle({from: [0, 1000], to: [1000, 0]});
  }
}

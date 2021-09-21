
/**
 * Сечение фрагмена изделия
 *
 * Created by Evgeniy Malyarov on 28.08.2021.
 */


class ProfileCut extends BaseLine {

  constructor(attr) {
    super(attr);
    if(!attr.preserv_parent) {
      this.parent = this.project.l_connective;
    }
    Object.assign(this.generatrix, {
      strokeColor: 'grey',
      fillColor: '',
      strokeScaling: false,
      strokeWidth: 1,
      dashOffset: 0,
      dashArray: [],
    });

    // создаём детей
    const content = this.text_content();
    new PathUnselectable({parent: this, name: 'callout1', strokeColor: 'black', guide: true, strokeScaling: false, strokeWidth: 1});
    new PathUnselectable({parent: this, name: 'callout2', strokeColor: 'black', guide: true, strokeScaling: false, strokeWidth: 1});
    new PathUnselectable({parent: this, name: 'thick1', strokeColor: 'black', strokeScaling: false, strokeWidth: 5});
    new PathUnselectable({parent: this, name: 'thick2', strokeColor: 'black', strokeScaling: false, strokeWidth: 5});
    new TextUnselectable({
      parent: this,
      name: 'text1',
      //justification: 'center',
      fillColor: 'black',
      fontFamily: consts.font_family,
      fontSize: consts.font_size,
      content,
    });
    new TextUnselectable({
      parent: this,
      name: 'text2',
      //justification: 'center',
      fillColor: 'black',
      fontFamily: consts.font_family,
      fontSize: consts.font_size,
      content,
    });
  }

  /**
   * Возвращает тип элемента (сечение)
   */
  get elm_type() {
    return $p.enm.elm_types.Сечение;
  }

  setSelection(selection) {
    paper.Item.prototype.setSelection.call(this.generatrix, selection);
  }

  text_content() {
    const letters = ['A','B','C','D','E','F','G','H','I','J','K'];
    const {elm, layer: {_ox}, elm_type} = this;
    let index = 0;
    for(const row of _ox.coordinates) {
      if(row.elm_type !== elm_type) {
        continue;
      }
      if(row.elm === elm) {
        break;
      }
      index++;
    }
    return (index + 1) >= letters.length ? `X${elm}` : letters[index];
  }

  redraw() {
    const {children: {thick1, thick2, callout1, callout2, text1, text2}, generatrix, length} = this;
    const tlength = length > 200 ? 90 : (length/2 - 10);
    thick1.removeSegments();
    thick2.removeSegments();
    callout1.removeSegments();
    callout2.removeSegments();
    if(tlength > 0) {
      thick1.addSegments([generatrix.firstSegment.point, generatrix.getPointAt(tlength)]);
      thick2.addSegments([generatrix.getPointAt(length - tlength), generatrix.lastSegment.point]);
      const pt1 = thick1.getPointAt(tlength / 2);
      const pt2 = thick2.getPointAt(tlength / 2);
      const tnormal = thick1.getNormalAt(0);
      const ttangent = thick1.getTangentAt(0);
      text1.position = pt1.add(tnormal.multiply(tlength + 30));
      text2.position = pt2.add(tnormal.multiply(tlength + 30));

      const c1base = pt1.subtract(ttangent.multiply(20)).add(tnormal.multiply(20));
      callout1.moveTo(c1base.add(tnormal.multiply(60)));
      callout1.lineTo(c1base);
      callout1.lineTo(c1base.add(tnormal.multiply(24)).add(ttangent.multiply(6)));
      callout1.lineTo(c1base.add(tnormal.multiply(24)).subtract(ttangent.multiply(6)));
      callout1.lineTo(c1base);

      const c2base = pt2.add(ttangent.multiply(20)).add(tnormal.multiply(20));
      callout2.moveTo(c2base.add(tnormal.multiply(60)));
      callout2.lineTo(c2base);
      callout2.lineTo(c2base.add(tnormal.multiply(24)).add(ttangent.multiply(6)));
      callout2.lineTo(c2base.add(tnormal.multiply(24)).subtract(ttangent.multiply(6)));
      callout2.lineTo(c2base);
    }

  }

}

EditorInvisible.ProfileCut = ProfileCut;

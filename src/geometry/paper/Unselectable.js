
export default function (paper) {
    
  class TextUnselectable extends paper.PointText {

    setSelection(selection) {
      
    }
  }

  paper.TextUnselectable = TextUnselectable;
}

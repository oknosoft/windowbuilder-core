
export default function (paper) {
    
  class TextUnselectable extends paper.PointText {
    setSelection(selection) {}
  }

  class PathUnselectable extends paper.Path {
    setSelection(selection) {}
  }

  paper.TextUnselectable = TextUnselectable;
  paper.PathUnselectable = PathUnselectable;
}

/**
 * Class representing a dot.
 * @extends Point
 */
class GraphEdge {
  /**
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @param {profile} ProfileItem
   */
  constructor({startVertex, endVertex, profile}) {
    this.startVertex = startVertex;
    this.endVertex = endVertex;
    this.profile = profile;
    this.weight = 0;
  }

  /**
   * @return {string}
   */
  getKey() {
    const startVertexKey = this.startVertex.getKey();
    const endVertexKey = this.endVertex.getKey();

    return `${startVertexKey}_${endVertexKey}`;
  }

  /**
   * @return {GraphEdge}
   */
  reverse() {
    const tmp = this.startVertex;
    this.startVertex = this.endVertex;
    this.endVertex = tmp;

    return this;
  }

  /**
   * @return {string}
   */
  toString() {
    return this.getKey();
  }
}

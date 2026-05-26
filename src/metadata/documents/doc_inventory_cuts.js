
exports.DocInventory_cuts = class DocInventory_cuts extends Object {
  before_save(attr) {
    this.materials.group_by('nom,characteristic,len,width', 'qty,quantity');
  }
}

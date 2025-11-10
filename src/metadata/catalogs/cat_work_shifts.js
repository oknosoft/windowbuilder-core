
exports.CatWork_shifts = class CatWork_shifts extends Object {

  /**
   * @summary Порядок смен в пределах дня
   * @desc Если две смены начинаются в одно и то же время, у них одинаковый порядок
   * @type {number}
   */
  get timeOrder() {
    const row = this.work_shift_periodes.get(0);
    if(row) {
      const {begin_time} = row;
      return begin_time.getHours() * 3600 + begin_time.getMinutes() * 60 + begin_time.getSeconds();
    }
    return 0;
  }

  /**
   * @summary Продолжительность смены
   * @desc В секундах
   * @type {number}
   */
  get duration() {
    let res = 0;
    for(const row of this.work_shift_periodes) {
      res += (row.end_time - row.begin_time) / 1000;
    }
    return res.round();
  }
}

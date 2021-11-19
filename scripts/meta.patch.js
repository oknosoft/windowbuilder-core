/**
 * Верхний уровень корректировки метаданных
 *
 * @module meta.patch.js
 *
 * Created by Evgeniy Malyarov on 18.05.2019.
 */

const include = ['*'];
const exclude = [
  'cat.servers',
  'cch.mdm_groups',
  //'cat.property_values_hierarchy',
  'doc.registers_correction',
  'ireg.delivery_schedules',
  'ireg.delivery_scheme',
];
const minimal = [];
const writable = ['*'];
const read_only = ['cat.countries'];

module.exports = function(meta) {
  for(const cls in meta) {
    const mgrs = meta[cls];
    for(const name in mgrs) {

      if(!include.includes('*') && !include.includes(`${cls}.${name}`)) {
        delete mgrs[name];
      }
      else if(exclude.includes(`${cls}.${name}`)) {
        delete mgrs[name];
      }
      else if(minimal.includes(`${cls}.${name}`)) {
        for(const fld in mgrs[name].fields) {
          if(['parent', 'owner'].includes(fld)) continue;
          delete mgrs[name].fields[fld];
        }
        for(const fld in mgrs[name].tabular_sections) {
          delete mgrs[name].tabular_sections[fld];
        }
      }

      if(name === 'branches' && cls === 'cat') {
        'back_server,repl_server,owner,mode,server'.split(',').forEach((fld) => delete mgrs[name].fields[fld]);
        delete mgrs[name].tabular_sections.servers;
        delete mgrs[name].has_owners;
      }

      if(name === 'abonents' && cls === 'cat') {
        for(const fld in mgrs[name].fields) {
          if(!['name', 'id'].includes(fld)) {
            delete mgrs[name].fields[fld];
          }
        }
        for(const fld in mgrs[name].tabular_sections) {
          if(fld !== 'servers') {
            delete mgrs[name].tabular_sections[fld];
          }
        }
      }

      if(name === 'http_apis' && cls === 'cat') {
        delete mgrs[name].fields.server;
      }

      if(name === 'lead_src' && cls === 'cat') {
        delete mgrs[name].fields.server;
      }

      if(!writable.includes('*') && !writable.includes(`${cls}.${name}`)) {
        mgrs[name].read_only = true;
      }
      else if(read_only.includes(`${cls}.${name}`)) {
        mgrs[name].read_only = true;
      }
    }
  }
}

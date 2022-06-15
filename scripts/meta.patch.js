/**
 * Верхний уровень корректировки метаданных
 *
 * @module meta.patch.js
 *
 * Created by Evgeniy Malyarov on 18.05.2019.
 */

const path = require('path');
const fs = require('fs');
const local_meta = path.resolve(__dirname, '../src/metadata');

const include = ['*'];
const exclude = [
  'cat.servers',
  'cch.mdm_groups',
  'doc.registers_correction',
  'ireg.i18n',
  'ireg.delivery_schedules',
  'ireg.delivery_scheme',
];
const minimal = [];
const writable = ['*'];
const read_only = ['cat.countries'];

const cls_map = {cat: 'catalogs', doc: 'documents', enm: 'enums', rep: 'reports', cch: 'chartscharacteristics'};

module.exports = function(meta, $p) {
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
          if(!['name', 'id', 'no_mdm'].includes(fld)) {
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

      // возможность скорректировать метаданные из файлов
      const filename = path.join(local_meta, cls_map[cls] || cls, `${cls}_${name}.json`);
      if(fs.existsSync(filename)) {
        const mp = require(filename);
        $p.utils._patch(meta, mp);
      }
    }
  }
}

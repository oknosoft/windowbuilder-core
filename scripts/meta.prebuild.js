/**
 * Модуль сборки *.js по описанию метаданных
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2022
 */

'use strict';

const fs = require('fs');
const path = require('path');

process.env.DEBUG = 'prebuild:,-not_this';
const debug = require('debug')('prebuild:');

const patch = require('./meta.patch');

debug('Читаем конструктор и плагины');

// путь настроек приложения
const settings_path = path.resolve(__dirname, '../config/app.settings.js');
const custom_constructors = [
  path.resolve(__dirname, '../src/metadata/common/custom_constructors.js'),
  path.resolve(__dirname, '../src/metadata/common/ProductFrame.js'),
];

// текст модуля начальных настроек приложения для включения в итоговый скрипт
const settings = fs.readFileSync(settings_path, 'utf8');

// конфигурация подключения к CouchDB
const config = require(settings_path)();

// если истина, добавляем в текст комментарии
const jsdoc = Boolean(process.env.JSDOC);

// эти классы создадим руками
const custom_constructor = [
  'CatFormulasParamsRow',
  'CatCharacteristicsParamsRow',
  'DpBuyers_orderProduct_paramsRow',
  'CatProduction_paramsFurn_paramsRow',
  'CatProduction_paramsProduct_paramsRow',
  'CatProduction_paramsFurn_paramsRow',
  'CatInsertsProduct_paramsRow',
  'CatCnnsSizesRow',
  'CatInsertsSelection_paramsRow',
  'CatCnnsSelection_paramsRow',
  'CatFurnsSelection_paramsRow',
  'DocCredit_card_orderPayment_detailsRow',
  'DocDebit_bank_orderPayment_detailsRow',
  'DocCredit_bank_orderPayment_detailsRow',
  'DocDebit_cash_orderPayment_detailsRow',
  'DocCredit_cash_orderPayment_detailsRow',
  'CatProjectsExtra_fieldsRow',
  'CatStoresExtra_fieldsRow',
  'CatCharacteristicsExtra_fieldsRow',
  'DocPurchaseExtra_fieldsRow',
  'DocCalc_orderExtra_fieldsRow',
  'DocCredit_card_orderExtra_fieldsRow',
  'DocDebit_bank_orderExtra_fieldsRow',
  'DocCredit_bank_orderExtra_fieldsRow',
  'DocDebit_cash_orderExtra_fieldsRow',
  'DocCredit_cash_orderExtra_fieldsRow',
  'DocSellingExtra_fieldsRow',
  'CatBranchesExtra_fieldsRow',
  'CatPartnersExtra_fieldsRow',
  'CatNomExtra_fieldsRow',
  'CatOrganizationsExtra_fieldsRow',
  'CatDivisionsExtra_fieldsRow',
  'CatUsersExtra_fieldsRow',
  'CatProduction_paramsExtra_fieldsRow',
  'CatWork_centersExtra_fieldsRow',
  'CatParameters_keysParamsRow',
  'CatCharacteristicsCoordinatesRow',
  'CatCharacteristicsInsertsRow',
];

// конструктор metadata-core и плагин metadata-pouchdb
const MetaEngine = require('metadata-core')
  .plugin(require('metadata-pouchdb'))
  .plugin(require('metadata-abstract-ui/meta'))
  .plugin(require('metadata-abstract-ui'));

debug('Создаём объект MetaEngine');

const $p = new MetaEngine();    // подключим метадату
let jstext = '';            // в этой переменной будем накапливать текст модуля
const {DataManager} = MetaEngine.classes;

debug('Настраиваем MetaEngine');


// инициализация и установка параметров
$p.wsql.init((prm) => {

  // разделитель для localStorage
  prm.local_storage_prefix = config.local_storage_prefix;

  // по умолчанию, обращаемся к зоне 0
  prm.zone = config.zone;

  // расположение couchdb
  prm.couch_path = config.couch_local;

}, ($p) => {

  const db = new MetaEngine.classes.PouchDB(config.couch_local + 'meta', {
    skip_setup: true,
    auth: config.user_node,
  });

  debug(`Читаем описание метаданных из CouchDB ${config.couch_local}`);
  return db.info()
    .then((info) => {
      debug(`Подключение к ${info.host}`);
      return db.allDocs({
        include_docs: true,
        attachments: true,
        startkey: 'meta',
        endkey: 'meta\ufff0',
      });
  })
    .catch((err) => {
      debug('Не удалось получить объект meta из CouchDB\nПроверьте логин, пароль и строку подключения');
      debug(err);
      process.exit(1);
    })
    .then(({rows}) => {
      const _m = {};
      for(const {doc} of rows) {
        $p.utils._patch(_m, doc);
      }
      delete _m._id;
      delete _m._rev;

      // фильтруем и корректируем метаданные
      patch(_m, $p);

      return $p.md.init(_m);
    })
    .then((_m) => {

      debug('Создаём текст модуля конструкторов данных');
      let text = create_modules(_m);

      debug('Выполняем текст модуля, чтобы создать менеджеры данных');
      eval(text);

      debug('Получаем скрипт таблиц alasql');
      $p.md.create_tables((sql) => {

        debug('Записываем результат');
        
        fs.writeFileSync(path.resolve(__dirname, '../dist/init_sql.js'), 
          '/* eslint-disable */\nmodule.exports = function init_sql({wsql}) {\n'+
          'wsql.alasql(\'' + sql + '\', [])};\n\n');

        fs.writeFileSync(path.resolve(__dirname, '../dist/init_meta.js'),
          '/* eslint-disable */\nmodule.exports = function init_meta({md}) {\n'+
          'md.init(' + JSON.stringify(_m) + ')};\n\n');
        
        fs.writeFileSync(path.resolve(__dirname, '../dist/init.js'),
          '/* eslint-disable */\nmodule.exports = function init_classes($p) {\n'+text+'};\n\n');
        
        process.exit(0);
      });

    })
    .catch((err) => {
      debug(err);
      process.exit(1);
    });
});


function create_modules(_m) {

  const sys_nsmes = ['log', 'meta_objs', 'meta_fields', 'scheme_settings'];
  const categoties = {
      cch: {mgr: 'ChartOfCharacteristicManager', proto: 'CatObj', dir: 'chartscharacteristics'},
      cacc: {mgr: 'ChartOfAccountManager', proto: 'CatObj'},
      cat: {mgr: 'CatManager', proto: 'CatObj', dir: 'catalogs'},
      bp: {mgr: 'BusinessProcessManager', proto: 'BusinessProcessObj'},
      tsk: {mgr: 'TaskManager', proto: 'TaskObj'},
      doc: {mgr: 'DocManager', proto: 'DocObj', dir: 'documents'},
      ireg: {mgr: 'InfoRegManager', proto: 'RegisterRow'},
      areg: {mgr: 'AccumRegManager', proto: 'RegisterRow'},
      dp: {mgr: 'DataProcessorsManager', proto: 'DataProcessorObj', dir: 'dataprocessors'},
      rep: {mgr: 'DataProcessorsManager', proto: 'DataProcessorObj', dir: 'reports'},
    };
  let text = `(function(){
  const {MetaEventEmitter,EnumManager,CatManager,DocManager,DataProcessorsManager,ChartOfCharacteristicManager,ChartOfAccountManager,
    InfoRegManager,AccumRegManager,BusinessProcessManager,TaskManager,CatObj,DocObj,TabularSectionRow,DataProcessorObj,
    RegisterRow,BusinessProcessObj,TaskObj} = $p.constructor.classes;

  const _define = Object.defineProperties;

`;


  // менеджеры перечислений
  for (const name in _m.enm){
    text += `$p.enm.create('${name}');\n`;
  }

  // менеджеры объектов данных, отчетов и обработок
  for (const category in categoties) {
    for (const name in _m[category]) {
      if (sys_nsmes.indexOf(name) == -1) {
        text += obj_constructor_text(_m, category, name, categoties);
      }
    }
  }

  for(const path of custom_constructors) {
    text += fs.readFileSync(path, 'utf8');
  }

  return text + '})();\n';

}

function fld_desc(fld, mfld) {
  let text = '';
  if(jsdoc) {
    if(!mfld.synonym) {
      if(fld === 'predefined_name') {
        mfld.synonym = 'Имя предопределенных данных';
      }
      else if(fld === 'type') {
        mfld.synonym = 'Тип значения';
      }
      else if(fld === 'parent') {
        mfld.synonym = 'Группа (иерархия)';
      }
    }
    text += `/**\n* @summary ${mfld.synonym}`;
    if(mfld.tooltip) {
      text += `\n* @desc ${mfld.tooltip}`;
    }
    text += `\n* @type ${mfld.type.types
      .map((type) => {
        if(type.includes('.')) {
          return DataManager.prototype.obj_constructor.call({class_name: type, constructor_names: {}});
        }
        return type.charAt(0).toUpperCase() + type.substr(1);
      })
      .join('|')}`;
    text += '\n*/\n';
  }
  return text;
}

function obj_constructor_text(_m, category, name, categoties) {

  const {mgr, proto, dir} = categoties[category];
  
  let meta = _m[category][name],
    fn_name = DataManager.prototype.obj_constructor.call({class_name: category + '.' + name, constructor_names: {}}),
    managerName = `${fn_name}Manager`,
    text = jsdoc ? 
      `\n/**
* @summary ${$p.msg.meta[category]} _${meta.synonym}_ 
* @see {@link ${managerName}} - менеджер данных`
      : '', f, props = '';

  const filename = dir && path.resolve(__dirname, `../src/metadata/${dir}/${category}_${name}.js`);
  let extModule;
  if(dir && fs.existsSync(filename)) {
    try {
      extModule = require(filename);
    }
    catch(err) {}
  };

  if(jsdoc) {
    const desc = dir && path.resolve(__dirname, `../src/metadata/${dir}/${category}_${name}.md`);
    if(desc && fs.existsSync(desc)) {
      text += `\n* @desc ${fs.readFileSync(desc).toString()}`;
    }
    else if(meta.illustration) {
      text += `\n* @desc ${meta.illustration}`;
    }
    const example = dir && path.resolve(__dirname, `../src/metadata/${dir}/${category}_${name}_ex.md`);
    if(example && fs.existsSync(example)) {
      text += `\n* @example ${fs.readFileSync(example).toString()}`;
    }
  }

  const extender = extModule && extModule[fn_name] && extModule[fn_name].toString();
  const objText = extender && extender.substring(extender.indexOf('{') + 1, extender.lastIndexOf('}') - 1);

  const substitute = extModule && extModule.substitute && extModule.substitute.toString();
  const substituteText = substitute && substitute.substring(substitute.indexOf('{') + 3, substitute.lastIndexOf('}'));

  
  const managerText = extModule && extModule[managerName] && extModule[managerName].toString();

  if(jsdoc) {
    text += '\n* @extends metadata.' + proto;
    text += '\n*/\n';
  }
  text += `class ${fn_name} extends ${proto}{\n`;

  // если описан конструктор объекта, используем его
  if(objText && extModule[fn_name]._replace){
    text += objText;
  }
  else {
    const exclude = extModule?.[fn_name]?.exclude || [];
    // реквизиты по метаданным
    if (meta.fields) {
      for (f in meta.fields) {
        if(exclude.includes(f)) {
          continue;
        }
        const mfld = meta.fields[f];
        text += fld_desc(f, mfld);
        
        if(category === 'cch' && f === 'type') {
          text += `get type(){const {type} = this._obj; return typeof type === 'object' ? type : {types: []}}
set type(v){this._obj.type = typeof v === 'object' ? v : {types: []}}\n`;
        }
        else {

          const mf = f.endsWith('clr') && mfld;
          if(mf && mf.type.str_len === 72 && !mf.type.types.includes('cat.color_price_groups')) {
            text += `get ${f}(){return $p.cat.clrs.getter(this._obj.${f})}\n`;
          }
          else {
            text += `get ${f}(){return this._getter('${f}')}\n`;
          }

          if(!meta.read_only) {
            text += `set ${f}(v){this._setter('${f}',v)}\n`;
          }
        }
      }
    }
    else {
      for (f in meta.dimensions) {
        text += `get ${f}(){return this._getter('${f}')}\nset ${f}(v){this._setter('${f}',v)}\n`;
      }
      for (f in meta.resources) {
        text += `get ${f}(){return this._getter('${f}')}\nset ${f}(v){this._setter('${f}',v)}\n`;
      }
      for (f in meta.attributes) {
        text += `get ${f}(){return this._getter('${f}')}\nset ${f}(v){this._setter('${f}',v)}\n`;
      }
    }

    // табличные части по метаданным - устанавливаем геттер и сеттер для табличной части
    for (const ts in meta.tabular_sections) {
      if(jsdoc) {
        const row_fn_name = DataManager.prototype.obj_constructor.call({class_name: category + '.' + name, constructor_names: {}}, ts);
        const mfld = meta.tabular_sections[ts];
        text += `/**\n* @summary ${mfld.synonym}`;
        if(mfld.tooltip) {
          text += `\n* @desc ${mfld.tooltip}`;
        }
        text += `\n* @see ${row_fn_name}`;
        text += `\n* @type metadata.TabularSection`;
        text += '\n*/\n';
      }
      text += `get ${ts}(){return this._getter_ts('${ts}')}\nset ${ts}(v){this._setter_ts('${ts}',v)}\n`;
    }

    if(objText){
      text += objText;
    }
  }

  text += `}\n`;
  text += `$p.${fn_name} = ${fn_name};\n`;


  // табличные части по метаданным
  for (const ts in meta.tabular_sections) {

    // создаём конструктор строки табчасти
    const row_fn_name = DataManager.prototype.obj_constructor.call({class_name: category + '.' + name, constructor_names: {}}, ts);
    if(custom_constructor.includes(row_fn_name)) {
      continue;
    }

    if(jsdoc) {
      const mfld = meta.tabular_sections[ts];
      text += `\n/**\n* @summary Строка табчасти _${mfld.synonym}_ ${$p.msg.meta_parents[category]} _${meta.synonym}_`;
      if(mfld.tooltip) {
        text += `\n* @desc ${mfld.tooltip}`;  
      }      
      text += `\n* @see {@link ${fn_name}} - объект-владелец`;
      text += '\n* @extends metadata.TabularSectionRow';
      text += '\n*/\n';
    }
    text += `class ${row_fn_name} extends TabularSectionRow{\n`;

    // в прототипе строки табчасти создаём свойства в соответствии с полями табчасти
    for (const rf in meta.tabular_sections[ts].fields) {
      const mfld = meta.tabular_sections[ts].fields[rf];
      const mf = rf === 'clr' && mfld;
      text += fld_desc(rf, mfld);
      
      if(mf && mf.type.str_len === 72 && !mf.type.types.includes('cat.color_price_groups')) {
        text += `get ${rf}(){return $p.cat.clrs.getter(this._obj.clr)}`;
      }
      else {
        text += `get ${rf}(){return this._getter('${rf}')}`;
      }
      text += `\nset ${rf}(v){this._setter('${rf}',v)}\n`;
    }

    text += `}\n`;
    text += `$p.${row_fn_name} = ${row_fn_name};\n`;

  }
  
  if(jsdoc) {
    text += `\n/**\n* @summary ${$p.msg.meta_mgrs[category]} {@link ${fn_name}|${meta.synonym}}`;
    text += `\n* @see {@link ${fn_name}} - объект данных`;
    if(!managerText) {
      text += `\n* @class ${managerName}`;  
    }
    text += '\n* @extends metadata.' + mgr;
    text += '\n*/\n';
  }
  // если описан расширитель менеджера, дополняем
  if(managerText){
    text += managerText.replace('extends Object', `extends ${mgr}`);
    text += `\n$p.${category}.create('${name}', ${managerName}, ${extModule[managerName]._freeze ? 'true' : 'false'});\n`;
  }
  else{
    text += `$p.${category}.create('${name}');\n`;
  }

  return text;

}

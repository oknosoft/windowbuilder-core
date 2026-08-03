
(function ({md}) {
  
  // порядок загрузки
  function order () {
    const res = [
      new Set(['cch.properties']),
      new Set(),
      new Set(),
      new Set(),
      new Set(),
      new Set(),
      new Set(['cch.predefined_elmnts', 'ireg.currency_courses', 'ireg.margin_coefficients', 'doc.calc_order'])
    ];

    for(const class_name of md.classes().cat) {
      if(['servers', 'nom_units', 'meta_fields', 'meta_objs'].includes(class_name)) {
        continue;
      }
      else if(['abonents', 'property_values', 'property_values_hierarchy', 'contact_information_kinds', 'currencies'].includes(class_name)) {
        res[1].add(`cat.${class_name}`);
      }
      else if(class_name === 'users') {
        res[2].add(`cat.${class_name}`);
      }
      else if(class_name.includes('nom')) {
        res[3].add(`cat.${class_name}`);
      }
      else if(class_name === 'formulas') {
        res[5].add(`cat.${class_name}`);
      }
      else if(class_name === 'choice_params') {
        res[6].add(`cat.${class_name}`);
      }
      else{
        res[4].add(`cat.${class_name}`);
      }
    }

    return res;
  }

  // эти общие - их не режем и грузим сразу
  const common = [
    'cch.properties',
    'cat.abonents',
    'cat.price_groups',
    'cat.property_values',
    'cat.property_values_hierarchy',
    'cat.contact_information_kinds',
    'cat.cash_flow_articles',
    'cat.clrs',
    'cat.color_price_groups',
    'cat.delivery_areas',
    'cat.units',
    'cat.countries',
    'cat.currencies',
    'cat.scheme_settings',
    'cat.meta_ids',
    'cat.destinations',
    'cat.nom_groups',
    'cat.nom_kinds',
    'cat.elm_visualization',
    'cat.templates',
    'cat.http_apis',
    'cat.work_center_kinds',
    'cat.work_centers',
    'cat.work_shifts',
    'cat.stages',
    'cat.project_categories',
    'cat.lead_src',
  ];

  // эти режем по отделу
  const by_branch = [
    'cat.partners',
    'cat.branches',
    'cat.divisions',
    'cat.users',
    'cat.individuals',
    'cat.organizations',
    'cat.cashboxes',
    'cat.stores',
    'cch.predefined_elmnts',
  ];

  function ids() {
    const res = {};
    const classes = md.classes();
    const patch = {
      Po:	'po',
      Ic:	'ic',
      Ig:	'ig',
      Rc:	'rc',
      Wp:	'wp',
      Wt:	'wt',
      Pc:	'pc',
      Bi:	'bai',
      Bo:	'bao',
      Ps:	'ps',
      Ki:	'cbi',
      Ko:	'cbo',
      Co:	'co',
      Sl:	'sl',
      Pl:	'pl',
      Se:	'sce',
      Rs:	'prs',
      ab:	'abc',
      pk:	'epk',
      to:	'eto',
      oo:	'eoo',
      al:	'eal',
      lk:	'elk',
      lr:	'elr',
      vz:	'evz',
      Lf:	'epf',
      ta:	'eta',
      ds:	'eds',
      cu:	'ecu',
      sk:	'esk',
      pb:	'epb',
      sf:	'esf',
      od:	'eod',
      rq:	'erq',
      pd:	'epd',
      nd:	'end',
      cs:	'ecs',
      it:	'ei',
      gi:	'egi',
      ls:	'els',
      ci:	'eci',
      ld:	'el',
      nt:	'ent',
      co:	'ec',
      ot:	'eo',
      sc:	'esc',
      sz:	'es',
      cn:	'ecn',
      ol:	'eol',
      sx:	'esx',
      el:	'ee',
      ph:	'ep',
      st:	'est',
      il:	'eil',
      Mg:	'mg',
      Pr:	'pr',
      Pe:	'pe',
      Dg:	'dg',
      It:	'i18',
      Cs:	'cs',
      Cc:	'cc',
      Mc:	'mc',
      Pi:	'ipe',
      Ds:	'ds',
      Ba:	'ba',
      Cr:	'cr',
      Pv: 'pvv',
      Ci:	'cik',
      Nk:	'nk',
      Pk:	'pk',
      Sg:	'sg',
      Vz:	'vz',
      Is:	'ins',
      Ng:	'ng',
      Cn:	'cn',
      Nu:	'nu',
      Vl:	'v',
      Vh:	'vh',
      Mi:	'mi',
      Pd:	'p',
      An:	'abn',
      Br:	'br',
      Sr:	'srv',
      Ls:	'ls',
      Cb:	'cb',
      Pj:	'prk',
      Bn:	'bn',
      Uc:	'uc',
      Kp:	'k',
      Pb:	'pb',
      Ka:	'ka',
      Ld:	'ld',
      Ed:	'ds',
      Dd:	'dd',
      Nm:	'n',
      Px:	'prr',
      Og:	'og',
      Sp:	'sp',
      Mk:	'mc2',
      Sy:	'sys',
      Ce:	'cnn',
      Fr:	'frn',
      Cl:	'clr',
      Dp:	'dep',
      Uu:	'u',
      Pa:	'pa',
      Li:	'isl',
      Pm:	'pt',
      Wc:	'wpl',
      Da:	'da',
      Rl:	'prl',
      Dm:	'dm',
      Wh:	'str',
      Ws:	'str',
      Sx:	'sx',
      Mm:	'mpt',
      Cu:	'cou',
      Pn:	'prc',
      Ip:	'ip',
      Fs:	'f',
      Pf:	'pf',
      Cx:	'cx',
      Cg:	'clg',
      Pg:	'pg',
      Tm:	'tm',
      Ph:	'psg',
    }
    for(const area in classes) {
      for(const name of classes[area]) {
        const class_name = `${area}.${name}`;
        const meta = md.get(class_name);
        if(meta?.id) {
          const id = patch[meta.id] || meta.id;
          meta.id = id;
          res[class_name] = id;
          res[id] = class_name;
        }
        if(meta?.cachable === 'remote') {
          meta.cachable = 'doc';
        }
      }
    }
    return res;
  }

  Object.assign(order, {common, by_branch, ids});
  md.order = order;
  md._ids = ids();
  
})($p);

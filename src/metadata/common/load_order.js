
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
    'cat.delivery_directions',
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
    const classes = md.classes()
    for(const area in classes) {
      for(const name of classes[area]) {
        const class_name = `${area}.${name}`;
        const meta = md.get(class_name);
        if(meta?.id) {
          res[class_name] = meta.id; 
          res[meta.id] = class_name; 
        }
      }
    }
    return res;
  }

  Object.assign(order, {common, by_branch, ids});
  md.order = order;
  
})($p);

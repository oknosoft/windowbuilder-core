
export const meta = {
    tabulars: {
      applying: {
        name: "Применение",
        synonym: "Применение для элемента",
        tooltip: "Актуально для параметров, задаваемых для элемента. Позволяет задействовать параметр только для определённых типов элемента и положений. Например, параметр будет виден в интерфейсе для горизонтальных импостов и скрыт для рам и створок",
        fields: {
          elm_type: {
            synonym: "Тип элемента",
            multiline: false,
            tooltip: "",
            choiceParams: [
              {
                name: "ref",
                path: [
                  "Рама",
                  "Створка",
                  "Импост",
                  "Стекло",
                  "Заполнение"
                ]
              }
            ],
            choiceGrp: "elm",
            type: {
              types: [
                "enm.elm_types"
              ]
            }
          },
          pos: {
            synonym: "Положение/ориентация",
            multiline: false,
            tooltip: "",
            choiceParams: [
              {
                name: "ref",
                path: [
                  "Любое",
                  "Лев",
                  "Прав",
                  "Верх",
                  "Низ",
                  "Центр",
                  "Горизонтальная",
                  "Вертикальная",
                  "Наклонная"
                ]
              }
            ],
            choiceGrp: "elm",
            type: {
              types: [
                "enm.orientations",
                "enm.positions"
              ]
            }
          }
        }
      },
      use: {
        name: "use",
        synonym: "Применение для способов расчёта",
        tooltip: "Позволяет отключить проверку параметра при расчёте специфиации для строк с определённым способом расчёта количества. Например, условие должно проверяться при расчёте по периметру и не должно при расчёте по площади",
        fields: {
          count_calc_method: {
            synonym: "Расчет колич.",
            multiline: false,
            tooltip: "",
            choiceGrp: "elm",
            type: {
              types: [
                "enm.count_calculating_ways"
              ]
            }
          }
        }
      },
    },
};

export const propValue = {
  synonym: "Значение",
  choiceLinks: [
    {
      name: ["selection", "owner"],
      path: ["selection_params", "param"]
    },
  ],
  choiceType: {
    path: ["selection_params", "param"],
    elm: 0
  },
  type: {
    types: [
      "cat.property_values",
      "enm.sketch_view",
      "cat.nomGroups",
      "enm.coloring",
      "cat.production_params",
      "enm.opening",
      "cat.inserts",
      "cat.priceGroups",
      "cat.currencies",
      "enm.open_directions",
      "cat.color_price_groups",
      "cch.properties",
      "cat.clrs",
      "cat.elm_visualization",
      "cat.property_values_hierarchy",
      "cat.formulas",
      "cat.nom_prices_types",
      "cat.divisions",
      "enm.elm_types",
      "enm.align_types",
      "cat.parameters_keys",
      "cat.partners",
      "enm.sz_line_types",
      "enm.orientations",
      "cat.organizations",
      "cat.units",
      "enm.plan_detailing",
      "cat.abonents",
      "cat.work_shifts",
      "cat.work_center_kinds",
      "enm.positions",
      "cat.branches",
      "cat.cashboxes",
      "enm.open_types",
      "cat.nom",
      "cat.cnns",
      "cat.furns",
      "enm.inserts_glass_types",
      "enm.vat_rates",
      "enm.cnn_sides",
      "enm.nested_object_editing_mode",
      "cat.stores",
      "cat.values_options",
      "cat.delivery_areas",
      "cat.individuals",
      "cat.users",
      "cat.projects",
      "cat.characteristics",
      "cat.templates",
      "cat.delivery_directions",
      "number",
      "date",
      "string",
      "boolean",
    ],
    strLen: 1024,
    datePart: "date_time",
    digits: 15,
    fraction: 3
  }
};


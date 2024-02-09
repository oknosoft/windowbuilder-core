
import {classes as divisionsClasses, meta as divisions, exclude as divisionsExclude} from './divisions/meta';
import {classes as nomKindsClasses, meta as nomKinds, exclude as nomKindsExclude} from './nomKinds/meta';
import {classes as insertsClasses, meta as inserts, exclude as insertsExclude} from './inserts';
import {classes as nomClasses, meta as nom, exclude as nomExclude} from './nom';

export const meta = {
  divisions,
  nomKinds,
  nomUnits: {
    name: "ЕдиницыИзмерения",
    synonym: "Единицы измерения",
    illustration: "Перечень единиц измерения номенклатуры и номенклатурных групп",
    objPresentation: "Единица измерения",
    listPresentation: "Единицы измерения",
    inputBy: ["name", "id"],
    hierarchical: false,
    hasOwners: true,
    mainPresentation: "name",
    codeLength: 9,
    fields: {
      qualifier_unit: {
        synonym: "Единица по классификатору",
        choiceGrp: "elm",
        type: {
          types: ["cat.units"]
        }
      },
      heft: {
        synonym: "Вес",
        type: {
          types: ["number"],
          digits: 15,
          fraction: 3
        }
      },
      volume: {
        synonym: "Объем",
        type: {
          types: ["number"],
          "digits": 15,
          "fraction": 3
        }
      },
      coefficient: {
        synonym: "Коэффициент",
        type: {
          types: ["number"],
          digits: 10,
          fraction: 3
        }
      },
      rounding_threshold: {
        synonym: "Порог округления",
        type: {
          types: ["number"],
          digits: 10,
          fraction: 0
        }
      },
      owner: {
        synonym: "Номенклатура",
        mandatory: true,
        type: {
          types: [
            "cat.nom_groups",
            "cat.nom"
          ]
        }
      }
    },
    tabulars: {},
    cachable: "ram",
    id: "nu",
    aliases: ['nom_units'],
  },
  nom,
  inserts,
  workCenterKinds: {
    name: "ВидыРабочихЦентров",
    synonym: "Этапы производства (Виды РЦ)",
    illustration: "",
    objPresentation: "Вид рабочего центра",
    listPresentation: "",
    inputBy: ["name"],
    hierarchical: false,
    groupHierarchy: false,
    mainPresentation: "name",
    codeLength: 0,
    fields: {
      applying: {
        synonym: "Детализация",
        tooltip: "Детализация планирования (до элемента, продукции, заказа...)",
        choiceParams: [
          {
            name: "ref",
            "path": [
              "product",
              "layer",
              "parent",
              "elm",
              "order",
              "region"
            ]
          }
        ],
        choiceGrp: "elm",
        type: {
          types: ["enm.plan_detailing"],
        }
      },
      available: {
        synonym: "Всегда доступен",
        tooltip: "Не учитывать остатки мощностей",
        type: {
          types: [
            "boolean"
          ]
        }
      },
      predefined_name: {
        synonym: "",
        multiline: false,
        tooltip: "",
        type: {
          types: ["string"],
          strLen: 256
        }
      }
    },
    tabulars: {},
    cachable: "ram",
    id: "sg",
    common: true,
    aliases: ['work_center_kinds'],
  },
  workCenters: {
    name: "РабочиеЦентры",
    synonym: "Рабочие центры",
    illustration: "",
    objPresentation: "",
    listPresentation: "",
    inputBy: ["name", "id"],
    hierarchical: true,
    groupHierarchy: true,
    mainPresentation: "name",
    codeLength: 9,
    fields: {
      department: {
        synonym: "Подразделение",
        multiline: false,
        tooltip: "",
        choiceGrp: "elm",
        mandatory: true,
        type: {
          types: [
            "cat.divisions"
          ]
        }
      },
      "parent": {
        synonym: "",
        multiline: false,
        tooltip: "",
        type: {
          types: [
            "cat.work_centers"
          ]
        }
      }
    },
    tabulars: {
      work_center_kinds: {
        name: "ВидыРабочихЦентров",
        synonym: "Виды рабочих центров",
        tooltip: "",
        fields: {
          kind: {
            synonym: "Вид РЦ",
            multiline: false,
            tooltip: "",
            choiceGrp: "elm",
            mandatory: true,
            type: {
              types: [
                "cat.work_center_kinds"
              ]
            }
          }
        }
      }
    },
    cachable: "ram",
    id: "",
    common: true,
    aliases: ['work_centers'],
  },
};

export const exclude = [...divisionsExclude, ...nomKindsExclude, ...insertsExclude, ...nomExclude];

export const classes = [
  divisionsClasses,
  nomKindsClasses,
  insertsClasses,
  nomClasses,
];

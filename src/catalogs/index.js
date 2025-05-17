
import primitives from './primitives';
import {classes as divisionsClasses, meta as divisions, exclude as divisionsExclude} from './divisions/meta';
import {classes as nomKindsClasses, meta as nomKinds, exclude as nomKindsExclude} from './nomKinds/meta';
import {classes as nomClasses, meta as nom, exclude as nomExclude} from './nom';
import {classes as insertsClasses, meta as inserts, exclude as insertsExclude} from './inserts';
import {classes as cnnsClasses, meta as cnns, exclude as cnnsExclude} from './cnns';
import {classes as furnsClasses, meta as furns, exclude as furnsExclude} from './furns';
import {classes as productionParamsClasses, meta as productionParams, exclude as productionParamsExclude} from './productionParams';
import {classes as specificationsClasses, meta as specifications} from './specifications';
import {classes as clrsClasses, meta as clrs, exclude as clrsExclude} from './clrs';
import {classes as visualizationClasses, meta as elmVisualization, exclude as visualizationExclude} from './elmVisualization';
import {classes as clrGroupsClasses, meta as colorPriceGroups, exclude as clrGroupsExclude} from './colorPriceGroups';
import {classes as productsClasses, meta as products, exclude as productsExclude} from './products';
import {classes as parametersKeysClasses, meta as parametersKeys, exclude as parametersKeysExclude} from './parametersKeys/meta';
import {classes as paramsLinksClasses, meta as paramsLinks, exclude as paramsLinksExclude} from './paramsLinks/meta';

export const meta = {
  ...primitives,
  destinations: {
    name: "НаборыДополнительныхРеквизитовИСведений",
    splitted: false,
    synonym: "Наборы дополнительных реквизитов и сведений",
    illustration: "",
    objPresentation: "Набор дополнительных реквизитов и сведений",
    listPresentation: "",
    inputBy: ["name"],
    hierarchical: true,
    hasOwners: false,
    groupHierarchy: true,
    mainPresentation: "name",
    codeLength: 0,
    id: "ds",
    fields: {
      predefined_name: {
        synonym: "",
        multiline: false,
        tooltip: "",
        type: {
          types: ["string"],
          strLen: 256
        }
      },
      parent: {
        synonym: "Входит в группу",
        multiline: false,
        tooltip: "Группа, к которой относится набор.",
        type: {
          types: ["cat.destinations"]
        }
      }
    },
    tabulars: {
      extra_fields: {
        name: "ДополнительныеРеквизиты",
        synonym: "Дополнительные реквизиты",
        tooltip: "",
        fields: {
          property: {
            synonym: "Дополнительный реквизит",
            multiline: false,
            tooltip: "Дополнительный реквизит этого набора",
            choiceGrp: "elm",
            type: {
              types: ["cch.properties"]
            }
          },
          _deleted: {
            synonym: "Пометка удаления",
            multiline: false,
            tooltip: "Устанавливается при исключении дополнительного реквизита из набора,\nчтобы можно было вернуть связь с уникальным дополнительным реквизитом.",
            type: {
              types: ["boolean"]
            }
          }
        }
      },
      extra_properties: {
        name: "ДополнительныеСведения",
        synonym: "Дополнительные сведения",
        tooltip: "",
        fields: {
          property: {
            synonym: "Дополнительное сведение",
            multiline: false,
            tooltip: "Дополнительное сведение этого набора",
            choiceGrp: "elm",
            type: {
              types: ["cch.properties"]
            }
          },
          _deleted: {
            synonym: "Пометка удаления",
            multiline: false,
            tooltip: "Устанавливается при исключении дополнительного сведения из набора,\nчтобы можно было вернуть связь с уникальным дополнительным сведением.",
            type: {
              types: ["boolean"]
            }
          }
        }
      }
    },
    cachable: "ram"
  },
  divisions,
  elmVisualization,
  nomKinds,
  nom,
  inserts,
  cnns,
  ...furns,
  productionParams,
  specifications,
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
            path: ["product", "layer", "parent", "elm", "order", "region"]
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
      parent: {
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
  clrs,
  colorPriceGroups,
  products,
  parametersKeys,
  paramsLinks,
};

export const exclude = [
  ...divisionsExclude,
  ...nomKindsExclude,
  ...insertsExclude,
  ...nomExclude,
  ...cnnsExclude,
  ...furnsExclude,
  ...productionParamsExclude,
  ...clrsExclude,
  ...clrGroupsExclude,
  ...productsExclude,
  ...paramsLinksExclude,
  ...parametersKeysExclude,
  ...visualizationExclude,
];

export const classes = [
  divisionsClasses,
  nomKindsClasses,
  nomClasses,
  insertsClasses,
  cnnsClasses,
  furnsClasses,
  productionParamsClasses,
  specificationsClasses,
  clrsClasses,
  clrGroupsClasses,
  productsClasses,
  parametersKeysClasses,
  paramsLinksClasses,
  visualizationClasses,
];

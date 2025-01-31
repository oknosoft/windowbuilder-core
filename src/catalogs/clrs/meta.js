
export const meta = {
  name: "пзЦвета",
  splitted: false,
  synonym: "Цвета",
  illustration: "",
  objPresentation: "Цвет",
  listPresentation: "Цвета",
  inputBy: [
    "name",
    "ral",
    "id"
  ],
  hierarchical: true,
  hasOwners: false,
  groupHierarchy: true,
  mainPresentation: "name",
  codeLength: 9,
  id: "clr",
  fields: {
    ral: {
      synonym: "Код RAL",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "string"
        ],
        strLen: 20
      }
    },
    machine_tools_clr: {
      synonym: "Код для станка",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "string"
        ],
        strLen: 20
      }
    },
    clr_str: {
      synonym: "Цвет в построителе",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "string"
        ],
        strLen: 36
      }
    },
    clr_out: {
      synonym: "Цвет снаружи",
      multiline: false,
      tooltip: "",
      choiceParams: [
        {
          name: "clr_out",
          path: "00000000-0000-0000-0000-000000000000"
        },
        {
          name: "clr_in",
          path: "00000000-0000-0000-0000-000000000000"
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.clrs"
        ]
      }
    },
    clr_in: {
      synonym: "Цвет изнутри",
      multiline: false,
      tooltip: "",
      choiceParams: [
        {
          name: "clr_out",
          path: "00000000-0000-0000-0000-000000000000"
        },
        {
          name: "clr_in",
          path: "00000000-0000-0000-0000-000000000000"
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.clrs"
        ]
      }
    },
    grouping: {
      synonym: "Каширование",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.property_values"
        ]
      }
    },
    area_src: {
      synonym: "Источник площади",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "enm.coloring"
        ]
      }
    },
    predefined_name: {
      synonym: "",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "string"
        ],
        strLen: 256
      }
    },
    parent: {
      synonym: "Группа",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "cat.clrs"
        ]
      }
    }
  },
  tabulars: {
    composition: {
      name: "Состав",
      synonym: "Рецептура",
      tooltip: "",
      fields: {
        is_supplier: {
          synonym: "Поставщик",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.partners"
            ]
          }
        },
        nom: {
          synonym: "Пигмент",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.nom"
            ]
          }
        },
        coefficient: {
          synonym: "Коэффициент",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 8,
            fraction: 2
          }
        }
      }
    }
  },
  cachable: "ram",
  names: {
    "БезЦвета": "noColor",
    "БезЦветаИзнутри": "noColorIner",
    "БезЦветаСнаружи": "noColorOuter",
    "Белый": "white",
    "КакНом": "nom",
    "КакВедущий": "leading",
    "КакВедущийИзнутри": "leadingIner",
    "КакВедущийИнверсный": "leadingInverse",
    "КакВедущийСнаружи": "leadingOuter",
    "КакВоВставке": "inset",
    "КакИзделие": "product",
    "КакИзделиеИзнутри": "productIner",
    "КакИзделиеИнверсный": "productInverse",
    "КакИзделиеСнаружи": "productOuter",
    "КакЭлемент": "elm",
    "КакЭлементИзнутри": "elmIner",
    "КакЭлементИнверсный": "elmInverse",
    "КакЭлементСнаружи": "elmOuter",
    "Любой": "any",
    "НеВключатьВСпецификацию": "ignored",
    "Прозрачный": "transparent",
    "СЛУЖЕБНЫЕ": "service"
  }
};


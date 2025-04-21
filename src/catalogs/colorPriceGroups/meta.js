
export const meta = {
  name: "ЦветоЦеновыеГруппы",
  splitted: false,
  synonym: "Цвето-ценовые группы",
  illustration: "",
  objPresentation: "Цвето-ценовая группа",
  listPresentation: "Цвето-ценовые группы",
  inputBy: [
    "name",
    "id"
  ],
  hierarchical: false,
  hasOwners: false,
  groupHierarchy: true,
  mainPresentation: "name",
  codeLength: 9,
  fields: {
    color_price_group_destination: {
      synonym: "Назначение",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "enm.color_price_group_destinations"
        ]
      }
    },
    condition_formula: {
      synonym: "Формула условия",
      multiline: false,
      tooltip: "В этом поле можно указать дополнительное условие на языке javascript",
      choiceParams: [
        {
          name: "parent",
          path: "1cce6b82-73be-11e9-94bb-98d95b9a5346"
        },
        {
          name: "disabled",
          path: false
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.formulas"
        ]
      }
    },
    mode: {
      synonym: "Режим",
      multiline: false,
      tooltip: "Режим формулы",
      max: 1,
      min: 0,
      type: {
        types: [
          "number"
        ],
        digits: 1,
        fraction: 0
      }
    },
    hide_composite: {
      synonym: "Скрыть составные",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    clr: {
      synonym: "Приведение цвета",
      multiline: false,
      tooltip: "",
      choiceParams: [
        {
          name: "parent",
          path: "faf4d037-7d9a-4d4e-ad65-ba01caa36481"
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.clrs"
        ]
      }
    },
    captured: {
      synonym: "Захвачен",
      multiline: false,
      tooltip: "Реквизит подсистемы MDM. Указывает, что объект в настоящий момент, захвачен для редактирования. Может содержать Тег (строку, комментарий) захвата ",
      choiceGrp: "elm",
      type: {
        types: [
          "boolean",
          "string"
        ],
        "strLen": 50
      }
    },
    editor: {
      synonym: "Редактор",
      multiline: false,
      tooltip: "Реквизит подсистемы MDM, указывает на {@link CatUsers|Пользователя}, захватившего объект для редактирования",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.users"
        ]
      }
    }
  },
  tabulars: {
    price_groups: {
      name: "ЦеновыеГруппы",
      synonym: "Ценовые группы",
      tooltip: "",
      fields: {
        price_group: {
          synonym: "Ценовая гр. или номенклатура",
          multiline: false,
          tooltip: "Ссылка на ценовую группу или номенклатуру или папку (родитель - первый уровень иерархии) номенклатуры, для которой действует соответствие цветов",
          type: {
            types: [
              "cat.priceGroups",
              "cat.nom"
            ]
          }
        }
      }
    },
    clr_conformity: {
      name: "СоответствиеЦветов",
      synonym: "Соответствие цветов",
      tooltip: "",
      fields: {
        clr1: {
          synonym: "Цвет",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "cat.color_price_groups",
              "string",
              "cat.clrs"
            ],
            "strLen": 72,
            "strFix": true
          }
        },
        clr2: {
          synonym: "Соответствие",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "clr_in",
              path: "00000000-0000-0000-0000-000000000000"
            },
            {
              name: "clr_out",
              path: "00000000-0000-0000-0000-000000000000"
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.clrs"
            ]
          }
        }
      }
    },
    exclude: {
      name: "Исключить",
      synonym: "Исключения сторон",
      tooltip: "",
      fields: {
        side: {
          synonym: "Сторона",
          multiline: false,
          tooltip: "* Любая - общий цвет",
          choiceParams: [
            {
              name: "ref",
              path: [
                "Изнутри",
                "Снаружи",
                "Любая"
              ]
            }
          ],
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.cnn_sides"
            ]
          }
        },
        clr: {
          synonym: "Цвет",
          multiline: false,
          tooltip: "",
          choiceParams: [
            {
              name: "clr_in",
              path: "00000000-0000-0000-0000-000000000000"
            },
            {
              name: "clr_out",
              path: "00000000-0000-0000-0000-000000000000"
            }
          ],
          mandatory: true,
          type: {
            types: [
              "cat.color_price_groups",
              "cat.clrs"
            ]
          }
        }
      }
    }
  },
  id: "clg",
  cachable: "ram",
  aliases: ['color_price_groups'],
};


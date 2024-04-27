
export const meta = {
  builderPen: {
    name: "РисованиеЭлементов",
    synonym: "Рисование",
    illustration: "Метаданные инструмента pen (рисование профилей)",
    objPresentation: "",
    listPresentation: "",
    mainPresentation: "name",
    codeLength: 0,
    fields: {
      elm_type: {
        synonym: "Тип элемента",
        multiline: false,
        choiceParams: [
          {
            name: "ref",
            path: [
              "Рама",
              "Импост",
              "Раскладка",
              "Добор",
              "Соединитель",
              "Водоотлив",
              "Линия",
              "Примыкание",
              "Сечение",
              "Разрыв",
              "Штапик"
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
      inset: {
        synonym: "Материал профиля",
        multiline: false,
        choiceGrp: "elm",
        type: {
          types: [
            "cat.inserts"
          ]
        }
      },
      clr: {
        synonym: "Цвет",
        multiline: false,
        choiceGrp: "elm",
        type: {
          types: [
            "string",
            "cat.clrs"
          ],
          "strLen": 72,
          "strFix": true
        }
      },
      bind_generatrix: {
        synonym: "Магнит к профилю",
        multiline: true,
        type: {
          types: [
            "boolean"
          ]
        }
      },
      bind_node: {
        synonym: "Магнит к узлам",
        multiline: true,
        type: {
          types: [
            "boolean"
          ]
        }
      },
      bind_sys: {
        synonym: "Вставки по умолчанию из системы",
        multiline: true,
        tooltip: "Действует при добавлении типовой формы",
        type: {
          types: [
            "boolean"
          ]
        }
      },
      grid: {
        synonym: "Шаг сетки",
        multiline: false,
        type: {
          types: [
            "number"
          ],
          "digits": 6,
          "fraction": 0
        }
      },
      region: {
        synonym: "Ряд",
        multiline: false,
        tooltip: "Для расклодок: inner, outer, 1, 2, 3\n0 - не ряд\n1 - ряд внутри элемента\n>1 - за элементом\n<0 - перед элементом",
        choiceParams: [
          {
            name: "ref",
            path: [
              "r1",
              "r2",
              "r3"
            ]
          }
        ],
        choiceGrp: "elm",
        type: {
          types: [
            "enm.lay_regions"
          ]
        }
      }
    },
    tabulars: {},
    id: "tbp",
    aliases: ['builder_pen'],
  },
};

export const exclude = [

];

export const classes = [

];

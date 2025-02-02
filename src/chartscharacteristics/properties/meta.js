
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


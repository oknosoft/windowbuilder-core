
export const meta = {
  builderPen: {
    name: "РисованиеЭлементов",
    synonym: "Рисование",
    illustration: "Метаданные инструмента Pen (рисование профилей)",
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
              "Штапик",
              "Добор",
              "Соединитель",
              "Линия",
              "Примыкание",
              "Перекрытие",
              "Сечение",
              "Размер",
              "Разрыв",
              "Водоотлив",
              "Раскладка",
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
          strLen: 72,
          strFix: true
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
          digits: 6,
          fraction: 0
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
  builderGrid: {
    name: "СеткаВитража",
    synonym: "Сетка витража",
    illustration: "Метаданные инструмента Grid (Сетка витража)",
    id: "tgr",
    fields: {
      elm_type: {
        synonym: "Тип элемента",
        multiline: false,
        tooltip: "",
        choiceParams: [
          {
            name: "ref",
            path: [
              "Импост",
              "Раскладка",
              "Рама"
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
      clr: {
        synonym: "Цвет",
        multiline: false,
        tooltip: "",
        choiceGrp: "elm",
        type: {
          types: [
            "string",
            "cat.clrs"
          ],
          strLen: 72,
          strFix: true
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
      },
      split: {
        synonym: "Тип деления",
        multiline: false,
        tooltip: "",
        choiceParams: [
          {
            name: "ref",
            path: [
              "ДелениеГоризонтальных",
              "ДелениеВертикальных",
              "КрестВСтык",
              "КрестПересечение"
            ]
          }
        ],
        choiceGrp: "elm",
        type: {
          types: [
            "enm.laySplitTypes"
          ]
        }
      },
      elm_by_y: {
        synonym: "Элементов",
        multiline: false,
        tooltip: "",
        type: {
          types: [
            "number"
          ],
          digits: 2,
          fraction: 0
        }
      },
      step_by_y: {
        synonym: "Шаг",
        multiline: false,
        tooltip: "",
        type: {
          types: [
            "number"
          ],
          digits: 4,
          fraction: 0
        }
      },
      align_by_y: {
        synonym: "Опора",
        multiline: false,
        tooltip: "",
        choiceParams: [
          {
            name: "ref",
            path: ["Низ", "Верх"]
          }
        ],
        choiceGrp: "elm",
        type: {
          types: [
            "enm.positions"
          ]
        }
      },
      inset_by_y: {
        synonym: "Вставка",
        multiline: false,
        tooltip: "",
        choiceGrp: "elm",
        type: {
          types: [
            "cat.inserts"
          ]
        }
      },
      elm_by_x: {
        synonym: "Элементов",
        multiline: false,
        tooltip: "",
        type: {
          types: [
            "number"
          ],
          digits: 2,
          fraction: 0
        }
      },
      step_by_x: {
        synonym: "Шаг",
        multiline: false,
        tooltip: "",
        type: {
          types: [
            "number"
          ],
          digits: 4,
          fraction: 0
        }
      },
      align_by_x: {
        synonym: "Опора",
        multiline: false,
        tooltip: "",
        choiceParams: [
          {
            name: "ref",
            path: ["Лев", "Прав"]
          }
        ],
        choiceGrp: "elm",
        type: {
          types: [
            "enm.positions"
          ]
        }
      },
      inset_by_x: {
        synonym: "Вставка",
        multiline: false,
        tooltip: "",
        choiceGrp: "elm",
        type: {
          types: [
            "cat.inserts"
          ]
        }
      },
      w: {
        synonym: "Ширина",
        multiline: false,
        tooltip: "",
        type: {
          types: [
            "number"
          ],
          digits: 8,
          fraction: 2
        }
      },
      h: {
        synonym: "Высота",
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
    },
    tabulars: {
      sizes: {
        name: "Размеры",
        synonym: "Размеры",
        tooltip: "Размеры ячеек фасада по X и Y",
        fields: {
          elm: {
            synonym: "Напраленние",
            multiline: false,
            tooltip: "0 - горизонт, 1 - вертикаль",
            type: {
              types: [
                "number"
              ],
              digits: 1,
              fraction: 0
            }
          },
          sz: {
            synonym: "Размер",
            multiline: false,
            tooltip: "Размер ячейки. Порядок в номере строки, направление в elm",
            mandatory: true,
            type: {
              types: [
                "string"
              ],
              strLen: 8
            }
          },
          inset: {
            synonym: "Материал профиля",
            multiline: false,
            tooltip: "",
            choiceParams: [
              {
                name: "insert_type",
                path: "Профиль"
              }
            ],
            choiceGrp: "elm",
            type: {
              types: [
                "cat.inserts"
              ]
            }
          },
          changed: {
            synonym: "Запись изменена",
            multiline: false,
            tooltip: "Запись изменена оператором",
            type: {
              types: [
                "number"
              ],
              digits: 1,
              fraction: 0
            }
          }
        }
      }
    }
  }
};

export const exclude = [

];

export const classes = [

];

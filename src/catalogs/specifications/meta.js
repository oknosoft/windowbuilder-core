
export const meta = {
  name: "Спецификации",
  synonym: "Спецификации",
  illustration: "Спецификации на изготовление продукции, выполнение работ",
  objPresentation: "Спецификация",
  inputBy: [
    "name"
  ],
  hierarchical: false,
  hasOwners: true,
  groupHierarchy: true,
  mainPresentation: "name",
  codeLength: 0,
  fields: {
    calc_order: {
      synonym: "Расчет",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "doc.calc_order"
        ]
      }
    },
    characteristic: {
      synonym: "Характеристика",
      multiline: false,
      tooltip: "Характеристика номенклатуры - владельца спецификации",
      choiceLinks: [
        {
          name: [
            "selection",
            "owner"
          ],
          path: [
            "owner"
          ]
        }
      ],
      choiceGrp: "elm",
      type: {
        types: [
          "cat.characteristics"
        ]
      }
    },
    production_kind: {
      synonym: "Вид производства",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.production_kinds"
        ]
      }
    },
    owner: {
      synonym: "Продукция",
      multiline: false,
      tooltip: "Продукция, работа",
      choiceParams: [
        {
          name: "nom_type",
          path: [
            "Товар",
            "Работа"
          ]
        },
        {
          name: "is_set",
          path: false
        }
      ],
      mandatory: true,
      type: {
        types: [
          "cat.nom"
        ]
      }
    }
  },
  tabulars: {
    composition: {
      name: "Состав",
      synonym: "Состав",
      tooltip: "Состав изделия, работы",
      fields: {
        composition_kinds: {
          synonym: "Тип строки",
          multiline: false,
          tooltip: "Тип строки состава изделия, работы\n//Учесть:\n+1 - аксессуары\n-1 - визуализация\n-2 - техоперации\n-3 - обрезь",
          choiceGrp: "elm",
          mandatory: true,
          type: {
            types: [
              "enm.specification_row_type"
            ]
          }
        },
        nom: {
          synonym: "Номенклатура",
          multiline: false,
          tooltip: "Номенклатура состава изделия, работы",
          choiceLinks: [
            {
              name: [
                "composition_kinds"
              ],
              path: [
                "composition",
                "composition_kinds"
              ]
            }
          ],
          choiceParams: [
            {
              name: "nom_type",
              path: [
                "Товар",
                "Услуга"
              ]
            },
            {
              name: "is_set",
              path: false
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.nom"
            ]
          }
        },
        characteristic: {
          synonym: "Характеристика",
          multiline: false,
          tooltip: "Характеристика номенклатуры состава изделия, работы",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "composition",
                "nom"
              ]
            },
            {
              name: [
                "composition_kinds"
              ],
              path: [
                "composition",
                "composition_kinds"
              ]
            },
            {
              name: [
                "ЭтоПриходныйДокумент"
              ],
              path: [
                "ref"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.characteristics"
            ]
          }
        },
        unit: {
          synonym: "Ед.",
          multiline: false,
          tooltip: "Единица измерения номенклатуры состава изделия, работы",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "composition",
                "nom"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.nom_units",
              "cat.units"
            ]
          }
        },
        specification: {
          synonym: "Спецификация",
          multiline: false,
          tooltip: "Спецификация изготовления номенклатуры состава изделия, работы",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "composition",
                "nom"
              ]
            },
            {
              name: [
                "selection",
                "ХарактеристикаПродукции"
              ],
              path: [
                "composition",
                "characteristic"
              ]
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.specifications"
            ]
          }
        },
        quantity: {
          synonym: "Количество +%",
          multiline: false,
          tooltip: "Количество номенклатуры состава изделия, работы",
          type: {
            types: [
              "number"
            ],
            digits: 15,
            fraction: 4
          }
        },
        cost_part: {
          synonym: "Доля стоимости",
          multiline: false,
          tooltip: "Доля стоимости запаса, получаемого в результате разборки (разделки) от стоимости исходной номенклатуры",
          type: {
            types: [
              "number"
            ],
            digits: 15,
            fraction: 2
          }
        },
        stage: {
          synonym: "Этап",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.work_center_kinds"
            ]
          }
        },
        elm: {
          synonym: "Элемент",
          multiline: false,
          tooltip: "Номер элемента, если значение > 0, либо номер конструкции, если значение < 0",
          type: {
            types: ["string"],
            strLen: 20,
          }
        },
        region: {
          synonym: "Ряд",
          multiline: false,
          tooltip: "0 - не ряд\n1 - ряд внутри элемента\n>1 - за элементом\n<0 - перед элементом",
          type: {
            types: [
              "number"
            ],
            digits: 2,
            fraction: 0
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
        len: {
          synonym: "Длина/высота, м",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 14,
            fraction: 6
          }
        },
        width: {
          synonym: "Ширина, м",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 14,
            fraction: 6
          }
        },
        depth: {
          synonym: "Глубина, м",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 14,
            fraction: 6
          }
        },
        s: {
          synonym: "Площадь, м²",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 14,
            fraction: 6
          }
        },
        alp1: {
          synonym: "Угол 1, °",
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
        alp2: {
          synonym: "Угол 2, °",
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
        qty: {
          synonym: "Количество (шт)",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 14,
            fraction: 6
          }
        },
        totqty: {
          synonym: "Количество",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 14,
            fraction: 4
          }
        },
        price: {
          synonym: "Себест.план",
          multiline: false,
          tooltip: "Цена плановой себестоимости строки спецификации",
          type: {
            types: [
              "number"
            ],
            digits: 15,
            fraction: 4
          }
        },
        amount: {
          synonym: "Сумма себест.",
          multiline: false,
          tooltip: "Сумма плановой себестоимости строки спецификации",
          type: {
            types: [
              "number"
            ],
            digits: 15,
            fraction: 4
          }
        },
        amount_marged: {
          synonym: "Сумма с наценкой",
          multiline: false,
          tooltip: "Вклад строки спецификации в стоимость изделия для сценария КМАРЖ_В_СПЕЦИФИКАЦИИ",
          type: {
            types: [
              "number"
            ],
            digits: 15,
            fraction: 4
          }
        },
        origin: {
          synonym: "Происхождение",
          multiline: false,
          tooltip: "Ссылка на настройки построителя, из которых возникла строка спецификации",
          type: {
            types: [
              "json"
            ]
          }
        }
      },
      schemas: {
        main: {
          ref: 'f56d2210-e610-11ef-8d41-1dbaf385ba47',
          fields: [
            {
              use: true,
              field: 'elm',
              width: 90,
              caption: 'Элемент',
              tooltip: '',
              //ctrl_type: '',
              formatter: 'Text',
              editor: '',
            },
            {
              use: true,
              field: 'nom',
              caption: 'Номенклатура',
              formatter: 'Presentation',
            },
            {
              use: true,
              field: 'clr',
              width: 120,
              caption: 'Цвет',
              formatter: 'Presentation',
            },
            {
              use: true,
              field: 'len',
              width: 90,
              caption: 'Длина',
              formatter: 'Number',
            },
          ]
        }
      }
    },
    procedures: {
      name: "Операции",
      synonym: "Операции",
      tooltip: "Технологические операции процесса изготовления изделия, выполнения работы",
      fields: {
        procedure: {
          synonym: "Операция",
          multiline: false,
          tooltip: "Технологическая операция процесса изготовления изделия, выполнения работы",
          choiceParams: [
            {
              name: "nom_type",
              path: ""
            }
          ],
          choiceGrp: "elm",
          type: {
            types: [
              "cat.nom"
            ]
          }
        },
        time_standard: {
          synonym: "Норма времени (ч)",
          multiline: false,
          tooltip: "Норма времени на выполнение технологической операции процесса изготовления изделия, выполнения работы",
          type: {
            types: [
              "number"
            ],
            digits: 10,
            fraction: 3
          }
        },
        quantity: {
          synonym: "Количество операций",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "number"
            ],
            digits: 15,
            fraction: 3
          }
        },
        stage: {
          synonym: "Этап",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.work_center_kinds"
            ]
          }
        }
      }
    }
  },
  id: "sx",
  cachable: "doc"
};



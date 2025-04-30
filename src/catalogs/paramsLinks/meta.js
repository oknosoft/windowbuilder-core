import {propValue} from '../../chartscharacteristics/properties/meta';

export const meta = {
  name: "СвязиПараметров",
  synonym: "Связи параметров",
  illustration: "Подчиненные параметры",
  objPresentation: "Связь параметров",
  listPresentation: "Связи параметров",
  inputBy: [
    "name"
  ],
  hierarchical: true,
  hasOwners: false,
  groupHierarchy: true,
  mainPresentation: "name",
  codeLength: 0,
  fields: {
    master: {
      synonym: "Ведущий",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "cat.parametersKeys"
        ]
      }
    },
    slave: {
      synonym: "Ведомый",
      multiline: false,
      tooltip: "",
      choiceGrp: "elm",
      type: {
        types: [
          "cch.properties"
        ]
      }
    },
    hide: {
      synonym: "Скрыть ведомый",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "boolean"
        ]
      }
    },
    note: {
      synonym: "Комментарий",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "string"
        ],
        strLen: 0
      }
    },
    use_master: {
      synonym: "Использование ведущих",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "number"
        ],
        digits: 1,
        fraction: 0
      }
    },
    parent: {
      synonym: "",
      multiline: false,
      tooltip: "",
      type: {
        types: [
          "cat.paramsLinks"
        ]
      }
    }
  },
  tabulars: {
    leadings: {
      name: "Ведущие",
      synonym: "Ведущие",
      tooltip: "",
      fields: {
        key: {
          synonym: "Ключ",
          multiline: false,
          tooltip: "",
          choiceGrp: "elm",
          type: {
            types: [
              "cat.parametersKeys"
            ]
          }
        }
      }
    },
    values: {
      name: "Значения",
      synonym: "Значения",
      tooltip: "",
      fields: {
        value: {
          synonym: "Значение",
          multiline: false,
          tooltip: "",
          choiceLinks: [
            {
              name: [
                "selection",
                "owner"
              ],
              path: [
                "slave"
              ]
            }
          ],
          choiceParams: [],
          choiceType: {
            path: [
              "slave"
            ],
            elm: 0
          },
          type: propValue.type,
        },
        by_default: {
          synonym: "По умолчанию",
          multiline: false,
          tooltip: "",
          type: {
            types: [
              "boolean"
            ]
          }
        },
        forcibly: {
          synonym: "Принудительно",
          multiline: false,
          tooltip: "Замещать установленное ранее значение при перевыборе ведущего параметра",
          type: {
            types: [
              "boolean"
            ]
          }
        }
      }
    }
  },
  id: "prl",
  aliases: ['params_links'],
  cachable: "ram"
};

export const exclude = [/*'cat.paramsLinks'*/];

export function classes({cat, classes, symbols}, exclude)  {
  const {CatParamsLinks: CatObj, CatColorPriceGroups} = classes;
  const {get, set} = symbols;

  class CatParamsLinks extends CatObj{
    /**
     * @summary Дополеняет массив разрешенными в текущей связи значениями
     * @param {Array} values
     * @param {Boolean} [rows]
     * @return {Array}
     */
    appendValues(values = [], rows = false) {
      const push = rows ?  //by_default,forcibly
        (row) => values.push(row) : (row) => values.push(row.value); 
      for(const row of this.values) {
        if(row.value instanceof CatColorPriceGroups) {
          for(const value of row.value.clrs()) {
            push({value});
          }
        }
        else if(row.value?.isFolder) {
          row.value._children().forEach(value => {
            !value.isFolder && push({value});
          });
        }
        else {
          push(row);
        }
      }
      return values;
    }
  }
  classes.CatParamsLinks = CatParamsLinks;
}



export const meta = {
  name: "ВидыНоменклатуры",
  splitted: false,
  synonym: "Виды номенклатуры",
  illustration: "",
  objPresentation: "Вид номенклатуры",
  listPresentation: "",
  inputBy: ["name", "id"],
  hierarchical: true,
  hasOwners: false,
  groupHierarchy: true,
  mainPresentation: "name",
  codeLength: 9,
  id: "nk",
  aliases: ['nom_kinds'],
  mdm: true,
  fields: {
    nom_type: {
      synonym: "Тип номенклатуры",
      multiline: false,
      tooltip: "Указывается тип, к которому относится номенклатура данного вида.",
      choiceGrp: "elm",
      mandatory: true,
      type: {types: ["enm.nom_types"]}
    },
    dnom: {
      synonym: "Набор свойств номенклатура",
      multiline: false,
      tooltip: "Набор свойств, которым будет обладать номенклатура с этим видом",
      choiceGrp: "elm",
      type: {types: ["cat.destinations"]}
    },
    dcharacteristic: {
      synonym: "Набор свойств характеристика",
      multiline: false,
      tooltip: "Набор свойств, которым будет обладать характеристика с этим видом",
      choiceGrp: "elm",
      type: {types: ["cat.destinations"]}
    },
    parent: {
      synonym: "Группа",
      multiline: false,
      tooltip: "",
      type: {types: ["cat.nom_kinds"]}
    }
  },
  tabulars: {},
  cachable: "ram"
};

export const exclude = ['catalogs.nomKinds'];

export function classes({cat, classes, symbols}, exclude)  {
  const {CatObj} = classes;
  const {get, set} = symbols;

  class CatNomKinds extends CatObj{
    get parent(){return this[get]('parent')}
    set parent(v){this[set]('parent',v)}
  }
  classes.CatDivisions = CatNomKinds;

  cat.create('nomKinds');
}


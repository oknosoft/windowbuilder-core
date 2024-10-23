[
	{
		"_id": "_design/auth",
		"_rev": "17-429cb41b3bb3758759a5a229e09c339f",
		"language": "javascript",
		"validate_doc_update": "function(newDoc, oldDoc, userCtx, secObj) {\n/*\n  if (userCtx.db.indexOf('_10_') !== -1 && userCtx.name !== 'repl-robot') {\n    throw({forbidden: 'Только репликатор может изменять данные под MDM'});\n  }\n  if(oldDoc && oldDoc.obj_delivery_state === 'Шаблон' && newDoc.obj_delivery_state !== 'Шаблон' && userCtx.name !== 'repl-robot') {\n    throw({forbidden: 'Нельзя переводить шаблон в ' + newDoc.obj_delivery_state});\n  }\n*/\n  if (userCtx.roles.indexOf('_admin') !== -1 || userCtx.roles.indexOf('ram_editor') !== -1 || userCtx.roles.indexOf('doc_full') !== -1) {\n    return;\n  }\n  throw({forbidden: 'Только администраторы могут изменять справочники'});\n}"
	},
	{
		"_id": "_design/class_name",
		"_rev": "1-76d160d9d8e24043288e3ff9fa81d844",
		"language": "query",
		"autoupdate": true,
		"views": {
			"class_name": {
				"map": {
					"fields": {
						"class_name": "asc"
					}
				},
				"reduce": "_count",
				"options": {
					"def": {
						"fields": [
							"class_name"
						]
					}
				}
			}
		}
	},
	{
		"_id": "_design/doc",
		"_rev": "1-5e24e3c1710e42da134f7adee5265468",
		"language": "javascript",
		"views": {
			"by_date": {
				"map": "function(doc){\nif(doc.date){\n  const d0=doc.date.split('T');\n  if(d0.length<2) return;\n  const d=d0[0].split('-');\n  const key = doc._id.split('|')[0];\n  if(key){\n    if(doc._id.substr(0, 18)=='doc.planning_event') emit([key,Number(d[0]),Number(d[1]),Number(d[2]),(d0[1]+' '+doc.number_doc)], null);\n    else emit([key,Number(d[0]),Number(d[1]),Number(d[2])], null);\n  }\n}}"
			},
			"number_doc": {
				"map": "function(doc) {\n    var c = doc._id.split('|')[0],\n        cn = c.substr(0, 3);\n    if ((cn == 'doc' || cn == 'tsk' || cn == 'bp.') && doc.date) {\n        var d = doc.date.split('T')[0].split('-');\n        emit([c, Number(d[0]), doc.number_doc], null);\n    } else if (doc.id) emit([c, 0, doc.id], null)\n}"
			}
		}
	},
	{
		"_id": "_design/linked",
		"_rev": "1-5ef8b585916d00db5834e7d13a3003d8",
		"language": "javascript",
		"views": {
			"linked": {
				"map": "function(doc) {\r\n  if(doc.class_name === 'cat.characteristics') {\r\n    if(!doc.calc_order || doc.calc_order === '00000000-0000-0000-0000-000000000000') {\r\n      if((doc.constructions && doc.constructions.length) || (doc.coordinates && doc.coordinates.length)) {\r\n        return;\r\n      }\r\n      emit(['00000000-0000-0000-0000-000000000000', doc.class_name], doc._id.replace(doc.class_name+'|', ''));\r\n    }\r\n    else {\r\n      emit([doc.calc_order, doc.class_name], doc._id.replace(doc.class_name+'|', ''));\r\n    }\r\n  }\r\n}"
			}
		}
	},
	{
		"_id": "_design/server",
		"_rev": "10-ada377b511e9461c8d6067998900350f",
		"language": "javascript",
		"views": {
			"load_order": {
				"map": "function (doc) {\n  if(!doc.class_name || doc.obj_delivery_state === \"Шаблон\" || doc.class_name.indexOf('doc.') !== -1) return;\n  if(doc.class_name === 'cch.properties') emit('00_' + doc._id, null)\n  else if(doc.class_name === 'cat.property_values' || doc.class_name === 'cat.contact_information_kinds') emit('01_' + doc._id, null)\n  else if(doc.class_name === 'cat.users') emit('02_' + doc._id, null)\n  else if(doc.class_name.indexOf('cat.nom') !== -1) emit('03_' + doc._id, null)\n  else if(doc.class_name === 'cat.characteristics') emit('90_' + doc._id, null)\n  else if(doc.class_name === 'cat.formulas' || doc.class_name === 'cat.parameters_keys') emit('91_' + doc._id, null)\n  else if(doc.class_name === 'cch.predefined_elmnts') emit('92_' + doc._id, null)\n  else if([\"ireg.currency_courses\", \"ireg.margin_coefficients\", \"ireg.i18n\", \"ireg.predefined_elmnts\"].indexOf(doc.class_name) !== -1) emit('93_' + doc._id, null)\n  else if(doc.class_name.indexOf('ireg.') === -1) emit('20_' + doc._id, null)\n}"
			}
		}
	},
	{
		"_id": "cat.cash_flow_articles|09619f4c-5703-4410-8a0f-204cb50a544f",
		"_rev": "1-7e40f24cc166bdde39ba1d92e2ec32b7",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Выдача денежных средств подотчетнику",
		"id": "000000003",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|184f7e9a-94b2-4c94-85c1-039d061e8766",
		"_rev": "1-79416d947140926cc6b7b5f0d836ace3",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Возврат денежных средств покупателю",
		"id": "000000004",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|222a5ea7-4d96-4372-ac0d-bed60da07645",
		"_rev": "1-036cacbefe9f3aeed234f282bb2949ff",
		"is_folder": false,
		"parent": "52c3bd68-0f2d-4cb3-bfb7-7f36bee49fdb",
		"name": "Зарплата офиса",
		"id": "000001017",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d35620c-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-0d6702ed6827aceac2fdab1a3014fbfc",
		"predefined_name": "ВозвратДенежныхСредствОтПоставщика",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Возврат денежных средств от поставщика",
		"id": "УТ-000016",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d35620d-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-209320a60a6329f0c7b47efad50e1967",
		"predefined_name": "ВозвратОплатыКлиенту",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Возврат оплаты клиенту",
		"id": "УТ-000015",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d35620e-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-a4cf1214df92aae31efdcdc0a3c5beba",
		"predefined_name": "ВыдачаДенежныхСредствВДругуюКассу",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Выдача денежных средств в другую кассу",
		"id": "УТ-000002",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d35620f-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-66594ce86d0f4e3407035c47908f9fda",
		"predefined_name": "ВыдачаДенежныхСредствВКассуККМ",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Выдача денежных средств в кассу ККМ",
		"id": "УТ-000010",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d356210-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-c4c2420a654e9e8dbaaae519d3fc127e",
		"predefined_name": "ВыплатаЗаработнойПлаты",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Выплата заработной платы",
		"id": "УТ-000014",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d356211-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-457cab63629f4e8595c149d0e4c8c7c1",
		"predefined_name": "ОплатаДенежныхСредствВДругуюОрганизацию",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Оплата денежных средств в другую организацию",
		"id": "УТ-000013",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d356212-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-b512e10c45015aacbf1254ed807fb716",
		"predefined_name": "ОплатаПоставщику",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Оплата поставщику",
		"id": "УТ-000006",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d356213-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-0b397ef7bb012d4294f8ee8e882549b2",
		"predefined_name": "ПеречислениеДенежныхСредствНаДругойСчет",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Перечисление денежных средств на другой счет",
		"id": "УТ-000003",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d356214-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-a3304d9c6810055668bc4f2da796f6a3",
		"predefined_name": "ПоступлениеДенежныхСредствИзБанкаВИностраннойВалюте",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Поступление денежных средств из банка (в иностранной валюте)",
		"id": "УТ-000011",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d356215-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-716cd8ef1059b05ebd52f66854034c0a",
		"predefined_name": "ПоступлениеДенежныхСредствИзБанка",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Поступление денежных средств из банка (в рублях)",
		"id": "УТ-000004",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d356216-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-e31131a4b55970a8a938d34ab9af9c12",
		"predefined_name": "ПоступлениеДенежныхСредствИзКассыККМ",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Поступление денежных средств из кассы ККМ",
		"id": "УТ-000009",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d356217-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-1e1eba8d03e894e12dc4b3e6b86ceed7",
		"predefined_name": "ПоступлениеОплатыОтКлиента",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Поступление оплаты от клиента",
		"id": "УТ-000005",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d356218-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-bffb86f29f920065f443ec5a2043b80b",
		"predefined_name": "СдачаДенежныхСредствВБанкВИностраннойВалюте",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Сдача денежных средств в банк (в иностранной валюте)",
		"id": "УТ-000012",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|2d356219-19a8-11e4-ab36-a745bf64a51e",
		"_rev": "1-6f9ac5808112ea3b8dee23107084535d",
		"predefined_name": "СдачаДенежныхСредствВБанк",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Сдача денежных средств в банк (в рублях)",
		"id": "УТ-000001",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|40281775-e6f9-437f-bb37-9150c8e0f0f9",
		"_rev": "1-d41a54428086677389cbe41a0a067b82",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Возврат денежных средств поставщиком",
		"id": "000000005",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|4fab2ef7-e06a-4eba-918d-85ede85b2710",
		"_rev": "1-1e2178af7cc0d82f625c9e2e1a083d4e",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Переоценка валютных средств",
		"id": "000000009",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|51d5c88b-5074-4f16-b3b5-5aaeb8def865",
		"_rev": "1-bb7c30dc7c91d52607d369c1cfbed026",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Приход денежных средств розничная выручка",
		"id": "000000007",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|52c3bd68-0f2d-4cb3-bfb7-7f36bee49fdb",
		"_rev": "1-befc048b6abf082293b3805f5f104a01",
		"is_folder": true,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Зарплата",
		"id": "000001018",
		"definition": "",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|57c27fa5-1515-4ee5-b193-fd83fed3553d",
		"_rev": "1-d25a5ec25240cd92d09f1256c8d7f8ad",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Прочие расходы денежных средств",
		"id": "000000014",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|6e4ff823-b254-4760-87b4-258977d3d409",
		"_rev": "1-d6bae5f64c41e30f618cf8aa3e8ee27f",
		"is_folder": false,
		"parent": "52c3bd68-0f2d-4cb3-bfb7-7f36bee49fdb",
		"name": "Комиссионные менеджеров",
		"id": "000001021",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|82a2cb9c-d68b-444e-b8e1-57323777a814",
		"_rev": "1-7290916f9b386ec8cdd2bd287e2f0b9a",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Перечисление налога",
		"id": "000000011",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|8732e41b-418d-497b-864d-e862d45a07f5",
		"_rev": "1-fba1e4326f17010261179be089ff1fa9",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Возврат денежных средств подотчетником",
		"id": "000000006",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|928c88df-9c02-469a-b8d4-a0976bdeebf0",
		"_rev": "1-9588a734e10e43c8d1db4b3b01582b2a",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Прочие расчеты с контрагентами",
		"id": "000000010",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|af659cf3-497a-4b2b-9f6b-16a4fcf7d5b1",
		"_rev": "1-3236bda59f9785b9ba92225f072bf3b5",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Прочие поступления денежных средств",
		"id": "000000013",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|b826aff4-34d7-4422-9422-901d46310c2a",
		"_rev": "1-56ff96a4f9d6d8277d3a9e8d286a81a6",
		"is_folder": false,
		"parent": "52c3bd68-0f2d-4cb3-bfb7-7f36bee49fdb",
		"name": "Зарплата цеха",
		"id": "000001019",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|e6848a0c-c774-4ded-9929-10e58116eff7",
		"_rev": "1-1771e6bb05d0ee512d3c7856a79ade3a",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Расчеты по кредитам и займам с контрагентами",
		"id": "000000012",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|eb3df34e-24c9-46b6-9967-3ab8deacf6d3",
		"_rev": "1-c92d1f15f9d4ac49107cc6916d71de0f",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Оплата покупателя",
		"id": "000000002",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.cash_flow_articles|fab1e242-867b-4283-a691-34f82514ff16",
		"_rev": "1-35e7525e0753e068ed4dec77e1ab7c18",
		"is_folder": false,
		"parent": "52c3bd68-0f2d-4cb3-bfb7-7f36bee49fdb",
		"name": "Зарплата монтажа",
		"id": "000001020",
		"sorting_field": 0,
		"class_name": "cat.cash_flow_articles"
	},
	{
		"_id": "cat.currencies|69ea8ba1-53f9-11df-9b91-005056c00008",
		"_rev": "2-a937188122d56729e20ca263395ee525",
		"name": "руб.",
		"id": "643",
		"name_full": "Российский рубль",
		"extra_charge": 0,
		"parameters_russian_recipe": "рубль, рубля, рублей, м, копейка, копейки, копеек, ж, -1",
		"class_name": "cat.currencies"
	},
	{
		"_id": "cat.currencies|69ea8ba2-53f9-11df-9b91-005056c00008",
		"_rev": "1-f60e1de3e8fef818146ef8b4ec9b74cc",
		"name": "USD",
		"id": "840",
		"name_full": "Доллар США",
		"extra_charge": 0,
		"parameters_russian_recipe": "доллар, доллара, долларов, м, цент, цента, центов, м, 2",
		"class_name": "cat.currencies"
	},
	{
		"_id": "cat.currencies|822d4161-731d-11df-839e-005056c00008",
		"_rev": "1-f8ceba157ad1218c9e4f2344df0088e5",
		"name": "EUR",
		"id": "978",
		"name_full": "Евро",
		"extra_charge": 0,
		"class_name": "cat.currencies"
	},
	{
		"_id": "cat.destinations|06ae29a8-f11a-11ee-9c4f-d89f6adade46",
		"_rev": "1-dbf07449db2265f7a317c9a95f3ec1f7",
		"predefined_name": "Справочник_РабочиеЦентры",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Рабочий центр",
		"extra_fields": [
			{
				"row": 1,
				"property": "1217718e-70dd-11ef-b9f0-7085c299da15",
				"_deleted": false
			},
			{
				"row": 2,
				"property": "1f6d3fa2-70dd-11ef-b9f0-7085c299da15",
				"_deleted": false
			},
			{
				"row": 3,
				"property": "25da9345-70dd-11ef-b9f0-7085c299da15",
				"_deleted": false
			},
			{
				"row": 4,
				"property": "25da936a-70dd-11ef-b9f0-7085c299da15",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|07dc8d4e-0204-11e5-be50-d2bb8c030246",
		"_rev": "1-8a1fb08c281ed338dc57ac75ea720e0c",
		"is_folder": false,
		"parent": "62f459e3-167f-11e4-8251-bcaec53cf0fb",
		"name": "Примыкание",
		"extra_fields": [
			{
				"row": 1,
				"property": "3180fb62-a972-11e6-92c2-8fc975681747",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|07dc8d4f-0204-11e5-be50-d2bb8c030246",
		"_rev": "1-c11b0fcd6eb05aada502d41a28b1052e",
		"is_folder": false,
		"parent": "62f459e4-167f-11e4-8251-bcaec53cf0fb",
		"name": "Примыкание",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|10dbace8-0204-11e5-be50-d2bb8c030246",
		"_rev": "1-601e7249bff072f55187812741db9b77",
		"is_folder": false,
		"parent": "62f459e3-167f-11e4-8251-bcaec53cf0fb",
		"name": "Продукция",
		"extra_fields": [
			{
				"row": 1,
				"property": "3180fb62-a972-11e6-92c2-8fc975681747",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|10dbace9-0204-11e5-be50-d2bb8c030246",
		"_rev": "1-d037c6a50490174b75fcd4aa88e077e1",
		"is_folder": false,
		"parent": "62f459e4-167f-11e4-8251-bcaec53cf0fb",
		"name": "Продукция",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|10dbacea-0204-11e5-be50-d2bb8c030246",
		"_rev": "4-6f78a88320a148764ffb00e5b88ffe04",
		"is_folder": false,
		"parent": "62f459e3-167f-11e4-8251-bcaec53cf0fb",
		"name": "Профиль",
		"extra_fields": [
			{
				"row": 1,
				"property": "f92a26c4-0135-11e6-8303-e67fda7f6b46",
				"_deleted": false
			},
			{
				"row": 2,
				"property": "0ecc9d72-0136-11e6-8303-e67fda7f6b46",
				"_deleted": false
			},
			{
				"row": 3,
				"property": "1a759d9a-0136-11e6-8303-e67fda7f6b46",
				"_deleted": false
			},
			{
				"row": 4,
				"property": "3180fb62-a972-11e6-92c2-8fc975681747",
				"_deleted": false
			},
			{
				"row": 5,
				"property": "aa256be0-0b5e-11e7-a4bb-f62a66dd0b46",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|10dbaceb-0204-11e5-be50-d2bb8c030246",
		"_rev": "1-c6d9c2a4b87d19cccc703e4f5211bc40",
		"is_folder": false,
		"parent": "62f459e4-167f-11e4-8251-bcaec53cf0fb",
		"name": "Профиль",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|17e3bc58-0204-11e5-be50-d2bb8c030246",
		"_rev": "1-6e0588e3b669cff21d7982407f84ac15",
		"is_folder": false,
		"parent": "62f459e3-167f-11e4-8251-bcaec53cf0fb",
		"name": "Работа",
		"extra_fields": [
			{
				"row": 1,
				"property": "3180fb62-a972-11e6-92c2-8fc975681747",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|17e3bc59-0204-11e5-be50-d2bb8c030246",
		"_rev": "1-25f77c49aa885c8d88d324ddc44928f0",
		"is_folder": false,
		"parent": "62f459e4-167f-11e4-8251-bcaec53cf0fb",
		"name": "Работа",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|1fc4c1c2-0204-11e5-be50-d2bb8c030246",
		"_rev": "1-18745413c6ba7a1c4283bdf75d9e5df9",
		"is_folder": false,
		"parent": "62f459e3-167f-11e4-8251-bcaec53cf0fb",
		"name": "Услуга",
		"extra_fields": [
			{
				"row": 1,
				"property": "3180fb62-a972-11e6-92c2-8fc975681747",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|1fc4c1c3-0204-11e5-be50-d2bb8c030246",
		"_rev": "1-f51312b41d3992788e37bbd90bb5a467",
		"is_folder": false,
		"parent": "62f459e4-167f-11e4-8251-bcaec53cf0fb",
		"name": "Услуга",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|1fc4c1c4-0204-11e5-be50-d2bb8c030246",
		"_rev": "1-7660ab1f6bef68f47340a1a8a9e6f3cd",
		"is_folder": false,
		"parent": "62f459e3-167f-11e4-8251-bcaec53cf0fb",
		"name": "Материал",
		"extra_fields": [
			{
				"row": 1,
				"property": "3180fb62-a972-11e6-92c2-8fc975681747",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|1fc4c1c5-0204-11e5-be50-d2bb8c030246",
		"_rev": "1-3ed3b6cf8995e8e6edcc8ceed5032a0a",
		"is_folder": false,
		"parent": "62f459e4-167f-11e4-8251-bcaec53cf0fb",
		"name": "Материал",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|62f459e3-167f-11e4-8251-bcaec53cf0fb",
		"_rev": "4-3617aeef70370f5c55f9b0ccb2e42090",
		"predefined_name": "Справочник_Номенклатура",
		"is_folder": true,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Номенклатура",
		"extra_fields": [
			{
				"row": 1,
				"property": "f92a26c4-0135-11e6-8303-e67fda7f6b46",
				"_deleted": false
			},
			{
				"row": 2,
				"property": "0ecc9d72-0136-11e6-8303-e67fda7f6b46",
				"_deleted": false
			},
			{
				"row": 3,
				"property": "1a759d9a-0136-11e6-8303-e67fda7f6b46",
				"_deleted": false
			},
			{
				"row": 4,
				"property": "3180fb62-a972-11e6-92c2-8fc975681747",
				"_deleted": false
			},
			{
				"row": 5,
				"property": "aa256be0-0b5e-11e7-a4bb-f62a66dd0b46",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|62f459e4-167f-11e4-8251-bcaec53cf0fb",
		"_rev": "1-c96e986e631e1e6645490cae936c2cd2",
		"predefined_name": "Справочник_ХарактеристикиНоменклатуры",
		"is_folder": true,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Характеристики номенклатуры",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|62f459e5-167f-11e4-8251-bcaec53cf0fb",
		"_rev": "1-38b9fc1d4ae0bc0dba190014dafd3e09",
		"predefined_name": "Документ_Встреча",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Встречи",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|62f459e7-167f-11e4-8251-bcaec53cf0fb",
		"_rev": "1-25e07a2a4acacbf80a35f4305df96608",
		"predefined_name": "Справочник_Контрагенты",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Контрагенты",
		"extra_fields": [
			{
				"row": 1,
				"property": "81797de0-be78-472a-b81f-f5982303aee2",
				"_deleted": false
			},
			{
				"row": 2,
				"property": "c11622de-25e7-46a3-9f00-e9b0c43440c5",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|62f459e8-167f-11e4-8251-bcaec53cf0fb",
		"_rev": "1-4f9d676e6fc51a3f83b5396098394837",
		"predefined_name": "Справочник_Организации",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Организации",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|62f459e9-167f-11e4-8251-bcaec53cf0fb",
		"_rev": "1-e98b2b2e2575ad24198fcb795b5dd421",
		"predefined_name": "Справочник_ПапкиФайлов",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Папки",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|62f459ea-167f-11e4-8251-bcaec53cf0fb",
		"_rev": "1-584e6aa8a0c28e1e407e3f6a40041429",
		"predefined_name": "Справочник_Подразделения",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Подразделения",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|62f459eb-167f-11e4-8251-bcaec53cf0fb",
		"_rev": "4-d4b859c3d66f67f0ca1b44968eb0e615",
		"predefined_name": "Документ_Расчет",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Расчеты-заказы",
		"extra_fields": [
			{
				"row": 1,
				"property": "fe0effea-f68e-11ea-bb4b-a3a00cb42f46",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|62f459ec-167f-11e4-8251-bcaec53cf0fb",
		"_rev": "1-9ed89e4135689ffa5d50f802601fcbf0",
		"predefined_name": "Справочник_Склады",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Склады",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|62f459ef-167f-11e4-8251-bcaec53cf0fb",
		"_rev": "1-11c31fbe7332d78bc60a4ed1630cbda8",
		"predefined_name": "Справочник_Файлы",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Файлы",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|62f459f0-167f-11e4-8251-bcaec53cf0fb",
		"_rev": "1-3b18786b681a832851c623cbb2e13eff",
		"predefined_name": "Документ_ЭлектронноеПисьмоВходящее",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Входящие электронные письма",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|62f459f1-167f-11e4-8251-bcaec53cf0fb",
		"_rev": "1-725991e8c2eb265cf2090e092bd398e6",
		"predefined_name": "Документ_ЭлектронноеПисьмоИсходящее",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Исходящие электронные письма",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|911e5be2-6f6a-11e6-b818-aca316cc6945",
		"_rev": "1-061d3d6d8f5a563ea127497ca23fe3d2",
		"predefined_name": "Документ_УстановкаЦенНоменклатуры",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Установка цен номенклатуры",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|96e0f756-9034-11e4-9d6e-b3b09e3e5031",
		"_rev": "1-0422c6656fa4a2c06dd77af619a1c766",
		"predefined_name": "Справочник_ВнешниеПользователи",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Внешние пользователи",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|d2b0d710-b638-11ea-8b34-831cbc7a2c46",
		"_rev": "1-ac03c4b2a446a0cc4ef1157612007476",
		"predefined_name": "Справочник_ИнтеграцияАбоненты",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Абоненты",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|dc4c9990-8cf0-11ec-9981-e64cf8971646",
		"_rev": "1-9776b00245c6e9d78cad92427da11e88",
		"predefined_name": "Справочник_пзПараметрыПродукции",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Параметры продукции",
		"extra_fields": [
			{
				"row": 1,
				"property": "7f596168-f8f0-11ea-bb4b-a3a00cb42f46",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|f2afd7fa-0712-11e8-acb3-820d969d5c46",
		"_rev": "1-2681e9f727df70fa828e28d3215bfc64",
		"predefined_name": "Справочник_ИнтеграцияОтделыАбонентов",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Отделы абонентов",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|f54e7c19-1bb0-11e4-ab36-a745bf64a51e",
		"_rev": "1-c80a0bc4dcf4a5ef5c964fcbb6fe0ad1",
		"predefined_name": "Справочник_Пользователи",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Пользователи",
		"extra_fields": [],
		"extra_properties": [
			{
				"row": 1,
				"property": "f1ec7cfb-1bb4-11e4-ab36-a745bf64a51e",
				"_deleted": false
			}
		],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|f72a9600-6bfb-11ed-9611-84f1e8809c54",
		"_rev": "1-8aedc20f345336cca1083358c551c419",
		"predefined_name": "Справочник_ДоговорыКонтрагентов",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Договоры контрагентов",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|fd350b1c-0203-11e5-be50-d2bb8c030246",
		"_rev": "1-fc5158b81493ae4e3ba918fb55f3d9b0",
		"is_folder": false,
		"parent": "62f459e3-167f-11e4-8251-bcaec53cf0fb",
		"name": "Заполнение",
		"extra_fields": [
			{
				"row": 1,
				"property": "3180fb62-a972-11e6-92c2-8fc975681747",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|fd350b1d-0203-11e5-be50-d2bb8c030246",
		"_rev": "1-6ddb151462ee6e145959002b8936bb83",
		"is_folder": false,
		"parent": "62f459e4-167f-11e4-8251-bcaec53cf0fb",
		"name": "Заполнение",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|fd350b1e-0203-11e5-be50-d2bb8c030246",
		"_rev": "1-2eefbdf6356cefb93dac20e071ac4e37",
		"is_folder": false,
		"parent": "62f459e3-167f-11e4-8251-bcaec53cf0fb",
		"name": "Товар",
		"extra_fields": [
			{
				"row": 1,
				"property": "3180fb62-a972-11e6-92c2-8fc975681747",
				"_deleted": false
			}
		],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.destinations|fd350b1f-0203-11e5-be50-d2bb8c030246",
		"_rev": "1-f2db1d20c83f754fc948b7c4f1a3695f",
		"is_folder": false,
		"parent": "62f459e4-167f-11e4-8251-bcaec53cf0fb",
		"name": "Товар",
		"extra_fields": [],
		"extra_properties": [],
		"class_name": "cat.destinations"
	},
	{
		"_id": "cat.nom_kinds|012abd41-e241-4f5a-84cf-636750084c95",
		"_rev": "1-3465e9ecdd3bf29377d05861ea2c0f92",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Профиль",
		"id": "000020004",
		"nom_type": "Товар",
		"dnom": "10dbacea-0204-11e5-be50-d2bb8c030246",
		"dcharacteristic": "10dbaceb-0204-11e5-be50-d2bb8c030246",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"class_name": "cat.nom_kinds"
	},
	{
		"_id": "cat.nom_kinds|24968c79-68eb-4aa8-9239-3d4b280116b8",
		"_rev": "1-f7109fa93974def549e636f6f8ec1a23",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Материал",
		"id": "000020010",
		"nom_type": "Товар",
		"dnom": "1fc4c1c4-0204-11e5-be50-d2bb8c030246",
		"dcharacteristic": "1fc4c1c5-0204-11e5-be50-d2bb8c030246",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"class_name": "cat.nom_kinds"
	},
	{
		"_id": "cat.nom_kinds|2af5f374-704c-46c1-8a5e-50bb32cae1fb",
		"_rev": "1-971736e0af905f96b17059130f971c01",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Примыкание",
		"id": "000020009",
		"nom_type": "Товар",
		"dnom": "07dc8d4e-0204-11e5-be50-d2bb8c030246",
		"dcharacteristic": "07dc8d4f-0204-11e5-be50-d2bb8c030246",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"class_name": "cat.nom_kinds"
	},
	{
		"_id": "cat.nom_kinds|79551d5d-6d0f-455c-ba54-9e751797bebd",
		"_rev": "1-1de454c6d313a0040103683f138c9b8f",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Работа",
		"id": "000010001",
		"nom_type": "Работа",
		"dnom": "17e3bc58-0204-11e5-be50-d2bb8c030246",
		"dcharacteristic": "17e3bc59-0204-11e5-be50-d2bb8c030246",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"class_name": "cat.nom_kinds"
	},
	{
		"_id": "cat.nom_kinds|cce2ae52-5f13-11e3-bfa1-206a8a1a5bb0",
		"_rev": "1-5c8ea16b08f15a75b6b7e6bd3789d499",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Товар",
		"id": "000020015",
		"nom_type": "Товар",
		"dnom": "fd350b1e-0203-11e5-be50-d2bb8c030246",
		"dcharacteristic": "fd350b1f-0203-11e5-be50-d2bb8c030246",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"class_name": "cat.nom_kinds"
	},
	{
		"_id": "cat.nom_kinds|d644d4bc-1ab4-4b6a-813b-68628c6e2b0f",
		"_rev": "1-9a483aeb23b4abf7ca1b338d0e9fa54c",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Услуга",
		"id": "000020003",
		"nom_type": "Услуга",
		"dnom": "1fc4c1c2-0204-11e5-be50-d2bb8c030246",
		"dcharacteristic": "1fc4c1c3-0204-11e5-be50-d2bb8c030246",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"class_name": "cat.nom_kinds"
	},
	{
		"_id": "cat.nom_kinds|e15123ef-de02-4bfd-ae0c-f4afcd18270f",
		"_rev": "1-997aebd73d16bd3712502a278f87ab87",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Заполнение",
		"id": "000020005",
		"nom_type": "Товар",
		"dnom": "fd350b1c-0203-11e5-be50-d2bb8c030246",
		"dcharacteristic": "fd350b1d-0203-11e5-be50-d2bb8c030246",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"class_name": "cat.nom_kinds"
	},
	{
		"_id": "cat.nom_kinds|eec9c933-cfc2-4c98-b502-b781ddacd903",
		"_rev": "1-14f5e3e3b4c02e1ccea9880727d233f9",
		"is_folder": false,
		"parent": "00000000-0000-0000-0000-000000000000",
		"name": "Продукция",
		"id": "000020001",
		"nom_type": "Товар",
		"dnom": "10dbace8-0204-11e5-be50-d2bb8c030246",
		"dcharacteristic": "10dbace9-0204-11e5-be50-d2bb8c030246",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"class_name": "cat.nom_kinds"
	},
	{
		"_id": "cat.scheme_settings|01d9f930-2a3f-11ea-84c7-633c65c58bd1",
		"_rev": "3-e91eea9c20b95dea04562b6354ab3508",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "elm",
				"caption": "Эл",
				"width": 40
			},
			{
				"use": true,
				"field": "width",
				"caption": "Шир",
				"width": 60
			},
			{
				"use": true,
				"field": "height",
				"caption": "Выс",
				"width": 60
			},
			{
				"use": true,
				"field": "formula",
				"caption": "Формула",
				"width": "*"
			},
			{
				"use": false,
				"field": "is_rectangular",
				"caption": "Прямоугольное",
				"width": 60
			},
			{
				"use": false,
				"field": "is_sandwich",
				"caption": "Непрозрачное",
				"width": 60
			},
			{
				"use": true,
				"field": "thickness",
				"caption": "Толщ",
				"width": 40
			}
		],
		"obj": "cat.characteristics.glasses",
		"name": "characteristics.glasses.gl1",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|04e2f6cf-6b06-4455-d48e-997d864a8398",
		"_rev": "7-63809d7c5591f0d23f83a80d1419ffdd",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": false,
				"field": "period",
				"width": "",
				"caption": "Период",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": false,
				"field": "register",
				"width": "",
				"caption": "Регистратор",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": false,
				"field": "organization",
				"width": "",
				"caption": "Организация",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": false,
				"field": "trans",
				"width": "",
				"caption": "Сделка",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "partner",
				"width": "",
				"caption": "Контрагент",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "initial_balance",
				"width": "",
				"caption": "Нач. остаток",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "debit",
				"width": "",
				"caption": "Приход",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "credit",
				"width": "",
				"caption": "Расход",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			},
			{
				"parent": "",
				"use": true,
				"field": "final_balance",
				"width": "",
				"caption": "Кон. остаток",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 9
			}
		],
		"obj": "rep.mutual_settlements.data",
		"name": "Взаиморасчеты",
		"date_from": "2018-01-01T05:00:00",
		"date_till": "2018-01-16T02:37:10",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|04eb8920-9080-11ea-874b-4b35e1995caa",
		"_rev": "3-ec5df2948168edd66e6931ad4f1fd6c7",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "cnstr",
				"caption": "Элемент",
				"width": "80"
			},
			{
				"use": true,
				"field": "inset",
				"caption": "Вставка",
				"width": "*"
			},
			{
				"parent": "",
				"use": true,
				"field": "param",
				"caption": "Параметр",
				"width": "*"
			},
			{
				"use": true,
				"field": "value",
				"caption": "Значение",
				"width": "*"
			},
			{
				"use": true,
				"field": "hide",
				"caption": "Скрыть",
				"width": "80"
			}
		],
		"obj": "cat.characteristics.params",
		"name": "characteristics.params.main",
		"user": "",
		"params": [],
		"sorting": [],
		"dimensions": [],
		"resources": [],
		"selection": [],
		"composition": [],
		"conditional_appearance": []
	},
	{
		"_id": "cat.scheme_settings|07645cd9-ec0e-4787-eb6e-dcf69b686852",
		"_rev": "2-ea93c255479f86757c356cc8e052cf77",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "id",
				"width": "",
				"caption": "Код"
			},
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": false,
				"field": "note",
				"width": "",
				"caption": "Комментарий"
			}
		],
		"sorting": [
			{
				"parent": "",
				"use": false,
				"field": "id",
				"direction": "asc"
			},
			{
				"parent": "",
				"use": false,
				"field": "name",
				"direction": "asc"
			}
		],
		"obj": "cat.individuals",
		"name": "Физлица",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|08c33f07-10f9-45cb-af38-a8d706aee268",
		"_rev": "7-27f59ca9412270ecf5882de816a185c7",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": false,
				"field": "period",
				"width": "",
				"caption": "Период",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "register",
				"width": "",
				"caption": "Регистратор",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": false,
				"field": "organization",
				"width": "",
				"caption": "Организация",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "bank_account_cashbox",
				"width": "",
				"caption": "Банк/касса",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "initial_balance",
				"width": "",
				"caption": "Нач. остаток",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "debit",
				"width": "",
				"caption": "Приход",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "credit",
				"width": "",
				"caption": "Расход",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "final_balance",
				"width": "",
				"caption": "Кон. остаток",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			}
		],
		"obj": "rep.cash.data",
		"name": "Ведомость по денежным средствам",
		"date_from": "2018-01-01T05:00:00",
		"date_till": "2018-01-11T19:34:00",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|0aa05938-d190-460f-9dfb-2c371984d104",
		"_rev": "2-44b0cb0e8d0fd6637a2f917f7afd6790",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "id",
				"width": "",
				"caption": "Код",
				"tooltip": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование",
				"tooltip": "",
				"row": 2
			},
			{
				"parent": "",
				"use": false,
				"field": "funds_currency",
				"width": "",
				"caption": "Валюта денежных средств",
				"tooltip": "Валюта учета денежных средств",
				"row": 3
			},
			{
				"parent": "",
				"use": false,
				"field": "department",
				"width": "",
				"caption": "Подразделение",
				"tooltip": "Подразделение, отвечающее за кассу.",
				"row": 4
			},
			{
				"parent": "",
				"use": false,
				"field": "current_account",
				"width": "",
				"caption": "Расчетный счет",
				"tooltip": "",
				"row": 5
			},
			{
				"parent": "",
				"use": false,
				"field": "owner",
				"width": "",
				"caption": "Организация",
				"tooltip": "",
				"row": 6
			}
		],
		"obj": "cat.cashboxes",
		"name": "Кассы",
		"date_from": "2019-01-01T05:00:00",
		"date_till": "2019-03-26T23:55:11",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|0ac173e0-15a9-11ed-9638-d31d84cae23f",
		"_rev": "3-2403a1c24d52e4299dbdb9c9a7d911b3",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": false,
				"field": "calc_order",
				"width": "",
				"caption": "Расчет",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": false,
				"field": "product",
				"width": "",
				"caption": "Изделие",
				"tooltip": "Для продукции - номер строки заказа, для характеристики стеклопакета - номер элемента",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": false,
				"field": "cnstr",
				"width": "",
				"caption": "№ Конструкции",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": false,
				"field": "elm",
				"width": "",
				"caption": "Элемент",
				"tooltip": "Номер элемента, если значение > 0, либо номер конструкции, если значение < 0",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "nom",
				"width": "*",
				"caption": "Номенклатура",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": false,
				"field": "clr",
				"width": "",
				"caption": "Цвет",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "characteristic",
				"width": "*",
				"caption": "Характеристика",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": false,
				"field": "nom_kind",
				"width": "260",
				"caption": "Вид номенклатуры",
				"tooltip": "Указывается вид, к которому следует отнести данную позицию номенклатуры.",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			},
			{
				"parent": "",
				"use": false,
				"field": "qty",
				"width": "",
				"caption": "Количество (шт)",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 9
			},
			{
				"parent": "",
				"use": false,
				"field": "len",
				"width": "",
				"caption": "Длина, м",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 10
			},
			{
				"parent": "",
				"use": false,
				"field": "width",
				"width": "",
				"caption": "Ширина, м",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 11
			},
			{
				"parent": "",
				"use": false,
				"field": "s",
				"width": "",
				"caption": "Площадь, м²",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 12
			},
			{
				"parent": "",
				"use": false,
				"field": "material",
				"width": "",
				"caption": "Материал",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 13
			},
			{
				"parent": "",
				"use": false,
				"field": "grouping",
				"width": "",
				"caption": "Группировка",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 14
			},
			{
				"parent": "",
				"use": true,
				"field": "totqty",
				"width": "200",
				"caption": "Количество",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 15
			},
			{
				"parent": "",
				"use": false,
				"field": "totqty1",
				"width": "",
				"caption": "Количество (+%)",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 16
			},
			{
				"parent": "",
				"use": false,
				"field": "price",
				"width": "",
				"caption": "Себест.план",
				"tooltip": "Цена плановой себестоимости строки спецификации",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 17
			},
			{
				"parent": "",
				"use": false,
				"field": "amount",
				"width": "",
				"caption": "Сумма себест.",
				"tooltip": "Сумма плановой себестоимости строки спецификации",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 18
			},
			{
				"parent": "",
				"use": false,
				"field": "amount_marged",
				"width": "",
				"caption": "Сумма с наценкой",
				"tooltip": "Вклад строки спецификации в стоимость изделия для сценария КМАРЖ_В_СПЕЦИФИКАЦИИ",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 19
			}
		],
		"obj": "rep.materials_demand.specification",
		"name": "Профиль после оптимизации",
		"selection": [
			{
				"parent": "",
				"use": true,
				"area": 0,
				"left_value": "nom_kind",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": {
					"is_folder": false,
					"parent": "00000000-0000-0000-0000-000000000000",
					"name": "Профиль",
					"id": "000020004",
					"nom_type": "Товар",
					"dnom": "10dbacea-0204-11e5-be50-d2bb8c030246",
					"dcharacteristic": "dfcb8504-ec30-11e9-8204-005056aafe4c",
					"captured": false,
					"ref": "012abd41-e241-4f5a-84cf-636750084c95"
				},
				"right_value_type": "cat.nom_kinds",
				"row": 1
			}
		],
		"dimensions": [
			{
				"parent": "",
				"use": false,
				"field": "",
				"row": 1
			}
		],
		"resources": [
			{
				"parent": "",
				"field": "totqty",
				"formula": "00000000-0000-0000-0000-000000000000",
				"row": 1
			}
		],
		"sorting": [],
		"order": 90,
		"params": [],
		"composition": [],
		"conditional_appearance": [],
		"user": "",
		"query": "",
		"standard_period": "00000000-0000-0000-0000-000000000000",
		"formula": "00000000-0000-0000-0000-000000000000",
		"tag": ""
	},
	{
		"_id": "cat.scheme_settings|0c2201df-9cc8-49c2-f7e3-56b6a8fe5952",
		"_rev": "2-4fce1faba407d618d06fb5e5b40ca345",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "type",
				"width": "",
				"caption": "Тип",
				"tooltip": "Тип контактной информации (телефон, адрес и т.п.)"
			},
			{
				"parent": "",
				"use": true,
				"field": "kind",
				"width": "",
				"caption": "Вид",
				"tooltip": "Вид контактной информации"
			},
			{
				"parent": "",
				"use": true,
				"field": "presentation",
				"width": "",
				"caption": "Представление",
				"tooltip": "Представление контактной информации для отображения в формах"
			}
		],
		"obj": "cat.partners.contact_information",
		"name": "cat.partners.contact_information",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|0d573409-ef40-40f0-8aa8-b43b31195b69",
		"_rev": "4-afbb71d9f6fae82cae1925be0774d7da",
		"class_name": "cat.scheme_settings",
		"obj": "dp.buyers_order.production",
		"name": "Жалюзи",
		"user": "",
		"order": 33,
		"selection": [
			{
				"parent": "",
				"use": true,
				"left_value": "inset.insert_type",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "Жалюзи",
				"right_value_type": "enm.inserts_types",
				"row": 1
			}
		],
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "inset",
				"width": "",
				"caption": "Продукция",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "clr",
				"width": "",
				"caption": "Цвет",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "len",
				"width": "",
				"caption": "Длина, мм",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "height",
				"width": "",
				"caption": "Высота, мм",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Колич., шт",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "20fa4b05-ade2-11e1-a7d7-1c6f65483aba",
				"width": "",
				"caption": "Управление",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "0370f212-3e38-11e8-81dc-005056aafe4c",
				"width": "",
				"caption": "Материал",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "2c4b5b2a-d894-11e9-841c-ddb20fb01f47",
				"width": "",
				"caption": "Жалюзи тип",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "",
				"caption": "Комментарий",
				"row": 9
			}
		],
		"params": [],
		"sorting": []
	},
	{
		"_id": "cat.scheme_settings|0f818908-5b06-49da-bc06-f1562db11451",
		"_rev": "3-7959475874e4e7ed3cb9c4bf254fc943",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "id",
				"width": "",
				"caption": "Код"
			},
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": false,
				"field": "server",
				"width": "",
				"caption": "Сервер",
				"tooltip": "Основной сервер абонента (отделы абонента могут использовать другие серверы)"
			},
			{
				"parent": "",
				"use": false,
				"field": "repl_mango",
				"width": "",
				"caption": "RMango",
				"tooltip": "Использовать mango-селетор в фильтре репликатора",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": false,
				"field": "repl_templates",
				"width": "",
				"caption": "RTemplate",
				"tooltip": "Использовать отдельную базу шаблонов"
			}
		],
		"obj": "cat.abonents",
		"name": "cat.abonents",
		"user": "",
		"params": [],
		"sorting": [],
		"selection": []
	},
	{
		"_id": "cat.scheme_settings|16139c00-095c-4286-f0b2-506854b5c021",
		"_rev": "27-69b5389866bc187909ef795ffe90fbdf",
		"class_name": "cat.scheme_settings",
		"obj": "dp.buyers_order.production",
		"name": "Подоконник",
		"user": "",
		"order": 10,
		"selection": [
			{
				"parent": "",
				"use": true,
				"left_value": "inset.insert_type",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "Подоконник",
				"right_value_type": "enm.inserts_types",
				"row": 1
			}
		],
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "inset",
				"width": "350",
				"caption": "Продукция",
				"tooltip": "",
				"ctrl_type": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "clr",
				"width": "",
				"caption": "Цвет",
				"tooltip": "",
				"ctrl_type": "",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "len",
				"width": "",
				"caption": "Длина, мм",
				"tooltip": "",
				"ctrl_type": "",
				"row": 3
			},
			{
				"parent": "",
				"use": false,
				"field": "height",
				"width": "",
				"caption": "Ширина, мм",
				"tooltip": "",
				"ctrl_type": "",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"editor": "00000000-0000-0000-0000-000000000000",
				"field": "5adf9f26-3be5-11e7-8937-abdef8fb0946",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"width": "",
				"caption": "Ширина подоконника",
				"tooltip": "",
				"ctrl_type": "",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Колич., шт",
				"tooltip": "",
				"ctrl_type": "",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "18ef542b-3298-11e8-81dc-005056aafe4c",
				"width": "",
				"caption": "Доп. значение набора",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "",
				"caption": "Комментарий",
				"tooltip": "",
				"ctrl_type": "",
				"row": 8
			}
		],
		"sorting": [],
		"dimensions": [],
		"resources": [],
		"params": [],
		"composition": [],
		"conditional_appearance": []
	},
	{
		"_id": "cat.scheme_settings|16139c00-095c-4286-f0b2-506854b5c022",
		"_rev": "16-325f182f1ec2ffb7d85a6cc66bbc84a6",
		"class_name": "cat.scheme_settings",
		"obj": "dp.buyers_order.production",
		"name": "Водоотлив",
		"user": "",
		"order": 20,
		"selection": [
			{
				"parent": "",
				"use": true,
				"left_value": "inset.insert_type",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "Водоотлив",
				"right_value_type": "enm.inserts_types",
				"row": 1
			}
		],
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "inset",
				"width": "350",
				"caption": "Продукция",
				"tooltip": "",
				"ctrl_type": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "clr",
				"width": "",
				"caption": "Цвет",
				"tooltip": "",
				"ctrl_type": "",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "len",
				"width": "",
				"caption": "Длина, мм",
				"tooltip": "",
				"ctrl_type": "",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "height",
				"width": "",
				"caption": "Ширина, мм",
				"tooltip": "",
				"ctrl_type": "",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Колич., шт",
				"tooltip": "",
				"ctrl_type": "",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "88207114-3f09-11e7-8937-abdef8fb0946",
				"width": "",
				"caption": "Параметры отлива",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "",
				"caption": "Комментарий",
				"tooltip": "",
				"ctrl_type": "",
				"row": 7
			}
		],
		"sorting": [],
		"params": []
	},
	{
		"_id": "cat.scheme_settings|16139c00-095c-4286-f0b2-506854b5c023",
		"_rev": "24-87f0f30696bd1107dd823b89ee445b05",
		"class_name": "cat.scheme_settings",
		"obj": "dp.buyers_order.production",
		"name": "МоскитнаяСетка",
		"order": 30,
		"selection": [
			{
				"parent": "",
				"use": true,
				"left_value": "inset.insert_type",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "МоскитнаяСетка",
				"right_value_type": "enm.inserts_types",
				"row": 1,
				"area": 0
			}
		],
		"fields": [
			{
				"use": true,
				"field": "inset",
				"width": "350",
				"caption": "Продукция",
				"parent": "",
				"row": 1,
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"use": true,
				"field": "clr",
				"caption": "Цвет",
				"parent": "",
				"row": 2,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"use": true,
				"field": "len",
				"caption": "Длина, мм",
				"parent": "",
				"row": 3,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "height",
				"caption": "Высота, мм",
				"row": 4,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"use": true,
				"field": "quantity",
				"caption": "Колич., шт",
				"parent": "",
				"row": 5,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"use": true,
				"field": "6b7e0aa6-1719-11e8-8006-f62df9746246",
				"caption": "Тип полотна МС",
				"parent": "",
				"row": 6,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"use": true,
				"field": "78d8f8d8-93ba-11e7-badf-e74766b70246",
				"caption": "Крепление МС",
				"parent": "",
				"row": 7,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"use": true,
				"field": "83d46deb-fa02-11e8-81fc-005056aafe4c",
				"caption": "Цвет креплений МС",
				"parent": "",
				"row": 8,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"use": true,
				"field": "653b5cf6-3c29-11e6-aac1-d73876e57c46",
				"caption": "Направл. МС",
				"parent": "",
				"row": 9,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "20fa4b05-ade2-11e1-a7d7-1c6f65483aba",
				"caption": "Жалюзи управление",
				"ctrl_type": "",
				"row": 10,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "0370f212-3e38-11e8-81dc-005056aafe4c",
				"caption": "Выбор номенклатуры",
				"ctrl_type": "",
				"row": 11,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "49c6a5fe-1d71-11ed-a080-ef7c46a70455",
				"width": "",
				"caption": "Высоты поперечин",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 12
			},
			{
				"use": true,
				"field": "note",
				"caption": "Комментарий",
				"parent": "",
				"row": 13,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			}
		],
		"sorting": [],
		"params": [],
		"dimensions": [],
		"resources": [],
		"composition": [],
		"conditional_appearance": [],
		"user": "",
		"query": "",
		"standard_period": "00000000-0000-0000-0000-000000000000",
		"formula": "00000000-0000-0000-0000-000000000000",
		"output": "00000000-0000-0000-0000-000000000000",
		"tag": ""
	},
	{
		"_id": "cat.scheme_settings|16139c00-095c-4286-f0b2-506854b5c024",
		"_rev": "16-50ad4017df6881c7ecf6ff4c7d61005a",
		"class_name": "cat.scheme_settings",
		"obj": "dp.buyers_order.production",
		"name": "Откос",
		"user": "",
		"order": 40,
		"selection": [
			{
				"parent": "",
				"use": true,
				"left_value": "inset.insert_type",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "Откос",
				"right_value_type": "enm.inserts_types",
				"row": 1
			}
		],
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "inset",
				"width": "350",
				"caption": "Продукция",
				"tooltip": "",
				"ctrl_type": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "clr",
				"width": "",
				"caption": "Цвет",
				"tooltip": "",
				"ctrl_type": "",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "len",
				"width": "",
				"caption": "Длина, мм",
				"tooltip": "",
				"ctrl_type": "",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "height",
				"width": "",
				"caption": "Ширина, мм",
				"tooltip": "",
				"ctrl_type": "",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Колич., шт",
				"tooltip": "",
				"ctrl_type": "",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "69bab83c-fc5b-11e7-ae72-cb2508b8b246",
				"width": "",
				"caption": "L-профиль",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "86df8094-fc4e-11e7-ae72-cb2508b8b246",
				"width": "",
				"caption": "F-профиль",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "",
				"caption": "Комментарий",
				"tooltip": "",
				"ctrl_type": "",
				"row": 8
			}
		],
		"sorting": [],
		"params": []
	},
	{
		"_id": "cat.scheme_settings|16139c00-095c-4286-f0b2-506854b5c026",
		"_rev": "20-b07d3e775e32c391b2654c02b9872569",
		"class_name": "cat.scheme_settings",
		"obj": "dp.buyers_order.production",
		"name": "Монтаж",
		"order": 60,
		"selection": [
			{
				"parent": "",
				"use": true,
				"left_value": "inset.insert_type",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "Монтаж",
				"right_value_type": "enm.inserts_types",
				"area": 0,
				"row": 1
			}
		],
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "inset",
				"width": "350",
				"caption": "Услуга",
				"ctrl_type": "",
				"row": 1,
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "s",
				"caption": "Площадь, м2",
				"ctrl_type": "",
				"row": 2,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"caption": "Колич., шт",
				"ctrl_type": "",
				"row": 3,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "92c69192-cf92-11e7-9552-ca5fe16a4746",
				"caption": "Доп. значение работ ",
				"ctrl_type": "",
				"row": 4,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "20fa4b01-ade2-11e1-a7d7-1c6f65483aba",
				"caption": "Тип",
				"ctrl_type": "",
				"row": 5,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "0370f212-3e38-11e8-81dc-005056aafe4c",
				"caption": "Выбор номенклатуры",
				"ctrl_type": "",
				"row": 6,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "111a6d54-27f3-11ea-820a-005056aafe4c",
				"width": "",
				"caption": "",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"caption": "Комментарий",
				"ctrl_type": "",
				"row": 8,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			}
		],
		"sorting": [],
		"params": [],
		"dimensions": [],
		"resources": [],
		"composition": [],
		"conditional_appearance": [],
		"user": "",
		"query": "",
		"standard_period": "00000000-0000-0000-0000-000000000000",
		"formula": "00000000-0000-0000-0000-000000000000",
		"output": "00000000-0000-0000-0000-000000000000",
		"tag": ""
	},
	{
		"_id": "cat.scheme_settings|16139c00-095c-4286-f0b2-506854b5c027",
		"_rev": "17-1671fd77b7f8d4d602a91425f7ff777a",
		"class_name": "cat.scheme_settings",
		"obj": "dp.buyers_order.production",
		"name": "Доставка",
		"user": "",
		"order": 70,
		"selection": [
			{
				"parent": "",
				"use": true,
				"left_value": "inset.insert_type",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "Доставка",
				"right_value_type": "enm.inserts_types",
				"row": 1
			}
		],
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "inset",
				"width": "350",
				"caption": "Услуга",
				"tooltip": "",
				"ctrl_type": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "len",
				"width": "",
				"caption": "Расстояние, км",
				"tooltip": "",
				"ctrl_type": "",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Колич., шт",
				"tooltip": "",
				"ctrl_type": "",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "92c69192-cf92-11e7-9552-ca5fe16a4746",
				"width": "",
				"caption": "Доп. значение работ ",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "1990e3bc-cf93-11e7-9552-ca5fe16a4746",
				"width": "",
				"caption": "Вид подъема",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "b13105a0-fcf0-11e7-ae72-cb2508b8b246",
				"width": "",
				"caption": "Материал упаковки",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "20fa4b01-ade2-11e1-a7d7-1c6f65483aba",
				"width": "",
				"caption": "Тип",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "",
				"caption": "Комментарий",
				"tooltip": "",
				"ctrl_type": "",
				"row": 8
			}
		],
		"sorting": [],
		"params": [],
		"dimensions": [],
		"resources": [],
		"composition": [],
		"conditional_appearance": []
	},
	{
		"_id": "cat.scheme_settings|16139c00-095c-4286-f0b2-506854b5c028",
		"_rev": "14-fc5a13fa3962b3f43727ec3cde8b12f1",
		"class_name": "cat.scheme_settings",
		"obj": "dp.buyers_order.production",
		"name": "Набор",
		"order": 80,
		"selection": [
			{
				"parent": "",
				"use": true,
				"left_value": "inset.insert_type",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "Набор",
				"right_value_type": "enm.inserts_types",
				"area": 0,
				"row": 1
			}
		],
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "inset",
				"width": "350",
				"caption": "Набор",
				"ctrl_type": "",
				"row": 1,
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "clr",
				"caption": "Цвет",
				"ctrl_type": "",
				"row": 2,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "len",
				"caption": "Длина, мм",
				"ctrl_type": "",
				"row": 3,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "height",
				"caption": "Ширина, мм",
				"ctrl_type": "",
				"row": 4,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"caption": "Колич., шт",
				"ctrl_type": "",
				"row": 5,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "18ef542b-3298-11e8-81dc-005056aafe4c",
				"caption": "Доп. значение набора",
				"ctrl_type": "",
				"row": 6,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "0370f212-3e38-11e8-81dc-005056aafe4c",
				"caption": "Выбор номенклатуры",
				"ctrl_type": "",
				"row": 7,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "c74d52d8-f758-11e6-8f35-9527474f7b44",
				"width": "",
				"caption": "Цвет комплекта",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"caption": "Комментарий",
				"ctrl_type": "",
				"row": 9,
				"width": "",
				"tooltip": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			}
		],
		"sorting": [],
		"params": [],
		"dimensions": [],
		"resources": [],
		"composition": [],
		"conditional_appearance": [],
		"user": "",
		"query": "",
		"standard_period": "00000000-0000-0000-0000-000000000000",
		"formula": "00000000-0000-0000-0000-000000000000",
		"output": "00000000-0000-0000-0000-000000000000",
		"tag": ""
	},
	{
		"_id": "cat.scheme_settings|1704b8e0-e5dd-11ea-a358-75e3a1ae6ba3",
		"_rev": "1-66bc06c9f9a1e0e1578181f0a607620f",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "elm",
				"caption": "Эл",
				"width": 40
			},
			{
				"use": true,
				"field": "nom",
				"caption": "Номенклатура",
				"width": "*"
			},
			{
				"use": true,
				"field": "clr",
				"caption": "Цвет",
				"width": 120
			},
			{
				"use": true,
				"field": "len",
				"caption": "Длин",
				"width": 60
			},
			{
				"use": true,
				"field": "alp1",
				"caption": "Угол1",
				"width": 60
			},
			{
				"use": true,
				"field": "alp2",
				"caption": "Угол2",
				"width": 60
			}
		],
		"obj": "cat.characteristics.coordinates",
		"name": "characteristics.coordinates.crooked",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|187f9a40-94fc-4ad2-ee4c-26341b816ade",
		"_rev": "5-f2c1e59dba862097618f9a2db4236a71",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": false,
				"field": "record_kind",
				"width": "",
				"caption": "Вид движения",
				"tooltip": "",
				"ctrl_type": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "stick",
				"width": "",
				"caption": "№ хлыста",
				"tooltip": "№ листа (хлыста, заготовки)",
				"ctrl_type": "",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "pair",
				"width": "",
				"caption": "№ пары",
				"tooltip": "№ парной заготовки",
				"ctrl_type": "",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "nom",
				"width": "260",
				"caption": "Номенклатура",
				"tooltip": "",
				"ctrl_type": "",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "characteristic",
				"width": "",
				"caption": "Характеристика",
				"tooltip": "",
				"ctrl_type": "",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "len",
				"width": "",
				"caption": "Длина",
				"tooltip": "длина в мм",
				"ctrl_type": "",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "width",
				"width": "",
				"caption": "Ширина",
				"tooltip": "ширина в мм",
				"ctrl_type": "",
				"row": 7
			},
			{
				"parent": "",
				"use": false,
				"field": "x",
				"width": "",
				"caption": "Координата X",
				"tooltip": "",
				"ctrl_type": "",
				"row": 8
			},
			{
				"parent": "",
				"use": false,
				"field": "y",
				"width": "",
				"caption": "Координата Y",
				"tooltip": "",
				"ctrl_type": "",
				"row": 9
			},
			{
				"parent": "",
				"use": false,
				"field": "quantity",
				"width": "",
				"caption": "Количество",
				"tooltip": "Количество в единицах хранения",
				"ctrl_type": "",
				"row": 10
			},
			{
				"parent": "",
				"use": true,
				"field": "cell",
				"width": "",
				"caption": "Ячейка",
				"tooltip": "№ ячейки (откуда брать заготовку или куда помещать деловой обрезок)",
				"ctrl_type": "",
				"row": 11
			},
			{
				"parent": "",
				"use": false,
				"field": "ref",
				"width": "",
				"caption": "Ссылка",
				"tooltip": "",
				"ctrl_type": "",
				"row": 12
			}
		],
		"obj": "doc.work_centers_task.cuts",
		"name": "Обрезь вход",
		"user": "",
		"params": [
			{
				"param": "record_kind",
				"value_type": "",
				"value": "gh",
				"quick_access": false,
				"row": 1
			}
		],
		"selection": [
			{
				"parent": "",
				"use": false,
				"left_value": "record_kind",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "credit",
				"right_value_type": "enm.debit_credit_kinds",
				"row": 1
			}
		]
	},
	{
		"_id": "cat.scheme_settings|1c8fb850-8ee4-11ea-9abb-79c3e9ec2f39",
		"_rev": "1-76c7a9d81927fd0b6e55a13b66404876",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "nom",
				"ctrl_type": "label",
				"width": "",
				"caption": "Номенклатура"
			},
			{
				"parent": "",
				"use": true,
				"field": "characteristic",
				"ctrl_type": "label",
				"width": "*",
				"caption": "Характеристика"
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"ctrl_type": "label",
				"width": "",
				"caption": "Комментарий"
			}
		],
		"obj": "dp.buyers_order.production",
		"name": "production.select_prod",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|1ec41d3f-d0d3-452a-db30-f4ed7a7f9b9e",
		"_rev": "2-ad5fa250a24b17b52cbe84691f391255",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "acl_obj",
				"width": "*",
				"caption": "Объект доступа"
			},
			{
				"parent": "",
				"use": true,
				"field": "type",
				"width": "",
				"caption": "Тип"
			},
			{
				"parent": "",
				"use": true,
				"field": "by_default",
				"width": "",
				"caption": "По умолчанию"
			}
		],
		"obj": "cat.users.acl_objs",
		"name": "cat.users.acl_objs",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|1fc6b022-7fd8-42f2-8830-11a504357af6",
		"_rev": "8-d83b4e697409b419639b0cbe6b64374b",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "id",
				"width": "",
				"caption": "Код"
			},
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": true,
				"field": "clr_str",
				"width": "",
				"caption": "Цвет",
				"tooltip": "В рисовалке"
			},
			{
				"parent": "",
				"use": true,
				"field": "clr_out",
				"width": "",
				"caption": "Снаружи"
			},
			{
				"parent": "",
				"use": true,
				"field": "clr_in",
				"width": "",
				"caption": "Изнутри"
			},
			{
				"parent": "",
				"use": true,
				"field": "grouping",
				"width": "",
				"caption": "Группировка"
			}
		],
		"sorting": [
			{
				"parent": "",
				"use": false,
				"field": "id",
				"direction": "asc"
			},
			{
				"parent": "",
				"use": false,
				"field": "name",
				"direction": "asc"
			}
		],
		"obj": "cat.clrs",
		"name": "Цвета",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|23b54af2-13ba-11ea-a6f2-db63355ad098",
		"_rev": "5-c0f641c548d1ca2a6c3e986a861a28d5",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "inset",
				"caption": "Вставка",
				"width": "*"
			},
			{
				"parent": "",
				"use": true,
				"field": "clr",
				"caption": "Цвет",
				"width": "*"
			}
		],
		"params": [],
		"sorting": [],
		"dimensions": [],
		"resources": [],
		"selection": [],
		"composition": [],
		"conditional_appearance": [],
		"obj": "cat.characteristics.inserts",
		"name": "characteristics.inserts.dop",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|23b54af3-13ba-11ea-a6f2-db63355ad098",
		"_rev": "4-5b994855676eec516aaef1f00713782b",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "param",
				"caption": "Параметр",
				"width": "*"
			},
			{
				"parent": "",
				"use": true,
				"field": "value",
				"caption": "Значение",
				"width": "*"
			}
		],
		"obj": "cat.characteristics.params",
		"name": "characteristics.params.dop",
		"user": "",
		"params": [],
		"sorting": [],
		"dimensions": [],
		"resources": [],
		"selection": [],
		"composition": [],
		"conditional_appearance": []
	},
	{
		"_id": "cat.scheme_settings|23b54af4-13ba-11ea-a6f2-db63355ad098",
		"_rev": "2-0b59d0632485499d319c25c8da45bda8",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "elm1",
				"caption": "Элем 1",
				"tooltip": "Номер первого элемента"
			},
			{
				"use": true,
				"field": "node1",
				"caption": "Узел 1"
			},
			{
				"use": true,
				"field": "elm2",
				"caption": "Элем 2",
				"tooltip": "Номер второго элемента"
			},
			{
				"use": true,
				"field": "node2",
				"caption": "Узел 2"
			},
			{
				"use": true,
				"field": "aperture_len",
				"caption": "Длина шва/проема",
				"tooltip": "Для соединений с заполнениями: длина светового проема примыкающего элемента"
			},
			{
				"use": true,
				"field": "cnn",
				"caption": "Соединение",
				"width": "*"
			}
		],
		"sorting": [
			{
				"direction": "asc",
				"field": "elm1",
				"use": true
			},
			{
				"direction": "asc",
				"field": "elm2",
				"use": false
			},
			{
				"direction": "asc",
				"field": "cnn",
				"use": false
			}
		],
		"obj": "cat.characteristics.cnn_elmnts",
		"name": "characteristics.cnn_elmnts.main",
		"user": "",
		"params": [],
		"dimensions": [],
		"resources": [],
		"selection": [],
		"composition": [],
		"conditional_appearance": []
	},
	{
		"_id": "cat.scheme_settings|23b57200-13ba-11ea-a6f2-db63355ad098",
		"_rev": "2-20009b70e312e1fa30062ef1e5868a59",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": false,
				"field": "elm",
				"caption": "Элемент"
			},
			{
				"use": true,
				"field": "inset",
				"caption": "Вставка",
				"width": "*"
			},
			{
				"use": false,
				"field": "clr",
				"caption": "Цвет"
			}
		],
		"obj": "cat.characteristics.glass_specification",
		"name": "characteristics.glass_specification.main",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|23b57203-13ba-11ea-a6f2-db63355ad098",
		"_rev": "6-a8f463629110ffe5118471a0819bbe34",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "elm",
				"caption": "Эл.",
				"tooltip": "Номер элемента, если значение > 0, либо номер конструкции, если значение < 0",
				"width": 60
			},
			{
				"use": true,
				"field": "nom",
				"caption": "Номенклатура",
				"width": "*"
			},
			{
				"use": true,
				"field": "clr",
				"caption": "Цвет"
			},
			{
				"use": true,
				"field": "characteristic",
				"caption": "Характеристика"
			},
			{
				"use": true,
				"field": "qty",
				"caption": "Колич (шт)",
				"width": 120
			},
			{
				"use": true,
				"field": "len",
				"caption": "Длина/высота, м"
			},
			{
				"use": true,
				"field": "width",
				"caption": "Ширина, м"
			},
			{
				"use": true,
				"field": "s",
				"caption": "Площадь, м²"
			},
			{
				"use": true,
				"field": "alp1",
				"caption": "Угол 1, °",
				"width": 90
			},
			{
				"use": true,
				"field": "alp2",
				"caption": "Угол 2, °",
				"width": 90
			},
			{
				"use": true,
				"field": "totqty",
				"caption": "Колич",
				"width": 120
			},
			{
				"use": true,
				"field": "totqty1",
				"caption": "Колич (+%)",
				"width": 120
			},
			{
				"use": false,
				"field": "price",
				"caption": "Себест.план",
				"tooltip": "Цена плановой себестоимости строки спецификации"
			},
			{
				"use": false,
				"field": "amount",
				"caption": "Сумма себест.",
				"tooltip": "Сумма плановой себестоимости строки спецификации"
			},
			{
				"use": false,
				"field": "amount_marged",
				"caption": "Сумма с наценкой",
				"tooltip": "Вклад строки спецификации в стоимость изделия для сценария КМАРЖ_В_СПЕЦИФИКАЦИИ"
			},
			{
				"use": false,
				"field": "origin",
				"caption": "Происхождение"
			},
			{
				"use": false,
				"field": "specify",
				"caption": "Уточнение происхождения"
			}
		],
		"obj": "cat.characteristics.specification",
		"name": "characteristics.specification.main",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|2660e8e0-5898-11ea-93a5-ad26bfc2216a",
		"_rev": "3-8f382dc89f58c2775a03d5535bd8c467",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "identifier",
				"width": "200",
				"caption": "Номенклатура"
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Количество"
			},
			{
				"parent": "",
				"use": false,
				"field": "price",
				"width": "",
				"caption": "Цена"
			},
			{
				"parent": "",
				"use": false,
				"field": "amount",
				"width": "",
				"caption": "Сумма"
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "*",
				"caption": "Комментарий"
			}
		],
		"obj": "doc.purchase_order.goods",
		"name": "purchase_order.goods.http",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|27d75495-6426-40df-c428-df81c1ba815b",
		"_rev": "7-b52af92a1e1495b593e34f46379cc484",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "date",
				"width": "160",
				"caption": "Дата",
				"tooltip": "Дата документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "number_doc",
				"width": "120",
				"caption": "№",
				"tooltip": "Номер документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "warehouse",
				"width": "160",
				"caption": "Склад",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": false,
				"field": "organization",
				"width": "160",
				"caption": "Организация",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "partner",
				"width": "160",
				"caption": "Контрагент",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "doc_amount",
				"width": "120",
				"caption": "Сумма",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "responsible",
				"width": "160",
				"caption": "Ответственный",
				"tooltip": "Пользователь, ответственный за  документ.",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "*",
				"caption": "Комментарий",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			},
			{
				"parent": "",
				"use": false,
				"field": "department",
				"width": "",
				"caption": "Подразделение",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 9
			}
		],
		"obj": "doc.selling",
		"name": "Реализация",
		"date_from": "2018-01-01T05:00:00",
		"date_till": "2018-01-10T20:43:20",
		"user": "",
		"sorting": [],
		"params": []
	},
	{
		"_id": "cat.scheme_settings|2823c3d0-d785-41d3-d581-f813f873a935",
		"_rev": "4-12a191c96e81219f8f9ea298329b54a4",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "property",
				"width": "",
				"caption": "Свойство",
				"tooltip": "Дополнительный реквизит"
			},
			{
				"parent": "",
				"use": true,
				"field": "value",
				"width": "",
				"caption": "Значение",
				"tooltip": "Значение дополнительного реквизита"
			}
		],
		"obj": "cat.branches.extra_fields",
		"name": "branches.extra_fields.main",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|30770873-d00d-4076-b57d-7d1215598758",
		"_rev": "3-73bd5a0e3bedb8f715bc9d0118a975fc",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "obj",
				"width": "*",
				"caption": "Объект"
			},
			{
				"parent": "",
				"use": true,
				"field": "type",
				"width": "",
				"caption": "Тип"
			}
		],
		"obj": "cat.abonents.acl_objs",
		"name": "abonents.acl_objs",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|319e619a-b309-459a-8ce1-49e5f8df8ef9",
		"_rev": "3-05b8237ec91ad9e346f89f630f5a8b73",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			}
		],
		"obj": "cat.property_values",
		"name": "Значения свойств объектов",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|34815609-3c19-4900-8513-3ba254656597",
		"_rev": "3-dd820179c559ff81a74c6d9f4891fb72",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": true,
				"field": "x",
				"width": "",
				"caption": "Длина, мм"
			},
			{
				"parent": "",
				"use": true,
				"field": "y",
				"width": "",
				"caption": "Высота, мм"
			},
			{
				"parent": "",
				"use": true,
				"field": "z",
				"width": "",
				"caption": "Толщина, мм"
			},
			{
				"parent": "",
				"use": true,
				"field": "s",
				"width": "",
				"caption": "Площадь, м²"
			},
			{
				"parent": "",
				"use": true,
				"field": "clr",
				"width": "",
				"caption": "Цвет"
			},
			{
				"parent": "",
				"use": false,
				"field": "calc_order",
				"width": "",
				"caption": "Расчет"
			},
			{
				"parent": "",
				"use": false,
				"field": "product",
				"width": "",
				"caption": "Изделие"
			},
			{
				"parent": "",
				"use": false,
				"field": "leading_product",
				"width": "",
				"caption": "Ведущая продукция"
			},
			{
				"parent": "",
				"use": false,
				"field": "leading_elm",
				"width": "",
				"caption": "Ведущий элемент",
				"tooltip": "Для москиток и стеклопакетов - номер элемента ведущей продукции"
			},
			{
				"parent": "",
				"use": false,
				"field": "origin",
				"width": "",
				"caption": "Происхождение",
				"tooltip": "Используется в связке с ведущей продукцией и ведущим элементом"
			},
			{
				"parent": "",
				"use": false,
				"field": "note",
				"width": "",
				"caption": "Комментарий"
			},
			{
				"parent": "",
				"use": false,
				"field": "owner",
				"width": "",
				"caption": "Номенклатура"
			}
		],
		"obj": "cat.characteristics",
		"name": "Характеристики",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|371fee00-13b1-11ea-9b32-db528968a17f",
		"_rev": "2-d01a2d85e78e9938c80411ebe9ac66ce",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "nom",
				"width": "",
				"caption": "Номенклатура"
			},
			{
				"parent": "",
				"use": true,
				"field": "characteristic",
				"width": "",
				"caption": "Характеристика"
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "",
				"caption": "Комментарий"
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Количество"
			},
			{
				"parent": "",
				"use": false,
				"field": "unit",
				"width": "",
				"caption": "Ед."
			},
			{
				"parent": "",
				"use": false,
				"field": "qty",
				"width": "",
				"caption": "Количество, шт"
			},
			{
				"parent": "",
				"use": true,
				"field": "len",
				"width": "",
				"caption": "Длина/высота, мм"
			},
			{
				"parent": "",
				"use": true,
				"field": "width",
				"width": "",
				"caption": "Ширина, мм"
			},
			{
				"parent": "",
				"use": true,
				"field": "s",
				"width": "",
				"caption": "Площадь, м²",
				"tooltip": "Площадь изделия"
			},
			{
				"parent": "",
				"use": false,
				"field": "first_cost",
				"width": "",
				"caption": "Себест. ед.",
				"tooltip": "Плановая себестоимость единицы продукции"
			},
			{
				"parent": "",
				"use": false,
				"field": "marginality",
				"width": "",
				"caption": "К. марж"
			},
			{
				"parent": "",
				"use": true,
				"field": "price",
				"width": "",
				"caption": "Цена"
			},
			{
				"parent": "",
				"use": true,
				"field": "discount_percent",
				"width": "",
				"caption": "Скидка %"
			},
			{
				"parent": "",
				"use": true,
				"field": "discount_percent_internal",
				"width": "",
				"caption": "Скидка внутр. %",
				"tooltip": "Процент скидки для внутренней перепродажи (холдинг) или внешней (дилеры)"
			},
			{
				"parent": "",
				"use": false,
				"field": "discount",
				"width": "",
				"caption": "Скидка"
			},
			{
				"parent": "",
				"use": true,
				"field": "amount",
				"width": "",
				"caption": "Сумма"
			},
			{
				"parent": "",
				"use": false,
				"field": "margin",
				"width": "",
				"caption": "Маржа"
			},
			{
				"parent": "",
				"use": true,
				"field": "price_internal",
				"width": "",
				"caption": "Цена внутр."
			},
			{
				"parent": "",
				"use": true,
				"field": "amount_internal",
				"width": "",
				"caption": "Сумма внутр.",
				"tooltip": "Сумма внутренней реализации (холдинг) или внешней (от дилера конечному клиенту)"
			},
			{
				"parent": "",
				"use": true,
				"field": "vat_rate",
				"width": "",
				"caption": "Ставка НДС"
			},
			{
				"parent": "",
				"use": true,
				"field": "vat_amount",
				"width": "",
				"caption": "Сумма НДС"
			},
			{
				"parent": "",
				"use": false,
				"field": "ordn",
				"width": "",
				"caption": "Ведущая продукция",
				"tooltip": "ссылка на продукциию, к которой относится материал"
			},
			{
				"parent": "",
				"use": false,
				"field": "changed",
				"width": "",
				"caption": "Запись изменена",
				"tooltip": "Запись изменена оператором (1, -2) или добавлена корректировкой спецификации (-1)"
			}
		],
		"obj": "doc.calc_order.production",
		"name": "production.parametric",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|38c13320-2803-11ea-97f5-2decc3a6bfee",
		"_rev": "1-8331830225d736f403666118eaa155ca",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "id",
				"width": "140",
				"caption": "Код"
			},
			{
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"use": true,
				"field": "open_type",
				"width": "150",
				"caption": "Тип открывания"
			},
			{
				"parent": "",
				"use": true,
				"field": "is_set",
				"width": "",
				"caption": "Это набор",
				"tooltip": "Определяет, является элемент набором для построения спецификации или комплектом фурнитуры для выбора в построителе"
			},
			{
				"use": false,
				"field": "parent",
				"width": "",
				"caption": "Группа"
			},
			{
				"use": false,
				"field": "left_right",
				"width": "",
				"caption": "Левая правая"
			},
			{
				"use": false,
				"field": "is_sliding",
				"width": "",
				"caption": "Это раздвижка"
			},
			{
				"use": false,
				"field": "furn_set",
				"width": "",
				"caption": "Набор фурнитуры"
			},
			{
				"use": false,
				"field": "side_count",
				"width": "",
				"caption": "Количество сторон"
			},
			{
				"use": false,
				"field": "handle_side",
				"width": "",
				"caption": "Ручка на стороне"
			},
			{
				"use": false,
				"field": "name_short",
				"width": "",
				"caption": "Наименование сокращенное"
			},
			{
				"use": false,
				"field": "captured",
				"width": "",
				"caption": "Захвачен"
			},
			{
				"use": false,
				"field": "editor",
				"width": "",
				"caption": "Редактор"
			}
		],
		"obj": "cat.furns",
		"name": "furns.main",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|392d9643-33fe-462d-90d2-9d2eab0f1911",
		"_rev": "3-aa05dc6ab88399f39a39b6c039bb58d0",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": true,
				"field": "server",
				"width": "*",
				"caption": "Сервер"
			}
		],
		"obj": "cat.abonents.ex_bases",
		"name": "abonents.ex_bases",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|3ca2d539-41c4-458c-bbd1-ae053fc7039f",
		"_rev": "26-799546ea6bb3de12fbfab2b9221fb011",
		"fields": [
			{
				"parent": "",
				"use": false,
				"field": "parent",
				"width": 0,
				"caption": "Родитель",
				"tooltip": "",
				"ctrl_type": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "field",
				"width": 400,
				"caption": "Поле",
				"tooltip": "",
				"ctrl_type": "ofields",
				"row": 2
			}
		],
		"obj": "cat.scheme_settings.dimensions",
		"class_name": "cat.scheme_settings",
		"user": "",
		"name": "dimensions"
	},
	{
		"_id": "cat.scheme_settings|3e189a49-5b22-46fa-9b58-6193934e6167",
		"_rev": "8-6d99e0ad7de80161feeca2db7e366ec2",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "id",
				"width": "140",
				"caption": "Код"
			},
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": true,
				"field": "insert_type",
				"width": "",
				"caption": "Тип"
			},
			{
				"use": true,
				"field": "note",
				"width": "",
				"caption": "Комментарий"
			},
			{
				"use": false,
				"field": "captured",
				"width": "",
				"caption": "Захвачен"
			},
			{
				"use": false,
				"field": "editor",
				"width": "",
				"caption": "Редактор"
			}
		],
		"sorting": [
			{
				"direction": "asc",
				"field": "id",
				"use": false
			},
			{
				"direction": "asc",
				"field": "insert_type",
				"use": false
			},
			{
				"direction": "asc",
				"field": "name",
				"use": false
			}
		],
		"obj": "cat.inserts",
		"name": "inserts.main",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|403ac8ec-5aff-454c-d14f-f4e916c33d80",
		"_rev": "7-bebbb203f90cf19c9241fd7423d96463",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": false,
				"field": "period",
				"width": "",
				"caption": "Период",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": false,
				"field": "register",
				"width": "",
				"caption": "Регистратор",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": false,
				"field": "organization",
				"width": "",
				"caption": "Организация",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": false,
				"field": "department",
				"width": "",
				"caption": "Подразделение",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "partner",
				"width": "",
				"caption": "Контрагент",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": false,
				"field": "trans",
				"width": "",
				"caption": "Сделка",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "nom",
				"width": "",
				"caption": "Номенклатура",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "characteristic",
				"width": "",
				"caption": "Характеристика",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Количество",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 9
			},
			{
				"parent": "",
				"use": true,
				"field": "amount",
				"width": "",
				"caption": "Сумма",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 10
			},
			{
				"parent": "",
				"use": true,
				"field": "vat_amount",
				"width": "",
				"caption": "Сумма НДС",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 11
			},
			{
				"parent": "",
				"use": true,
				"field": "discount",
				"width": "",
				"caption": "Сумма скидки",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 12
			}
		],
		"obj": "rep.selling.data",
		"name": "Продажи",
		"date_from": "2018-01-01T05:00:00",
		"date_till": "2018-01-16T02:55:59",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|479af650-930c-11ea-988c-33244fe6882e",
		"_rev": "1-839c0c0b9951cae9b43eb48f060de63e",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": false,
				"field": "elm",
				"width": "",
				"caption": "№",
				"tooltip": "Идентификатор строки спецификации"
			},
			{
				"use": true,
				"field": "nom",
				"width": "",
				"caption": "Номенклатура"
			},
			{
				"use": true,
				"field": "algorithm",
				"width": "",
				"caption": "Алгоритм"
			},
			{
				"use": true,
				"field": "nom_characteristic",
				"width": "",
				"caption": "Характеристика"
			},
			{
				"use": true,
				"field": "clr",
				"width": "",
				"caption": "Цвет"
			},
			{
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Количество"
			},
			{
				"use": true,
				"field": "sz",
				"width": "",
				"caption": "Размер"
			},
			{
				"use": true,
				"field": "coefficient",
				"width": "",
				"caption": "Коэфф.",
				"tooltip": "коэффициент (кол-во комплектующего на 1мм профиля или 1м² заполнения)"
			},
			{
				"use": true,
				"field": "angle_calc_method",
				"width": "",
				"caption": "Расчет угла"
			},
			{
				"use": true,
				"field": "count_calc_method",
				"width": "",
				"caption": "Расчет колич."
			},
			{
				"use": true,
				"field": "formula",
				"width": "",
				"caption": "Формула"
			},
			{
				"use": true,
				"field": "lmin",
				"width": "",
				"caption": "Длина min",
				"tooltip": "Минимальная длина или ширина"
			},
			{
				"use": true,
				"field": "lmax",
				"width": "",
				"caption": "Длина max",
				"tooltip": "Максимальная длина или ширина"
			},
			{
				"use": true,
				"field": "ahmin",
				"width": "",
				"caption": "Угол min",
				"tooltip": "Минимальный угол к горизонтали"
			},
			{
				"use": true,
				"field": "ahmax",
				"width": "",
				"caption": "Угол max",
				"tooltip": "Максимальный угол к горизонтали"
			},
			{
				"use": true,
				"field": "smin",
				"width": "",
				"caption": "S min"
			},
			{
				"use": true,
				"field": "smax",
				"width": "",
				"caption": "S max"
			},
			{
				"use": true,
				"field": "for_direct_profile_only",
				"width": "",
				"caption": "Для прямых",
				"tooltip": "Использовать только для прямых профилей (1), только для кривых (-1) или всегда(0)"
			},
			{
				"use": true,
				"field": "step",
				"width": "",
				"caption": "Шаг",
				"tooltip": "Шаг (расчет по точкам)"
			},
			{
				"use": true,
				"field": "step_angle",
				"width": "",
				"caption": "Угол шага"
			},
			{
				"use": true,
				"field": "offsets",
				"width": "",
				"caption": "Отступы шага"
			},
			{
				"use": true,
				"field": "do_center",
				"width": "",
				"caption": "↔",
				"tooltip": "Положение от края или от центра"
			},
			{
				"use": true,
				"field": "attrs_option",
				"width": "",
				"caption": "Направления"
			},
			{
				"use": true,
				"field": "is_order_row",
				"width": "",
				"caption": "Это строка заказа",
				"tooltip": "Если заполнено, строка будет добавлена в заказ, а не в спецификацию текущей продукции"
			},
			{
				"use": true,
				"field": "is_main_elm",
				"width": "",
				"caption": "Это основной элемент",
				"tooltip": "Для профильных вставок определяет номенклатуру, размеры которой будут использованы при построении эскиза"
			}
		],
		"params": [],
		"obj": "cat.inserts.specification",
		"name": "inserts.specification.main",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|479b1d60-930c-11ea-988c-33244fe6882e",
		"_rev": "2-a100a0197587a8f28df1a085501341da",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "param",
				"width": "*",
				"caption": "Параметр"
			},
			{
				"use": true,
				"field": "comparison_type",
				"width": "",
				"caption": "Вид сравнения"
			},
			{
				"use": true,
				"field": "value",
				"width": "*",
				"caption": "Значение"
			}
		],
		"obj": "cat.inserts.selection_params",
		"name": "inserts.selection_params.main",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|479b1d61-930c-11ea-988c-33244fe6882e",
		"_rev": "1-e25bf16f7710e5a27a7af35ac7fceaae",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "param",
				"width": "",
				"caption": "Параметр"
			},
			{
				"use": true,
				"field": "value",
				"width": "",
				"caption": "Значение"
			},
			{
				"use": true,
				"field": "hide",
				"width": "",
				"caption": "Скрыть",
				"tooltip": "Не показывать строку параметра в диалоге свойств изделия"
			},
			{
				"use": true,
				"field": "forcibly",
				"width": "",
				"caption": "Принудительно",
				"tooltip": "Замещать установленное ранее значение при перевыборе системы"
			},
			{
				"use": true,
				"field": "pos",
				"width": "",
				"caption": "Расположение"
			},
			{
				"use": true,
				"field": "list",
				"width": "",
				"caption": "Дискретный ряд"
			}
		],
		"obj": "cat.inserts.product_params",
		"name": "inserts.product_params.main",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|4b2003c0-90ae-11ea-8f7a-31ffa3ee9111",
		"_rev": "1-78ea84ba586a058d22a5ab2b08feee6c",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "property",
				"width": "",
				"caption": "Свойство",
				"tooltip": "Дополнительный реквизит"
			},
			{
				"use": true,
				"field": "value",
				"width": "",
				"caption": "Значение",
				"tooltip": "Значение дополнительного реквизита"
			},
			{
				"use": false,
				"field": "txt_row",
				"width": "",
				"caption": "Текстовая строка",
				"tooltip": "Полный текст строкового дополнительного реквизита"
			}
		],
		"obj": "cat.nom.extra_fields",
		"name": "nom.extra_fields.main",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|4c3745bf-538a-42a9-dcc1-790639a48a75",
		"_rev": "3-ac593f3f3c76ad3440efa18c6d9b8e10",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "acl_obj",
				"width": "*",
				"caption": "Подразделение"
			},
			{
				"parent": "",
				"use": true,
				"field": "by_default",
				"width": "",
				"caption": "По умолчанию"
			}
		],
		"obj": "cat.branches.divisions",
		"name": "cat.branches.divisions",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|4fe15a0f-a6c2-442e-d8bb-7204c3085c4e",
		"_rev": "2-c10bd06921986d842ffbcbfc22397bf6",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "production",
				"width": "",
				"caption": "Продукция",
				"tooltip": "",
				"ctrl_type": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "specimen",
				"width": "",
				"caption": "Экземпляр",
				"tooltip": "Номер экземпляра",
				"ctrl_type": "",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "elm",
				"width": "",
				"caption": "Элемент",
				"tooltip": "Номер элемента",
				"ctrl_type": "",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "nom",
				"width": "",
				"caption": "Номенклатура",
				"tooltip": "",
				"ctrl_type": "",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "characteristic",
				"width": "",
				"caption": "Характеристика",
				"tooltip": "",
				"ctrl_type": "",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "len",
				"width": "",
				"caption": "Длина",
				"tooltip": "",
				"ctrl_type": "",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "width",
				"width": "",
				"caption": "Ширина",
				"tooltip": "",
				"ctrl_type": "",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "stick",
				"width": "",
				"caption": "№ хлыста",
				"tooltip": "№ листа (заготовки), на котором размещать изделие",
				"ctrl_type": "",
				"row": 8
			},
			{
				"parent": "",
				"use": true,
				"field": "pair",
				"width": "",
				"caption": "№ пары",
				"tooltip": "№ парного изделия",
				"ctrl_type": "",
				"row": 9
			},
			{
				"parent": "",
				"use": true,
				"field": "orientation",
				"width": "",
				"caption": "Ориентация",
				"tooltip": "",
				"ctrl_type": "",
				"row": 10
			},
			{
				"parent": "",
				"use": true,
				"field": "elm_type",
				"width": "",
				"caption": "Тип элемента",
				"tooltip": "",
				"ctrl_type": "",
				"row": 11
			},
			{
				"parent": "",
				"use": true,
				"field": "alp1",
				"width": "",
				"caption": "Угол реза1",
				"tooltip": "",
				"ctrl_type": "",
				"row": 12
			},
			{
				"parent": "",
				"use": true,
				"field": "alp2",
				"width": "",
				"caption": "Угол реза2",
				"tooltip": "",
				"ctrl_type": "",
				"row": 13
			},
			{
				"parent": "",
				"use": true,
				"field": "cell",
				"width": "",
				"caption": "Ячейка",
				"tooltip": "№ ячейки (куда помещать изделие)",
				"ctrl_type": "",
				"row": 14
			},
			{
				"parent": "",
				"use": true,
				"field": "part",
				"width": "",
				"caption": "Партия",
				"tooltip": "Партия (такт, группа раскроя)",
				"ctrl_type": "",
				"row": 15
			},
			{
				"parent": "",
				"use": true,
				"field": "x",
				"width": "",
				"caption": "Координата X",
				"tooltip": "",
				"ctrl_type": "",
				"row": 16
			},
			{
				"parent": "",
				"use": true,
				"field": "y",
				"width": "",
				"caption": "Y",
				"tooltip": "",
				"ctrl_type": "",
				"row": 17
			},
			{
				"parent": "",
				"use": true,
				"field": "rotated",
				"width": "",
				"caption": "Поворот",
				"tooltip": "",
				"ctrl_type": "",
				"row": 18
			},
			{
				"parent": "",
				"use": true,
				"field": "nonstandard",
				"width": "",
				"caption": "Это нестандарт",
				"tooltip": "",
				"ctrl_type": "",
				"row": 19
			},
			{
				"parent": "",
				"use": true,
				"field": "ref",
				"width": "",
				"caption": "Ссылка",
				"tooltip": "",
				"ctrl_type": "",
				"row": 20
			}
		],
		"obj": "doc.work_centers_task.cutting",
		"name": "Раскрой",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|5333df80-4889-11eb-8fc4-c37f85a77b8f",
		"_rev": "2-fb2e4cc7441ac00e59d9f95714ac99d2",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "elm",
				"caption": "Эл.",
				"tooltip": "Номер элемента, если значение > 0, либо номер конструкции, если значение < 0",
				"width": 60
			},
			{
				"use": true,
				"field": "nom",
				"caption": "Номенклатура",
				"width": "*"
			},
			{
				"use": true,
				"field": "clr",
				"caption": "Цвет"
			},
			{
				"use": true,
				"field": "characteristic",
				"caption": "Характеристика"
			},
			{
				"use": true,
				"field": "qty",
				"caption": "Колич (шт)",
				"width": 120
			},
			{
				"use": true,
				"field": "len",
				"caption": "Длина/высота, м"
			},
			{
				"use": true,
				"field": "width",
				"caption": "Ширина, м"
			},
			{
				"use": true,
				"field": "s",
				"caption": "Площадь, м²"
			},
			{
				"use": false,
				"field": "alp1",
				"caption": "Угол 1, °",
				"width": 90
			},
			{
				"use": false,
				"field": "alp2",
				"caption": "Угол 2, °",
				"width": 90
			},
			{
				"use": false,
				"field": "totqty",
				"caption": "Колич",
				"width": 120
			},
			{
				"use": true,
				"field": "totqty1",
				"caption": "Колич (+%)",
				"width": 120
			},
			{
				"use": true,
				"field": "price",
				"caption": "Себест.план",
				"tooltip": "Цена плановой себестоимости строки спецификации",
				"width": 120
			},
			{
				"use": true,
				"field": "amount",
				"caption": "Сумма себест.",
				"tooltip": "Сумма плановой себестоимости строки спецификации",
				"width": 120
			},
			{
				"use": true,
				"field": "amount_marged",
				"caption": "Сумма с наценкой",
				"tooltip": "Вклад строки спецификации в стоимость изделия для сценария КМАРЖ_В_СПЕЦИФИКАЦИИ",
				"width": 120
			},
			{
				"use": false,
				"field": "origin",
				"caption": "Происхождение"
			},
			{
				"use": false,
				"field": "specify",
				"caption": "Уточнение происхождения"
			}
		],
		"obj": "cat.characteristics.specification",
		"name": "characteristics.specification.prices",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|5395a7f0-bb86-11ea-af4f-6366cb16ba48",
		"_rev": "3-927a70abca0b098dad6ec8c1d89a9d90",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "elm1",
				"width": "*",
				"caption": "Текущая",
				"tooltip": "",
				"ctrl_type": "label"
			},
			{
				"use": true,
				"field": "elm2",
				"width": "*",
				"caption": "Заменить на",
				"tooltip": "",
				"ctrl_type": ""
			}
		],
		"obj": "dp.buyers_order.sys_furn",
		"name": "buyers_order.sys_furn.maun",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|53ce44e0-224b-11ea-acb4-49d2068d9082",
		"_rev": "9-403844685388f8fdcf724e66d6c91796",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "cnstr",
				"caption": "Ств",
				"width": 40
			},
			{
				"use": true,
				"field": "w",
				"caption": "Шир",
				"tooltip": "Ширина фурнитуры (по фальцу)",
				"width": 60
			},
			{
				"use": true,
				"field": "h",
				"caption": "Выс",
				"tooltip": "Высота фурнитуры (по фальцу)",
				"width": 60
			},
			{
				"use": true,
				"field": "furn",
				"caption": "Фурнитура",
				"width": "*"
			},
			{
				"use": false,
				"field": "direction",
				"caption": "Направл. откр.",
				"tooltip": "Направление открывания",
				"ctrl_type": ""
			},
			{
				"use": false,
				"field": "h_ruch",
				"caption": "Высота ручки",
				"tooltip": "Высота ручки в координатах контура (от габарита створки)",
				"width": 60
			},
			{
				"use": true,
				"field": "fix_ruch",
				"caption": "Руч",
				"tooltip": "Вычисляется по свойствам фурнитуры",
				"width": 60
			},
			{
				"use": false,
				"field": "is_rectangular",
				"caption": "Есть кривые",
				"ctrl_type": ""
			}
		],
		"obj": "cat.characteristics.constructions",
		"name": "characteristics.constructions.furn1",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|56a23b72-5e80-4434-e3d2-02cf927a16d3",
		"_rev": "2-8105ac03d10946670a2fca98e409b33c",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "identifier",
				"width": "*",
				"caption": "Идентификатор"
			},
			{
				"parent": "",
				"use": true,
				"field": "server",
				"width": "",
				"caption": "Сервер"
			}
		],
		"obj": "cat.users.ids",
		"name": "cat.users.ids",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|59b74870-9087-11ea-8ee8-ff811c187d2b",
		"_rev": "2-7a8f57eb8e4827d88a5aff8a42138bd1",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "parent",
				"caption": "Родитель",
				"width": 80
			},
			{
				"use": true,
				"field": "cnstr",
				"caption": "Слой",
				"width": 80
			},
			{
				"use": true,
				"field": "elm",
				"caption": "Элемент",
				"width": 80
			},
			{
				"use": true,
				"field": "region",
				"caption": "Камера",
				"width": 70
			},
			{
				"use": true,
				"field": "elm_type",
				"caption": "Тип эл",
				"width": 80
			},
			{
				"use": true,
				"field": "inset",
				"caption": "Вставка"
			},
			{
				"use": true,
				"field": "nom",
				"caption": "Номенклатура"
			},
			{
				"use": true,
				"field": "clr",
				"caption": "Цвет",
				"width": 130
			},
			{
				"use": true,
				"field": "len",
				"caption": "Длина",
				"width": 80
			},
			{
				"use": true,
				"field": "offset",
				"caption": "Смещение",
				"width": 80
			},
			{
				"use": true,
				"field": "x1",
				"caption": "X1",
				"width": 80
			},
			{
				"use": true,
				"field": "y1",
				"caption": "Y1",
				"width": 80
			},
			{
				"use": true,
				"field": "x2",
				"caption": "X2",
				"width": 80
			},
			{
				"use": true,
				"field": "y2",
				"caption": "Y2",
				"width": 80
			},
			{
				"use": true,
				"field": "s",
				"caption": "Площадь",
				"width": 90
			},
			{
				"use": true,
				"field": "r",
				"caption": "Радиус",
				"width": 80
			},
			{
				"use": true,
				"field": "arc_ccw",
				"caption": "Против часовой",
				"width": 90
			},
			{
				"use": true,
				"field": "angle_hor",
				"caption": "Угол к гор",
				"width": 90
			},
			{
				"use": true,
				"field": "alp1",
				"caption": "Угол 1",
				"width": 80
			},
			{
				"use": true,
				"field": "alp2",
				"caption": "Угол 2",
				"width": 80
			}
		],
		"obj": "cat.characteristics.coordinates",
		"name": "characteristics.coordinates.main",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|5a7e3589-88a8-4740-dfc8-96da4cf21be3",
		"_rev": "7-31bc22642b7318ec9ad9274a17c77a1f",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "date",
				"width": "160",
				"caption": "Дата",
				"tooltip": "Дата документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "number_doc",
				"width": "120",
				"caption": "Номер",
				"tooltip": "Номер документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "phase",
				"width": "120",
				"caption": "Фаза",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "key",
				"width": "160",
				"caption": "Ключ",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "recipient",
				"width": "160",
				"caption": "Получатель",
				"tooltip": "СГП или следующий передел",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": false,
				"field": "trans",
				"width": "",
				"caption": "Сделка",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			},
			{
				"parent": "",
				"use": false,
				"field": "partner",
				"width": "",
				"caption": "Контрагент",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 9
			},
			{
				"parent": "",
				"use": false,
				"field": "project",
				"width": "",
				"caption": "Проект",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 10
			},
			{
				"parent": "",
				"use": false,
				"field": "Основание",
				"width": "",
				"caption": "Основание",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 11
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "*",
				"caption": "Комментарий",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 12
			},
			{
				"parent": "",
				"use": false,
				"field": "_deleted",
				"width": "",
				"caption": "Пометка удаления",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 13
			},
			{
				"parent": "",
				"use": false,
				"field": "posted",
				"width": "",
				"caption": "Проведен",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 14
			}
		],
		"obj": "doc.planning_event",
		"name": "Событие планирования",
		"date_from": "2018-01-01T05:00:00",
		"date_till": "2018-01-10T20:27:50",
		"user": "",
		"sorting": [],
		"params": []
	},
	{
		"_id": "cat.scheme_settings|5ef63761-63f9-44e4-a6da-4f808e477ac7",
		"_rev": "2-813fc2ab44659e63be1501c1b83e1225",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "id",
				"width": "",
				"caption": "Код"
			},
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": false,
				"field": "inn",
				"width": "",
				"caption": "ИНН"
			}
		],
		"obj": "cat.organizations",
		"name": "cat.organizations",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|618f036c-ebcb-41e7-89f0-916396a221f4",
		"_rev": "2-54920eff61473aed3799fc4fe36f63e5",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "acl_obj",
				"width": "",
				"caption": "Объект доступа"
			}
		],
		"obj": "cat.branches.keys",
		"name": "cat.branches.keys",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|61f748f6-c8aa-414a-cfac-4e391761e59e",
		"_rev": "40-0b81be71a747781f25a8c163dd487703",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "date",
				"width": "160",
				"caption": "Дата",
				"tooltip": "Дата документа"
			},
			{
				"use": true,
				"field": "number_doc",
				"width": "120",
				"caption": "№",
				"tooltip": "Номер документа"
			},
			{
				"use": true,
				"field": "number_internal",
				"width": "120",
				"caption": "№ внутр",
				"tooltip": "Дополнительный (внутренний) номер документа"
			},
			{
				"use": true,
				"field": "partner",
				"width": "170",
				"caption": "Контрагент"
			},
			{
				"use": true,
				"field": "client_of_dealer",
				"width": "170",
				"caption": "Клиент",
				"tooltip": "Наименование конечного клиента в дилерских заказах"
			},
			{
				"use": true,
				"field": "manager",
				"width": "",
				"caption": "Автор",
				"tooltip": "Менеджер, оформивший заказ"
			},
			{
				"use": true,
				"field": "department",
				"caption": "Подразделение",
				"tooltip": "Офис продаж"
			},
			{
				"use": false,
				"field": "doc_amount",
				"width": "120",
				"caption": "Сумма"
			},
			{
				"use": false,
				"field": "amount_operation",
				"width": "",
				"caption": "Сумма упр",
				"tooltip": "Сумма в валюте управленческого учета"
			},
			{
				"use": true,
				"field": "amount_internal",
				"width": "120",
				"caption": "Сумма",
				"tooltip": "Сумма внутренней реализации"
			},
			{
				"use": true,
				"field": "obj_delivery_state",
				"width": "120",
				"caption": "Статус"
			},
			{
				"use": true,
				"field": "note",
				"caption": "Комментарий",
				"tooltip": "Дополнительная информация"
			},
			{
				"use": false,
				"field": "sys_profile",
				"width": "120",
				"caption": "Профиль"
			},
			{
				"use": false,
				"field": "project",
				"width": "",
				"caption": "Проект"
			},
			{
				"use": false,
				"field": "organization",
				"width": "",
				"caption": "Организация"
			},
			{
				"use": false,
				"field": "leading_manager",
				"width": "",
				"caption": "Ведущий менеджер",
				"tooltip": "Куратор, ведущий менеджер"
			},
			{
				"use": false,
				"field": "warehouse",
				"width": "",
				"caption": "Склад",
				"tooltip": "Склад отгрузки товаров по заказу"
			},
			{
				"use": false,
				"field": "delivery_area",
				"width": "",
				"caption": "Район",
				"tooltip": "Район (зона, направление) доставки для группировки при планировании и оптимизации маршрута геокодером"
			},
			{
				"parent": "",
				"use": false,
				"field": "category",
				"width": "",
				"caption": "Категория заказа"
			}
		],
		"params": [
			{
				"param": "Период",
				"value_type": "",
				"value": "",
				"quick_access": false,
				"row": 1
			}
		],
		"selection": [
			{
				"use": true,
				"left_value_type": "path",
				"left_value": "obj_delivery_state",
				"comparison_type": "in",
				"right_value_type": "enm.obj_delivery_states",
				"right_value": ""
			},
			{
				"use": true,
				"left_value_type": "path",
				"left_value": "department",
				"comparison_type": "in",
				"right_value_type": "cat.divisions",
				"right_value": "f09cd672-a7da-11dd-bdf9-000e35ba3c43"
			},
			{
				"use": true,
				"left_value_type": "path",
				"left_value": "partner",
				"comparison_type": "in",
				"right_value_type": "cat.partners",
				"right_value": ""
			},
			{
				"use": true,
				"left_value_type": "path",
				"left_value": "manager",
				"comparison_type": "in",
				"right_value_type": "cat.users",
				"right_value": ""
			}
		],
		"dimensions": [],
		"resources": [],
		"sorting": [
			{
				"direction": "desc",
				"field": "date",
				"use": true
			}
		],
		"obj": "doc.calc_order",
		"name": "calc_order.main",
		"user": "",
		"order": 10,
		"date_from": "2024-01-01T00:00:00",
		"date_till": "2024-06-30T23:59:59",
		"standard_period": "last6Month"
	},
	{
		"_id": "cat.scheme_settings|63582c60-28c6-11ea-89a1-f735c1a90859",
		"_rev": "4-c2d5bddf7f6f06733f626a9031fb4d76",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "left_value_type",
				"width": 120,
				"caption": "Тип слева",
				"ctrl_type": "type"
			},
			{
				"use": true,
				"field": "left_value",
				"width": 120,
				"caption": "Значение слева",
				"ctrl_type": "typed_field"
			},
			{
				"use": true,
				"field": "comparison_type",
				"width": 120,
				"caption": "Вид сравнения",
				"ctrl_type": "field"
			},
			{
				"use": true,
				"field": "right_value_type",
				"width": 120,
				"caption": "Тип справа",
				"ctrl_type": "type"
			},
			{
				"use": true,
				"field": "right_value",
				"width": "*",
				"caption": "Значение справа",
				"ctrl_type": "typed_field"
			},
			{
				"use": true,
				"field": "columns",
				"width": 100,
				"caption": "Колонки"
			},
			{
				"use": true,
				"field": "css",
				"width": "*",
				"caption": "Оформление",
				"tooltip": "В синтаксисе jss"
			}
		],
		"obj": "cat.scheme_settings.conditional_appearance",
		"user": "",
		"name": "appearance"
	},
	{
		"_id": "cat.scheme_settings|64174359-6107-46d5-f934-aabe480160bc",
		"_rev": "27-8db0cd694082e9b0ea1a516158c43a64",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "field",
				"width": 200,
				"caption": "Поле",
				"tooltip": "",
				"ctrl_type": "path",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "direction",
				"width": 200,
				"caption": "Направление",
				"tooltip": "",
				"ctrl_type": "field",
				"row": 3
			}
		],
		"obj": "cat.scheme_settings.sorting",
		"class_name": "cat.scheme_settings",
		"user": "",
		"name": "sorting"
	},
	{
		"_id": "cat.scheme_settings|66cda75f-de19-4a48-f9cc-c44e06773b2e",
		"_rev": "3-5dfae917ff57d0cdf361ebe8f5fa035d",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "product",
				"width": "",
				"caption": "Изделие",
				"tooltip": "Для продукции - номер строки заказа, для характеристики стеклопакета - номер элемента"
			},
			{
				"parent": "",
				"use": true,
				"field": "nom",
				"width": "360",
				"caption": "Номенклатура"
			},
			{
				"parent": "",
				"use": true,
				"field": "clr",
				"width": "",
				"caption": "Цвет"
			},
			{
				"parent": "",
				"use": true,
				"field": "characteristic",
				"width": "",
				"caption": "Характеристика"
			},
			{
				"parent": "",
				"use": true,
				"field": "len",
				"width": "",
				"caption": "Длина, м"
			},
			{
				"parent": "",
				"use": true,
				"field": "width",
				"width": "",
				"caption": "Ширина, м"
			},
			{
				"parent": "",
				"use": true,
				"field": "s",
				"width": "",
				"caption": "Площадь, м²"
			},
			{
				"parent": "",
				"use": true,
				"field": "qty",
				"width": "",
				"caption": "Количество (шт)"
			},
			{
				"parent": "",
				"use": true,
				"field": "sz",
				"width": "",
				"caption": "Размеры"
			},
			{
				"parent": "",
				"use": true,
				"field": "grouping",
				"width": "",
				"caption": "Группировка"
			},
			{
				"parent": "",
				"use": true,
				"field": "totqty",
				"width": "",
				"caption": "Количество"
			},
			{
				"parent": "",
				"use": false,
				"field": "calc_order",
				"width": "",
				"caption": "Расчет"
			},
			{
				"parent": "",
				"use": false,
				"field": "cnstr",
				"width": "",
				"caption": "№ Конструкции"
			},
			{
				"parent": "",
				"use": false,
				"field": "elm",
				"width": "",
				"caption": "Элемент",
				"tooltip": "Номер элемента, если значение > 0, либо номер конструкции, если значение < 0"
			},
			{
				"parent": "",
				"use": false,
				"field": "nom_kind",
				"width": "",
				"caption": "Вид номенклатуры",
				"tooltip": "Указывается вид, к которому следует отнести данную позицию номенклатуры."
			},
			{
				"parent": "",
				"use": false,
				"field": "material",
				"width": "",
				"caption": "Материал"
			},
			{
				"parent": "",
				"use": false,
				"field": "totqty1",
				"width": "",
				"caption": "Количество (+%)"
			},
			{
				"parent": "",
				"use": false,
				"field": "price",
				"width": "",
				"caption": "Себест.план",
				"tooltip": "Цена плановой себестоимости строки спецификации"
			},
			{
				"parent": "",
				"use": false,
				"field": "amount",
				"width": "",
				"caption": "Сумма себест.",
				"tooltip": "Сумма плановой себестоимости строки спецификации"
			},
			{
				"parent": "",
				"use": false,
				"field": "amount_marged",
				"width": "",
				"caption": "Сумма с наценкой",
				"tooltip": "Вклад строки спецификации в стоимость изделия для сценария КМАРЖ_В_СПЕЦИФИКАЦИИ"
			}
		],
		"dimensions": [
			{
				"parent": "specification",
				"use": false,
				"field": "grouping",
				"row": 1
			}
		],
		"obj": "rep.materials_demand.specification",
		"name": "Резка в цех",
		"selection": [
			{
				"parent": "",
				"use": false,
				"left_value": "nom.complete_list_sorting",
				"comparison_type": "gt",
				"right_value": "0",
				"row": 1
			},
			{
				"parent": "",
				"use": false,
				"left_value": "nom.nom_kind.nom_type",
				"comparison_type": "ne",
				"right_value": "Товар",
				"row": 2
			},
			{
				"parent": "",
				"use": false,
				"left_value": "nom.nom_kind",
				"comparison_type": "ne",
				"right_value": "012abd41-e241-4f5a-84cf-636750084c95",
				"row": 3
			},
			{
				"parent": "",
				"use": false,
				"left_value": "nom.grouping",
				"comparison_type": "in",
				"right_value": "Фурнитура,Армирование,Профиль",
				"row": 4
			}
		],
		"sorting": [],
		"resources": [],
		"params": [],
		"composition": [
			{
				"parent": "",
				"use": true,
				"field": "header",
				"kind": "obj",
				"definition": "Заголовок",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "scheme_small",
				"kind": "row",
				"definition": "Эскизы малые",
				"row": 2
			},
			{
				"parent": "",
				"use": false,
				"field": "table_production",
				"kind": "table",
				"definition": "Таблица продукции",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "table_specification",
				"kind": "table",
				"definition": "Состав изделий",
				"row": 4
			},
			{
				"parent": "",
				"use": false,
				"field": "footer",
				"kind": "obj",
				"definition": "Подвал заказа",
				"row": 5
			},
			{
				"parent": "",
				"use": false,
				"field": "signatures",
				"kind": "obj",
				"definition": "Подписи сдал-принял",
				"row": 6
			}
		],
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|6b9a1290-4641-4d25-d410-1e67bf703c62",
		"_rev": "4-33dcc0080e22d904d435544c5f492c50",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "id",
				"width": 140,
				"caption": "Код"
			},
			{
				"parent": "",
				"use": true,
				"field": "article",
				"width": "",
				"caption": "Артикул",
				"tooltip": "Артикул номенклатуры."
			},
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": true,
				"field": "thickness",
				"width": "70",
				"caption": "Толщина"
			},
			{
				"parent": "",
				"use": false,
				"field": "nom_kind",
				"width": "",
				"caption": "Вид номенклатуры",
				"tooltip": "Указывается вид, к которому следует отнести данную позицию номенклатуры."
			},
			{
				"parent": "",
				"use": false,
				"field": "nom_group",
				"width": "",
				"caption": "Номенклатурная группа"
			},
			{
				"parent": "",
				"use": false,
				"field": "note",
				"width": "",
				"caption": "Комментарий"
			},
			{
				"parent": "",
				"use": false,
				"field": "parent",
				"width": "",
				"caption": "Группа",
				"tooltip": "Группа, в которую входит данная позиция номенклатуры."
			}
		],
		"sorting": [
			{
				"parent": "",
				"use": false,
				"field": "id",
				"direction": "asc"
			},
			{
				"parent": "",
				"use": false,
				"field": "name",
				"direction": "asc"
			}
		],
		"obj": "cat.nom",
		"name": "Номенклатура",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|6c606f3b-145c-4018-cd6f-30c1e1c2d72a",
		"_rev": "11-df663022adfb350b168a5d8a8fbfbd66",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "date",
				"width": "160",
				"caption": "Дата",
				"tooltip": "Дата документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "number_doc",
				"width": "120",
				"caption": "Номер",
				"tooltip": "Номер документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "key",
				"width": "160",
				"caption": "Участок",
				"tooltip": "Участок или станок в подразделении производства",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "recipient",
				"width": "160",
				"caption": "Получатель",
				"tooltip": "СГП или следующий передел",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": false,
				"field": "biz_cuts",
				"width": "",
				"caption": "Деловая обрезь",
				"tooltip": "Учитывать или нет",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "responsible",
				"width": "160",
				"caption": "Ответственный",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "*",
				"caption": "Комментарий",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			}
		],
		"obj": "doc.work_centers_task",
		"name": "work_centers_task.main",
		"sorting": [],
		"params": [],
		"standard_period": "last6Month",
		"dimensions": [],
		"resources": [],
		"selection": [],
		"composition": [],
		"conditional_appearance": [],
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|73e4d680-230f-11ea-b9fd-0d438dbf6e3b",
		"_rev": "5-2230a320478fea1b423886285652f445",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "elm",
				"caption": "Эл",
				"width": 40
			},
			{
				"use": true,
				"field": "nom",
				"caption": "Номенклатура",
				"width": "*"
			},
			{
				"use": true,
				"field": "clr",
				"caption": "Цвет",
				"width": 120
			},
			{
				"use": true,
				"field": "len",
				"caption": "Длин",
				"width": 60
			}
		],
		"obj": "cat.characteristics.coordinates",
		"name": "characteristics.coordinates.welding",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|74bb5072-b797-44f8-99e8-e0f7c8086f57",
		"_rev": "3-e7a601889df9afda3abbe78f35e94ee7",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": true,
				"field": "suffix",
				"width": "",
				"caption": "Суффикс CouchDB",
				"tooltip": "Для разделения данных в CouchDB"
			},
			{
				"parent": "",
				"use": false,
				"field": "direct",
				"width": "",
				"caption": "Direct",
				"tooltip": "Для пользователя запрещен режим offline"
			},
			{
				"parent": "",
				"use": false,
				"field": "use",
				"width": "",
				"caption": "Используется",
				"tooltip": "Использовать данный отдел при создании баз и пользователей"
			},
			{
				"parent": "",
				"use": false,
				"field": "mode",
				"width": "",
				"caption": "Режим",
				"tooltip": "Режим репликации текущего отдела"
			},
			{
				"parent": "",
				"use": false,
				"field": "parent",
				"width": "",
				"caption": "Ведущий отдел",
				"tooltip": "Заполняется в случае иерархической репликации"
			}
		],
		"sorting": [
			{
				"parent": "",
				"use": false,
				"field": "suffix",
				"direction": "asc"
			},
			{
				"parent": "",
				"use": false,
				"field": "name",
				"direction": "asc"
			}
		],
		"obj": "cat.branches",
		"name": "cat.branches",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|774ce8f0-26fa-11ea-ba7f-dbfe6975d974",
		"_rev": "1-41446507d3a3b19384b894c56219324e",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "id",
				"width": "",
				"caption": "Код",
				"tooltip": ""
			},
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование",
				"tooltip": ""
			},
			{
				"parent": "",
				"use": false,
				"field": "parent",
				"width": "",
				"caption": "Группа",
				"tooltip": ""
			}
		],
		"obj": "cat.production_params",
		"name": "production_params.main",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|7986832d-60ea-486c-d29e-eb351cc774d9",
		"_rev": "7-3c0e037f9dd3561ced666f8154bf0ffb",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "id",
				"width": "*",
				"caption": "Логин",
				"tooltip": "Произвольная строка"
			},
			{
				"parent": "",
				"use": false,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": true,
				"field": "branch",
				"width": "*",
				"caption": "Отдел"
			},
			{
				"parent": "",
				"use": false,
				"field": "note",
				"width": "*",
				"caption": "Комментарий",
				"tooltip": "Произвольная строка"
			},
			{
				"parent": "",
				"use": false,
				"field": "department",
				"width": "",
				"caption": "Подразделение",
				"tooltip": "Подразделение, в котором работает пользователь"
			},
			{
				"parent": "",
				"use": true,
				"field": "prefix",
				"width": "",
				"caption": "Префикс нумерации документов",
				"tooltip": "Префикс номеров документов текущего пользователя"
			},
			{
				"parent": "",
				"use": true,
				"field": "push_only",
				"width": "",
				"caption": "Только push репликация",
				"tooltip": "Для пользователя установлен режим push-only (изменения мигрируют в одну сторону - от пользователя на сервер)"
			}
		],
		"sorting": [
			{
				"parent": "",
				"use": false,
				"field": "branch",
				"direction": "asc"
			},
			{
				"parent": "",
				"use": false,
				"field": "id",
				"direction": "asc"
			}
		],
		"obj": "cat.users",
		"name": "Пользователи",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|79c6498d-06ee-4f90-f0fa-8ca1bad44f55",
		"_rev": "2-8092d2735227624a1c83c500a8ffe115",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "type",
				"width": "",
				"caption": "Тип",
				"tooltip": "Тип контактной информации (телефон, адрес и т.п.)"
			},
			{
				"parent": "",
				"use": true,
				"field": "kind",
				"width": "",
				"caption": "Вид",
				"tooltip": "Вид контактной информации"
			},
			{
				"parent": "",
				"use": true,
				"field": "presentation",
				"width": "*",
				"caption": "Представление",
				"tooltip": "Представление контактной информации для отображения в формах"
			},
			{
				"parent": "",
				"use": false,
				"field": "values_fields",
				"width": "",
				"caption": "Значения полей",
				"tooltip": "Служебное поле, для хранения контактной информации"
			},
			{
				"parent": "",
				"use": false,
				"field": "country",
				"width": "",
				"caption": "Страна",
				"tooltip": "Страна (заполняется для адреса)"
			},
			{
				"parent": "",
				"use": false,
				"field": "region",
				"width": "",
				"caption": "Регион",
				"tooltip": "Регион (заполняется для адреса)"
			},
			{
				"parent": "",
				"use": false,
				"field": "city",
				"width": "",
				"caption": "Город",
				"tooltip": "Город (заполняется для адреса)"
			},
			{
				"parent": "",
				"use": false,
				"field": "email_address",
				"width": "",
				"caption": "Адрес ЭП",
				"tooltip": "Адрес электронной почты"
			},
			{
				"parent": "",
				"use": false,
				"field": "server_domain_name",
				"width": "",
				"caption": "Доменное имя сервера",
				"tooltip": "Доменное имя сервера электронной почты или веб-страницы"
			},
			{
				"parent": "",
				"use": false,
				"field": "phone_number",
				"width": "",
				"caption": "Номер телефона",
				"tooltip": "Полный номер телефона"
			},
			{
				"parent": "",
				"use": false,
				"field": "phone_without_codes",
				"width": "",
				"caption": "Номер телефона без кодов",
				"tooltip": "Номер телефона без кодов и добавочного номера"
			},
			{
				"parent": "",
				"use": false,
				"field": "list_view",
				"width": "",
				"caption": "Вид для списка",
				"tooltip": "Вид контактной информации для списка"
			}
		],
		"obj": "cat.users.contact_information",
		"name": "cat.users.contact_information",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|7ba12e7a-2e7e-4a11-a012-869c35821ab9",
		"_rev": "7-499bcb171b30eece733af8131232826d",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "date",
				"width": "160",
				"caption": "Дата",
				"tooltip": "Дата документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "number_doc",
				"width": "120",
				"caption": "№",
				"tooltip": "Номер документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "department",
				"width": "160",
				"caption": "Подразделение",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": false,
				"field": "organization",
				"width": "*",
				"caption": "Организация",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "partner",
				"width": "160",
				"caption": "Контрагент",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "doc_amount",
				"width": "160",
				"caption": "Сумма",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "responsible",
				"width": "160",
				"caption": "Ответственный",
				"tooltip": "Пользователь, ответственный за  документ.",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "*",
				"caption": "Комментарий",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			}
		],
		"obj": "doc.credit_card_order",
		"name": "Оплата картой",
		"date_from": "2018-01-01T05:00:00",
		"date_till": "2018-01-11T19:27:07",
		"user": "",
		"sorting": [],
		"params": []
	},
	{
		"_id": "cat.scheme_settings|7c765159-ffda-4833-f847-bc6b5f60e38e",
		"_rev": "26-d3d588500234d54e455bc17b15b00360",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "param",
				"width": 200,
				"caption": "Параметр",
				"tooltip": "",
				"ctrl_type": "input",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "value",
				"width": 200,
				"caption": "Значение",
				"tooltip": "Может иметь примитивный или ссылочный тип или массив",
				"ctrl_type": "input",
				"row": 2
			}
		],
		"obj": "cat.scheme_settings.params",
		"class_name": "cat.scheme_settings",
		"user": "",
		"name": "params"
	},
	{
		"_id": "cat.scheme_settings|835f5a7e-18f0-4ab3-9270-0d9369f71a87",
		"_rev": "2-296252e076699a98811407d7b94e4a96",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "acl_obj",
				"width": "",
				"caption": "Тип цен"
			}
		],
		"obj": "cat.branches.price_types",
		"name": "cat.branches.price_types",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|845b3cce-bd1c-4285-b42f-94ce1edb84eb",
		"_rev": "2-a3c30b171ae3d99de8b678c264d822ec",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "acl_obj",
				"width": "",
				"caption": "Организация"
			},
			{
				"parent": "",
				"use": true,
				"field": "by_default",
				"width": "",
				"caption": "По умолчанию"
			}
		],
		"obj": "cat.branches.organizations",
		"name": "cat.branches.organizations",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|8b8005ae-b153-41fe-c21c-cc8a4f4add9a",
		"_rev": "7-f27052400b5af7ca306ef7e13c4182bb",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "date",
				"width": "160",
				"caption": "Дата",
				"tooltip": "Дата документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "number_doc",
				"width": "120",
				"caption": "№",
				"tooltip": "Номер документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": false,
				"field": "organization",
				"width": "*",
				"caption": "Организация",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "cashbox",
				"width": "120",
				"caption": "Касса",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "partner",
				"width": "*",
				"caption": "Контрагент",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "doc_amount",
				"width": "160",
				"caption": "Сумма",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "responsible",
				"width": "",
				"caption": "Ответственный",
				"tooltip": "Пользователь, ответственный за  документ.",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "*",
				"caption": "Комментарий",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			},
			{
				"parent": "",
				"use": false,
				"field": "department",
				"width": "",
				"caption": "Подразделение",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 9
			},
			{
				"parent": "",
				"use": false,
				"field": "_deleted",
				"width": "",
				"caption": "Пометка удаления",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 10
			},
			{
				"parent": "",
				"use": false,
				"field": "posted",
				"width": "",
				"caption": "Проведен",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 11
			}
		],
		"obj": "doc.debit_cash_order",
		"name": "Касса приход",
		"date_from": "2019-01-01T00:00:00",
		"date_till": "2019-03-31T23:59:59",
		"user": "",
		"sorting": [],
		"params": [],
		"standard_period": "last3Month"
	},
	{
		"_id": "cat.scheme_settings|8c755290-a048-11ea-869b-33e64d805161",
		"_rev": "2-fe7710089dd09cbfeb39204ea353d8af",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "date",
				"width": "160",
				"caption": "Дата",
				"tooltip": "Дата документа"
			},
			{
				"use": true,
				"field": "number_doc",
				"width": "120",
				"caption": "№",
				"tooltip": "Номер документа"
			},
			{
				"use": false,
				"field": "organization",
				"width": "",
				"caption": "Организация"
			},
			{
				"use": true,
				"field": "department",
				"width": "",
				"caption": "Подразделение"
			},
			{
				"use": false,
				"field": "warehouse",
				"width": "",
				"caption": "Склад"
			},
			{
				"use": true,
				"field": "partner",
				"width": "",
				"caption": "Контрагент"
			},
			{
				"use": true,
				"field": "responsible",
				"width": "",
				"caption": "Ответственный"
			},
			{
				"use": true,
				"field": "doc_amount",
				"width": "",
				"caption": "Сумма документа"
			},
			{
				"use": true,
				"field": "obj_delivery_state",
				"width": "",
				"caption": "Этап согласования"
			},
			{
				"use": true,
				"field": "note",
				"width": "*",
				"caption": "Комментарий"
			},
			{
				"use": false,
				"field": "identifier",
				"width": "",
				"caption": "Идентификатор",
				"tooltip": "Идентификатор в учетной системе поставщика"
			}
		],
		"params": [],
		"obj": "doc.purchase_order",
		"name": "purchase_order.main",
		"user": "",
		"date_from": "2020-01-01T05:00:00",
		"date_till": "2020-05-28T23:33:24",
		"standard_period": "last3Month"
	},
	{
		"_id": "cat.scheme_settings|8fca797a-4e1c-4f8b-b0aa-1965b5e5e7db",
		"_rev": "1-fe5d0c932fb655ed43699217efff75d4",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": false,
				"field": "record_kind",
				"width": "",
				"caption": "Вид движения",
				"tooltip": "",
				"ctrl_type": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "stick",
				"width": "",
				"caption": "№ хлыста",
				"tooltip": "№ листа (хлыста, заготовки)",
				"ctrl_type": "",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "pair",
				"width": "",
				"caption": "№ пары",
				"tooltip": "№ парной заготовки",
				"ctrl_type": "",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "nom",
				"width": "",
				"caption": "Номенклатура",
				"tooltip": "",
				"ctrl_type": "",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "characteristic",
				"width": "",
				"caption": "Характеристика",
				"tooltip": "",
				"ctrl_type": "",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "len",
				"width": "",
				"caption": "Длина",
				"tooltip": "длина в мм",
				"ctrl_type": "",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "width",
				"width": "",
				"caption": "Ширина",
				"tooltip": "ширина в мм",
				"ctrl_type": "",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "x",
				"width": "",
				"caption": "Координата X",
				"tooltip": "",
				"ctrl_type": "",
				"row": 8
			},
			{
				"parent": "",
				"use": true,
				"field": "y",
				"width": "",
				"caption": "Координата Y",
				"tooltip": "",
				"ctrl_type": "",
				"row": 9
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Количество",
				"tooltip": "Количество в единицах хранения",
				"ctrl_type": "",
				"row": 10
			},
			{
				"parent": "",
				"use": true,
				"field": "cell",
				"width": "",
				"caption": "Ячейка",
				"tooltip": "№ ячейки (откуда брать заготовку или куда помещать деловой обрезок)",
				"ctrl_type": "",
				"row": 11
			},
			{
				"parent": "",
				"use": false,
				"field": "ref",
				"width": "",
				"caption": "Ссылка",
				"tooltip": "",
				"ctrl_type": "",
				"row": 12
			}
		],
		"obj": "doc.work_centers_task.cuts",
		"name": "Обрезь выход",
		"user": "",
		"params": [],
		"selection": [
			{
				"parent": "",
				"use": false,
				"left_value": "record_kind",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "debit",
				"right_value_type": "enm.debit_credit_kinds",
				"row": 1
			}
		]
	},
	{
		"_id": "cat.scheme_settings|940411d0-9f31-11ea-8e19-617fdd7e0460",
		"_rev": "6-f9055b9ec4711ad7fb891bc990f6a37c",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "id",
				"width": "140",
				"caption": "Код"
			},
			{
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"use": true,
				"field": "cnn_type",
				"width": "200",
				"caption": "Тип"
			},
			{
				"use": true,
				"field": "note",
				"width": "",
				"caption": "Комментарий"
			},
			{
				"use": false,
				"field": "captured",
				"width": "",
				"caption": "Захвачен"
			},
			{
				"use": false,
				"field": "editor",
				"width": "",
				"caption": "Редактор"
			}
		],
		"sorting": [
			{
				"direction": "asc",
				"field": "id",
				"use": false
			},
			{
				"direction": "asc",
				"field": "cnn_type",
				"use": false
			},
			{
				"direction": "asc",
				"field": "name",
				"use": false
			}
		],
		"obj": "cat.cnns",
		"name": "cnns.main",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|98df3300-4d45-11ed-9a7f-63809d7e2e19",
		"_rev": "1-7ed923d335b593a3eab7a3eb7b7a67b8",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "elm",
				"caption": "Эл.",
				"tooltip": "Номер элемента, если значение > 0, либо номер конструкции, если значение < 0",
				"width": 60
			},
			{
				"use": true,
				"field": "nom",
				"caption": "Номенклатура",
				"width": "*"
			},
			{
				"use": false,
				"field": "clr",
				"caption": "Цвет"
			},
			{
				"use": true,
				"field": "qty",
				"caption": "Колич (шт)",
				"width": 120
			},
			{
				"use": false,
				"field": "len",
				"caption": "Длина/высота, м"
			},
			{
				"use": false,
				"field": "width",
				"caption": "Ширина, м"
			},
			{
				"use": false,
				"field": "s",
				"caption": "Площадь, м²"
			},
			{
				"use": false,
				"field": "totqty",
				"caption": "Колич",
				"width": 120
			},
			{
				"use": false,
				"field": "totqty1",
				"caption": "Колич (+%)",
				"width": 120
			}
		],
		"obj": "cat.characteristics.specification",
		"name": "characteristics.specification.crackers",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|9a84a0a8-8e3f-45d5-ce1c-95a910704d89",
		"_rev": "3-617f0fe4eb875a5e9e9b5fde27fa12d1",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "property",
				"width": "",
				"caption": "Свойство",
				"tooltip": "Дополнительный реквизит"
			},
			{
				"parent": "",
				"use": true,
				"field": "value",
				"width": "",
				"caption": "Значение",
				"tooltip": "Значение дополнительного реквизита"
			},
			{
				"parent": "",
				"use": false,
				"field": "txt_row",
				"width": "",
				"caption": "Текстовая строка",
				"tooltip": "Полный текст строкового дополнительного реквизита"
			}
		],
		"obj": "cat.divisions.extra_fields",
		"name": "divisions.extra_fields.main",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|9e2bc740-deff-11ee-80da-93985246ebfc",
		"_rev": "9-e74db09ca7892ab39a7cec3db7b1c95a",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "date",
				"width": "",
				"caption": "Дата",
				"tooltip": "",
				"ctrl_type": ""
			},
			{
				"parent": "",
				"use": true,
				"field": "calc_order",
				"width": "",
				"caption": "Заказ",
				"tooltip": "",
				"ctrl_type": ""
			},
			{
				"parent": "",
				"use": true,
				"field": "obj",
				"width": "",
				"caption": "Объект",
				"tooltip": "",
				"ctrl_type": ""
			},
			{
				"parent": "",
				"use": false,
				"field": "work_center",
				"width": "",
				"caption": "Рабочий центр",
				"tooltip": "",
				"ctrl_type": ""
			},
			{
				"parent": "",
				"use": false,
				"field": "work_shift",
				"width": "",
				"caption": "Смена",
				"tooltip": "",
				"ctrl_type": ""
			},
			{
				"parent": "",
				"use": true,
				"field": "power",
				"width": "",
				"caption": "Мощность",
				"tooltip": "",
				"ctrl_type": ""
			}
		],
		"dimensions": [
			{
				"parent": "",
				"use": false,
				"field": ""
			}
		],
		"selection": [
			{
				"use": false,
				"area": 0,
				"left_value": "phase",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "run",
				"right_value_type": "enm.planning_phases"
			},
			{
				"use": true,
				"area": 0,
				"left_value": "stage",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "ff9cef3e-9271-11ee-bb06-8e955d21ad46",
				"right_value_type": "cat.work_center_kinds"
			},
			{
				"use": false,
				"area": 0,
				"left_value": "calc_order.partner",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "",
				"right_value_type": "cat.partners"
			},
			{
				"use": false,
				"area": 0,
				"left_value": "obj.obj.imaterial",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "",
				"right_value_type": "cat.nom",
				"list": "[\"cd4a6f60-92a5-11ed-9cb5-dac91ac36046\",\r\n\t\"e6c7e118-b39f-11ee-9c4f-d89f6adade46\",\r\n\t\"1a43bb0a-92a6-11ed-9cb5-dac91ac36046\",\r\n\t\"05856a28-b55b-11ee-9c4f-d89f6adade46\",\r\n\t\"14acfbe6-b55c-11ee-9c4f-d89f6adade46\",\r\n\t\"26245494-b55e-11ee-9c4f-d89f6adade46\",\r\n\t\"3054a130-b55e-11ee-9c4f-d89f6adade46\",\r\n\t\"38a8177c-b55e-11ee-9c4f-d89f6adade46\",\r\n\t\"bfb870f2-b55b-11ee-9c4f-d89f6adade46\",\r\n\t\"f1bde730-b55b-11ee-9c4f-d89f6adade46\",\r\n\t\"4dfcc3aa-b55b-11ee-9c4f-d89f6adade46\",\r\n\t\"d992f0e2-b55b-11ee-9c4f-d89f6adade46\",\r\n\t\"0b222898-bdb4-11ee-9c4f-d89f6adade46\",\r\n\t\"3f1eaf04-bdb4-11ee-9c4f-d89f6adade46\",\r\n\t\"77ee378c-bdb4-11ee-9c4f-d89f6adade46\",\r\n\t\"8a4bd4d4-bdb4-11ee-9c4f-d89f6adade46\",\r\n\t\"b196b612-bdb4-11ee-9c4f-d89f6adade46\",\r\n\t\"a0bb55be-bdb4-11ee-9c4f-d89f6adade46\",\r\n\t\"dae230e6-bdb4-11ee-9c4f-d89f6adade46\",\r\n\t\"4ab86a04-b55c-11ee-9c4f-d89f6adade46\",\r\n\t\"90d49094-b55c-11ee-9c4f-d89f6adade46\",\r\n\t\"f163c520-bdb2-11ee-9c4f-d89f6adade46\",\r\n\t\"d52bafe4-bdb2-11ee-9c4f-d89f6adade46\",\r\n\t\"c7d3261a-bdb2-11ee-9c4f-d89f6adade46\",\r\n\t\"628082b6-e97e-11ed-bb06-8e955d21ad46\",\r\n\t\"0e34f910-b55e-11ee-9c4f-d89f6adade46\",\r\n\t\"464cec86-b55e-11ee-9c4f-d89f6adade46\",\r\n\t\"f75a2e54-b55d-11ee-9c4f-d89f6adade46\",\r\n\t\"3e001514-bdb3-11ee-9c4f-d89f6adade46\"]",
				"caption": "Материал"
			},
			{
				"use": false,
				"area": 0,
				"left_value": "obj.obj.iedge",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": false,
				"right_value_type": "boolean",
				"caption": "Есть обработки кромок"
			},
			{
				"use": false,
				"area": 0,
				"left_value": "obj.obj.ihole",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": false,
				"right_value_type": "boolean",
				"caption": "Есть отверстия"
			}
		],
		"order": 20,
		"obj": "rep.planning.data",
		"standard_period": "last30days",
		"name": "Стеклопакеты",
		"date_from": "2024-03-01",
		"date_till": "2024-03-30",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|a555c6be-8b77-40e8-b099-e7e69a527acf",
		"_rev": "2-24f150d325788d294dc2527d0eee1a47",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": true,
				"field": "priority",
				"width": "",
				"caption": "Приоритет"
			},
			{
				"parent": "",
				"use": false,
				"field": "note",
				"width": "",
				"caption": "Комментарий"
			},
			{
				"parent": "",
				"use": false,
				"field": "sorting_field",
				"width": "",
				"caption": "Порядок",
				"tooltip": "Используется для упорядочивания"
			},
			{
				"parent": "",
				"use": false,
				"field": "applying",
				"width": "",
				"caption": "Применение"
			},
			{
				"parent": "",
				"use": false,
				"field": "parent",
				"width": "",
				"caption": "Группа"
			}
		],
		"sorting": [
			{
				"parent": "",
				"use": false,
				"field": "sorting_field",
				"direction": "asc"
			},
			{
				"parent": "",
				"use": false,
				"field": "name",
				"direction": "asc"
			}
		],
		"obj": "cat.parameters_keys",
		"name": "cat.parameters_keys",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|a78e8645-bf6e-4266-f5e6-2f1a416b947f",
		"_rev": "3-d2cff8a3653bfffd4b8b00035fddfe2f",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "id",
				"width": "",
				"caption": "Код"
			},
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": true,
				"field": "inn",
				"width": "",
				"caption": "ИНН"
			}
		],
		"obj": "cat.partners",
		"name": "Контрагенты",
		"user": "",
		"sorting": [
			{
				"parent": "",
				"use": false,
				"field": "id",
				"direction": "asc"
			},
			{
				"parent": "",
				"use": false,
				"field": "name",
				"direction": "asc"
			},
			{
				"parent": "",
				"use": false,
				"field": "inn",
				"direction": "asc"
			}
		]
	},
	{
		"_id": "cat.scheme_settings|a887934d-cf20-494c-8f01-9f8bad1c3dff",
		"_rev": "7-2596a1c807a6401b54e5119ca1d55151",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": false,
				"field": "period",
				"width": "",
				"caption": "Период",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": false,
				"field": "organization",
				"width": "",
				"caption": "Организация",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "department",
				"width": "",
				"caption": "Подразделение",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "partner",
				"width": "",
				"caption": "Контрагент",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "trans",
				"width": "",
				"caption": "Сделка",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "invoice",
				"width": "",
				"caption": "Сумма заказа",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "pay",
				"width": "",
				"caption": "Оплачено",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "pay_total",
				"width": "",
				"caption": "Оплатить",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			},
			{
				"parent": "",
				"use": true,
				"field": "pay_percent",
				"width": "",
				"caption": "% оплаты",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 9
			},
			{
				"parent": "",
				"use": true,
				"field": "shipment",
				"width": "",
				"caption": "Отгружено",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 10
			},
			{
				"parent": "",
				"use": true,
				"field": "shipment_total",
				"width": "",
				"caption": "Отгрузить",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 11
			},
			{
				"parent": "",
				"use": true,
				"field": "shipment_percent",
				"width": "",
				"caption": "% Отгрузки",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 12
			}
		],
		"obj": "rep.invoice_execution.data",
		"name": "Исполнение заказов",
		"date_from": "2018-01-01T05:00:00",
		"date_till": "2018-01-11T19:27:43",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|aab525e2-a6d4-47bf-a261-20b8825f79a9",
		"_rev": "2-a6d7085f3cc08ae6552d136d456522bd",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "property",
				"width": "",
				"caption": "Свойство",
				"tooltip": "Дополнительный реквизит"
			},
			{
				"parent": "",
				"use": true,
				"field": "value",
				"width": "",
				"caption": "Значение",
				"tooltip": "Значение дополнительного реквизита"
			}
		],
		"obj": "cat.organizations.extra_fields",
		"name": "cat.organizations.extra_fields",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|aabe9148-4952-4b09-f08e-2a77e8802061",
		"_rev": "7-7c5017dd54468ebd126b662cae5eec63",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "number_doc",
				"width": "",
				"caption": "Номер",
				"tooltip": "Номер документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "date",
				"width": "",
				"caption": "Дата",
				"tooltip": "Дата документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": false,
				"field": "organization",
				"width": "",
				"caption": "Организация",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "cashbox",
				"width": "",
				"caption": "Касса",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "partner",
				"width": "",
				"caption": "Контрагент",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": false,
				"field": "department",
				"width": "",
				"caption": "Подразделение",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "doc_amount",
				"width": "",
				"caption": "Сумма",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "responsible",
				"width": "",
				"caption": "Ответственный",
				"tooltip": "Пользователь, ответственный за  документ.",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "",
				"caption": "Комментарий",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 9
			},
			{
				"parent": "",
				"use": false,
				"field": "_deleted",
				"width": "",
				"caption": "Пометка удаления",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 10
			},
			{
				"parent": "",
				"use": false,
				"field": "posted",
				"width": "",
				"caption": "Проведен",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 11
			}
		],
		"obj": "doc.credit_cash_order",
		"name": "Касса расход",
		"date_from": "2018-01-01T05:00:00",
		"date_till": "2018-01-10T20:16:00",
		"user": "",
		"sorting": [],
		"params": []
	},
	{
		"_id": "cat.scheme_settings|ac17328e-243f-4d1d-cb23-368f60b6f821",
		"_rev": "29-aa5b8de29b092430f03e355ac007bc40",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": false,
				"field": "date",
				"width": "160",
				"caption": "Дата",
				"tooltip": "Дата документа"
			},
			{
				"use": true,
				"field": "number_doc",
				"width": "140",
				"caption": "№",
				"tooltip": "Номер документа"
			},
			{
				"use": false,
				"field": "obj_delivery_state",
				"width": "120",
				"caption": "Статус"
			},
			{
				"use": true,
				"field": "note",
				"width": "*",
				"caption": "Комментарий",
				"tooltip": "Дополнительная информация"
			},
			{
				"parent": "",
				"use": true,
				"field": "manager",
				"width": "",
				"caption": "Менеджер",
				"tooltip": "Менеджер, оформивший заказ"
			},
			{
				"parent": "",
				"use": false,
				"field": "category",
				"width": "",
				"caption": "Категория заказа",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 32
			}
		],
		"params": [
			{
				"param": "Период",
				"value": "",
				"row": 1
			}
		],
		"selection": [
			{
				"use": true,
				"left_value_type": "path",
				"left_value": "obj_delivery_state",
				"comparison_type": "in",
				"right_value_type": "enm.obj_delivery_states",
				"right_value": "Шаблон"
			}
		],
		"dimensions": [],
		"resources": [],
		"sorting": [
			{
				"direction": "desc",
				"field": "number_doc",
				"use": false
			}
		],
		"user": "",
		"obj": "doc.calc_order",
		"name": "calc_order.templates",
		"order": 70,
		"date_from": "2016-05-01T19:00:00",
		"date_till": "2030-05-01T19:00:00"
	},
	{
		"_id": "cat.scheme_settings|b20ba84f-a014-4822-b3b8-dacc8bc87e51",
		"_rev": "31-5ea6ff0149762d32fac0964e0aea89f0",
		"fields": [
			{
				"use": true,
				"field": "area",
				"width": 70,
				"caption": "Гр. ИЛИ"
			},
			{
				"use": true,
				"field": "left_value_type",
				"width": 200,
				"caption": "Тип слева",
				"ctrl_type": "type"
			},
			{
				"use": true,
				"field": "left_value",
				"width": "*",
				"caption": "Значение слева",
				"tooltip": "",
				"ctrl_type": "typed_field"
			},
			{
				"use": true,
				"field": "comparison_type",
				"width": 200,
				"caption": "Вид сравнения",
				"ctrl_type": "field"
			},
			{
				"use": true,
				"field": "right_value_type",
				"width": 200,
				"caption": "Тип справа",
				"ctrl_type": "type"
			},
			{
				"use": true,
				"field": "right_value",
				"width": "*",
				"caption": "Значение справа",
				"ctrl_type": "typed_field"
			}
		],
		"obj": "cat.scheme_settings.selection",
		"class_name": "cat.scheme_settings",
		"user": "",
		"name": "selection"
	},
	{
		"_id": "cat.scheme_settings|b3e9c63f-63b4-443e-973c-005aa9a17407",
		"_rev": "2-edd984f1e4ccf0e23c2e119ccbedc33f",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "acl_obj",
				"width": "",
				"caption": "Контрагент"
			},
			{
				"parent": "",
				"use": true,
				"field": "by_default",
				"width": "",
				"caption": "По умолчанию"
			}
		],
		"obj": "cat.branches.partners",
		"name": "cat.branches.partners",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|b4eff395-ceeb-4dd8-cb84-ca9f8fd5d5c6",
		"_rev": "27-c5fe0e63121cac34dd16c0fab82315ab",
		"fields": [
			{
				"parent": "",
				"use": false,
				"field": "parent",
				"caption": "Родитель",
				"tooltip": "Для плоского списка, родитель пустой"
			},
			{
				"parent": "",
				"use": false,
				"field": "use",
				"width": 60,
				"caption": "√",
				"tooltip": "Использование"
			},
			{
				"parent": "",
				"use": true,
				"field": "field",
				"caption": "Поле",
				"tooltip": "Путь к данным",
				"ctrl_type": "path"
			},
			{
				"parent": "",
				"use": true,
				"field": "caption",
				"caption": "Заголовок",
				"ctrl_type": "input"
			},
			{
				"parent": "",
				"use": true,
				"field": "width",
				"caption": "Ширина",
				"tooltip": "",
				"ctrl_type": "input"
			},
			{
				"parent": "",
				"use": false,
				"field": "tooltip",
				"caption": "Подсказка",
				"tooltip": "",
				"ctrl_type": "input"
			},
			{
				"parent": "",
				"use": true,
				"field": "ctrl_type",
				"caption": "Элемент",
				"tooltip": "Тип элемента управления",
				"ctrl_type": "field"
			},
			{
				"parent": "",
				"use": true,
				"field": "editor",
				"caption": "Редактор",
				"tooltip": "Компонент редактирования"
			},
			{
				"parent": "",
				"use": true,
				"field": "formatter",
				"caption": "Формат",
				"tooltip": "Функция форматирования"
			}
		],
		"obj": "cat.scheme_settings.fields",
		"class_name": "cat.scheme_settings",
		"user": "",
		"name": "fields"
	},
	{
		"_id": "cat.scheme_settings|b971c647-6f96-42ed-be6a-a15c39e8a6a6",
		"_rev": "7-c8b1e490c28e16f3ab8fe9c05aafd645",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": false,
				"field": "period",
				"width": "",
				"caption": "Период",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": false,
				"field": "register",
				"width": "",
				"caption": "Регистратор",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "warehouse",
				"width": "",
				"caption": "Склад",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "nom",
				"width": "",
				"caption": "Номенклатура",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "characteristic",
				"width": "",
				"caption": "Характеристика",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "initial_balance",
				"width": "",
				"caption": "Нач. остаток",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "debit",
				"width": "",
				"caption": "Приход",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "credit",
				"width": "",
				"caption": "Расход",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			},
			{
				"parent": "",
				"use": true,
				"field": "final_balance",
				"width": "",
				"caption": "Кон. остаток",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 9
			},
			{
				"parent": "",
				"use": true,
				"field": "amount_initial_balance",
				"width": "",
				"caption": "Сумма нач. остаток",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 10
			},
			{
				"parent": "",
				"use": true,
				"field": "amount_debit",
				"width": "",
				"caption": "Сумма приход",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 11
			},
			{
				"parent": "",
				"use": true,
				"field": "amount_credit",
				"width": "",
				"caption": "Сумма расход",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 12
			},
			{
				"parent": "",
				"use": true,
				"field": "amount_final_balance",
				"width": "",
				"caption": "Сумма кон. остаток",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 13
			},
			{
				"parent": "",
				"use": false,
				"field": "ref",
				"width": "",
				"caption": "Ссылка",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 14
			}
		],
		"obj": "rep.goods.data",
		"name": "Товары на складах",
		"date_from": "2018-01-01T05:00:00",
		"date_till": "2018-01-16T02:00:24",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|b9f76fb4-42b8-4d36-9940-c369c2ee267f",
		"_rev": "2-db2a4c01e781d6d12810a3ff5d728479",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "property",
				"width": "",
				"caption": "Свойство",
				"tooltip": "Дополнительный реквизит"
			},
			{
				"parent": "",
				"use": true,
				"field": "value",
				"width": "",
				"caption": "Значение",
				"tooltip": "Значение дополнительного реквизита"
			}
		],
		"obj": "cat.partners.extra_fields",
		"name": "cat.partners.extra_fields",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|bc828630-5875-11ea-84a6-837217863669",
		"_rev": "1-13f8d5f9d41c7c8e2213e6f9e93c88e4",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			}
		],
		"obj": "cat.http_apis",
		"name": "cat.http_apis",
		"user": "",
		"params": [],
		"sorting": []
	},
	{
		"_id": "cat.scheme_settings|c864d895-ac50-42be-8760-203cc46d208f",
		"_rev": "1-ac8f20175b69db2d9859fb593c6c725e",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "obj",
				"width": "",
				"caption": "Объект",
				"tooltip": "",
				"ctrl_type": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "specimen",
				"width": "",
				"caption": "Экземпляр",
				"tooltip": "",
				"ctrl_type": "",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "elm",
				"width": "",
				"caption": "Элемент",
				"tooltip": "",
				"ctrl_type": "",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "power",
				"width": "",
				"caption": "Мощность",
				"tooltip": "",
				"ctrl_type": "",
				"row": 4
			},
			{
				"parent": "",
				"use": false,
				"field": "ref",
				"width": "",
				"caption": "Ссылка",
				"tooltip": "",
				"ctrl_type": "",
				"row": 5
			}
		],
		"obj": "doc.work_centers_task.planning",
		"name": "Планирование",
		"user": "",
		"params": [],
		"selection": []
	},
	{
		"_id": "cat.scheme_settings|cb6a57e6-506a-4df3-bd5e-44db629e3dea",
		"_rev": "2-20bc8473982b72ede552c10f94811650",
		"class_name": "cat.scheme_settings",
		"obj": "dp.buyers_order.production",
		"name": "Параметрик",
		"user": "",
		"order": 90,
		"selection": [
			{
				"parent": "",
				"use": true,
				"left_value": "inset.insert_type",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "Параметрик",
				"right_value_type": "enm.inserts_types",
				"row": 1
			}
		],
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "inset",
				"width": "",
				"caption": "Изделие"
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Колич., шт"
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "",
				"caption": "Комментарий"
			}
		],
		"params": []
	},
	{
		"_id": "cat.scheme_settings|cced5193-f025-4a27-a7f2-f8b4fb86b7fd",
		"_rev": "7-6e9289d2ae2262c955023ca66509a9a0",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "date",
				"width": "160",
				"caption": "Дата",
				"tooltip": "Дата документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "number_doc",
				"width": "120",
				"caption": "Номер",
				"tooltip": "Номер документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "warehouse",
				"width": "160",
				"caption": "Склад",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": false,
				"field": "department",
				"width": "160",
				"caption": "Подразделение",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": false,
				"field": "organization",
				"width": "",
				"caption": "Организация",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "partner",
				"width": "160",
				"caption": "Контрагент",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "doc_amount",
				"width": "120",
				"caption": "Сумма",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "responsible",
				"width": "160",
				"caption": "Ответственный",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "*",
				"caption": "Комментарий",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 9
			}
		],
		"obj": "doc.purchase",
		"name": "Поступление",
		"date_from": "2018-01-01T05:00:00",
		"date_till": "2018-01-10T20:45:49",
		"user": "",
		"sorting": [],
		"params": []
	},
	{
		"_id": "cat.scheme_settings|ce1561fc-1d36-42f5-9639-7189a21c613b",
		"_rev": "3-aea7661023d0d4bc8b095c41911c1397",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": true,
				"field": "http",
				"width": "*",
				"caption": "HTTP",
				"tooltip": "Адрес couchdb"
			},
			{
				"parent": "",
				"use": false,
				"field": "username",
				"width": "",
				"caption": "Username",
				"tooltip": "Login администратора CouchDB"
			}
		],
		"obj": "cat.servers",
		"name": "cat.servers",
		"user": "",
		"params": [],
		"sorting": []
	},
	{
		"_id": "cat.scheme_settings|d0a4cc10-defc-11ee-80da-93985246ebfc",
		"_rev": "1-0d78503effc4b7917513634b0f5a9abe",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "date",
				"width": 100,
				"caption": "Дата"
			},
			{
				"parent": "",
				"use": true,
				"field": "work_center",
				"width": 120,
				"caption": "Рабочий центр"
			},
			{
				"parent": "",
				"use": true,
				"field": "calc_order",
				"width": 210,
				"caption": "Заказ"
			},
			{
				"parent": "",
				"use": true,
				"field": "obj",
				"minWidth": 200,
				"caption": "Объект"
			},
			{
				"parent": "",
				"use": false,
				"field": "work_shift",
				"caption": "Смена"
			},
			{
				"parent": "",
				"use": true,
				"field": "power",
				"width": 100,
				"caption": "Мощность"
			}
		],
		"dimensions": [
			{
				"parent": "",
				"use": false,
				"field": ""
			}
		],
		"selection": [
			{
				"parent": "",
				"use": true,
				"area": 0,
				"left_value": "phase",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "run",
				"right_value_type": "enm.planning_phases",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"area": 0,
				"left_value": "stage",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": "489d1e96-6a89-11ed-9611-84f1e8809c54",
				"right_value_type": "cat.work_center_kinds",
				"row": 1
			}
		],
		"order": 30,
		"obj": "rep.planning.data",
		"standard_period": "last30days",
		"name": "Напиловка",
		"date_from": "2024-03-01",
		"date_till": "2024-03-30",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|d32f514a-e39b-469c-865e-414bcba96b69",
		"_rev": "25-ee6fa3aefdcb7c6b619199e937d4c019",
		"fields": [
			{
				"parent": "",
				"use": false,
				"field": "parent",
				"width": 0,
				"caption": "Родитель",
				"tooltip": "",
				"ctrl_type": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "field",
				"width": 180,
				"caption": "Поле",
				"tooltip": "",
				"ctrl_type": "ofields",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "formula",
				"width": 220,
				"caption": "Формула",
				"tooltip": "По умолчанию - сумма",
				"ctrl_type": "ocombo",
				"row": 3
			}
		],
		"obj": "cat.scheme_settings.resources",
		"class_name": "cat.scheme_settings",
		"user": "",
		"name": "resources"
	},
	{
		"_id": "cat.scheme_settings|da895410-9083-11ea-afaa-39458a1aa74d",
		"_rev": "2-4e1d7a9fe5b42e26078d992bf55e9983",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "parent",
				"caption": "Родитель",
				"width": 90
			},
			{
				"use": true,
				"field": "cnstr",
				"caption": "Слой",
				"width": 90
			},
			{
				"use": true,
				"field": "kind",
				"caption": "Тип",
				"width": 60
			},
			{
				"use": true,
				"field": "w",
				"caption": "Ширина",
				"tooltip": "Ширина по фальцу",
				"width": 90
			},
			{
				"use": true,
				"field": "h",
				"caption": "Высота",
				"tooltip": "Высота по фальцу",
				"width": 90
			},
			{
				"use": true,
				"field": "furn",
				"caption": "Фурнитура",
				"width": "*"
			},
			{
				"use": true,
				"field": "direction",
				"caption": "Направл. откр.",
				"tooltip": "Направление открывания",
				"width": 90
			},
			{
				"use": true,
				"field": "h_ruch",
				"caption": "Высота ручки",
				"tooltip": "Высота ручки в координатах контура (от габарита створки)",
				"width": 90
			},
			{
				"use": true,
				"field": "fix_ruch",
				"caption": "Ручка fix",
				"width": 90
			},
			{
				"use": true,
				"field": "is_rectangular",
				"caption": "Есть кривые",
				"width": 90
			}
		],
		"obj": "cat.characteristics.constructions",
		"name": "characteristics.constructions.main",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|daa0f47b-f4a9-4063-d1e5-3afd38dd5e56",
		"_rev": "9-81e5d03a24a1404eec7c73e7989a3fad",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "nom",
				"width": "*",
				"caption": "Номенклатура"
			},
			{
				"parent": "",
				"use": true,
				"field": "characteristic",
				"width": 180,
				"caption": "Характеристика"
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": 180,
				"caption": "Комментарий"
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Количество"
			},
			{
				"parent": "",
				"use": false,
				"field": "unit",
				"width": "",
				"caption": "Ед."
			},
			{
				"parent": "",
				"use": false,
				"field": "qty",
				"width": "",
				"caption": "Количество, шт"
			},
			{
				"parent": "",
				"use": false,
				"field": "first_cost",
				"width": "",
				"caption": "Себест. ед.",
				"tooltip": "Плановая себестоимость единицы продукции"
			},
			{
				"parent": "",
				"use": false,
				"field": "marginality",
				"width": "",
				"caption": "К. марж"
			},
			{
				"parent": "",
				"use": true,
				"field": "price",
				"width": "",
				"caption": "Цена"
			},
			{
				"parent": "",
				"use": true,
				"field": "discount_percent",
				"width": "",
				"caption": "Скидка %"
			},
			{
				"parent": "",
				"use": false,
				"field": "discount",
				"width": "",
				"caption": "Скидка"
			},
			{
				"parent": "",
				"use": true,
				"field": "amount",
				"width": "",
				"caption": "Сумма"
			},
			{
				"parent": "",
				"use": false,
				"field": "margin",
				"width": "",
				"caption": "Маржа"
			},
			{
				"parent": "",
				"use": false,
				"field": "price_internal",
				"width": "",
				"caption": "Цена"
			},
			{
				"parent": "",
				"use": false,
				"field": "discount_percent_internal",
				"width": "",
				"caption": "Скидка %",
				"tooltip": "Процент скидки для внутренней перепродажи (холдинг) или внешней (дилеры)"
			},
			{
				"parent": "",
				"use": false,
				"field": "amount_internal",
				"width": "",
				"caption": "Сумма",
				"tooltip": "Сумма внутренней реализации (холдинг) или внешней (от дилера конечному клиенту)"
			},
			{
				"parent": "",
				"use": false,
				"field": "vat_rate",
				"width": "",
				"caption": "Ставка НДС"
			},
			{
				"parent": "",
				"use": false,
				"field": "vat_amount",
				"width": "",
				"caption": "Сумма НДС"
			},
			{
				"parent": "",
				"use": false,
				"field": "ordn",
				"width": "",
				"caption": "Ведущая продукция",
				"tooltip": "ссылка на продукциию, к которой относится материал"
			},
			{
				"parent": "",
				"use": false,
				"field": "changed",
				"width": "",
				"caption": "Запись изменена",
				"tooltip": "Запись изменена оператором (1, -2) или добавлена корректировкой спецификации (-1)"
			}
		],
		"obj": "doc.calc_order.production",
		"name": "production.main",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|dab2c503-a426-4bf5-f083-fe6f1c64fbe5",
		"_rev": "1-8d50d36ea1019416b23dc781ae6f603c",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "production",
				"width": "",
				"caption": "Продукция",
				"tooltip": "Ссылка на характеристику продукции или объект планирования. Указывает, к чему относится материал текущей строки",
				"ctrl_type": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "specimen",
				"width": "",
				"caption": "Экземпляр",
				"tooltip": "Номер экземпляра",
				"ctrl_type": "",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "elm",
				"width": "",
				"caption": "Элемент",
				"tooltip": "Номер элемента",
				"ctrl_type": "",
				"row": 3
			},
			{
				"parent": "",
				"use": true,
				"field": "nom",
				"width": "",
				"caption": "Номенклатура",
				"tooltip": "Номенклатура потребности. По умолчанию, совпадает с номенклатурой спецификации, но может содержать аналог",
				"ctrl_type": "",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "characteristic",
				"width": "",
				"caption": "Характеристика",
				"tooltip": "Характеристика потребности. По умолчанию, совпадает с характеристикой спецификации, но может содержать аналог",
				"ctrl_type": "",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "final_balance",
				"width": "",
				"caption": "Остаток потребности",
				"tooltip": "",
				"ctrl_type": "",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "quantity",
				"width": "",
				"caption": "Количество",
				"tooltip": "",
				"ctrl_type": "",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "from_cut",
				"width": "",
				"caption": "Из обрези",
				"tooltip": "",
				"ctrl_type": "",
				"row": 8
			},
			{
				"parent": "",
				"use": true,
				"field": "close",
				"width": "",
				"caption": "Закрыть",
				"tooltip": "",
				"ctrl_type": "",
				"row": 9
			},
			{
				"parent": "",
				"use": false,
				"field": "ref",
				"width": "",
				"caption": "Ссылка",
				"tooltip": "",
				"ctrl_type": "",
				"row": 10
			}
		],
		"obj": "doc.work_centers_task.demand",
		"name": "Потребность",
		"user": "",
		"params": [],
		"selection": []
	},
	{
		"_id": "cat.scheme_settings|dd4800a6-485d-466b-ef65-d6010a9a673a",
		"_rev": "7-e8d5ff06f66b1bba1f2b952a79afbdd0",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "date",
				"width": "160",
				"caption": "Дата",
				"tooltip": "Дата документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "number_doc",
				"width": "120",
				"caption": "Номер",
				"tooltip": "Номер документа",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 2
			},
			{
				"parent": "",
				"use": true,
				"field": "department",
				"width": "160",
				"caption": "Подразделение",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			},
			{
				"parent": "",
				"use": false,
				"field": "organization",
				"width": "",
				"caption": "Организация",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 4
			},
			{
				"parent": "",
				"use": true,
				"field": "partner",
				"width": "160",
				"caption": "Контрагент",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 5
			},
			{
				"parent": "",
				"use": true,
				"field": "doc_amount",
				"width": "120",
				"caption": "Сумма",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 6
			},
			{
				"parent": "",
				"use": true,
				"field": "responsible",
				"width": "160",
				"caption": "Ответственный",
				"tooltip": "Пользователь, ответственный за  документ.",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 7
			},
			{
				"parent": "",
				"use": true,
				"field": "note",
				"width": "*",
				"caption": "Комментарий",
				"tooltip": "",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 8
			}
		],
		"obj": "doc.credit_bank_order",
		"name": "Банк расход",
		"date_from": "2018-01-01T05:00:00",
		"date_till": "2018-01-10T20:45:40",
		"user": "",
		"sorting": [],
		"params": []
	},
	{
		"_id": "cat.scheme_settings|e081b244-ff35-49d0-a99f-3bbfbba5fddc",
		"_rev": "29-ef4a222b3c479b7f94af8cfe18cf9fd0",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": false,
				"field": "calc_order",
				"caption": "Расчет",
				"row": 1,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "product",
				"caption": "Изделие",
				"tooltip": "Для продукции - номер строки заказа, для характеристики стеклопакета - номер элемента",
				"row": 2,
				"width": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "cnstr",
				"caption": "№ Конструкции",
				"row": 3,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "elm",
				"caption": "Элемент",
				"tooltip": "Номер элемента, если значение > 0, либо номер конструкции, если значение < 0",
				"row": 4,
				"width": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "nom_kind",
				"caption": "Вид номенклатуры",
				"tooltip": "Указывается вид, к которому следует отнести данную позицию номенклатуры.",
				"row": 5,
				"width": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "nom",
				"width": "360",
				"caption": "Номенклатура",
				"row": 6,
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "clr",
				"caption": "Цвет",
				"row": 7,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "characteristic",
				"caption": "Характеристика",
				"row": 8,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "qty",
				"caption": "Количество (шт)",
				"row": 9,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "len",
				"caption": "Длина, м",
				"row": 10,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "width",
				"caption": "Ширина, м",
				"row": 11,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "s",
				"caption": "Площадь, м²",
				"row": 12,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "material",
				"caption": "Материал",
				"row": 13,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "grouping",
				"caption": "Группировка",
				"row": 14,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": true,
				"field": "totqty",
				"caption": "Количество",
				"row": 15,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "totqty1",
				"caption": "Количество (+%)",
				"row": 16,
				"width": "",
				"tooltip": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "price",
				"caption": "Себест.план",
				"tooltip": "Цена плановой себестоимости строки спецификации",
				"row": 17,
				"width": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "amount",
				"caption": "Сумма себест.",
				"tooltip": "Сумма плановой себестоимости строки спецификации",
				"row": 18,
				"width": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			},
			{
				"parent": "",
				"use": false,
				"field": "amount_marged",
				"caption": "Сумма с наценкой",
				"tooltip": "Вклад строки спецификации в стоимость изделия для сценария КМАРЖ_В_СПЕЦИФИКАЦИИ",
				"row": 19,
				"width": "",
				"ctrl_type": "00000000-0000-0000-0000-000000000000",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000"
			}
		],
		"obj": "rep.materials_demand.specification",
		"name": "Заполнения",
		"selection": [],
		"dimensions": [
			{
				"parent": "",
				"field": "nom_kind",
				"use": false,
				"row": 1
			}
		],
		"resources": [],
		"sorting": [],
		"order": 100,
		"params": [],
		"composition": [],
		"conditional_appearance": [
			{
				"parent": "",
				"use": false,
				"area": 0,
				"left_value": "clr",
				"left_value_type": "path",
				"comparison_type": "eq",
				"right_value": {
					"predefined_name": "Белый",
					"is_folder": false,
					"parent": "00000000-0000-0000-0000-000000000000",
					"name": "Белый",
					"id": "000000006",
					"ral": "9016",
					"clr_str": "FEFEFE",
					"ref": "3f93f0e2-1103-4b2c-9cc7-193b640462ec"
				},
				"right_value_type": "cat.clrs",
				"columns": "clr",
				"css": "{\"color\": \"red\"}",
				"row": 1
			}
		],
		"user": "",
		"query": "",
		"standard_period": "00000000-0000-0000-0000-000000000000",
		"formula": "00000000-0000-0000-0000-000000000000",
		"output": "00000000-0000-0000-0000-000000000000",
		"tag": ""
	},
	{
		"_id": "cat.scheme_settings|e20c08ac-077c-4998-85ab-a8f05461cdb4",
		"_rev": "2-9be27490b9094845e1d09807d787ccef",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "id",
				"width": "",
				"caption": "Код"
			},
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование"
			},
			{
				"parent": "",
				"use": false,
				"field": "region",
				"width": "",
				"caption": "Регион",
				"tooltip": "Регион, край, область"
			},
			{
				"parent": "",
				"use": false,
				"field": "city",
				"width": "",
				"caption": "Город (населенный пункт)"
			},
			{
				"parent": "",
				"use": false,
				"field": "ind",
				"width": "",
				"caption": "Индекс"
			}
		],
		"sorting": [
			{
				"parent": "",
				"use": false,
				"field": "id",
				"direction": "asc"
			},
			{
				"parent": "",
				"use": false,
				"field": "name",
				"direction": "asc"
			}
		],
		"obj": "cat.delivery_areas",
		"name": "cat.delivery_areas",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|e573af40-2712-11ea-b9a4-515b94336ab7",
		"_rev": "4-91d52b1ab91113ee8f92042ff508e279",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "elm",
				"caption": "№ Эл",
				"width": 60
			},
			{
				"use": true,
				"field": "nom",
				"caption": "Номенклатура",
				"width": "*"
			},
			{
				"use": true,
				"field": "clr",
				"caption": "Цвет",
				"width": 120
			},
			{
				"use": true,
				"field": "len",
				"caption": "Длина",
				"width": 70
			},
			{
				"use": true,
				"field": "alp1",
				"caption": "Угол1",
				"width": 70
			},
			{
				"use": true,
				"field": "alp2",
				"caption": "Угол2",
				"width": 70
			},
			{
				"use": true,
				"field": "r",
				"caption": "Радиус",
				"width": 70
			}
		],
		"obj": "cat.characteristics.coordinates",
		"name": "characteristics.coordinates.arc",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|e7806144-d00a-40f2-e00f-55a49d13b1ed",
		"_rev": "3-a6e0dd4093957c8c5ed123afe5195c7a",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "id",
				"width": "",
				"caption": "Код",
				"tooltip": "",
				"row": 1
			},
			{
				"parent": "",
				"use": true,
				"field": "name",
				"width": "*",
				"caption": "Наименование",
				"tooltip": "",
				"row": 2
			},
			{
				"parent": "",
				"use": false,
				"field": "parent",
				"width": "",
				"caption": "В группе статей",
				"tooltip": "Группа статей движения денежных средств",
				"ctrl_type": "",
				"formatter": "00000000-0000-0000-0000-000000000000",
				"editor": "00000000-0000-0000-0000-000000000000",
				"row": 3
			}
		],
		"sorting": [
			{
				"parent": "",
				"use": false,
				"field": "id",
				"direction": "asc"
			},
			{
				"parent": "",
				"use": false,
				"field": "name",
				"direction": "asc"
			}
		],
		"obj": "cat.cash_flow_articles",
		"name": "Статьи ДДС",
		"user": "",
		"params": []
	},
	{
		"_id": "cat.scheme_settings|f7fcedf0-90ff-11ea-be53-27c084a9021b",
		"_rev": "1-543338e3fa89cb396b838c965fea5c05",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"use": true,
				"field": "elm",
				"caption": "Элемент",
				"width": 80
			},
			{
				"use": true,
				"field": "width",
				"caption": "Ширина",
				"width": 80
			},
			{
				"use": true,
				"field": "height",
				"caption": "Высота",
				"width": 80
			},
			{
				"use": true,
				"field": "thickness",
				"caption": "Толщина",
				"width": 80
			},
			{
				"use": true,
				"field": "formula",
				"caption": "Формула",
				"width": "*"
			},
			{
				"use": true,
				"field": "is_rectangular",
				"caption": "Прямоугольное",
				"width": 80
			},
			{
				"use": true,
				"field": "is_sandwich",
				"caption": "Непрозрачное",
				"width": 80
			}
		],
		"obj": "cat.characteristics.glasses",
		"name": "characteristics.glasses.main",
		"user": ""
	},
	{
		"_id": "cat.scheme_settings|fba24db1-930c-11ea-96aa-2797b9143acc",
		"_rev": "1-e75e7cbb107f42b14daa27b501b08e19",
		"class_name": "cat.scheme_settings",
		"fields": [
			{
				"parent": "",
				"use": true,
				"field": "param",
				"width": "*",
				"caption": "Параметр"
			},
			{
				"use": true,
				"field": "comparison_type",
				"width": "",
				"caption": "Вид сравнения"
			},
			{
				"use": true,
				"field": "value",
				"width": "*",
				"caption": "Значение"
			}
		],
		"obj": "cat.cnns.selection_params",
		"name": "cnns.selection_params.main",
		"user": ""
	},
	{
		"_id": "cat.units|1c83b0a4-8343-11e1-92c2-8b79e9a2b61c",
		"_rev": "1-72ed6c2374497f6390a1ca739a570171",
		"name": "л/дм³",
		"id": "112",
		"name_full": "Литр/Кубический дециметр",
		"international_short": "LTR",
		"class_name": "cat.units"
	},
	{
		"_id": "cat.units|20fa4b08-ade2-11e1-a7d7-1c6f65483aba",
		"_rev": "1-7690152ece4fcc2518373a66add5f742",
		"name": "см³/мл",
		"id": "111",
		"name_full": "Кубический сантиметр /Миллилитр",
		"international_short": "CMQ",
		"class_name": "cat.units"
	},
	{
		"_id": "cat.units|49a453e4-3431-11e0-9acb-1c6f65483aba",
		"_rev": "1-1877065a5b5ad4beb96fd472d0114a33",
		"name": "ед",
		"id": "642",
		"name_full": "Единица",
		"class_name": "cat.units"
	},
	{
		"_id": "cat.units|5e8b9f3a-59b1-11df-abe9-005056c00008",
		"_rev": "1-d0f826d0efe63bd2d770d28e12da6a2f",
		"name": "м²",
		"id": "055",
		"name_full": "Квадратный метр",
		"international_short": "MTK",
		"class_name": "cat.units"
	},
	{
		"_id": "cat.units|5e8b9f3b-59b1-11df-abe9-005056c00008",
		"_rev": "1-38547ed69e55baa954c7cd5dede347cb",
		"name": "компл",
		"id": "839",
		"name_full": "Комплект",
		"class_name": "cat.units"
	},
	{
		"_id": "cat.units|5e8b9f3c-59b1-11df-abe9-005056c00008",
		"_rev": "1-68c364bd1740a7de60188d4a365cc623",
		"name": "м",
		"id": "006",
		"name_full": "Метр",
		"international_short": "MTR",
		"class_name": "cat.units"
	},
	{
		"_id": "cat.units|5e8b9f3e-59b1-11df-abe9-005056c00008",
		"_rev": "1-7b7704b4208dc5edefce678e4901f121",
		"name": "км/1000 м",
		"id": "008",
		"name_full": "Километр/Тысяча метров",
		"international_short": "KMT",
		"class_name": "cat.units"
	},
	{
		"_id": "cat.units|69ea8ba3-53f9-11df-9b91-005056c00008",
		"_rev": "1-00a798eaa99a9d6a1d5fb2947608f0b3",
		"name": "кг",
		"id": "166",
		"name_full": "Килограмм",
		"international_short": "KGM",
		"class_name": "cat.units"
	},
	{
		"_id": "cat.units|69ea8ba4-53f9-11df-9b91-005056c00008",
		"_rev": "1-792624bfe70ff0234906f60389b75941",
		"name": "шт",
		"id": "796",
		"name_full": "Штука",
		"international_short": "PCE",
		"class_name": "cat.units"
	},
	{
		"_id": "cat.units|ea0ec409-833f-11e1-92c2-8b79e9a2b61c",
		"_rev": "1-01551dbee552e239356c9204ea6003c8",
		"name": "ч",
		"id": "356",
		"name_full": "Час",
		"international_short": "HUR",
		"class_name": "cat.units"
	},
	{
		"_id": "cat.units|f83b0e29-8339-11e1-92c2-8b79e9a2b61c",
		"_rev": "1-9b1bbcc30c0f46ce4cc8a9eafc8e1e26",
		"name": "м³",
		"id": "113",
		"name_full": "Кубический метр",
		"international_short": "MTQ",
		"class_name": "cat.units"
	},
	{
		"_id": "cch.predefined_elmnts|0591ff94-012a-11ee-bb06-8e955d21ad46",
		"_rev": "4-432b379ff703ef8f502b1d2609c8e6cb",
		"name": "Шаблон параметрических заполнений",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"value": "5b2dbf70-016a-11ee-b0af-a166407327d1",
		"synonym": "glasses_template",
		"list": 0,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.characteristics"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|05c01a02-da3f-11e9-8c83-d10229710f46",
		"_rev": "2-53df0cdbf1b14fdf0e7fe16921a5518f",
		"name": "Не обновлять цены",
		"is_folder": false,
		"parent": "59c4a54e-016e-11e6-8cc6-92b8012e9145",
		"value": "00000000-0000-0000-0000-000000000000",
		"synonym": "not_update",
		"list": 1,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [
			{
				"row": 1,
				"value": "fba70d17-ade5-11e1-a7d7-1c6f65483aba"
			}
		],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|06111c7a-c264-11ed-bb06-8e955d21ad46",
		"_rev": "3-a16ed7466a424fa7d8105efe36a32ed2",
		"name": "10 Служебная MDM",
		"area": false,
		"no_mdm": true,
		"lang": "  ",
		"class_name": "cch.predefined_elmnts",
		"zone": 10,
		"synonym": "abonent",
		"predefined_name": "abonent",
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"type": {},
		"elmnts": []
	},
	{
		"_id": "cch.predefined_elmnts|09367ee4-0336-11e6-8cc6-92b8012e9145",
		"_rev": "2-67dec6de6599d802d5fe1ef30f6df5e5",
		"name": "Основной тип цен продажи",
		"is_folder": false,
		"parent": "59c4a54e-016e-11e6-8cc6-92b8012e9145",
		"value": "f83b0e28-8339-11e1-92c2-8b79e9a2b61c",
		"synonym": "price_type_sale",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom_prices_types"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4738-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-593c496b6517571a794c987b157f45fc",
		"predefined_name": "properties",
		"name": "Дополнительные реквизиты и сведения",
		"is_folder": true,
		"parent": "00000000-0000-0000-0000-000000000000",
		"value": "",
		"definition": "",
		"synonym": "properties",
		"list": "",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": []
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4739-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-b4c762c16148341701989273c7507a24",
		"name": "Группа цен контрагента",
		"is_folder": false,
		"parent": "59c4a54e-016e-11e6-8cc6-92b8012e9145",
		"value": "c11622de-25e7-46a3-9f00-e9b0c43440c5",
		"synonym": "partner_price_group",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cch.properties"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e473a-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "1-5cdf064b2d58b7997f443f4af6dd0871",
		"name": "Жалюзи сдвиг",
		"is_folder": false,
		"parent": "0d5e4738-ff42-11e5-8cc6-92b8012e9145",
		"synonym": "jalousie_shift",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cch.properties"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e473b-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-6cfef6a694c4afffd33f7a5e56e805d1",
		"name": "Жалюзи управление",
		"is_folder": false,
		"parent": "0d5e4738-ff42-11e5-8cc6-92b8012e9145",
		"synonym": "jalousie_control",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cch.properties"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e473d-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-aa571ffe752116703d61a4685c3081d8",
		"name": "Наценка дилера",
		"is_folder": false,
		"parent": "59c4a54e-016e-11e6-8cc6-92b8012e9145",
		"value": "81797de0-be78-472a-b81f-f5982303aee2",
		"synonym": "dealer_surcharge",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cch.properties"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-a1eebfa54657771539262f3ba28d655f",
		"predefined_name": "nom",
		"name": "Номенклатура",
		"is_folder": true,
		"parent": "00000000-0000-0000-0000-000000000000",
		"value": "",
		"definition": "",
		"synonym": "nom",
		"list": "",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": []
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4742-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-31085660bc711eeb45432ccfc658db24",
		"name": "Аксессуары",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "c642daf9-8782-42ca-aa69-102c76571fe5",
		"synonym": "accessories",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4743-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-96024d9ca92f3ef62b8904912189590b",
		"name": "Армирование",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "20fa4b00-ade2-11e1-a7d7-1c6f65483aba",
		"synonym": "armor",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4744-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-f3a49be9f77ca3407615170198b003fb",
		"name": "Артикул1",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "4c450826-89b9-11e2-9c06-da48b440c859",
		"synonym": "art1",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4745-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-c1d79103a7cb5db47c065bc977972b29",
		"name": "Артикул2",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "4c450828-89b9-11e2-9c06-da48b440c859",
		"synonym": "art2",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4746-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-33c2b0232a17aaa331735b136e847b01",
		"name": "Виртуальная для параметров",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "20fa4af8-ade2-11e1-a7d7-1c6f65483aba",
		"synonym": "virt",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4747-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-412e38ff0dd914d440bdbfe35ccf4cd9",
		"name": "Заполнение",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "1c83b06b-8343-11e1-92c2-8b79e9a2b61c",
		"synonym": "glass",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4748-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-9967f6b99a540ba022588059f9ebea0a",
		"name": "Интеграция",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"synonym": "integration",
		"list": 1,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4749-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-a5d44a44d467492926f01ae55214d819",
		"name": "Материалы",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "93224d0c-82c5-4993-97e3-774f61dcaa3c",
		"synonym": "materials",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e474a-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-8da385d900025bb58583eb11f54e33f8",
		"name": "Москитные сетки",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "20fa4afb-ade2-11e1-a7d7-1c6f65483aba",
		"synonym": "mosquito",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e474b-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-e738b9de1a8946470d32500dd239e31b",
		"name": "Ошибка фурнитуры",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "1ad64e45-1985-4517-ac06-6b27f0a682aa",
		"synonym": "furn_error",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e474c-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-1428c7d93864c329cc6583aa9a9b27fb",
		"name": "Продукция",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "7fe8b688-eb22-43ea-89c0-a293e2a716fa",
		"synonym": "products",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e474d-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-ea6ebe0dde104b06d823c918dabe0e64",
		"name": "Профиль",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "20fa4afa-ade2-11e1-a7d7-1c6f65483aba",
		"synonym": "profile",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e474e-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-09336f2a6f72668f511732febeed6e2c",
		"name": "Прочее",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "f8f80540-4b89-11ed-9611-84f1e8809c54",
		"synonym": "other",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e474f-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-f009f972ac6cdb430f3c23541924681a",
		"name": "Раскладка",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "20fa4afc-ade2-11e1-a7d7-1c6f65483aba",
		"synonym": "layouts",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4750-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-c8d6b434480964c98fa7d0daace8329c",
		"name": "Служебные элементы",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "fba70d17-ade5-11e1-a7d7-1c6f65483aba",
		"synonym": "utilities",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4751-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-84080b65d1edc95043c0ae7cb4aa98e4",
		"name": "Техоперации",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "6e4fed4b-ff93-4ef4-a9fb-6b5726024826",
		"synonym": "operations",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4752-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-78fe2eec9cc54b18d29d7824b1354917",
		"name": "Услуги",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "592d2f4c-0ed3-406c-9fde-07f768df0dd4",
		"synonym": "servise",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4753-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-0220a364587c44e68567a10db0481c94",
		"name": "Фурнитура",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "dca16864-08d6-11ed-9611-84f1e8809c54",
		"synonym": "furn",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4754-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-a542c25a7a0703729953703880251234",
		"name": "ъУдалено. Не используется",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "fba70d17-ade5-11e1-a7d7-1c6f65483aba",
		"synonym": "deleted",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4755-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-aa57a6d3fa3b7adb517df1fa960cdf7c",
		"name": "Подразделения",
		"is_folder": true,
		"parent": "00000000-0000-0000-0000-000000000000",
		"value": "",
		"definition": "",
		"synonym": "divisions",
		"list": "",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": []
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4756-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-357922ceaa98aa033f0913f893fe2239",
		"name": "Доставка",
		"is_folder": false,
		"parent": "0d5e4755-ff42-11e5-8cc6-92b8012e9145",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.divisions"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4757-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-99dc38bddcbb79f64fe8685ae2fddfde",
		"name": "Замеры",
		"is_folder": false,
		"parent": "0d5e4755-ff42-11e5-8cc6-92b8012e9145",
		"value": "fe980d5c-dee1-11e1-b45a-1c6f65483aba",
		"synonym": "measurements",
		"list": 1,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.divisions"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4758-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-27c39254d463d879a0d5e5f164778331",
		"name": "Монтаж",
		"is_folder": false,
		"parent": "0d5e4755-ff42-11e5-8cc6-92b8012e9145",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.divisions"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4759-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-9a1d8f41e65f9e8467eeb1706b697628",
		"name": "Производство",
		"is_folder": false,
		"parent": "0d5e4755-ff42-11e5-8cc6-92b8012e9145",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.divisions"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e475a-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "1-8828872ce156885a7d5dd114a12feefa",
		"name": "Рекламации",
		"is_folder": false,
		"parent": "0d5e4755-ff42-11e5-8cc6-92b8012e9145",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.divisions"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e475b-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-c01a9c499cf23f8c7c2e8f97fdf74cc1",
		"name": "Самовывоз",
		"is_folder": false,
		"parent": "0d5e4755-ff42-11e5-8cc6-92b8012e9145",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.divisions"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e475c-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-646776607d6f6ed419eae25dda38ddc1",
		"name": "СГП",
		"is_folder": false,
		"parent": "0d5e4755-ff42-11e5-8cc6-92b8012e9145",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.divisions"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-5a38f6af1ef108e39c6a296538ad1ea1",
		"name": "Построитель",
		"is_folder": true,
		"parent": "00000000-0000-0000-0000-000000000000",
		"value": "",
		"definition": "",
		"synonym": "builder",
		"list": "",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": []
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e475e-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-200b18b7b0cdd4ee7f8fb5073fabe36a",
		"name": "Дельта наклона",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"value": 20,
		"definition": "<!DOCTYPE html>\r\n<html lang='ru'>\r\n<head>\r\n<meta http-equiv=X-UA-Compatible content='IE=edge'>\r\n\r\n<style>\r\nhtml, body {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0;    \r\n\tcolor: rgb(48, 57, 66);\t\r\n\tfont-family: Arial, sans-serif;\r\n\tfont-size: 100%;\r\n\tline-height: 19px;\r\n\ttext-rendering: optimizeLegibility;\r\n}\r\n</style>\r\n\r\n</head>\r\n<body>\r\n<h3>Дельта наклона (в градусах)</h3>\r\n<p>В пределах этого угла, элемент будет считаться вертикальным или горизонтальным</p>\r\n\r\n</body></html>",
		"synonym": "orientation_delta",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 3,
			"fraction": 0
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e475f-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-c1cf3b436b937a1bb23ae6c7fed93364",
		"name": "Добавлять D",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"value": 1,
		"definition": "<!DOCTYPE html>\r\n<html lang='ru'>\r\n<head>\r\n<meta http-equiv=X-UA-Compatible content='IE=edge'>\r\n\r\n<style>\r\nhtml, body {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0;    \r\n\tcolor: rgb(48, 57, 66);\t\r\n\tfont-family: Arial, sans-serif;\r\n\tfont-size: 100%;\r\n\tline-height: 19px;\r\n\ttext-rendering: optimizeLegibility;\r\n}\r\n</style>\r\n\r\n</head>\r\n<body>\r\n<h3>Добавлять D</h3>\r\n<p>Учитывается при расчете координат техопераций для обрабатывающего центра</p>\r\n\r\n</body></html>",
		"synonym": "add_d",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"boolean"
			]
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4760-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-73f70a1c3b05106a98f380cb8a8add65",
		"name": "Прилипание",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"value": 80,
		"definition": "<!DOCTYPE html>\r\n<html lang='ru'>\r\n<head>\r\n<meta http-equiv=X-UA-Compatible content='IE=edge'>\r\n\r\n<style>\r\nhtml, body {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0;    \r\n\tcolor: rgb(48, 57, 66);\t\r\n\tfont-family: Arial, sans-serif;\r\n\tfont-size: 100%;\r\n\tline-height: 19px;\r\n\ttext-rendering: optimizeLegibility;\r\n}\r\n</style>\r\n\r\n</head>\r\n<body>\r\n<h3>Прилипание (в миллиметрах)</h3>\r\n<p>Учитывается графическим редактором при перетаскивании узлов и профилей, а так же, при вычислении привязок при изменении размеров.</p>\r\n<p>На этом расстоянии, текущая точка будет притягиваться к ближайшему узлу или профилю.</p>\r\n\r\n</body></html>",
		"synonym": "sticking",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 3,
			"fraction": 0
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4761-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-ceda25bc882a3ff6f93af785a0310f53",
		"name": "Прилипание L",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"value": 9,
		"definition": "<!DOCTYPE html>\r\n<html lang='ru'>\r\n<head>\r\n<meta http-equiv=X-UA-Compatible content='IE=edge'>\r\n\r\n<style>\r\nhtml, body {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0;    \r\n\tcolor: rgb(48, 57, 66);\t\r\n\tfont-family: Arial, sans-serif;\r\n\tfont-size: 100%;\r\n\tline-height: 19px;\r\n\ttext-rendering: optimizeLegibility;\r\n}\r\n</style>\r\n\r\n</head>\r\n<body>\r\n<h3>Прилипание L (в миллиметрах)</h3>\r\n<p>Учитывается графическим редактором в L-соединениях</p>\r\n<p>На этом расстоянии, текущая точка будет притягиваться к ближайшему узлу</p>\r\n\r\n</body></html>",
		"synonym": "sticking_l",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 3,
			"fraction": 0
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4762-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-13363d3c7935c129aa1e97f195d9db60",
		"name": "Размер шрифта",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"value": 70,
		"synonym": "font_size",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 3,
			"fraction": 0
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4763-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "2-a8870a3f2a40074aeea0df6f032177db",
		"name": "Расчет типовой блок",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"synonym": "base_block",
		"list": 1,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"doc.calc_order"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|0d5e4764-ff42-11e5-8cc6-92b8012e9145",
		"_rev": "3-2de6636585b86414e7842f11796aa15f",
		"name": "Цвет основной",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"value": "b39beaf7-30c3-11e3-bf84-206a8a1a5bb0",
		"synonym": "base_clr",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.clrs"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|13240128-19a3-11ed-8f0c-d46d16d2dd41",
		"_rev": "2-4bb30445ef4f390de00984db79c9b353",
		"name": "Ошибка примыкающего соединения",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "13240126-19a3-11ed-8f0c-d46d16d2dd41",
		"synonym": "cnn_ii_error",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|17aee72a-3a47-11e6-bf30-82cf9717e145",
		"_rev": "4-3a6799c57e612ca7e3d438af1c90270e",
		"name": "Кмарж в спецификации",
		"is_folder": false,
		"parent": "59c4a54e-016e-11e6-8cc6-92b8012e9145",
		"value": true,
		"synonym": "marginality_in_spec",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"boolean"
			]
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|1ba08058-c264-11ed-bb06-8e955d21ad46",
		"_rev": "3-627f7b736f667512883be540fc1dd812",
		"name": "Стекло",
		"area": false,
		"no_mdm": true,
		"lang": "  ",
		"class_name": "cch.predefined_elmnts",
		"zone": 29,
		"synonym": "abonent",
		"predefined_name": "abonent",
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"type": {},
		"elmnts": []
	},
	{
		"_id": "cch.predefined_elmnts|1c07023f-1eef-11e9-81fe-005056aafe4c",
		"_rev": "3-6ffbdf7f495dfc658b63f1ba215b1247",
		"name": "Фурнитура основная",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"synonym": "base_furn",
		"list": -1,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [
			{
				"row": 1,
				"value": "6ef001b1-310b-11e3-bf84-206a8a1a5bb0",
				"elm": "00000000-0000-0000-0000-000000000000"
			}
		],
		"type": {
			"types": [
				"cat.furns"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|207395f8-ff47-11e5-8cc6-92b8012e9145",
		"_rev": "2-f1148cb6a824475187e3f494fe106dec",
		"name": "Размер узла",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"value": 10,
		"definition": "<!DOCTYPE html>\r\n<html lang='ru'>\r\n<head>\r\n<meta http-equiv=X-UA-Compatible content='IE=edge'>\r\n\r\n<style>\r\nhtml, body {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0;    \r\n\tcolor: rgb(48, 57, 66);\t\r\n\tfont-family: Arial, sans-serif;\r\n\tfont-size: 100%;\r\n\tline-height: 19px;\r\n\ttext-rendering: optimizeLegibility;\r\n}\r\n</style>\r\n\r\n</head>\r\n<body>\r\n<h3>Размер узла (в пикселах)</h3>\r\n<p>Размер визуализации выделенного узла (синяя точка)</p>\r\n<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAecAAADCCAMAAABExfpXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRFzNr0FhYWu8blusbbqrXMxub2/kZHzdr7ZGVl/9fX4L7S/6ur/VRVnarCLK7qVb7yws7a/3h41QkLqN75rrrUur27sr3V0SIn/7e3/4eH/2Jim6W+dHR0ytb0/8PDtsLVAwMDxcXGxtLyhIWEws7sy+r6vsLCMDAwsI+PpbLFJCgpxNLkrrrM/+vr9iww8/Tz4uLiws7mytrtlWJioa2+/+DgogsLREREuNjoioyKlJWUpbLLnaq+QCAgxqi5DIvKjJaq//r6/f39SEhIqrfSzs7O0N71qbbF8iUo////ysrKDKHuFjZG5xoa/56eytbu0uL17SEh3t7e1tbWiKe3+vr66urq/zU1IKTm1ub/6oeV/8/P0t7/1uL/2ur/0uL/6jpAvsC+2ub/9vb23u7/VVVVPDw83ur/paWl0tLSnZ2de3t76u7uqqqq4vL/KCgs2u7/4u7/8vLyICQkJCQkXV1d2NjY/zAwWVlZ7+/v6u7qsr7afX19srKytsLaQERI/zMzvsrm5ubmAJ3u9vr6aXF9KCgobXV9tr7a2traLCwsODg47u7u5urmvsrays7KfYF9ICAgMbLytsLetsbaoaGhvsrixtLurq6uoa7Goa7CeXl57vLu0uL6pa7G/zg4xtLq0tbWvsreoarCvs7mqqqu1uL6vs7axtbw5vL/vsrqWV1ZTE5Mpa7K/4+PusrebXF9sb/OnaGhtra2UFVQusra//Lypa7CwtLqxsrKoarG2t7e7vLy4ubmxsrGIJ3evs7imZmZsray3uLewtLuxtboP0BAlZmV8vb2wtLa3sLW5urq0tbSz976uMLi7iwwj5GRdURE7e7uRGV1lZmZ7m15ssLa2t72VVlVhYmFypWl5pWl//39qqWl9ubmNDQ0NDg8WV1tlZWZvs7eoaWleX199vr25vb/4uLm4ubixsbK1ub63Ts71mFh8GFpys7OssLeKKXmusriUFBQHBwcXzg8ICAkbG5w7O7sqsragc7y3t7iysrOztLO1tba////uELm7QAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAABLaSURBVHja7d15XBTXHQDwXZbAGjEWBIwgOAhCiKJgNBaxSZRDl1a8sku2AhtBadTYpmTNxAMD1BjOVrxQvBKx1ioxJUnTtGmamLTmqok9krYJDb3v9tM2pPb82JnZmWWPmd33Zt68mZ19vz/YZXYV9n35/d783szumK7pNAqqElr8IqGq4BoJuWHS56+1No1uCY60tQTMSM7j0ljV6pOJVZnjFl+7tnhcZlViHLOFptPGETLDOI9nlU8mZvpvzUw8yW4fT8yM4bw4kVWeIjIZF1xgpKsTFxM1AzivTWipbkmbL/7g/LTqluoEMktHvvO4aiZlLwxLPWy7wE7cZJKW5/zAyGadxC2Tly9ffsvRUM9gnjD5ll9vJuEfV/PmSMU/HXPmcM6VjXmb9BF/WrV8+U0hn3HxJuYpf9pEwj+Ke7sKpWJN4ZIlnnx+MK/Lpoe4QNMtmcPDIZ8znMn0VxdsJHxjtXlqo10qtm8T6vbWJl1AZ9I0PT7808YzT8sktv7MTUDONl1AJ9D0lGGA502h6TiC68dsA3TWA/SNDN8zfltmTBLCb/MzcTR9I+H1ZQZ21gF0XFDVnvE5PvYFVW6S0H7M4M6aQzOzc9xiMOfhODJD+zNDOGsNnUbTVTYwZ1sVTacRYh9mGGcGuneLZvHTVauW3RSw7U7B+QX/7YdvWrVq1U+3kNiymWeGcrYVUuYNWsX3kpZPfjpg2w8E59sDnz05afn3NpAopcx2Gc42qnNEqwJURc8OWv2QrNtLLgQX+SiMDvPgBpss5+48raATRXolSWe2B0skzOap9zwoz9nepBV0Ak3PB3eeT9MJ0c78ADM3y3a2aQXNtEoFQc4TJ07c93Hmy8TARwpIB93B7oLJd9YK+iRNLxbbft0NYlsX0/RJks2KnDWClnYeJs4S2azM2dbUmdeAO+Ywdft9sQc+eoPY1veZut0QxbGG75sVOdu02OsW2w+Tzuco3w/rEJZHlDnbu/EvgSZKHIMSn5+ju69imBuQONvxr3VXSZwlIu4c1eskbDYjcsZ/UGOtxKEJcec0ml4b1UUblTN+aJquLgB1Lqim6eiem5E5Y4dOEy/Fos5RfFyS3wVD54wbmj3PYBjMeXFcS7SeZyDsaSN0xg0dR7eMB3OO3vOGvA0VSmfMK2PB5wFKOD/DpPONw9HILJw9gtgZM3QcTU8BcZ5Ct8RFdzajdsYLzb7TYnx456g9T9+HGbUzXugp7PtuwjlnVoulfZQxI3e2NZkpt/t+lOGWjluTkpI+xtz2UmYhPnG79y5l7nW7P8Y85dYQ/4Xojxw1996vdrjVDsq6REVn29Gft7e375Ad7d7YJR4Wn7jt7lXL3nrXYsk3b2RiDRv/uou7WcN8+4s8i+Xdt5atuvu2Az6xK1y8s+iO9Al33HHC8127Xyh+VbsAXlVQfJWJz0vFl/j4iH+89pp7o01N550Pu/yiBiq8/6zWP5w+UT8W189m4pP1M81idbv5ofpPso9f7wQJ4SfF9KfOPV5bmxMbm8N855IKxC/K5zXV1/nHp/hYHxSf5eLTYvHlL/92D15nudK1QINyfdxsevZfssSdP/zL7NlvxYEx89CH+ocy+B9YVBL7rDQ0ir9eJxD0p2RCY3dWNaV/9Dabsre+H+xc8Ock5pG3f+SsB4Y+dCI5w+cnns6P7UMLDVal6uCgdeOsbkq/xyRt0snETH/nzMSTyxjn97ingDm3nkheEfATW0/E9mGCllW5Q0Fr4axqSr+e8FbSbJqOYz8njnVmPyfuZEsLvSwp4fV6YOfT+bPO1gYHg98XmVO0Js6qpnTtbbfSQsyezDTVnrt3f1gnPCOschGjPLYv5heHjiSf1fkUrSdnNVO6yDy/KmHMmY2EqvnND9UBQjO7XH2++9wB8fd+cWl9T9FaOauQ0k6vM7vflTklMYFxbklIu5BZwPVVdUDQTAv1aEBz5R8uV8xAckakVW7VnWsRQ4dPgSK+rxoe9u+fQZwfHVMOAe2yTEjNiKzmSn3n2lrMKV0ksU5SFxaaUX5WdLkkCLrGsijVFEmVG4cz5pQO5RwK+uys2CKJZbFgaFfN/mBpHTdXWJzxprQ857Oz8ouk1z+DnV2uy/vTd5giZYrG5IwzpUM6S0CvEFUOA+26vCu9PT4ymitczhhTOrSzGPTcIQnlkJWbjfhd6bviI2GKxueMLaXDOAdBm4byT4c/ciXu7HKZdqTvuqz/yo3RGVdKwzmbUr92COgQpRS0y5Savr9G780VVmc8KR3O2Re6IrX/EOixaEloV0bqIq+0Tis3Xmcs0qfDOXuhK6b1nwI/5yDUK8lInmCp0QoapLnC7YwBOrxzHa887wmok0tCvhBGOkbHUzR2Z/WlwZyBlUGhXWeTB2J021xp4Kw2NIBz3coDA5YzwOcc1IJBu6Z7pPU4RWvhrLJ0a1jn45ZFluP1ECeX1IK+ir6yI636WP8MqNzaOKsKHc7ZR7m+3okY2tUXe6RVh82V6s7ARQ+ZdGjnPz4x78DKuro61aBd34490aq7yq2+M3boUM7OUx5laGioF5ET+3irzporDM64paWdGeVpFYFdNPqE5qRLzumqucLijBda0vmX/T7KalZu9hXklJTk6Ki5wuOMVVrCuTHfT1ndys2+gHMlsTm6maJxOWOEFnX+T/HPApQRQYd6Aa2Pg0qrXrmxOeOTFnEuzC3f8lCdQmfYys1G6wkwadWbK4zOuKCDnAuzyrsD1sOwQde0Hon9tg4qN05nTNIBzm2ssk3cWe0pmouYI2V9mjdXeJ3lTHLQ0H7OvLKUs6rNlfe3j/lG2XSNmyvczhhSesx5yYt3lTtEj2PgrNyc9ITk6Zo2VzdDOTesXpeSkpLlUOCsfkp7ndsqy+6SOF6Ft3KDSas6RcM4Ny3spDyxIMUh31ntlOadHZWVb0gel8TYXHljf3pyhmZn7kM4H7tKWbfk/r6nI2VhKfXDbvnOKqc058wot4U4/oy/cgNIq1m5IZyb3SnC3Tk/6VqtxFnVlGacHf/9Q1vI8ww0go7fn56aoUnlhnDea23y3n9sT5YiZzVTOsZcnvV8mPNJNJmieekdGRo0VxDO2b7OnZUKnVVL6Zx08+/Cnjek0RTNSe9I3xGPvbmCcE4Zq9tNOxsLlTorzQzx6Cs7UgJwfphmlTuMtGpTNMx+mNVcujCFjeJG6uI25c7oU3p62UAMU7dhnbFWbjYydqT/NR7rFA3TV726SeirPshyoHBGnNLTyya8yc3P0M54KzcnnZy+Px5jcwW3TrK7J4tJ543ditZJVErp6cnpb/L7YWo7O1H8dUpIK5qipRP6ZtzrniqlNDtq3v1teGctoNnf+U1clRvO+fmXirOzs69kHUPojCKlfZRlOmOfov1rkOrNFYxzoZWfnqnRhc+jc1Y8ahmpfhVQnjP+Kdp3n0L15grCuW3QfbHDsdv+as/Xp1LZ/0TorCilTYFdChZnJ7IdyOll34hRv7mCcD7YuVG4u+TJPWtQOstPaZFeVKazNpWbW9kJlFZhioZZ97z6qvf+cyOA655fqVcH2jNw8e+IrDjIddaocnPSsUdi1G2uIJyLz3d775fvKQd1BoWGl+Y+2ElsfRuLsxPpal6O39uy0DdXEM5ZoxfnCHtk50vbgJ3r1UnpGqljP7KdNYWuySnxebMO8soN4dxQTI1uZdqq7L1Pm93N2yCcVUhp9uP4Mlw1aJ21m6IF6XNqNVdQ/XP5VjPXVrmzC7dDOaNO6RrLBM9H5iJ21nCK5uJcifC2LNTNFex62Paenp4miPWwRyBrIZB0zMDYR2Br6exEf8Dt3OP827IQN1dqr3s+4h06ZCkd4/9B50idNa7cNT5v1kE7RUM5v/xkoX13ytYFpVd6wJ2hkyT06IlcuACls9aVm38LRw7q5gpmP2yTmcpt+AnVe2mEGlkH4YwwpVuPiF2IRDtnFSo3L92HtrmCcP7W6NWXmebqCjM9d5QOtkE4o0pp6QsLoXPWBzT3Zh2UlRtmneTB7XZ7NvvFbq8EXSd5JGD0FAwfe6EwkIqo0FkHU7TnZQyUTUfXXMGse079DfPl6G72/uquLDhnxSntufAfyNyn1FkPUzQvLeyKKJ+iYY5jXHrZbj886GDvr8tbA+usKKX5C3mCvWsNr7NalZt/s04GmuYKwrmja3CN/Zh15zH77qwuqwPaWX5KPzumDCCt2FlH0MKCkOIpGqavquyiGo9ONZsb3VTp/7bJcJY3go/6K4eFblXsrJvKzTRXNW9y11tRWrmh+udjv9owSlGUufTgse3ynOFTui+2pAhuEGNwO6uZ0PwBG5PS5kr99TBFY8hehQY2WxDks76gPVfWUVa58TtDjCGjfBr+uDSCfNZNcyUsi8WzV9ZR0lxp4Aw6iCuSTxySM4oo8llHU7RwZZ329F2X5U/RmjiDDKJpyOf6JFDSWjirXbm56620p++/LLe50sY57DCaAq5PAgMt5XxfpEPXmlIXWWrkVW6tnEMOo0nkKjTg0oic9TZFc100K+2SU7k1c5YeR0b5CSUDKekc8QnNCmekDlhkNFcaOosPZMW0eZZaRSkj7WwI6NqM5IEY6ClaS2eRkayYNmA5o7A2InPWZeX2SPcfgpyitXUOGMmKA4ssxxWPZQhnLaBRNlfe9c8MpueEmqI1dvYdSu76JAiSJpSzMSo3GyuST7RCVG7NnYWxPGNZdOA4kvIY0jnymytvsKuFwJVbe2duMM9YBg6sRHRCKEpn3U7RXPTF+l23OlTl1oNznfOJedMqkJ3jLeW8/j5jVW7+mG0RELQOnLmr0CA8xzuMs7GguaPzANCaOztPcdcnQXiOt6TzeuNVbl760bBTtNbOL+YPVaA89Teks3bQqjRX3mWxHK+0ZEJr61yUP2RCdUKod0jDOhuscrP73EWxsWdDQmvp7KeM8Gx+aWejQIucRFSUP2tFiMqtnfPMpalzFY6oE9rZoFO0c0xaIqG1cp65dGgugtxxwjqvN2Tl5pdLXsxPXiEBrY2zlDISaBBnA07RXBz6WqpJFFp1Z5Eh/c6sWXPRDaoTztnIldsjPWTSxvm+IOUVSLPHCeds1OZqTLq/3RQEjcPZd1Dnzpr1HeR10inD2aiVm41T/d4FxnqszsKgzh0CUVYIHc7ZwM3VmLR3KRmXs8+oAisrkw7rbPQpmm2uzlgGeGlczsKwzh1aOlPOuEJnUHhnQzdXwrIYe0B/pRcahzM7rBWQygpSGtjZyFM0+4tyJ+jw0Fic17PKCkol3NACOBu/cnuWS1jpM9icK6YtnSlvZGWlNIiz4ZsrYVlspWXAcgaL88ppS1+TXSvlpDSEs9ErNxsV0+adcqru/PCB/JmKcgg+pYGco6C5qveVVtl51Hz/ns9gDjfVK8Qnbvfcjvb2mqnOz0RE3Bw2ZPyf/6AWqunc2Jm7EX98kY3DTDTf+cJhT7AbNkZzbKWa1XNu7LzXpmn41O1oj50+0IidNWcmzj6xeQwarbP2zMRZPKOROjd2dtuIsy4zGqWzHpiJs3hGI3TWBTNxFs9odM76YCbO4hmNzFknzMRZPKNROeuFmTiLZzQiZ90wE2fxjEbj3KUbZuIsntGHUTh37Wlr0EnMue6GBhJBcZRvrxQ5d+1x6OdP97q/kfQVCR5aibOumIdJ3Q4FrcBZR8wzJk2a9O+7mC+TiKs4tHxnPWXzjH0TPbGPsIpDy3bWVdGesc//lkQgtFxnXTET57DQU2U6j168R0dxp+D8wj0kxOIDalSO8yVqwQY9xQ8E59s3kBANs3A8Gsa5sXObvuoSqdvhYolw4gGEs37WtIkz1Fo3nLP+mBnfSZ4gzqHWupthnHXIbJsxUQjCGSajQZ31yEwCPKMBnQlzhGc0mDNhjvSMPgzinNdZSA7pRvjx6MbdUuH4Pu9c2dVIIsJjZE+bVKxe19bGOS/5gp1EhMfutmuhgjgTZxLEmQRxJkGcSRBnEsSZBHEmQZyJM3EmziSIc2REymAP8zWX4uOg3d6wpZEaOTiHffCNvb3U05XEOfLjJfcC1nlNNhcLRnPt9oPmq0/tNGc32O3HrO5fNJ8fTSHOER6rp1IU5+yJ3NFX7PaOkb0M8ZOj37Lbt5hTWOynHcQ5oqNnAWW1jjm3DW69l0lndzlzv7Cx2N5kPd/N3H3K/HXiHNnOV3N37x1zfsW8jvm6k9vwTau1qe3SXnbzdzsPEueIjzHnjq6pzM5Xk9X6TTt7U+p4rHMTu/2xzmzibCDni+YsDtjaxG9/zJPIPQv2EmfjODsGtx4jzsZ3zqI4Vd7ZU7cPkrptOOfizge4W7IfZmjn7vPnv8/dIX2VoZ2f6+Jn4Y6RbO86yShZJzGac7lbqM5XzNaXNnPrno4H3cXNP47Gdc/ce40WRy91cLdPUc38ljcOdlF5V9rYu8/9epQaTNluqBfsWB3S+f8GEr2yflTHuwAAAABJRU5ErkJggg==\">\r\n\r\n</body></html>",
		"synonym": "handle_size",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 3,
			"fraction": 0
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|2839079e-a6cc-11ed-bb06-8e955d21ad46",
		"_rev": "2-0b589c41b0845a6eed4bc9406e948db7",
		"name": "Полоса по периметру",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "3b3a27a8-a6ca-11ed-bb06-8e955d21ad46",
		"synonym": "strip",
		"list": 0,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|3bd5bb2a-234d-11e7-9b5c-f2ca90e9fe45",
		"_rev": "2-f171bae971d9d6ae68bcad971cc671fb",
		"name": "Детализация",
		"is_folder": false,
		"parent": "a6302282-234b-11e7-9b5c-f2ca90e9fe45",
		"value": "",
		"synonym": "detailing",
		"list": 1,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [
			{
				"row": 1,
				"value": "parent",
				"elm": "Раскладка"
			},
			{
				"row": 2,
				"value": "elm",
				"elm": "Стекло"
			},
			{
				"row": 3,
				"value": "elm",
				"elm": "Заполнение"
			}
		],
		"type": {
			"types": [
				"enm.plan_detailing"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|3c67e328-2358-11e7-9b5c-f2ca90e9fe45",
		"_rev": "2-242302cdc6400c7007c5aa3e150c9ff7",
		"name": "Время плюс день",
		"is_folder": false,
		"parent": "a6302282-234b-11e7-9b5c-f2ca90e9fe45",
		"value": 15,
		"synonym": "time_plus_day",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 2,
			"fraction": 0
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|447dbd8a-3aeb-11e7-aafb-c92f892df045",
		"_rev": "2-d332595a5a1040741c6e4f13747f0bc4",
		"name": "Адрес сервера эскизов",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"value": "",
		"definition": "<!DOCTYPE html>\r\n<html lang='ru'>\r\n<head>\r\n<meta http-equiv=X-UA-Compatible content='IE=edge'>\r\n\r\n<style>\r\nhtml, body {\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n    padding: 0;    \r\n\tcolor: rgb(48, 57, 66);\t\r\n\tfont-family: Arial, sans-serif;\r\n\tfont-size: 100%;\r\n\tline-height: 19px;\r\n\ttext-rendering: optimizeLegibility;\r\n}\r\n</style>\r\n\r\n</head>\r\n<body>\r\n<h3>Адрес сервера эскизов</h3>\r\n<p>URL сервера отчетов и рендеринга эскизов</p>\r\n\r\n</body></html>",
		"synonym": "imgs_url",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"string"
			],
			"str_len": 100
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|44b384a0-569a-11eb-a387-83ed29bc2946",
		"_rev": "2-2091b8ba9b90057f6b1f55ee837199f7",
		"name": "Разрешить пустые цены в спецификации",
		"is_folder": false,
		"parent": "59c4a54e-016e-11e6-8cc6-92b8012e9145",
		"value": true,
		"synonym": "skip_empty_in_spec",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"boolean"
			]
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|4d88d0ba-67d7-11ef-a8d1-b1dc89e6b246",
		"_rev": "1-31138e772ed9bfcc596a07d618887bb7",
		"name": "Отверстия",
		"is_folder": false,
		"parent": "0d5e4738-ff42-11e5-8cc6-92b8012e9145",
		"value": "00000000-0000-0000-0000-000000000000",
		"synonym": "ihole",
		"list": 1,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [
			{
				"row": 1,
				"value": "0f420cbc-b3a1-11ee-9c4f-d89f6adade46"
			},
			{
				"row": 2,
				"value": "0df0de64-bac3-11ee-9c4f-d89f6adade46"
			},
			{
				"row": 3,
				"value": "4bb9ffbc-b9d5-11ee-9c4f-d89f6adade46"
			}
		],
		"type": {
			"types": [
				"cch.properties"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|50b7d8de-5218-11e8-9bc8-ee58eae94b45",
		"_rev": "2-4f58401856cf44ce84346fe5544725f6",
		"name": "Вычисляемые показывать",
		"is_folder": false,
		"parent": "0d5e4738-ff42-11e5-8cc6-92b8012e9145",
		"value": "aae7417e-b619-11e6-9862-afdec152d845",
		"synonym": "show_calculated",
		"list": 1,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cch.properties"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|59c4a54e-016e-11e6-8cc6-92b8012e9145",
		"_rev": "2-bfd72be75cfc132e300f150366939605",
		"predefined_name": "pricing",
		"name": "Ценообразование",
		"is_folder": true,
		"parent": "00000000-0000-0000-0000-000000000000",
		"value": "",
		"definition": "",
		"synonym": "pricing",
		"list": "",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": []
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|63496008-2856-11ed-9611-84f1e8809c54",
		"_rev": "2-5015557f09d9a48ab83d37a4ed840875",
		"name": "Списки",
		"is_folder": true,
		"parent": "00000000-0000-0000-0000-000000000000",
		"value": "",
		"definition": "",
		"synonym": "lists",
		"list": "",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": []
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|739786b8-9235-11ec-8f90-8a0c3ce1c945",
		"_rev": "2-ab4b5fc2e612799528e97e60e498a07e",
		"name": "Счет действителен N дней",
		"is_folder": false,
		"parent": "59c4a54e-016e-11e6-8cc6-92b8012e9145",
		"value": 0,
		"synonym": "valid_days",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 2,
			"fraction": 0
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|9915b9d2-b37b-11ee-9c4f-d89f6adade46",
		"_rev": "2-0b46f7113e3fa13adf1f10b4c5ae189d",
		"name": "Использовать внутренние цены",
		"is_folder": false,
		"parent": "59c4a54e-016e-11e6-8cc6-92b8012e9145",
		"value": false,
		"synonym": "use_internal",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"boolean"
			]
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|a6302282-234b-11e7-9b5c-f2ca90e9fe45",
		"_rev": "2-16bb6ecca8a79452ecca5bba880ac891",
		"name": "Планирование",
		"is_folder": true,
		"parent": "00000000-0000-0000-0000-000000000000",
		"value": "",
		"definition": "",
		"synonym": "planning",
		"list": "",
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": []
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|b073daa6-472e-11ed-9611-84f1e8809c54",
		"_rev": "2-a54cb7686e6b32e5594f65887f269ca3",
		"name": "Шаблоны запретить смену системы",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"value": "00000000-0000-0000-0000-000000000000",
		"synonym": "templates_lock_sys",
		"list": 1,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"doc.calc_order"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|b156ba6c-b619-11e6-9862-afdec152d845",
		"_rev": "2-78008975e4a32d7b29cd769f65ea7671",
		"name": "Вычисляемые",
		"is_folder": false,
		"parent": "0d5e4738-ff42-11e5-8cc6-92b8012e9145",
		"value": "aae7417e-b619-11e6-9862-afdec152d845",
		"synonym": "calculated",
		"list": 1,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [
			{
				"row": 1,
				"value": "1addcc0c-f9ed-11e6-b63f-d6d199fe0d45"
			}
		],
		"type": {
			"types": [
				"cch.properties"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|b4e8d88c-0335-11e6-8cc6-92b8012e9145",
		"_rev": "2-a0a60e1d1e1c4f56e2189bfdea108fa2",
		"name": "Валюта учета",
		"is_folder": false,
		"parent": "59c4a54e-016e-11e6-8cc6-92b8012e9145",
		"value": "69ea8ba1-53f9-11df-9b91-005056c00008",
		"synonym": "main_currency",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.currencies"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|bad75504-c509-11e9-937d-d837a7e10147",
		"_rev": "2-1d1b5a96d537b4842bf030a8e6eb2ced",
		"name": "Ошибка вес створки",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "94b1b504-c509-11e9-937d-d837a7e10147",
		"synonym": "flap_weight_max",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|cdce9464-5e96-11e7-88d7-931927f6a946",
		"_rev": "2-5daf47f66dd74f1b4481aeed5e25c71a",
		"name": "Ошибка инфо",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "c3c867d1-2e55-4c24-99e3-d8f5a36e2629",
		"synonym": "info_error",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|d53565f0-b880-11e6-ae96-e1cd02504545",
		"_rev": "2-1c698f50d36be561af74e91f00d4b0c6",
		"name": "Папка составных цветов",
		"is_folder": false,
		"parent": "0d5e475d-ff42-11e5-8cc6-92b8012e9145",
		"value": "00000000-0000-0000-0000-000000000000",
		"synonym": "composite_clr_folder",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.clrs"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|e011f7ce-5e96-11e7-88d7-931927f6a946",
		"_rev": "2-747e217d12fc58aaadba84d5a3929f58",
		"name": "Ошибка критическая",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "7c47c32c-fb5b-4315-bb33-20f665b475b5",
		"synonym": "critical_error",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|ec01a7e2-19a2-11ed-8f0c-d46d16d2dd41",
		"_rev": "2-cfea67a7a98bc02514b0aad166e4f96b",
		"name": "Ошибка концевого соединения",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "e34ed386-19a2-11ed-8f0c-d46d16d2dd41",
		"synonym": "cnn_node_error",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|ee68a220-8573-11eb-a387-83ed29bc2946",
		"_rev": "2-2688ff8f20227f061fb73a319414999f",
		"name": "Ошибка состав заполнения",
		"is_folder": false,
		"parent": "0d5e4741-ff42-11e5-8cc6-92b8012e9145",
		"value": "b1172770-8573-11eb-a387-83ed29bc2946",
		"synonym": "glass_chain",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|f097a41d-6ebf-11e6-83ee-d9b4d20c6c45",
		"_rev": "2-38c99dd6fa90b15e6e55dc37e4d8f33c",
		"predefined_name": "ПустаяХарактеристика",
		"name": "Пустая характеристика",
		"is_folder": false,
		"parent": "0d5e4738-ff42-11e5-8cc6-92b8012e9145",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cch.properties"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.predefined_elmnts|f097a41e-6ebf-11e6-83ee-d9b4d20c6c45",
		"_rev": "2-c70178bed110cdea7c2e065bb2f0c425",
		"predefined_name": "СостояниеТранспорта",
		"name": "Состояние транспорта",
		"is_folder": false,
		"parent": "0d5e4738-ff42-11e5-8cc6-92b8012e9145",
		"list": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"elmnts": [],
		"type": {
			"types": [
				"cch.properties"
			],
			"is_ref": true
		},
		"class_name": "cch.predefined_elmnts"
	},
	{
		"_id": "cch.properties|04bcf8bc-f9ed-11e6-b63f-d6d199fe0d45",
		"_rev": "1-5660f9cf2802a8dfc2bf6bf4419d1a00",
		"predefined_name": "department",
		"name": "Подразделение",
		"shown": true,
		"sorting_field": 1063,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Подразделение",
		"is_extra_property": false,
		"include_to_description": false,
		"calculated": "dcb73d3a-fa70-11e6-b63f-d6d199fe0d45",
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.divisions"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|066ab6da-9237-11ec-8f90-8a0c3ce1c945",
		"_rev": "1-5916ef7014c25d644b58aa07dea2d467",
		"predefined_name": "valid_days",
		"name": "Счет действителен N дней",
		"shown": true,
		"sorting_field": 1238,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Счет действителен N дней",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 2,
			"fraction": 0
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|0df0de64-bac3-11ee-9c4f-d89f6adade46",
		"_rev": "4-13c7f5ff597e524c0eaa2600242970e8",
		"name": "Отверстия 31-50мм",
		"shown": true,
		"sorting_field": 1286,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Отверстия 31-50мм",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 15,
			"fraction": 3
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|0ecc9d72-0136-11e6-8303-e67fda7f6b46",
		"_rev": "1-09d676c4b6a7a63510c539249b3c478c",
		"predefined_name": "lam_out",
		"name": "Площадь лам. снаружи",
		"shown": true,
		"sorting_field": 1127,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Площадь лам. снаружи",
		"tooltip": "Площадь ламинации внешней стороны профиля в м² на  единицу хранения",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 15,
			"fraction": 3
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|0f420cbc-b3a1-11ee-9c4f-d89f6adade46",
		"_rev": "14-0344088c6ea6d84988258dd1af7b5114",
		"name": "Отверстие до 30",
		"shown": true,
		"sorting_field": 1283,
		"available": true,
		"mandatory": false,
		"include_to_name": true,
		"list": 0,
		"caption": "Отверстие до 30",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 2,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 15,
			"fraction": 3
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|1217718e-70dd-11ef-b9f0-7085c299da15",
		"_rev": "1-e214b5aa34d0c0b5d26a23e4f969fbd9",
		"predefined_name": "edgeLeft",
		"name": "Кромка лев",
		"shown": true,
		"sorting_field": 20032,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Кромка лев",
		"destination": "06ae29a8-f11a-11ee-9c4f-d89f6adade46",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"conserve": false,
		"captured": true,
		"editor": "bd68aa5d-8339-11e1-92c2-8b79e9a2b61c",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 8,
			"fraction": 2
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|1a759d9a-0136-11e6-8303-e67fda7f6b46",
		"_rev": "1-cb1d15d4fe9dad05b068afa995589f7f",
		"predefined_name": "lam_in",
		"name": "Площадь лам. изнутри",
		"shown": true,
		"sorting_field": 1126,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Площадь лам. изнутри",
		"tooltip": "Площадь ламинации внутренней стороны профиля в м² на  единицу хранения",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 15,
			"fraction": 3
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|1addcc0c-f9ed-11e6-b63f-d6d199fe0d45",
		"_rev": "1-88c3f9071578bcfdc7c4e83ad05905c6",
		"predefined_name": "delivery_direction",
		"name": "Напр.доставки",
		"shown": true,
		"sorting_field": 40,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Напр.доставки",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.delivery_directions"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|1afcd368-eb8d-11eb-a51f-84872f593c46",
		"_rev": "1-2433e04ce4662866410536afdc6583aa",
		"predefined_name": "branch",
		"name": "Отдел абонента",
		"shown": true,
		"sorting_field": 1234,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Отдел абонента",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.branches"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|1eb42316-e97f-11ed-bb06-8e955d21ad46",
		"_rev": "6-ff8c3ac3ddfeaffac20be303cce6a090",
		"predefined_name": "imaterial",
		"name": "Материал",
		"shown": true,
		"sorting_field": 1276,
		"available": true,
		"mandatory": true,
		"include_to_name": true,
		"list": 0,
		"caption": "Материал",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"conserve": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|1f6d3fa2-70dd-11ef-b9f0-7085c299da15",
		"_rev": "1-6d8e054709546d0e50056be2116a4d92",
		"predefined_name": "edgeRight",
		"name": "Кромка прав",
		"shown": true,
		"sorting_field": 20033,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Кромка прав",
		"destination": "06ae29a8-f11a-11ee-9c4f-d89f6adade46",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"conserve": false,
		"captured": true,
		"editor": "bd68aa5d-8339-11e1-92c2-8b79e9a2b61c",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 8,
			"fraction": 2
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|22ab2edc-41fc-11e7-8937-abdef8fb0946",
		"_rev": "1-88bd864ab61a20743072570f48cb5f7c",
		"predefined_name": "inset",
		"name": "Вставка",
		"shown": true,
		"sorting_field": 9,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Вставка",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.inserts"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|2390754a-54ec-11ea-b6cf-e9a810ef0946",
		"_rev": "1-4aeae7acd0862e921232bbae5483c3be",
		"predefined_name": "http_api",
		"name": "Внешнее API",
		"shown": true,
		"sorting_field": 1205,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Внешнее API",
		"note": "json-сериализация параметров текущего изделия в терминах внешнего поставщика",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"string"
			],
			"str_len": 1024
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|25da9345-70dd-11ef-b9f0-7085c299da15",
		"_rev": "1-988eb8930f8b10589848c0c4d76b1476",
		"predefined_name": "edgeTop",
		"name": "Кромка верх",
		"shown": true,
		"sorting_field": 20034,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Кромка верх",
		"destination": "06ae29a8-f11a-11ee-9c4f-d89f6adade46",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"conserve": false,
		"captured": true,
		"editor": "bd68aa5d-8339-11e1-92c2-8b79e9a2b61c",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 8,
			"fraction": 2
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|25da936a-70dd-11ef-b9f0-7085c299da15",
		"_rev": "1-36ab46fc0e8168e6cf4651561c1d3839",
		"predefined_name": "edgeBottom",
		"name": "Кромка низ",
		"shown": true,
		"sorting_field": 20035,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Кромка низ",
		"destination": "06ae29a8-f11a-11ee-9c4f-d89f6adade46",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"conserve": false,
		"captured": true,
		"editor": "bd68aa5d-8339-11e1-92c2-8b79e9a2b61c",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 8,
			"fraction": 2
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|3180fb62-a972-11e6-92c2-8fc975681747",
		"_rev": "1-d27728903b313885a297a9ad8ba5ebbd",
		"predefined_name": "grouping",
		"name": "Группировка",
		"shown": true,
		"sorting_field": 1038,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Группировка",
		"note": "Допреквизит номенклатуры для дополнительной пользовательской группировки в отчетах",
		"tooltip": "Группировка в отчетах",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.property_values"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|38a0c4ac-0082-11e6-8303-e67fda7f6b46",
		"_rev": "1-8a76a06b0fe9270eddec47aae83037c9",
		"predefined_name": "furn",
		"name": "Фурнитура",
		"shown": true,
		"sorting_field": 1094,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Фурнитура",
		"is_extra_property": false,
		"include_to_description": false,
		"calculated": "42fe1634-063f-11e7-2f99-00163ebf91ab",
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.furns"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|3a086486-b286-11ed-bb06-8e955d21ad46",
		"_rev": "1-de74a9fe4c8ffa5f044f1cd6ce99ae5c",
		"predefined_name": "region",
		"name": "Ряд",
		"shown": true,
		"sorting_field": 1275,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Ряд",
		"is_extra_property": true,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 15,
			"fraction": 3
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|457df3ce-0104-11e7-a520-b36ac823e84f",
		"_rev": "1-592e7a48ed6751d96de8bbfaa740521c",
		"predefined_name": "auto_align",
		"name": "Автоуравнивание",
		"shown": true,
		"sorting_field": 1026,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Автоуравнивание",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"enm.align_types"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|461841f0-a2e8-11ec-aa46-9c5fc529bf46",
		"_rev": "1-aa7f40aba54cff296c4587f2ef456712",
		"predefined_name": "elm_pos",
		"name": "Положение элемента",
		"shown": true,
		"sorting_field": 1265,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Положение элемента",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"enm.positions"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|4bb9ffbc-b9d5-11ee-9c4f-d89f6adade46",
		"_rev": "2-680079d097766131f2557eb25adbf6e5",
		"name": "Отверстие 60-70",
		"shown": true,
		"sorting_field": 1285,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Отверстие 60-70",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 15,
			"fraction": 3
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|4bc9f044-aff6-11ea-b14f-b87d04fd1847",
		"_rev": "1-4d324f388e07fc56b72bfc117c26608b",
		"predefined_name": "mount_height",
		"name": "Высота монтажа",
		"shown": true,
		"sorting_field": 1218,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Высота монтажа",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 3,
			"fraction": 0
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|4fe84a24-e980-11ed-bb06-8e955d21ad46",
		"_rev": "7-2db96f984c99aa7ced1817130292238f",
		"predefined_name": "iedge",
		"name": "Кромка",
		"shown": true,
		"sorting_field": 1277,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Кромка",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 2,
		"conserve": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.property_values"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|507282e5-e90d-11e4-80aa-206a8a1a5bb0",
		"_rev": "1-cab7044b192be7b4b3a3ef4ea0d1e01f",
		"predefined_name": "clr_product",
		"name": "Цвет изделия",
		"shown": false,
		"sorting_field": 1096,
		"available": false,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Цвет изделия",
		"note": "Значение этого параметра рассчитывается автоматически, как цвет изделия. Его не нужно указывать в табчасти параметров",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.color_price_groups",
				"cat.clrs"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|507282e6-e90d-11e4-80aa-206a8a1a5bb0",
		"_rev": "1-3fe0c735825c79a843217d11769ead40",
		"predefined_name": "clr_elm",
		"name": "Цвет элемента",
		"shown": false,
		"sorting_field": 1098,
		"available": false,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Цвет элемента",
		"note": "Значение этого параметра рассчитывается автоматически, как цвет изделия. Его не нужно указывать в табчасти параметров",
		"is_extra_property": false,
		"include_to_description": true,
		"calculated": "0b49638c-c36a-11e6-a549-c95dc3ac6545",
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.color_price_groups",
				"cat.clrs"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|579da33c-afed-11e6-ae96-e1cd02504545",
		"_rev": "1-c376fd165e1ff36653c25193a4bf803a",
		"predefined_name": "glass_formula",
		"name": "Формула стеклопакета",
		"shown": true,
		"sorting_field": 1092,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Формула стеклопакета",
		"note": "Используется при заказе разовых эксклюзивных пакетов с нестандартной формулой. Не влияет на спецификацию",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"string"
			],
			"str_len": 250
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|68d15ece-cb3f-11e6-9862-afdec152d845",
		"_rev": "1-8734cbbf6c0ec21796e8c0590c83b8e6",
		"predefined_name": "row_nom",
		"name": "Номенклатура элемента",
		"shown": true,
		"sorting_field": 22,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 3,
		"caption": "Номенклатура элемента",
		"is_extra_property": false,
		"include_to_description": false,
		"calculated": "6092cd8a-9a09-11e7-ac87-b95945751d47",
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|72344690-2394-11e7-9b5c-f2ca90e9fe45",
		"_rev": "1-cf9a9aa277f055835e3cc4a8658b2b0f",
		"predefined_name": "planning_detailing",
		"name": "Детализация планирования",
		"shown": true,
		"sorting_field": 1,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Детализация планирования",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"enm.plan_detailing"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|790fbb83-840c-11e1-8eed-e21b160dbf3a",
		"_rev": "1-8983a90f93238c2689942b6b0e4de3c9",
		"predefined_name": "direction",
		"name": "Напр.открывания",
		"shown": false,
		"sorting_field": 1,
		"available": false,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Напр.открывания",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"enm.open_directions"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|7e788428-3104-11e3-bf84-206a8a1a5bb0",
		"_rev": "1-255220d9078d0f1507b5c1075ee95969",
		"name": "Вид монтажа",
		"shown": false,
		"sorting_field": 0,
		"available": false,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Вид монтажа",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.property_values"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|7f5608e2-b619-11e6-9862-afdec152d845",
		"_rev": "1-50b102f7e90ebd9f21adaac0733cbd2a",
		"predefined_name": "length",
		"name": "Длина",
		"shown": true,
		"sorting_field": 1046,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Длина",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": true,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 8,
			"fraction": 1
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|7f596168-f8f0-11ea-bb4b-a3a00cb42f46",
		"_rev": "1-b73b3d843ee392fbe77ae219572a4a42",
		"predefined_name": "sys_hierarchy",
		"name": "Иерархия систем",
		"shown": true,
		"sorting_field": 1221,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Иерархия систем",
		"destination": "dc4c9990-8cf0-11ec-9981-e64cf8971646",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.property_values_hierarchy"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|7f860110-b796-11ee-9c4f-d89f6adade46",
		"_rev": "2-44525e115c4ead74dc30c1c431b36342",
		"name": "Фигура",
		"shown": true,
		"sorting_field": 1284,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Фигура",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"boolean"
			]
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|8082d076-aff6-11ea-b14f-b87d04fd1847",
		"_rev": "3-42148729b4bdd3f0853b805047219823",
		"predefined_name": "from_edge",
		"name": "От края здания",
		"shown": true,
		"sorting_field": 1219,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "От края здания",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 3,
			"fraction": 0
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|81797de0-be78-472a-b81f-f5982303aee2",
		"_rev": "1-ee52a8de3b4b3cdc648a259354faa5ce",
		"name": "Наценка дилера (внешняя)",
		"shown": true,
		"sorting_field": 0,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Наценка дилера (внешняя)",
		"destination": "62f459e7-167f-11e4-8251-bcaec53cf0fb",
		"tooltip": "Наценка, которую дилер использует для своих клиентов\r\nНе влияет на цены завода - только для внешнего ценообразования\r\nУстанавливается дилером в свойствах лёгкого клиента",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 8,
			"fraction": 1
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|87b201b0-0081-11e6-8303-e67fda7f6b46",
		"_rev": "1-54c7efb7bb58966cf7090304bed9d2b0",
		"predefined_name": "sys",
		"name": "Система",
		"shown": true,
		"sorting_field": 1077,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Система",
		"is_extra_property": false,
		"include_to_description": false,
		"calculated": "705b6c9c-0641-11e7-2f99-00163ebf91ab",
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.production_params"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|8b6297aa-3039-11ec-90dc-ae9d46780a46",
		"_rev": "1-cdd82682d24a6f400d1afa573a1ccc31",
		"predefined_name": "use",
		"name": "Использование",
		"shown": true,
		"sorting_field": 1235,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Использование",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"boolean"
			]
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|94ec0190-a2e8-11ec-aa46-9c5fc529bf46",
		"_rev": "1-d5d34a66f333399f0c9399d473111048",
		"predefined_name": "elm_orientation",
		"name": "Ориентация элемента",
		"shown": true,
		"sorting_field": 1266,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Ориентация элемента",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"enm.orientations"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|968c00b8-4b7c-11e7-870b-dc334a70f245",
		"_rev": "1-9218ff8f7ada58b0fafe394402a2cf58",
		"predefined_name": "machine",
		"name": "Станок",
		"shown": true,
		"sorting_field": 11,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Станок",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.property_values"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|9cc16d2e-e98c-11ed-bb06-8e955d21ad46",
		"_rev": "3-66721b924a7db5c976be51def2a82674",
		"name": "Плёнка",
		"shown": true,
		"sorting_field": 1278,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Плёнка",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 1,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|a53d6b38-d3a8-11ec-a4ca-83659de63346",
		"_rev": "1-7cbad240e1c7fe5c1ef091fe452aceb1",
		"predefined_name": "coloring",
		"name": "Способ придания цвета",
		"shown": true,
		"sorting_field": 1268,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Способ придания цвета",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"enm.coloring"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|aa256be0-0b5e-11e7-a4bb-f62a66dd0b46",
		"_rev": "3-37a82a8c56caaaf5d87bd45a3bf768c5",
		"predefined_name": "clr_key",
		"name": "Ключ цветового аналога",
		"shown": true,
		"sorting_field": 1051,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Ключ цветового аналога",
		"note": "Для связи однотипных, отличающихся только цветом номенклатур",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"string"
			],
			"str_len": 11
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|aae7417e-b619-11e6-9862-afdec152d845",
		"_rev": "1-a6926aef09ba748839ed5e1d8b4147b0",
		"predefined_name": "thickness",
		"name": "Толщина",
		"shown": true,
		"sorting_field": 1088,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Толщина",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 3,
			"fraction": 0
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|ab0b2c88-afed-11e6-ae96-e1cd02504545",
		"_rev": "1-ff5ac3686c7a050e82fb8dca15d426e0",
		"predefined_name": "first_cost",
		"name": "Цена закупа",
		"shown": true,
		"sorting_field": 1099,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Цена закупа",
		"note": "Параметр для разовых заказных материалов. Используется во вставке в элемент. Позволяет указать цену плановой себестоимости заказной номенклатуры минуя документ установки цен",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 15,
			"fraction": 3
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|b056e3f7-6d20-11eb-8215-005056aafe4c",
		"_rev": "1-22bd89f57da6b75d7fa332d95fe85dd5",
		"predefined_name": "coloring_out",
		"name": "Площадь покр. снаружи",
		"shown": true,
		"sorting_field": 1235,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Площадь покр. снаружи",
		"tooltip": "Площадь покраски внешней стороны профиля в м² на  единицу хранения",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 15,
			"fraction": 3
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|b0be6362-e98d-11ed-bb06-8e955d21ad46",
		"_rev": "9-50b70f76482a6d6bf67dcae46c77e367",
		"name": "Пескоструйная обработка",
		"shown": true,
		"sorting_field": 1279,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Пескоструйная обработка",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 1,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.nom"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|b956fde0-e98d-11ed-bb06-8e955d21ad46",
		"_rev": "2-225e6280cd8cff85af588dbce336c894",
		"name": "Краска",
		"shown": true,
		"sorting_field": 1280,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Краска",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 2,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"boolean"
			]
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|be2f04fa-b61a-11e6-9862-afdec152d845",
		"_rev": "1-66ac789d6e02e3a0014c992b12a24606",
		"predefined_name": "clr_inset",
		"name": "Цвет вставки",
		"shown": true,
		"sorting_field": 1095,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Цвет вставки",
		"note": "Значение этого параметра рассчитывается автоматически, как цвет текущей дополнительной вставки. Его не нужно указывать в табчасти параметров",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.clrs"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|bf46e8dd-afd9-11e6-87ab-cc972957f346",
		"_rev": "1-30b2c1965fb797f1fcefe3c1d01a918b",
		"predefined_name": "width",
		"name": "Ширина",
		"shown": true,
		"sorting_field": 3,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Ширина",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": true,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 8,
			"fraction": 1
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|c11622de-25e7-46a3-9f00-e9b0c43440c5",
		"_rev": "2-6d886870d4821c3133fbd186fb989df6",
		"name": "Группа цен контрагента",
		"shown": true,
		"sorting_field": 26,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Группа цен контрагента",
		"destination": "62f459e7-167f-11e4-8251-bcaec53cf0fb",
		"tooltip": "Определяет группу ценообразованиея гонтрагента (например, 'Дилер 10%')",
		"is_extra_property": false,
		"include_to_description": false,
		"calculated": "938ee6aa-4b86-11e7-870b-dc334a70f245",
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.property_values",
				"cat.nom_prices_types"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|c4d3c240-a2e7-11ec-aa46-9c5fc529bf46",
		"_rev": "1-9d224840e2f8de37b9d062b5736ab311",
		"predefined_name": "elm_rectangular",
		"name": "Прямоугольность элемента",
		"shown": true,
		"sorting_field": 1264,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Прямоугольность элемента",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"boolean"
			]
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|d01d72ea-00fd-11e7-a520-b36ac823e84f",
		"_rev": "1-fdd87f5aa5007503424f0a2cc9074f3f",
		"predefined_name": "sz_lines",
		"name": "Размерные линии",
		"shown": true,
		"sorting_field": 1074,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Размерные линии",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"enm.sz_line_types"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|d143f70a-e98d-11ed-bb06-8e955d21ad46",
		"_rev": "5-21f4f2d17d4b3a9844ee2886beb446a9",
		"name": "Срезанный угол",
		"shown": true,
		"sorting_field": 1281,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Срезанный угол",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 2,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 11,
			"fraction": 1
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|e2624702-a2ea-11ec-aa46-9c5fc529bf46",
		"_rev": "1-46fede8bdb7d65aad079728aff6c391b",
		"predefined_name": "bounds_contains",
		"name": "Вхождение в габариты",
		"shown": true,
		"sorting_field": 1267,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 4,
		"caption": "Вхождение в габариты",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"enm.positions"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|ea7c5712-e98d-11ed-bb06-8e955d21ad46",
		"_rev": "2-f55418e6f7a7807f06dc661b5f73d3ad",
		"name": "Склейка УФ",
		"shown": true,
		"sorting_field": 1282,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Склейка УФ",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 2,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"boolean"
			]
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|ebafc656-472f-11ed-9611-84f1e8809c54",
		"_rev": "1-5d04fa48e1246317984af7873506f82d",
		"predefined_name": "layer_level",
		"name": "Уровень слоя",
		"shown": true,
		"sorting_field": 1270,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Уровень слоя",
		"note": "0 - рама, 1 - створка, 2 - створка в створке и т.д.",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 8,
			"fraction": 1
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|ef180c0d-6d20-11eb-8215-005056aafe4c",
		"_rev": "1-6fc7ae1bac50d12f027aac40de0aa3db",
		"predefined_name": "coloring_in",
		"name": "Площадь покр. изнутри",
		"shown": true,
		"sorting_field": 1236,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Площадь покр. изнутри",
		"tooltip": "Площадь покраски внутренней стороны профиля в м² на  единицу хранения",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 15,
			"fraction": 3
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|f1ec7cfb-1bb4-11e4-ab36-a745bf64a51e",
		"_rev": "1-166b27bd16ef188f69269ad1f9a94d3b",
		"name": "Физ. лицо",
		"shown": true,
		"sorting_field": 0,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Физ. лицо",
		"destination": "f54e7c19-1bb0-11e4-ab36-a745bf64a51e",
		"is_extra_property": true,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.individuals"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|f92a26c4-0135-11e6-8303-e67fda7f6b46",
		"_rev": "1-b5a23de106bd609c2d83be8f984bd4da",
		"predefined_name": "coloring",
		"name": "Площадь окраски",
		"shown": true,
		"sorting_field": 1237,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 0,
		"caption": "Площадь окраски",
		"destination": "10dbacea-0204-11e5-be50-d2bb8c030246",
		"tooltip": "Площадь окраски в м² на  единицу хранения",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"number"
			],
			"digits": 15,
			"fraction": 3
		},
		"class_name": "cch.properties"
	},
	{
		"_id": "cch.properties|fe0effea-f68e-11ea-bb4b-a3a00cb42f46",
		"_rev": "1-d15de17f7fa4bebe9424bf477c287a7e",
		"predefined_name": "permitted_sys",
		"name": "Разрешенные системы",
		"shown": true,
		"sorting_field": 1220,
		"available": true,
		"mandatory": false,
		"include_to_name": false,
		"list": 3,
		"caption": "Разрешенные системы",
		"is_extra_property": false,
		"include_to_description": false,
		"showcalc": false,
		"inheritance": 0,
		"captured": false,
		"editor": "00000000-0000-0000-0000-000000000000",
		"applying": [],
		"use": [],
		"hide": [],
		"type": {
			"types": [
				"cat.production_params"
			],
			"is_ref": true
		},
		"class_name": "cch.properties"
	}
]

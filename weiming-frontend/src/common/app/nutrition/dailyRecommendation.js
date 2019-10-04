const dailyRecommendedValues = {
    "sources": [
        "https://www.dsld.nlm.nih.gov/dsld/dailyvalue.jsp",
        "https://www.netrition.com/rdi_page.html"
    ],
    "nutrients": [
        [1003, {
            "unit": "g",
            "label": "Protein",
            "amount": 50,
            "type": "w"
        }],
        [1004, {
            "unit": "g",
            "label": "Total lipid (fat)",
            "amount": 65,
            "type": "w"
        }],
        [1005, {
            "unit": "g",
            "label": "Total carbohydrates",
            "amount": 300,
            "type": "w"
        }],
        [1079, {
            "unit": "g",
            "label": "Fiber, total dietary",
            "amount": 25,
            "type": "x"
        }],
        [1253, {
            "unit": "mg",
            "label": "Cholesterol",
            "amount": 300,
            "type": "x"
        }],
        [1258, {
            "unit": "g",
            "label": "Saturated fatty acids",
            "amount": 20,
            "type": "x"
        }],
        [1087, {
            "unit": "mg",
            "label": "Calcium, Ca",
            "amount": 1300,
            "type": "y"
        }],
        [1089, {
            "unit": "mg",
            "label": "Iron, Fe",
            "amount": 18,
            "type": "y"
        }],
        [1090, {
            "unit": "mg",
            "label": "Magnesium, Mg",
            "amount": 420,
            "type": "y"
        }],
        [1091, {
            "unit": "mg",
            "label": "Phosphorus, P",
            "amount": 1250,
            "type": "y"
        }],
        [1092, {
            "unit": "mg",
            "label": "Potassium, K",
            "amount": 4700,
            "type": "y"
        }],
        [1093, {
            "unit": "mg",
            "label": "Sodium, Na",
            "amount": 2400,
            "type": "y"
        }],
        [1095, {
            "unit": "mg",
            "label": "Zinc, Zn",
            "amount": 11,
            "type": "y"
        }],
        [1098, {
            "unit": "mg",
            "label": "Copper, Cu",
            "amount": 0.9,
            "type": "y"
        }],
        [1101, {
            "unit": "mg",
            "label": "Manganese, Mn",
            "amount": 2.3,
            "type": "y"
        }],
        [1103, {
            "unit": "µg",
            "label": "Selenium, Se",
            "amount": 55,
            "type": "y"
        }],
        [1165, {
            "unit": "mg",
            "label": "Thiamin",
            "amount": 1.2,
            "type": "y"
        }],
        [1166, {
            "unit": "mg",
            "label": "Riboflavin",
            "amount": 1.3,
            "type": "y"
        }],
        [1167, {
            "unit": "mg",
            "label": "Niacin",
            "amount": 16,
            "type": "y"
        }],
        [1170, {
            "unit": "mg",
            "label": "Pantothenic acid",
            "amount": 5,
            "type": "y"
        }],
        [1180, {
            "unit": "mg",
            "label": "Choline, total",
            "amount": 550,
            "type": "y"
        }],
        [1190, {
            "unit": "µg",
            "label": "Folate, DFE",
            "amount": 400,
            "type": "y"
        }],
        [1106, {
            "unit": "µg",
            "label": "Vitamin A, RAE",
            "amount": 900,
            "type": "z"
        }],
        [1109, {
            "unit": "mg",
            "label": "Vitamin E (alpha-tocopherol)",
            "amount": 15,
            "type": "z"
        }],
        [1114, {
            "unit": "µg",
            "label": "Vitamin D (D2 + D3)",
            "amount": 20,
            "type": "z"
        }],
        [1162, {
            "unit": "mg",
            "label": "Vitamin C, total ascorbic acid",
            "amount": 90,
            "type": "z"
        }],
        [1175, {
            "unit": "mg",
            "label": "Vitamin B-6",
            "amount": 1.7,
            "type": "z"
        }],
        [1178, {
            "unit": "µg",
            "label": "Vitamin B-12",
            "amount": 2.4,
            "type": "z"
        }],
        [1185, {
            "unit": "µg",
            "label": "Vitamin K (phylloquinone)",
            "amount": 120,
            "type": "z"
        }]
    ]
}

export default new Map(dailyRecommendedValues.nutrients);
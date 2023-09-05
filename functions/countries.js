const countries = [
  {
    name_en: "Afghanistan",
    name_es: "Afganistán",
    dial_code: "93",
    code: "AF",
    currency: 'PEN'
  },
  {
    name_en: "Albania",
    name_es: "Albania",
    dial_code: "355",
    code: "AL",
    currency: 'PEN'
  },
  {
    name_en: "Algeria",
    name_es: "Argelia",
    dial_code: "213",
    code: "DZ",
    currency: 'PEN'
  },
  {
    name_en: "AmericanSamoa",
    name_es: "Samoa Americana",
    dial_code: "1684",
    code: "AS",
    currency: 'PEN'
  },
  {
    name_en: "Andorra",
    name_es: "Andorra",
    dial_code: "376",
    code: "AD",
    currency: 'PEN'
  },
  {
    name_en: "Angola",
    name_es: "Angola",
    dial_code: "244",
    code: "AO",
    currency: 'PEN'
  },
  {
    name_en: "Anguilla",
    name_es: "Anguilla",
    dial_code: "1264",
    code: "AI",
    currency: 'PEN'
  },
  {
    name_en: "Antarctica",
    name_es: "Antártida",
    dial_code: "672",
    code: "AQ",
    currency: 'PEN'
  },
  {
    name_en: "Antigua and Barbuda",
    name_es: "Antigua y Barbuda",
    dial_code: "1268",
    code: "AG",
    currency: 'PEN'
  },
  {
    name_en: "Argentina",
    name_es: "Argentina",
    dial_code: "54",
    code: "AR",
    currency: 'PEN'
  },
  {
    name_en: "Armenia",
    name_es: "Armenia",
    dial_code: "374",
    code: "AM",
    currency: 'PEN'
  },
  {
    name_en: "Aruba",
    name_es: "Aruba",
    dial_code: "297",
    code: "AW",
    currency: 'PEN'
  },
  {
    name_en: "Australia",
    name_es: "Australia",
    dial_code: "61",
    code: "AU",
    currency: 'PEN'
  },
  {
    name_en: "Austria",
    name_es: "Austria",
    dial_code: "43",
    code: "AT",
    currency: 'PEN'
  },
  {
    name_en: "Azerbaijan",
    name_es: "Azerbaiyán",
    dial_code: "994",
    code: "AZ",
    currency: 'PEN'
  },
  {
    name_en: "Bahamas",
    name_es: "Bahamas",
    dial_code: "1242",
    code: "BS",
    currency: 'PEN'
  },
  {
    name_en: "Bahrain",
    name_es: "Baréin",
    dial_code: "973",
    code: "BH",
    currency: 'PEN'
  },
  {
    name_en: "Bangladesh",
    name_es: "Banglades",
    dial_code: "880",
    code: "BD",
    currency: 'PEN'
  },
  {
    name_en: "Barbados",
    name_es: "Barbados",
    dial_code: "1246",
    code: "BB",
    currency: 'PEN'
  },
  {
    name_en: "Belarus",
    name_es: "Bielorrusia",
    dial_code: "375",
    code: "BY",
    currency: 'PEN'
  },
  {
    name_en: "Belgium",
    name_es: "Bélgica",
    dial_code: "32",
    code: "BE",
    currency: 'PEN'
  },
  {
    name_en: "Belize",
    name_es: "Belice",
    dial_code: "501",
    code: "BZ",
    currency: 'PEN'
  },
  {
    name_en: "Benin",
    name_es: "Benin",
    dial_code: "229",
    code: "BJ",
    currency: 'PEN'
  },
  {
    name_en: "Bermuda",
    name_es: "Bermudas",
    dial_code: "1441",
    code: "BM",
    currency: 'PEN'
  },
  {
    name_en: "Bhutan",
    name_es: "Butan",
    dial_code: "975",
    code: "BT",
    currency: 'PEN'
  },
  {
    name_en: "Bolivia",
    name_es: "Bolivia",
    dial_code: "591",
    code: "BO",
    currency: 'PEN'
  },
  {
    name_en: "Bosnia and Herzegovina",
    name_es: "Bosnia-Herzegovina",
    dial_code: "387",
    code: "BA",
    currency: 'PEN'
  },
  {
    name_en: "Botswana",
    name_es: "Botsuana",
    dial_code: "267",
    code: "BW",
    currency: 'PEN'
  },
  {
    name_en: "Brazil",
    name_es: "Brasil",
    dial_code: "55",
    code: "BR",
    currency: 'PEN'
  },
  {
    name_en: "British Indian Ocean Territory",
    name_es: "Territorio Británico del Océano Índico",
    dial_code: "246",
    code: "IO",
    currency: 'PEN'
  },
  {
    name_en: "Brunei Darussalam",
    name_es: "Brunei",
    dial_code: "673",
    code: "BN",
    currency: 'PEN'
  },
  {
    name_en: "Bulgaria",
    name_es: "Bulgaria",
    dial_code: "359",
    code: "BG",
    currency: 'PEN'
  },
  {
    name_en: "Burkina Faso",
    name_es: "Burkina Faso",
    dial_code: "226",
    code: "BF",
    currency: 'PEN'
  },
  {
    name_en: "Burundi",
    name_es: "Burundi",
    dial_code: "257",
    code: "BI",
    currency: 'PEN'
  },
  {
    name_en: "Cambodia",
    name_es: "Camboya",
    dial_code: "855",
    code: "KH",
    currency: 'PEN'
  },
  {
    name_en: "Cameroon",
    name_es: "Camerún",
    dial_code: "237",
    code: "CM",
    currency: 'PEN'
  },
  {
    name_en: "Canada",
    name_es: "Canadá",
    dial_code: "1",
    code: "CA",
    currency: 'PEN'
  },
  {
    name_en: "Cape Verde",
    name_es: "Cabo Verde",
    dial_code: "238",
    code: "CV",
    currency: 'PEN'
  },
  {
    name_en: "Cayman Islands",
    name_es: "Islas Caimán",
    dial_code: " 345",
    code: "KY",
    currency: 'PEN'
  },
  {
    name_en: "Central African Republic",
    name_es: "República Centroafricana",
    dial_code: "236",
    code: "CF",
    currency: 'PEN'
  },
  {
    name_en: "Chad",
    name_es: "Chad",
    dial_code: "235",
    code: "TD",
    currency: 'PEN'
  },
  {
    name_en: "Chile",
    name_es: "Chile",
    dial_code: "56",
    code: "CL",
    currency: 'PEN'
  },
  {
    name_en: "China",
    name_es: "China",
    dial_code: "86",
    code: "CN",
    currency: 'PEN'
  },
  {
    name_en: "Christmas Island",
    name_es: "Isla de Navidad",
    dial_code: "61",
    code: "CX",
    currency: 'PEN'
  },
  {
    name_en: "Cocos (Keeling) Islands",
    name_es: "Islas Cocos",
    dial_code: "61",
    code: "CC",
    currency: 'PEN'
  },
  {
    name_en: "Colombia",
    name_es: "Colombia",
    dial_code: "57",
    code: "CO",
    currency: 'COP'
  },
  {
    name_en: "Comoros",
    name_es: "Comoras",
    dial_code: "269",
    code: "KM",
    currency: 'PEN'
  },
  {
    name_en: "Congo",
    name_es: "Congo",
    dial_code: "242",
    code: "CG",
    currency: 'PEN'
  },
  {
    name_en: "Congo, The Democratic Republic of the",
    name_es: "República Democrática del Congo",
    dial_code: "243",
    code: "CD",
    currency: 'PEN'
  },
  {
    name_en: "Cook Islands",
    name_es: "Islas Cook",
    dial_code: "682",
    code: "CK",
    currency: 'PEN'
  },
  {
    name_en: "Costa Rica",
    name_es: "Costa Rica",
    dial_code: "506",
    code: "CR",
    currency: 'PEN'
  },
  {
    name_en: "Cote d'Ivoire",
    name_es: "Costa de Marfil",
    dial_code: "225",
    code: "CI",
    currency: 'PEN'
  },
  {
    name_en: "Croatia",
    name_es: "Croacia",
    dial_code: "385",
    code: "HR",
    currency: 'PEN'
  },
  {
    name_en: "Cuba",
    name_es: "Cuba",
    dial_code: "53",
    code: "CU",
    currency: 'PEN'
  },
  {
    name_en: "Cyprus",
    name_es: "Chipre",
    dial_code: "537",
    code: "CY",
    currency: 'PEN'
  },
  {
    name_en: "Czechia",
    name_es: "Chequia",
    dial_code: "420",
    code: "CZ",
    currency: 'PEN'
  },
  {
    name_en: "Denmark",
    name_es: "Dinamarca",
    dial_code: "45",
    code: "DK",
    currency: 'PEN'
  },
  {
    name_en: "Djibouti",
    name_es: "Yibuti",
    dial_code: "253",
    code: "DJ",
    currency: 'PEN'
  },
  {
    name_en: "Dominica",
    name_es: "Dominica",
    dial_code: "1767",
    code: "DM",
    currency: 'PEN'
  },
  {
    name_en: "Dominican Republic",
    name_es: "República Dominicana",
    dial_code: "1849",
    code: "DO",
    currency: 'PEN'
  },
  {
    name_en: "Ecuador",
    name_es: "Ecuador",
    dial_code: "593",
    code: "EC",
    currency: 'PEN'
  },
  {
    name_en: "Egypt",
    name_es: "Egipto",
    dial_code: "20",
    code: "EG",
    currency: 'PEN'
  },
  {
    name_en: "El Salvador",
    name_es: "El Salvador",
    dial_code: "503",
    code: "SV",
    currency: 'PEN'
  },
  {
    name_en: "Equatorial Guinea",
    name_es: "Guinea Ecuatorial",
    dial_code: "240",
    code: "GQ",
    currency: 'PEN'
  },
  {
    name_en: "Eritrea",
    name_es: "Eritrea",
    dial_code: "291",
    code: "ER",
    currency: 'PEN'
  },
  {
    name_en: "Estonia",
    name_es: "Estonia",
    dial_code: "372",
    code: "EE",
    currency: 'PEN'
  },
  {
    name_en: "Ethiopia",
    name_es: "Etiopía",
    dial_code: "251",
    code: "ET",
    currency: 'PEN'
  },
  {
    name_en: "Falkland Islands (Malvinas)",
    name_es: "Islas Malvinas",
    dial_code: "500",
    code: "FK",
    currency: 'PEN'
  },
  {
    name_en: "Faroe Islands",
    name_es: "Islas Feroe",
    dial_code: "298",
    code: "FO",
    currency: 'PEN'
  },
  {
    name_en: "Fiji",
    name_es: "Fiyi",
    dial_code: "679",
    code: "FJ",
    currency: 'PEN'
  },
  {
    name_en: "Finland",
    name_es: "Finlandia",
    dial_code: "358",
    code: "FI",
    currency: 'PEN'
  },
  {
    name_en: "France",
    name_es: "Francia",
    dial_code: "33",
    code: "FR",
    currency: 'PEN'
  },
  {
    name_en: "French Guiana",
    name_es: "Guayana Francesa",
    dial_code: "594",
    code: "GF",
    currency: 'PEN'
  },
  {
    name_en: "French Polynesia",
    name_es: "Polinesia Francesa",
    dial_code: "689",
    code: "PF",
    currency: 'PEN'
  },
  {
    name_en: "Gabon",
    name_es: "Gabón",
    dial_code: "241",
    code: "GA",
    currency: 'PEN'
  },
  {
    name_en: "Gambia",
    name_es: "Gambia",
    dial_code: "220",
    code: "GM",
    currency: 'PEN'
  },
  {
    name_en: "Georgia",
    name_es: "Georgia",
    dial_code: "995",
    code: "GE",
    currency: 'PEN'
  },
  {
    name_en: "Germany",
    name_es: "Alemania",
    dial_code: "49",
    code: "DE",
    currency: 'PEN'
  },
  {
    name_en: "Ghana",
    name_es: "Ghana",
    dial_code: "233",
    code: "GH",
    currency: 'PEN'
  },
  {
    name_en: "Gibraltar",
    name_es: "Gibraltar",
    dial_code: "350",
    code: "GI",
    currency: 'PEN'
  },
  {
    name_en: "Greece",
    name_es: "Grecia",
    dial_code: "30",
    code: "GR",
    currency: 'PEN'
  },
  {
    name_en: "Greenland",
    name_es: "Groenlandia",
    dial_code: "299",
    code: "GL",
    currency: 'PEN'
  },
  {
    name_en: "Grenada",
    name_es: "Granada",
    dial_code: "1473",
    code: "GD",
    currency: 'PEN'
  },
  {
    name_en: "Guadeloupe",
    name_es: "Guadalupe",
    dial_code: "590",
    code: "GP",
    currency: 'PEN'
  },
  {
    name_en: "Guam",
    name_es: "Guam",
    dial_code: "1671",
    code: "GU",
    currency: 'PEN'
  },
  {
    name_en: "Guatemala",
    name_es: "Guatemala",
    dial_code: "502",
    code: "GT",
    currency: 'PEN'
  },
  {
    name_en: "Guernsey",
    name_es: "Guernsey",
    dial_code: "44",
    code: "GG",
    currency: 'PEN'
  },
  {
    name_en: "Guinea",
    name_es: "Guinea",
    dial_code: "224",
    code: "GN",
    currency: 'PEN'
  },
  {
    name_en: "Guinea-Bissau",
    name_es: "Guinea-Bisau",
    dial_code: "245",
    code: "GW",
    currency: 'PEN'
  },
  {
    name_en: "Guyana",
    name_es: "Guyana",
    dial_code: "595",
    code: "GY",
    currency: 'PEN'
  },
  {
    name_en: "Haiti",
    name_es: "Haití",
    dial_code: "509",
    code: "HT",
    currency: 'PEN'
  },
  {
    name_en: "Holy See (Vatican City State)",
    name_es: "Ciudad del Vaticano",
    dial_code: "379",
    code: "VA",
    currency: 'PEN'
  },
  {
    name_en: "Honduras",
    name_es: "Honduras",
    dial_code: "504",
    code: "HN",
    currency: 'PEN'
  },
  {
    name_en: "Hong Kong",
    name_es: "Hong Kong",
    dial_code: "852",
    code: "HK",
    currency: 'PEN'
  },
  {
    name_en: "Hungary",
    name_es: "Hungría",
    dial_code: "36",
    code: "HU",
    currency: 'PEN'
  },
  {
    name_en: "Iceland",
    name_es: "Islandia",
    dial_code: "354",
    code: "IS",
    currency: 'PEN'
  },
  {
    name_en: "India",
    name_es: "India",
    dial_code: "91",
    code: "IN",
    currency: 'PEN'
  },
  {
    name_en: "Indonesia",
    name_es: "Indonesia",
    dial_code: "62",
    code: "ID",
    currency: 'PEN'
  },
  {
    name_en: "Iran, Islamic Republic of",
    name_es: "Irán",
    dial_code: "98",
    code: "IR",
    currency: 'PEN'
  },
  {
    name_en: "Iraq",
    name_es: "Iraq",
    dial_code: "964",
    code: "IQ",
    currency: 'PEN'
  },
  {
    name_en: "Ireland",
    name_es: "Irlanda",
    dial_code: "353",
    code: "IE",
    currency: 'PEN'
  },
  {
    name_en: "Isle of Man",
    name_es: "Isla de Man",
    dial_code: "44",
    code: "IM",
    currency: 'PEN'
  },
  {
    name_en: "Israel",
    name_es: "Israel",
    dial_code: "972",
    code: "IL",
    currency: 'PEN'
  },
  {
    name_en: "Italy",
    name_es: "Italia",
    dial_code: "39",
    code: "IT",
    currency: 'PEN'
  },
  {
    name_en: "Jamaica",
    name_es: "Jamaica",
    dial_code: "1876",
    code: "JM",
    currency: 'PEN'
  },
  {
    name_en: "Japan",
    name_es: "Japón",
    dial_code: "81",
    code: "JP",
    currency: 'PEN'
  },
  {
    name_en: "Jersey",
    name_es: "Jersey",
    dial_code: "44",
    code: "JE",
    currency: 'PEN'
  },
  {
    name_en: "Jordan",
    name_es: "Jordania",
    dial_code: "962",
    code: "JO",
    currency: 'PEN'
  },
  {
    name_en: "Kazakhstan",
    name_es: "Kazajistán",
    dial_code: "7",
    code: "KZ",
    currency: 'PEN'
  },
  {
    name_en: "Kenya",
    name_es: "Kenia",
    dial_code: "254",
    code: "KE",
    currency: 'PEN'
  },
  {
    name_en: "Kiribati",
    name_es: "Kiribati",
    dial_code: "686",
    code: "KI",
    currency: 'PEN'
  },
  {
    name_en: "Korea, Democratic People's Republic of",
    name_es: "Corea del Norte",
    dial_code: "850",
    code: "KP",
    currency: 'PEN'
  },
  {
    name_en: "Korea, Republic of",
    name_es: "Corea del Sur",
    dial_code: "82",
    code: "KR",
    currency: 'PEN'
  },
  {
    name_en: "Kosovo",
    name_es: "Kosovo",
    dial_code: "383",
    code: "XK",
    currency: 'PEN'
  },
  {
    name_en: "Kuwait",
    name_es: "Kuwait",
    dial_code: "965",
    code: "KW",
    currency: 'PEN'
  },
  {
    name_en: "Kyrgyzstan",
    name_es: "Kirguistán",
    dial_code: "996",
    code: "KG",
    currency: 'PEN'
  },
  {
    name_en: "Lao People's Democratic Republic",
    name_es: "Laos",
    dial_code: "856",
    code: "LA",
    currency: 'PEN'
  },
  {
    name_en: "Latvia",
    name_es: "Letonia",
    dial_code: "371",
    code: "LV",
    currency: 'PEN'
  },
  {
    name_en: "Lebanon",
    name_es: "Líbano",
    dial_code: "961",
    code: "LB",
    currency: 'PEN'
  },
  {
    name_en: "Lesotho",
    name_es: "Lesoto",
    dial_code: "266",
    code: "LS",
    currency: 'PEN'
  },
  {
    name_en: "Liberia",
    name_es: "Liberia",
    dial_code: "231",
    code: "LR",
    currency: 'PEN'
  },
  {
    name_en: "Libyan Arab Jamahiriya",
    name_es: "Libia",
    dial_code: "218",
    code: "LY",
    currency: 'PEN'
  },
  {
    name_en: "Liechtenstein",
    name_es: "Liechtenstein",
    dial_code: "423",
    code: "LI",
    currency: 'PEN'
  },
  {
    name_en: "Lithuania",
    name_es: "Lituania",
    dial_code: "370",
    code: "LT",
    currency: 'PEN'
  },
  {
    name_en: "Luxembourg",
    name_es: "Luxemburgo",
    dial_code: "352",
    code: "LU",
    currency: 'PEN'
  },
  {
    name_en: "Macao",
    name_es: "Macao",
    dial_code: "853",
    code: "MO",
    currency: 'PEN'
  },
  {
    name_en: "Macedonia, The Former Yugoslav Republic of",
    name_es: "República de Macedonia",
    dial_code: "389",
    code: "MK",
    currency: 'PEN'
  },
  {
    name_en: "Madagascar",
    name_es: "Madagascar",
    dial_code: "261",
    code: "MG",
    currency: 'PEN'
  },
  {
    name_en: "Malawi",
    name_es: "Malaui",
    dial_code: "265",
    code: "MW",
    currency: 'PEN'
  },
  {
    name_en: "Malaysia",
    name_es: "Malasia",
    dial_code: "60",
    code: "MY",
    currency: 'PEN'
  },
  {
    name_en: "Maldives",
    name_es: "Maldivas",
    dial_code: "960",
    code: "MV",
    currency: 'PEN'
  },
  {
    name_en: "Mali",
    name_es: "Malí",
    dial_code: "223",
    code: "ML",
    currency: 'PEN'
  },
  {
    name_en: "Malta",
    name_es: "Malta",
    dial_code: "356",
    code: "MT",
    currency: 'PEN'
  },
  {
    name_en: "Marshall Islands",
    name_es: "Islas Marshall",
    dial_code: "692",
    code: "MH",
    currency: 'PEN'
  },
  {
    name_en: "Martinique",
    name_es: "Martinica",
    dial_code: "596",
    code: "MQ",
    currency: 'PEN'
  },
  {
    name_en: "Mauritania",
    name_es: "Mauritania",
    dial_code: "222",
    code: "MR",
    currency: 'PEN'
  },
  {
    name_en: "Mauritius",
    name_es: "Mauricio",
    dial_code: "230",
    code: "MU",
    currency: 'PEN'
  },
  {
    name_en: "Mayotte",
    name_es: "Mayotte",
    dial_code: "262",
    code: "YT",
    currency: 'PEN'
  },
  {
    name_en: "Mexico",
    name_es: "México",
    dial_code: "52",
    code: "MX",
    currency: 'MXN'
  },
  {
    name_en: "Micronesia, Federated States of",
    name_es: "Estados Federados de Micronesia",
    dial_code: "691",
    code: "FM",
    currency: 'PEN'
  },
  {
    name_en: "Moldova, Republic of",
    name_es: "Moldavia",
    dial_code: "373",
    code: "MD",
    currency: 'PEN'
  },
  {
    name_en: "Monaco",
    name_es: "Monaco",
    dial_code: "377",
    code: "MC",
    currency: 'PEN'
  },
  {
    name_en: "Mongolia",
    name_es: "Mongolia",
    dial_code: "976",
    code: "MN",
    currency: 'PEN'
  },
  {
    name_en: "Montenegro",
    name_es: "Montenegro",
    dial_code: "382",
    code: "ME",
    currency: 'PEN'
  },
  {
    name_en: "Montserrat",
    name_es: "Montserrat",
    dial_code: "1664",
    code: "MS",
    currency: 'PEN'
  },
  {
    name_en: "Morocco",
    name_es: "Marruecos",
    dial_code: "212",
    code: "MA",
    currency: 'PEN'
  },
  {
    name_en: "Mozambique",
    name_es: "Mozambique",
    dial_code: "258",
    code: "MZ",
    currency: 'PEN'
  },
  {
    name_en: "Myanmar",
    name_es: "Birmania",
    dial_code: "95",
    code: "MM",
    currency: 'PEN'
  },
  {
    name_en: "Namibia",
    name_es: "Namibia",
    dial_code: "264",
    code: "NA",
    currency: 'PEN'
  },
  {
    name_en: "Nauru",
    name_es: "Nauru",
    dial_code: "674",
    code: "NR",
    currency: 'PEN'
  },
  {
    name_en: "Nepal",
    name_es: "Nepal",
    dial_code: "977",
    code: "NP",
    currency: 'PEN'
  },
  {
    name_en: "Netherlands",
    name_es: "Holanda",
    dial_code: "31",
    code: "NL",
    currency: 'PEN'
  },
  {
    name_en: "Netherlands Antilles",
    name_es: "Antillas Holandesas",
    dial_code: "599",
    code: "AN",
    currency: 'PEN'
  },
  {
    name_en: "New Caledonia",
    name_es: "Nueva Caledonia",
    dial_code: "687",
    code: "NC",
    currency: 'PEN'
  },
  {
    name_en: "New Zealand",
    name_es: "Nueva Zelanda",
    dial_code: "64",
    code: "NZ",
    currency: 'PEN'
  },
  {
    name_en: "Nicaragua",
    name_es: "Nicaragua",
    dial_code: "505",
    code: "NI",
    currency: 'PEN'
  },
  {
    name_en: "Niger",
    name_es: "Niger",
    dial_code: "227",
    code: "NE",
    currency: 'PEN'
  },
  {
    name_en: "Nigeria",
    name_es: "Nigeria",
    dial_code: "234",
    code: "NG",
    currency: 'PEN'
  },
  {
    name_en: "Niue",
    name_es: "Niue",
    dial_code: "683",
    code: "NU",
    currency: 'PEN'
  },
  {
    name_en: "NorfolkIsland",
    name_es: "IslaNorfolk",
    dial_code: "672",
    code: "NF",
    currency: 'PEN'
  },
  {
    name_en: "NorthernMarianaIslands",
    name_es: "IslasMarianasdelNorte",
    dial_code: "1670",
    code: "MP",
    currency: 'PEN'
  },
  {
    name_en: "Norway",
    name_es: "Noruega",
    dial_code: "47",
    code: "NO",
    currency: 'PEN'
  },
  {
    name_en: "Oman",
    name_es: "Omán",
    dial_code: "968",
    code: "OM",
    currency: 'PEN'
  },
  {
    name_en: "Pakistan",
    name_es: "Pakistán",
    dial_code: "92",
    code: "PK",
    currency: 'PEN'
  },
  {
    name_en: "Palau",
    name_es: "Palaos",
    dial_code: "680",
    code: "PW",
    currency: 'PEN'
  },
  {
    name_en: "Panama",
    name_es: "Panamá",
    dial_code: "507",
    code: "PA",
    currency: 'PEN'
  },
  {
    name_en: "Papua New Guinea",
    name_es: "Papúa Nueva Guinea",
    dial_code: "675",
    code: "PG",
    currency: 'PEN'
  },
  {
    name_en: "Paraguay",
    name_es: "Paraguay",
    dial_code: "595",
    code: "PY",
    currency: 'PEN'
  },
  {
    name_en: "Peru",
    name_es: "Perú",
    dial_code: "51",
    code: "PE",
    currency: 'PEN'
  },
  {
    name_en: "Philippines",
    name_es: "Filipinas",
    dial_code: "63",
    code: "PH",
    currency: 'PEN'
  },
  {
    name_en: "Pitcairn",
    name_es: "Islas Pitcairn",
    dial_code: "872",
    code: "PN",
    currency: 'PEN'
  },
  {
    name_en: "Poland",
    name_es: "Polonia",
    dial_code: "48",
    code: "PL",
    currency: 'PEN'
  },
  {
    name_en: "Portugal",
    name_es: "Portugal",
    dial_code: "351",
    code: "PT",
    currency: 'PEN'
  },
  {
    name_en: "Puerto Rico",
    name_es: "Puerto Rico",
    dial_code: "1",
    code: "PR",
    currency: 'PEN'
  },
  {
    name_en: "Qatar",
    name_es: "Qatar",
    dial_code: "974",
    code: "QA",
    currency: 'PEN'
  },
  {
    name_en: "Romania",
    name_es: "Rumania",
    dial_code: "40",
    code: "RO",
    currency: 'PEN'
  },
  {
    name_en: "Russia",
    name_es: "Rusia",
    dial_code: "7",
    code: "RU",
    currency: 'PEN'
  },
  {
    name_en: "Rwanda",
    name_es: "Ruanda",
    dial_code: "250",
    code: "RW",
    currency: 'PEN'
  },
  {
    name_en: "Réunion",
    name_es: "Reunion",
    dial_code: "262",
    code: "RE",
    currency: 'PEN'
  },
  {
    name_en: "Saint Barthélemy",
    name_es: "San Bartolome",
    dial_code: "590",
    code: "BL",
    currency: 'PEN'
  },
  {
    name_en: "Saint Helena, Ascension and Tristan Da Cunha",
    name_es: "Santa Elena, Ascensión y Tristán de Acuña",
    dial_code: "290",
    code: "SH",
    currency: 'PEN'
  },
  {
    name_en: "Saint Kitts and Nevis",
    name_es: "San Cristóbal y Nieves",
    dial_code: "1869",
    code: "KN",
    currency: 'PEN'
  },
  {
    name_en: "Saint Lucia",
    name_es: "Santa Lucía",
    dial_code: "1758",
    code: "LC",
    currency: 'PEN'
  },
  {
    name_en: "Saint Martin",
    name_es: "Isla de San Martín",
    dial_code: "590",
    code: "MF",
    currency: 'PEN'
  },
  {
    name_en: "Saint Pierre and Miquelon",
    name_es: "San Pedro y Miquelon",
    dial_code: "508",
    code: "PM",
    currency: 'PEN'
  },
  {
    name_en: "Saint Vincent and the Grenadines",
    name_es: "San Vicente y las Granadinas",
    dial_code: "1784",
    code: "VC",
    currency: 'PEN'
  },
  {
    name_en: "Samoa",
    name_es: "Samoa",
    dial_code: "685",
    code: "WS",
    currency: 'PEN'
  },
  {
    name_en: "San Marino",
    name_es: "San Marino",
    dial_code: "378",
    code: "SM",
    currency: 'PEN'
  },
  {
    name_en: "Sao Tome and Principe",
    name_es: " Santo Tomé y Príncipe",
    dial_code: "239",
    code: "ST",
    currency: 'PEN'
  },
  {
    name_en: "Saudi Arabia",
    name_es: "Arabia Saudita",
    dial_code: "966",
    code: "SA",
    currency: 'PEN'
  },
  {
    name_en: "Senegal",
    name_es: "Senegal",
    dial_code: "221",
    code: "SN",
    currency: 'PEN'
  },
  {
    name_en: "Serbia",
    name_es: "Serbia",
    dial_code: "381",
    code: "RS",
    currency: 'PEN'
  },
  {
    name_en: "Seychelles",
    name_es: "Seychelles",
    dial_code: "248",
    code: "SC",
    currency: 'PEN'
  },
  {
    name_en: "Sierra Leone",
    name_es: "Sierra Leona",
    dial_code: "232",
    code: "SL",
    currency: 'PEN'
  },
  {
    name_en: "Singapore",
    name_es: "Singapur",
    dial_code: "65",
    code: "SG",
    currency: 'PEN'
  },
  {
    name_en: "Slovakia",
    name_es: "Eslovaquia",
    dial_code: "421",
    code: "SK",
    currency: 'PEN'
  },
  {
    name_en: "Slovenia",
    name_es: "Eslovenia",
    dial_code: "386",
    code: "SI",
    currency: 'PEN'
  },
  {
    name_en: "Solomon Islands",
    name_es: "Islas Salomón",
    dial_code: "677",
    code: "SB",
    currency: 'PEN'
  },
  {
    name_en: "Somalia",
    name_es: "Somalia",
    dial_code: "252",
    code: "SO",
    currency: 'PEN'
  },
  {
    name_en: "South Africa",
    name_es: "Sudáfrica",
    dial_code: "27",
    code: "ZA",
    currency: 'PEN'
  },
  {
    name_en: "South Sudan",
    name_es: "Sudán del Sur",
    dial_code: "211",
    code: "SS",
    currency: 'PEN'
  },
  {
    name_en: "Spain",
    name_es: "España",
    dial_code: "34",
    code: "ES",
    currency: 'PEN'
  },
  {
    name_en: "Sri Lanka",
    name_es: "Sri Lanka",
    dial_code: "94",
    code: "LK",
    currency: 'PEN'
  },
  {
    name_en: "State of Palestine",
    name_es: "Estado de Palestina",
    dial_code: "970",
    code: "PS",
    currency: 'PEN'
  },
  {
    name_en: "Sudan",
    name_es: "Sudán",
    dial_code: "249",
    code: "SD",
    currency: 'PEN'
  },
  {
    name_en: "Suriname",
    name_es: "Surinam",
    dial_code: "597",
    code: "SR",
    currency: 'PEN'
  },
  {
    name_en: "Svalbard and Jan Mayen",
    name_es: "Svalbard y Jan Mayen",
    dial_code: "47",
    code: "SJ",
    currency: 'PEN'
  },
  {
    name_en: "Swaziland",
    name_es: "Suazilandia",
    dial_code: "268",
    code: "SZ",
    currency: 'PEN'
  },
  {
    name_en: "Sweden",
    name_es: "Suecia",
    dial_code: "46",
    code: "SE",
    currency: 'PEN'
  },
  {
    name_en: "Switzerland",
    name_es: "Suiza",
    dial_code: "41",
    code: "CH",
    currency: 'PEN'
  },
  {
    name_en: "Syrian Arab Republic",
    name_es: "Siria",
    dial_code: "963",
    code: "SY",
    currency: 'PEN'
  },
  {
    name_en: "Taiwan, Province of China",
    name_es: "Taiwán",
    dial_code: "886",
    code: "TW",
    currency: 'PEN'
  },
  {
    name_en: "Tayikistan",
    name_es: "Tayikistán",
    dial_code: "992",
    code: "TJ",
    currency: 'PEN'
  },
  {
    name_en: "Tanzania, United Republic of",
    name_es: "Tanzania",
    dial_code: "255",
    code: "TZ",
    currency: 'PEN'
  },
  {
    name_en: "Thailand",
    name_es: "Tailandia",
    dial_code: "66",
    code: "TH",
    currency: 'PEN'
  },
  {
    name_en: "Timor-Leste",
    name_es: "Timor Oriental",
    dial_code: "670",
    code: "TL",
    currency: 'PEN'
  },
  {
    name_en: "Togo",
    name_es: "Togo",
    dial_code: "228",
    code: "TG",
    currency: 'PEN'
  },
  {
    name_en: "Tokelau",
    name_es: "Tokelau",
    dial_code: "690",
    code: "TK",
    currency: 'PEN'
  },
  {
    name_en: "Tonga",
    name_es: "Tonga",
    dial_code: "676",
    code: "TO",
    currency: 'PEN'
  },
  {
    name_en: "Trinidad and Tobago",
    name_es: "Trinidad y Tobago",
    dial_code: "1868",
    code: "TT",
    currency: 'PEN'
  },
  {
    name_en: "Tunisia",
    name_es: "Túnez",
    dial_code: "216",
    code: "TN",
    currency: 'PEN'
  },
  {
    name_en: "Turkey",
    name_es: "Turquía",
    dial_code: "90",
    code: "TR",
    currency: 'PEN'
  },
  {
    name_en: "Turkmenistan",
    name_es: "Turkmenistán",
    dial_code: "993",
    code: "TM",
    currency: 'PEN'
  },
  {
    name_en: "Turks and Caicos Islands",
    name_es: "Islas Turcas y Caicos",
    dial_code: "1649",
    code: "TC",
    currency: 'PEN'
  },
  {
    name_en: "Tuvalu",
    name_es: "Tuvalu",
    dial_code: "688",
    code: "TV",
    currency: 'PEN'
  },
  {
    name_en: "Uganda",
    name_es: "Uganda",
    dial_code: "256",
    code: "UG",
    currency: 'PEN'
  },
  {
    name_en: "Ukraine",
    name_es: "Ucrania",
    dial_code: "380",
    code: "UA",
    currency: 'PEN'
  },
  {
    name_en: "United Arab Emirates",
    name_es: "Emiratos Árabes Unidos",
    dial_code: "971",
    code: "AE",
    currency: 'PEN'
  },
  {
    name_en: "United Kingdom",
    name_es: "Reino Unido",
    dial_code: "44",
    code: "GB",
    currency: 'PEN'
  },
  {
    name_en: "United States",
    name_es: "Estados Unidos",
    dial_code: "1",
    code: "US",
    currency: 'PEN'
  },
  {
    name_en: "Uruguay",
    name_es: "Uruguay",
    dial_code: "598",
    code: "UY",
    currency: 'PEN'
  },
  {
    name_en: "Uzbekistan",
    name_es: "Uzbekistán",
    dial_code: "998",
    code: "UZ",
    currency: 'PEN'
  },
  {
    name_en: "Vanuatu",
    name_es: "Vanuatu",
    dial_code: "678",
    code: "VU",
    currency: 'PEN'
  },
  {
    name_en: "Venezuela, Bolivarian Republic of",
    name_es: "Venezuela",
    dial_code: "58",
    code: "VE",
    currency: 'PEN'
  },
  {
    name_en: "Vietnam",
    name_es: "Vietnam",
    dial_code: "84",
    code: "VN",
    currency: 'PEN'
  },
  {
    name_en: "Virgin Islands, British",
    name_es: "Islas Vírgenes Británicas",
    dial_code: "1284",
    code: "VG",
    currency: 'PEN'
  },
  {
    name_en: "Virgin Islands, U.S.",
    name_es: "Islas Vírgenes de los Estados Unidos",
    dial_code: "1340",
    code: "VI",
    currency: 'PEN'
  },
  {
    name_en: "Wallis and Futuna",
    name_es: "Wallis y Futuna",
    dial_code: "681",
    code: "WF",
    currency: 'PEN'
  },
  {
    name_en: "Yemen",
    name_es: "Yemen",
    dial_code: "967",
    code: "YE",
    currency: 'PEN'
  },
  {
    name_en: "Zambia",
    name_es: "Zambia",
    dial_code: "260",
    code: "ZM",
    currency: 'PEN'
  },
  {
    name_en: "Zimbabwe",
    name_es: "Zimbabue",
    dial_code: "263",
    code: "ZW",
    currency: 'PEN'
  },
  {
    name_en: "Åland Islands",
    name_es: "Åland",
    dial_code: "358",
    code: "AX",
    currency: 'PEN'
  }
]

const countriesData = countries
  .map(country => ({
    name: country.name_es,
    code: country.code,
    currency: country.currency,
    callingCode: country.dial_code
  }))

module.exports = countriesData

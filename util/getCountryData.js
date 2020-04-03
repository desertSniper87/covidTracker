var countryInfoApiStr = 'https://corona.lmao.ninja/countries';
var countries = [];
var yandexTranslateApiKey = "trnsl.1.1.20200401T105152Z.c158baf3f9648a92.4b26328c81790053e7a0071ac3cc39d96247eaac";
var yandexURL = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexTranslateApiKey}&lang=en-bn`;


d3.json(countryInfoApiStr).then((data) =>{
  data.forEach((d) => {
    var cInfo = {}
    cInfo.name_en = d.country;
    cInfo.iso2 = d.countryInfo.iso2;
    cInfo.iso3 = d.countryInfo.iso3;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", yandexURL + '&text=' + d.country, false ); // false for synchronous request
    xmlHttp.send( null );

    console.log(xmlHttp.responseText)

    cInfo.name = xmlHttp.responseText.text[0];
    countries.push(cInfo);
  })
});

console.log(countries);

var en_bn = [
  {
    "name_en": "USA",
    "name_bn": "আমেরিকা"
  },
  {
    "name_en": "Italy",
    "name_bn": "ইতালি"
  },
  {
    "name_en": "Spain",
    "name_bn": "স্পেন"
  },
  {
    "name_en": "Germany",
    "name_bn": "জার্মানি"
  },
  {
    "name_en": "France",
    "name_bn": "ফ্রান্স"
  },
  {
    "name_en": "Iran",
    "name_bn": "ইরান"
  },
  {
    "name_en": "UK",
    "name_bn": "ইউ"
  },
  {
    "name_en": "Switzerland",
    "name_bn": "সুইজারল্যান্ড"
  },
  {
    "name_en": "Belgium",
    "name_bn": "বেলজিয়াম"
  },
  {
    "name_en": "Turkey",
    "name_bn": "তুরস্ক"
  },
  {
    "name_en": "Netherlands",
    "name_bn": "নেদারল্যান্ডস"
  },
  {
    "name_en": "Austria",
    "name_bn": "অস্ট্রিয়া"
  },
  {
    "name_en": "S. Korea",
    "name_bn": "এস কোরিয়া"
  },
  {
    "name_en": "Canada",
    "name_bn": "কানাডা"
  },
  {
    "name_en": "Portugal",
    "name_bn": "পর্তুগাল"
  },
  {
    "name_en": "Brazil",
    "name_bn": "ব্রাজিল"
  },
  {
    "name_en": "Israel",
    "name_bn": "ইস্রায়েলের"
  },
  {
    "name_en": "Australia",
    "name_bn": "অস্ট্রেলিয়া"
  },
  {
    "name_en": "Norway",
    "name_bn": "নরওয়ে"
  },
  {
    "name_en": "Sweden",
    "name_bn": "সুইডেন"
  },
  {
    "name_en": "Czechia",
    "name_bn": "Czechia"
  },
  {
    "name_en": "Ireland",
    "name_bn": "আয়ারল্যান্ড"
  },
  {
    "name_en": "Malaysia",
    "name_bn": "মালয়েশিয়া"
  },
  {
    "name_en": "Denmark",
    "name_bn": "ডেনমার্ক"
  },
  {
    "name_en": "Russia",
    "name_bn": "রাশিয়া"
  },
  {
    "name_en": "Chile",
    "name_bn": "চিলি"
  },
  {
    "name_en": "Poland",
    "name_bn": "পোল্যান্ড"
  },
  {
    "name_en": "Philippines",
    "name_bn": "ফিলিপাইন"
  },
  {
    "name_en": "Ecuador",
    "name_bn": "ইকুয়েডর"
  },
  {
    "name_en": "Romania",
    "name_bn": "রুমানিয়া"
  },
  {
    "name_en": "Japan",
    "name_bn": "জাপান"
  },
  {
    "name_en": "Luxembourg",
    "name_bn": "লাক্সেমবার্গ"
  },
  {
    "name_en": "Pakistan",
    "name_bn": "পাকিস্তান"
  },
  {
    "name_en": "Thailand",
    "name_bn": "থাই"
  },
  {
    "name_en": "Indonesia",
    "name_bn": "ইন্দোনেশিয়া"
  },
  {
    "name_en": "India",
    "name_bn": "ভারত"
  },
  {
    "name_en": "Saudi Arabia",
    "name_bn": "সৌদি আরব"
  },
  {
    "name_en": "Finland",
    "name_bn": "ফিন্ল্যাণ্ড"
  },
  {
    "name_en": "South Africa",
    "name_bn": "দক্ষিন আফ্রিকা"
  },
  {
    "name_en": "Greece",
    "name_bn": "গ্রীস"
  },
  {
    "name_en": "Mexico",
    "name_bn": "মেক্সিকো"
  },
  {
    "name_en": "Panama",
    "name_bn": "পানামা"
  },
  {
    "name_en": "Iceland",
    "name_bn": "আইসলণ্ড"
  },
  {
    "name_en": "Dominican Republic",
    "name_bn": "ডোমিনিকান প্রজাতন্ত্র"
  },
  {
    "name_en": "Peru",
    "name_bn": "পেরু"
  },
  {
    "name_en": "Argentina",
    "name_bn": "আর্জেন্টিনা"
  },
  {
    "name_en": "Singapore",
    "name_bn": "সিঙ্গাপুর"
  },
  {
    "name_en": "Colombia",
    "name_bn": "কলোমবিয়া"
  },
  {
    "name_en": "Serbia",
    "name_bn": "সার্বিয়া"
  },
  {
    "name_en": "Croatia",
    "name_bn": "ক্রোয়েশিয়া"
  },
  {
    "name_en": "Slovenia",
    "name_bn": "স্লোভেনিয়া"
  },
  {
    "name_en": "Qatar",
    "name_bn": "কাতার"
  },
  {
    "name_en": "Estonia",
    "name_bn": "এস্তোনিয়া"
  },
  {
    "name_en": "Hong Kong",
    "name_bn": "হংকং"
  },
  {
    "name_en": "Algeria",
    "name_bn": "আলজেরিয়া"
  },
  {
    "name_en": "Diamond Princess",
    "name_bn": "ডায়মন্ড প্রিন্সেস"
  },
  {
    "name_en": "Egypt",
    "name_bn": "মিশর"
  },
  {
    "name_en": "New Zealand",
    "name_bn": "নিউজিল্যান্ড"
  },
  {
    "name_en": "Iraq",
    "name_bn": "ইরাক"
  },
  {
    "name_en": "Ukraine",
    "name_bn": "ইউক্রেন"
  },
  {
    "name_en": "UAE",
    "name_bn": "সংযুক্ত আরব আমিরাতের"
  },
  {
    "name_en": "Morocco",
    "name_bn": "মরক্কো"
  },
  {
    "name_en": "Lithuania",
    "name_bn": "লিত্ভা"
  },
  {
    "name_en": "Armenia",
    "name_bn": "আর্মেনিয়া"
  },
  {
    "name_en": "Bahrain",
    "name_bn": "বাহরাইন"
  },
  {
    "name_en": "Hungary",
    "name_bn": "হাঙ্গেরি"
  },
  {
    "name_en": "Lebanon",
    "name_bn": "লেবাননের"
  },
  {
    "name_en": "Bosnia and Herzegovina",
    "name_bn": "বসনিয়া ও হার্জেগোভিনা"
  },
  {
    "name_en": "Latvia",
    "name_bn": "লাত্ভিয়া"
  },
  {
    "name_en": "Bulgaria",
    "name_bn": "বুলগেরিয়া"
  },
  {
    "name_en": "Slovakia",
    "name_bn": "শ্লোভাকিয়া"
  },
  {
    "name_en": "Tunisia",
    "name_bn": "টিউনিস্"
  },
  {
    "name_en": "Andorra",
    "name_bn": "এ্যান্ডোরা"
  },
  {
    "name_en": "Kazakhstan",
    "name_bn": "কাজাকস্থান"
  },
  {
    "name_en": "Moldova",
    "name_bn": "মোল্দাভিয়া"
  },
  {
    "name_en": "Costa Rica",
    "name_bn": "কোস্টারিকা"
  },
  {
    "name_en": "Uruguay",
    "name_bn": "উরুগুয়ে"
  },
  {
    "name_en": "North Macedonia",
    "name_bn": "উত্তর ম্যাসেডোনিয়া"
  },
  {
    "name_en": "Taiwan",
    "name_bn": "তাইওয়ান"
  },
  {
    "name_en": "Kuwait",
    "name_bn": "কুয়েত"
  },
  {
    "name_en": "Azerbaijan",
    "name_bn": "আজারবাইজান"
  },
  {
    "name_en": "Jordan",
    "name_bn": "জর্ডান"
  },
  {
    "name_en": "Cyprus",
    "name_bn": "সাইপ্রাস"
  },
  {
    "name_en": "Burkina Faso",
    "name_bn": "বুর্কিনা ফাসো"
  },
  {
    "name_en": "Réunion",
    "name_bn": "রিইউনিয়ন"
  },
  {
    "name_en": "Albania",
    "name_bn": "আলবেনিয়া"
  },
  {
    "name_en": "San Marino",
    "name_bn": "সান মারিনো"
  },
  {
    "name_en": "Cameroon",
    "name_bn": "ক্যামেরুন"
  },
  {
    "name_en": "Vietnam",
    "name_bn": "ভিয়েতনাম"
  },
  {
    "name_en": "Oman",
    "name_bn": "ওমান"
  },
  {
    "name_en": "Afghanistan",
    "name_bn": "আফগানিস্তান"
  },
  {
    "name_en": "Ghana",
    "name_bn": "ঘানা"
  },
  {
    "name_en": "Cuba",
    "name_bn": "কিউবা"
  },
  {
    "name_en": "Ivory Coast",
    "name_bn": "আইভরি কোস্ট"
  },
  {
    "name_en": "Senegal",
    "name_bn": "সেনেগাল"
  },
  {
    "name_en": "Uzbekistan",
    "name_bn": "উজ্বেকিস্থান"
  },
  {
    "name_en": "Faeroe Islands",
    "name_bn": "ফেরো দ্বীপপুঞ্জ"
  },
  {
    "name_en": "Honduras",
    "name_bn": "হন্ডুরাস"
  },
  {
    "name_en": "Malta",
    "name_bn": "মাল্টা"
  },
  {
    "name_en": "Belarus",
    "name_bn": "বেলারুশ"
  },
  {
    "name_en": "Channel Islands",
    "name_bn": "চ্যানেল দ্বীপপুঞ্জ"
  },
  {
    "name_en": "Mauritius",
    "name_bn": "মরিশাস"
  },
  {
    "name_en": "Venezuela",
    "name_bn": "ভেনেজুয়েলা"
  },
  {
    "name_en": "Sri Lanka",
    "name_bn": "শ্রীলংকা"
  },
  {
    "name_en": "Nigeria",
    "name_bn": "নাইজেরিয়া"
  },
  {
    "name_en": "Palestine",
    "name_bn": "প্যালেস্টাইন"
  },
  {
    "name_en": "Brunei",
    "name_bn": "ব্রুনেই"
  },
  {
    "name_en": "Martinique",
    "name_bn": "মার্টিনিক"
  },
  {
    "name_en": "Montenegro",
    "name_bn": "মন্টিনিগ্রো"
  },
  {
    "name_en": "Bolivia",
    "name_bn": "বলিভিয়া"
  },
  {
    "name_en": "Georgia",
    "name_bn": "জর্জিয়া"
  },
  {
    "name_en": "Guadeloupe",
    "name_bn": "গুয়াডেলোপ"
  },
  {
    "name_en": "Kyrgyzstan",
    "name_bn": "কিরগিজস্তান"
  },
  {
    "name_en": "DRC",
    "name_bn": "ডি আর সি"
  },
  {
    "name_en": "Cambodia",
    "name_bn": "কাম্বোজ"
  },
  {
    "name_en": "Mayotte",
    "name_bn": "মায়োত্তে"
  },
  {
    "name_en": "Trinidad and Tobago",
    "name_bn": "ত্রিনিদাদ ও টোবাগো"
  },
  {
    "name_en": "Rwanda",
    "name_bn": "রুয়ান্ডা"
  },
  {
    "name_en": "Paraguay",
    "name_bn": "প্যারাগুয়ে"
  },
  {
    "name_en": "Gibraltar",
    "name_bn": "জিব্রাল্টার"
  },
  {
    "name_en": "Liechtenstein",
    "name_bn": "লিচেনস্টেইন"
  },
  {
    "name_en": "Isle of Man",
    "name_bn": "আইল অফ ম্যান"
  },
  {
    "name_en": "Kenya",
    "name_bn": "কেনিয়া"
  },
  {
    "name_en": "Madagascar",
    "name_bn": "মাদাগাস্কার"
  },
  {
    "name_en": "Aruba",
    "name_bn": "আরুবা"
  },
  {
    "name_en": "Bangladesh",
    "name_bn": "বাংলাদেশ"
  },
  {
    "name_en": "Monaco",
    "name_bn": "মোনাকো"
  },
  {
    "name_en": "French Guiana",
    "name_bn": "একটি দেশের নাম"
  },
  {
    "name_en": "Uganda",
    "name_bn": "উগান্ডা"
  },
  {
    "name_en": "Macao",
    "name_bn": "ম্যাকাও"
  },
  {
    "name_en": "Guatemala",
    "name_bn": "গুয়াতেমালা"
  },
  {
    "name_en": "Jamaica",
    "name_bn": "জামাইকা"
  },
  {
    "name_en": "French Polynesia",
    "name_bn": "ফরাসি পলিনেশিয়া"
  },
  {
    "name_en": "Zambia",
    "name_bn": "জাম্বিয়া"
  },
  {
    "name_en": "Niger",
    "name_bn": "নাইজার"
  },
  {
    "name_en": "Togo",
    "name_bn": "যাও"
  },
  {
    "name_en": "Barbados",
    "name_bn": "বার্বাডোস"
  },
  {
    "name_en": "El Salvador",
    "name_bn": "এল সালভাদর"
  },
  {
    "name_en": "Bermuda",
    "name_bn": "বারমুডা"
  },
  {
    "name_en": "Djibouti",
    "name_bn": "জিবুতি"
  },
  {
    "name_en": "Ethiopia",
    "name_bn": "ইথিওপিয়া"
  },
  {
    "name_en": "Mali",
    "name_bn": "মালি"
  },
  {
    "name_en": "Guinea",
    "name_bn": "গিনি"
  },
  {
    "name_en": "Tanzania",
    "name_bn": "তাঞ্জানিয়া"
  },
  {
    "name_en": "Congo",
    "name_bn": "কঙ্গো"
  },
  {
    "name_en": "Gabon",
    "name_bn": "গ্যাবন"
  },
  {
    "name_en": "Maldives",
    "name_bn": "মালদ্বীপ"
  },
  {
    "name_en": "Saint Martin",
    "name_bn": "সেন্ট মার্টিন"
  },
  {
    "name_en": "Haiti",
    "name_bn": "হাইতি"
  },
  {
    "name_en": "New Caledonia",
    "name_bn": "নতুন ক্যালেডোনিয়া"
  },
  {
    "name_en": "Myanmar",
    "name_bn": "মায়ানমার"
  },
  {
    "name_en": "Bahamas",
    "name_bn": "বাহামা"
  },
  {
    "name_en": "Equatorial Guinea",
    "name_bn": "নিরক্ষীয় গিনি"
  },
  {
    "name_en": "Eritrea",
    "name_bn": "ইরিত্রিয়া"
  },
  {
    "name_en": "Cayman Islands",
    "name_bn": "কেম্যান দ্বীপপুঞ্জ"
  },
  {
    "name_en": "Mongolia",
    "name_bn": "মঙ্গোলিয়া"
  },
  {
    "name_en": "Saint Lucia",
    "name_bn": "সেন্ট লুসিয়া"
  },
  {
    "name_en": "Guyana",
    "name_bn": "গায়ানা"
  },
  {
    "name_en": "Dominica",
    "name_bn": "ডোমিনিকা"
  },
  {
    "name_en": "Curaçao",
    "name_bn": "কিউরাসাও"
  },
  {
    "name_en": "Namibia",
    "name_bn": "নামিবিয়া"
  },
  {
    "name_en": "Syria",
    "name_bn": "সিরিয়া"
  },
  {
    "name_en": "Greenland",
    "name_bn": "গ্রীনল্যান্ড"
  },
  {
    "name_en": "Laos",
    "name_bn": "লাওস"
  },
  {
    "name_en": "Libya",
    "name_bn": "লিবিয়া"
  },
  {
    "name_en": "Seychelles",
    "name_bn": "সিসিলি"
  },
  {
    "name_en": "Suriname",
    "name_bn": "সুরিনাম"
  },
  {
    "name_en": "Benin",
    "name_bn": "বেনিন"
  },
  {
    "name_en": "Grenada",
    "name_bn": "গ্রেনাডা"
  },
  {
    "name_en": "Eswatini",
    "name_bn": "Eswatini"
  },
  {
    "name_en": "Zimbabwe",
    "name_bn": "জিম্বাবুয়ে"
  },
  {
    "name_en": "Guinea-Bissau",
    "name_bn": "গিনি-বিসাউ"
  },
  {
    "name_en": "Mozambique",
    "name_bn": "মোজাম্বিক"
  },
  {
    "name_en": "Saint Kitts and Nevis",
    "name_bn": "সেন্ট কিটস ও নেভিস"
  },
  {
    "name_en": "Angola",
    "name_bn": "অ্যাঙ্গোলা"
  },
  {
    "name_en": "Sudan",
    "name_bn": "সুদান"
  },
  {
    "name_en": "Antigua and Barbuda",
    "name_bn": "অ্যান্টিগুয়া ও বার্বুডা"
  },
  {
    "name_en": "Chad",
    "name_bn": "চাদ"
  },
  {
    "name_en": "Cabo Verde",
    "name_bn": "ক্যাবো ভার্দে"
  },
  {
    "name_en": "Mauritania",
    "name_bn": "মরিতানিয়া"
  },
  {
    "name_en": "Vatican City",
    "name_bn": "ভ্যাটিকান সিটি"
  },
  {
    "name_en": "Liberia",
    "name_bn": "লাইবেরিয়া"
  },
  {
    "name_en": "St. Barth",
    "name_bn": "সেন্ট বার্থ"
  },
  {
    "name_en": "Sint Maarten",
    "name_bn": "সিন্ট মার্টেন"
  },
  {
    "name_en": "Nicaragua",
    "name_bn": "নিকারাগুয়া"
  },
  {
    "name_en": "Nepal",
    "name_bn": "নেপাল"
  },
  {
    "name_en": "Fiji",
    "name_bn": "ফিজি"
  },
  {
    "name_en": "Montserrat",
    "name_bn": "মন্টসেরাট"
  },
  {
    "name_en": "Somalia",
    "name_bn": "সোমালিয়া"
  },
  {
    "name_en": "Turks and Caicos",
    "name_bn": "টার্কস এবং কাইকোস"
  },
  {
    "name_en": "Botswana",
    "name_bn": "বতসোয়ানা"
  },
  {
    "name_en": "Gambia",
    "name_bn": "গাম্বিয়া"
  },
  {
    "name_en": "Bhutan",
    "name_bn": "ভুটান"
  },
  {
    "name_en": "Belize",
    "name_bn": "বেলিজ"
  },
  {
    "name_en": "British Virgin Islands",
    "name_bn": "ব্রিটিশ ভার্জিন দ্বীপপুঞ্জ"
  },
  {
    "name_en": "CAR",
    "name_bn": "গাড়িতে"
  },
  {
    "name_en": "MS Zaandam",
    "name_bn": "এমএস জায়ানদাম"
  },
  {
    "name_en": "Anguilla",
    "name_bn": "এ্যাঙ্গুইলা"
  },
  {
    "name_en": "Burundi",
    "name_bn": "বুরুন্ডি"
  },
  {
    "name_en": "Caribbean Netherlands",
    "name_bn": "ক্যারিবিয়ান নেদারল্যান্ডস"
  },
  {
    "name_en": "Papua New Guinea",
    "name_bn": "পাপুয়া নিউ গিনি"
  },
  {
    "name_en": "St. Vincent Grenadines",
    "name_bn": "সেন্ট ভিনসেন্ট গ্রেনাডাইনস"
  },
  {
    "name_en": "Sierra Leone",
    "name_bn": "সিয়েরা লিওন"
  },
  {
    "name_en": "Timor-Leste",
    "name_bn": "পূর্ব তিমুর"
  },
  {
    "name_en": "China",
    "name_bn": "চীন"
  }
]



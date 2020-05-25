#!/usr/bin/env python
# coding: utf-8

# In[20]:


iedcr2bcc_district = {
    "B. Baria": "Brahamanbaria",
    "Barishal": "Barisal",
    "Chattogram": "Chittagong",
    "Cox’s bazar": "Cox's Bazar",
    "Coxsbazar": "Cox's Bazar",
    "Cumilla": "Comilla",
    "Hobiganj": "Habiganj",
    "Jhalokathi": "Jhalokati",
    "Khagrachari": "Khagrachhari",
    "Laksmipur": "Lakshmipur",
    "Moulovi Bazar": "Maulvibazar",
    "Munshigonj": "Munshiganj",
    "Narshingdi": "Narsingdi",
    "Netrokona": "Netrakona",
    "Panchagar": "Panchagarh",
    "Potuakhali": "Patuakhali",
    "Rangmati": "Rangamati",
    "Chapainawabganj": "Nawabganj"
}

# arcGis_district_url = "https://services3.arcgis.com/nIl76MjbPamkQiu8/arcgis/rest/services/districts_wise_corona_data/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=confirmed%20desc&outSR=102100&resultOffset=0&resultRecordCount=64&resultType=standard&cacheHint=true"
arcGis_district_url = "https://services3.arcgis.com/nIl76MjbPamkQiu8/arcgis/rest/services/districts_wise_corona_data/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&maxRecordCountFactor=4&orderByFields=confirmed%20DESC&outSR=102100&resultOffset=0&resultRecordCount=8000&cacheHint=true&quantizationParameters=%7B%22mode%22%3A%22view%22%2C%22originPosition%22%3A%22upperLeft%22%2C%22tolerance%22%3A1.0583354500042312%2C%22extent%22%3A%7B%22xmin%22%3A9826319.17328554%2C%22ymin%22%3A2444041.9364330745%2C%22xmax%22%3A10283573.777836105%2C%22ymax%22%3A3040113.3163954075%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D%7D"


# In[21]:


import requests

district_response = requests.get(arcGis_district_url)


# In[22]:


import json
from pprint import pprint
from collections import OrderedDict

district_json = json.loads(district_response.text)
district_confirm_dict = OrderedDict()

dhaka_city_count = 0
for attr in district_json['features']:
    name = attr['attributes']['name']
    confirmed = attr['attributes']['confirmed']
    if name in ['Dhaka City', 'Dhaka (District)']:
        dhaka_city_count += confirmed
    elif name in iedcr2bcc_district.keys():
        district_confirm_dict[iedcr2bcc_district[name]] = confirmed
    else:
        district_confirm_dict[name] = confirmed

district_confirm_dict['Dhaka'] = dhaka_city_count
        
print("Number of districts", len(district_confirm_dict))    
pprint(district_confirm_dict)


# In[23]:


from pathlib import Path

date = 22
month = 'may'
month_n = 5

dir_path = f"./{month}/{date}"
try:
    Path(dir_path).mkdir()
except FileExistsError:
    print('File exists')
f_dist = open(f"{dir_path}/data.csv", "w+")


for d in district_confirm_dict:
    f_dist.write(d + ',,' + str(district_confirm_dict[d]) + "\n")

f_dist.close()


# In[24]:


import json
import copy
from pprint import pprint

base_json = json.load(open('base.json'))
final_json = copy.deepcopy(base_json)

for fx, f in enumerate(base_json['features']):
#     print(fx, f)
    key = f['properties']['key']
    final_json['features'][fx]['properties']['confirmed'] = str(district_confirm_dict[key])
    
with open(f'{dir_path}/district.txt', 'w+') as f:
    json.dump(final_json, f, ensure_ascii=False)


# In[15]:


en2bn_dhk_area = {
    "Abdullahpur": "আব্দুল্লাহপুর",
    "Adabor": "আদাবর",
    "Aftabnagar": "আফতাবনগর",
    "Agargaon": "আগারগাঁও",
    "Ahmed Nagar": "আহমেদনগর",
    "Ahmedabag": "আহমেদাবাগ",
    "Aminbazar": "আমিনবাজার",
    "Amlapara": "আমলাপাড়া",
    "Armanitola": "আরমানিটোলা",
    "Arambagh": "আরামবাগ",
    "Asad Gate": "আসাদগেট",
    "Ashkona": "আশকোনা",
    "Ashulia": "আশুলিয়া",
    "Azimpur": "আজিমপুর",
    "Babu Bazar": "বাবু বাজার",
    "Bahadur Bazar": "বাহাদুর বাজার",
    "Badda": "বাড্ডা",
    "Baily Road": "বেইলি রোড",
    "Bakshibazar": "বকশিবাজার",
    "Baridhara": "বারিধারা",
    "Banasree": "বনশ্রী",
    "Banani": "বনানী",
    "Banglamotor": "বাংলামটর",
    "Bangshal": "বংশাল",
    "Banianagar": "বানিয়ানগর",
    "Basabo": "বাসাবো",
    "Bijoynagar": "বিজয়নগর",
    "Bashundhora": "বসুন্ধরা",
    "Begunbari": "বেগুনবাড়ি",
    "Begum Bazar": "বেগম বাজার",
    "Beribadh": "বেড়িবাঁধ",
    "Bokshi Bazar": "বকশি বাজার",
    "Bosila": "বসিলা",
    "Buet Area": "বুয়েট এলাকা",
    "Cantonment": "ঢাকা সেনানিবাস",
    "Central Road": "সেন্ট্রাল রোড",
    "Chankharpool": "চাঁনখারপুল",
    "Chawk Bazar": "চক বাজার",
    "Dania": "দনিয়া",
    "Dakshinkhan": "দক্ষিণখান",
    "Dhakkeshori": "ঢাকেশ্বরী",
    "Demra": "ডেমরা",
    "Dhanmondi": "ধানমন্ডি",
    "Dholaikhal": "ধোলাইখাল",
    "Dholaipar": "ধোলাইপাড়",
    "Dhalpur": "ধলপুর", 
    "Doyaganj": "দয়াগঞ্জ",
    "Elephant Road": "এলিফ্যান্ট রোড",
    "Eskaton": "ইস্কাটন",
    "Faridabagh": "ফরিদাবাদ",
    "Fakirapool": "ফকিরাপুল",
    "Farmgate": "ফার্মগেট",
    "Fulbaria": "ফুলবাড়িয়া",
    "Farasganj": "ফরাশগঞ্জ",
    "Farashganj": "ফরাশগঞ্জ",
    "Forasganj": "ফরাশগঞ্জ",
    "Forashganj": "ফরাশগঞ্জ",
    "Gendaria": "গেন্ডারিয়া",
    "Gausia": "গাওছিয়া",
    "Gabtoli": "গাবতলী",
    "Golartek": "গোলারটেক",
    "Goran": "গোরান",
    "Gonoktuli": "গণকটুলি",
    "Gopibag": "গোপীবাগ",
    "Golapbagh": "গোলাপবাগ",
    "Green Road": "গ্রীন রোড",
    "Gulistan": "গুলিস্তান",
    "Gulshan": "গুলশান",
    "Hajipara": "হাজীপাড়া",
    "Hatkhula": "হাটখোলা",
    "Hatir jhil": "হাতিরঝিল",
    "Hatirpool": "হাতিরপুল",
    "Hazaribagh": "হাজারীবাগ",
    "Ibrahimpur": "ইব্রাহীমপুর",
    "Indira Road": "ইন্দিরা রোড",
    "Islambagh": "ইসলাামবাগ",
    "Islampur": "ইসলামপুর",
    "Jailgate": "জেলগেট",
    "Jatrabari": "যাত্রাবাড়ী",
    "Jigatala": "জিগাতলা",
    "Jinjira": "জিঞ্জিরা",
    "Jurain": "জুরাইন",
    "kajla": "কাজলা", 
    "Kafrul": "কাফরুল", 
    "Kallyanpur": "কল্যাণপুর",
    "Kalabagan": "কলাবাগান",
    "Kakrail": "কাকরাইল",
    "Kathalbagan": "কাঁঠালবাগান",
    "Kamalapur": "কমলাপুর",
    "Kamrangir Char": "কামরাঙ্গীর চর",
    "Kazi para": "কাজীপাড়া",
    "Kawran Bazar": "কাওরান বাজার",
    "Koratitola": "করাতিটোলা",
    "Kochukhet": "কচুক্ষেত",
    "Khilgaon": "খিলগাঁও",
    "Khilkhet": "খিলক্ষেত",
    "Koltabazar": "কলতাবাজার",
    "Kodomtoli": "কদমতলি",
    "Kosaituli": "কসাইটুলী",
    "Kotowali": "কোতোয়ালী",
    "Kuril": "কুড়িল",
    "Kutubkhali": "কুতুবখালি",
    "Lalmatia": "লালমাটিয়া",
    "Lalbagh": "লালবাগ",
    "Laxmibazar": "লক্ষ্মীবাজার",
    "Madartek": "মাদারটেক",
    "Malitola": "মালিটোলা",
    "Malibagh": "মালিবাগ",
    "Maniknagar": "মানিকনগর",
    "Manda": "মানডা",
    "Manikdi": "মানিকদি",
    "Matuail": "মাতুয়াইল",
    "Matikata": "মাটিকাটা",
    "Merul": "মেরুল", 
    "Meradia": "মেরাদিয়া", 
    "Mintu Road": "মিন্টু রোড", 
    "Mirhajaribagh": "মীরহাজারিবাগ",
    "Mirpur": "মিরপুর",
    "Mirpur-1": "মিরপুর-১",
    "Mirpur-2": "মিরপুর-২",
    "Mirpur-6": "মিরপুর-৬",
    "Mirpur 7": "মিরপুর-৭",
    "Mirpur-7": "মিরপুর-৭",
    "Mirpur-10": "মিরপুর-১০",
    "Mirpur-11": "মিরপুর-১১",
    "Mirpur-12": "মিরপুর-১২",
    "Mirpur-13": "মিরপুর-১৩",
    "Mirpur-14": "মিরপুর-১৪",
    "Mitford": "মিটফোর্ড",
    "Mogbazar": "মগবাজার",
    "Monipur": "মনিপুর",
    "Mohakhali": "মহাখালী",
    "Mohonpur": "মোহনপুর",
    "Mohammadpur": "মোহাম্মাদপুর",
    "Motijeel": "মতিঝিল",
    "Mugda": "মুগদা",
    "Nawabpur": "নবাবপুর",
    "New market": "নিউমার্কেট",
    "Nazirabazar": "নাজিরাবাজার",
    "Nawabganj": "নবাবগঞ্জ",
    "Narinda": "নারিন্দা",
    "Nilkhet": "নীলক্ষেত",
    "Nandi Para": "নন্দীপাড়া",
    "Nakhalpara": "নাখালপাড়া",
    "Nayabazar": "নয়াবাজার",
    "Neemtoli": "নিমতলী",
    "Nikunja": "নিকুঞ্জ",
    "Niketon": "নিকেতন",
    "Paikpara": "পাইকপাড়া",
    "Panthapath": "পান্থপথ",
    "Paltan": "পল্টন", 
    "Pallabi": "পল্লবী",
    "Pirerbagh": "পীরেরবাগ",
    "Poribagh": "পরীবাগ",
    "Postogola": "পোস্তগোলা",
    "Purana Paltan": "পুরাণা পল্টন",
    "Rajarbagh": "রাজারবাগ",
    "Rampura": "রামপুরা",
    "Ramna": "রমনা",
    "Rasulbagh": "রসুলবাগ",
    "Rayerbagh": "রায়েরবাগ",
    "Raja Bazar": "রাজা বাজার",
    "Rosulpur": "রসুলপুর",
    "Rupganj": "রূপগঞ্জ",
    "Rayerbazar ": "রায়েরবাজার",
    "Rayerbazar": "রায়েরবাজার",
    "Sabujbagh": "সবুজবাগ",
    "Sadarghat": "সদরঘাট",
    "Sahjanpur": "শাহজাহানপুর",
    "Sayedabad": "সায়েদাবাদ",
    "Segunbagicha": "সেগুনবাগিচা",
    "Science Lab": "সায়েন্স ল্যাব",
    "Shah Ali Bagh": "শাহ আলী বাগ",
    "Shahbag": "শাহবাগ",
    "Shakharibazar": "শাখাঁরীবাজার",
    "Shantibagh": "শান্তিবাগ",
    "Shampur": "শ্যামপুর",
    "Shantinagar": "শান্তিনগর",
    "Shaymoli": "শ্যামলী",
    "Shewrapara": "শেওড়াপাড়া",
    "Shekher Tek": "শেখের টেক",
    "Showari Ghat": "সওয়ারী ঘাট",
    "Sipahibag": "সিপাহীবাগ",
    "Siddheshwari": "সিদ্ধেশ্বরী",
    "Sonir akhra": "শনির আখড়া",
    "Swamibagh": "স্বামীবাগ",
    "Sher-E-Bangla Nagar": "শের-ই-বাংলা নগর",
    "Sutrapur": "সূত্রাপুর",
    "Tallabagh": "তল্লাবাগ",
    "Taltola": "তালতলা",
    "TatiBazar": "তাতীঁবাজার",
    "Tikatoli": "টিকাটুলি",
    "Tejkunipara": "তেজকুনিপাড়া",
    "Tejgaon": "তেজগাঁও",
    "Turag": "তুরাগ",
    "Tezturi Bazar": "তেজতুরী বাজার",
    "Tolarbag": "টোলারবাগ",
    "Tongi": "টঙ্গী",
    "Urdu Road": "উর্দু রোড",
    "Uttara": "উত্তরা",
    "Vatara": "ভাটারা",
    "Vasantek": "ভাসানটেক",
    "Wari": "ওয়ারী",
    "Badam Toli": "বাদামতলী",
    "English Road": "ইংলিশ রোড",
    "Sankar": "শংকর",
    "Shohid Nagar": "শহীদ নগর"
}

arcGis_dhaka_url = "https://services3.arcgis.com/nIl76MjbPamkQiu8/arcgis/rest/services/confirmed_cases_dhaka_city/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&maxRecordCountFactor=4&orderByFields=cases%20DESC&outSR=102100&resultOffset=0&resultRecordCount=8000&cacheHint=true&quantizationParameters=%7B%22mode%22%3A%22view%22%2C%22originPosition%22%3A%22upperLeft%22%2C%22tolerance%22%3A1.0583354500043074%2C%22extent%22%3A%7B%22xmin%22%3A10035936.00083909%2C%22ymin%22%3A2713650.347400964%2C%22xmax%22%3A10156039.823972352%2C%22ymax%22%3A2755460.149106408%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D%7D"


# In[16]:


import requests
dhaka_response = requests.get(arcGis_dhaka_url)


# In[17]:


import json
from pprint import pprint
from collections import OrderedDict

dhaka_json = json.loads(dhaka_response.text)
dhaka_confirm_dict = OrderedDict()

for attr in dhaka_json['features']:
    name = attr['attributes']['city']
    confirmed = attr['attributes']['cases']
    
    dhaka_confirm_dict[name] = confirmed
    
print("Number of areas: ", len(dhaka_confirm_dict))
# pprint(dhaka_confirm_dict)
    


# In[18]:


import json

dhaka_json_final_dict = []

for a in dhaka_confirm_dict:
    area_data = {}
    
    area_data['name'] = a
    area_data['confirmed'] = dhaka_confirm_dict[a]
    area_data['bnName'] = en2bn_dhk_area[a]
    
    dhaka_json_final_dict.append(area_data)
    
with open(f'{dir_path}/dhaka.txt', 'w+') as f:
    json.dump(dhaka_json_final_dict, f, ensure_ascii=False)


import sys
print (sys.version)

import tabula
import pandas as pd

import json
from copy import deepcopy

date = 16
month = 'june'
month_n = 6

f = open(f"./{month}/{date}/district", "w+")

iedcr2bcc_district = {
    "B. Baria": "Brahamanbaria",
    "Barishal": "Barisal",
    "Bogura": "Bogra",
    "Chattogram": "Chittagong",
    "Cox’s bazar": "Cox's Bazar",
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

en2bn_district = {
    "Bagerhat": "বাগেরহাট",
    "Bandarban": "বান্দরবান",
    "Barguna": "বরগুনা",
    "Barisal": "বরিশাল",
    "Bhola": "ভোলা",
    "Bogra": "বগুড়া",
    "Brahamanbaria": "ব্রাহ্মণবাড়িয়া",
    "Chandpur": "চাঁদপুর",
    "Chittagong": "চট্টগ্রাম",
    "Chuadanga": "চুয়াডাঙ্গা",
    "Comilla": "কুমিল্লা",
    "Cox's Bazar": "কক্সবাজার",
    "Dhaka": "ঢাকা",
    "Dinajpur": "দিনাজপুর",
    "Faridpur": "ফরিদপুর",
    "Feni": "ফেনী",
    "Gaibandha": "গাইবান্ধা",
    "Gazipur": "গাজীপুর",
    "Gopalganj": "গোপালগঞ্জ",
    "Habiganj": "হবিগঞ্জ",
    "Jamalpur": "জামালপুর",
    "Jessore": "যশোর",
    "Jhalokati": "ঝালকাঠি",
    "Jhenaidah": "ঝিনাইদহ",
    "Joypurhat": "জয়পুরহাট",
    "Khagrachhari": "খাগড়াছড়ি",
    "Khulna": "খুলনা",
    "Kishoreganj": "কিশোরগঞ্জ",
    "Kurigram": "কুড়িগ্রাম",
    "Kushtia": "কুষ্টিয়া",
    "Lakshmipur": "লক্ষ্মীপুর",
    "Lalmonirhat": "লালমনিরহাট",
    "Madaripur": "মাদারীপুর",
    "Magura": "মাগুরা",
    "Manikganj": "মানিকগঞ্জ",
    "Maulvibazar": "মেহেরপুর",
    "Meherpur": "মৌলভীবাজার",
    "Munshiganj": "মুন্সিগঞ্জ",
    "Mymensingh": "ময়মনসিংহ",
    "Naogaon": "নওগাঁ",
    "Narail": "নড়াইল",
    "Narayanganj": "নারায়ণগঞ্জ",
    "Narsingdi": "নরসিংদী",
    "Natore": "নাটোর",
    "Nawabganj": "চাঁপাইনবাবগঞ্জ",
    "Netrakona": "নেত্রকোণা",
    "Nilphamari": "নীলফামারী",
    "Noakhali": "নোয়াখালী",
    "Pabna": "পাবনা",
    "Panchagarh": "পঞ্চগড়",
    "Patuakhali": "পটুয়াখালী",
    "Pirojpur": "পিরোজপুর",
    "Rajbari": "রাজবাড়ী",
    "Rajshahi": "রাজশাহী",
    "Rangamati": "রাঙ্গামাটি",
    "Rangpur": "রংপুর",
    "Satkhira": "সাতক্ষীরা",
    "Shariatpur": "শরীয়তপুর",
    "Sherpur": "শেরপুর",
    "Sirajganj": "সিরাজগঞ্জ",
    "Sunamganj": "সুনামগঞ্জ",
    "Sylhet": "সিলেট",
    "Tangail": "টাঙ্গাইল",
    "Thakurgaon": "ঠাকুরগাঁও"
}

en2bn_dhk_area = {
    "abdullahpur": "আব্দুল্লাহপুর",
    "adabor": "আদাবর",
    "aftabnagar": "আফতাবনগর",
    "agargaon": "আগারগাঁও",
    "ahmed nagar": "আহমেদনগর",
    "ahmedabag": "আহমেদাবাগ",
    "aminbazar": "আমিনবাজার",
    "amlapara": "আমলাপাড়া",
    "armanitola": "আরমানিটোলা",
    "arambagh": "আরামবাগ",
    "asad gate": "আসাদগেট",
    "ashkona": "আশকোনা",
    "ashulia": "আশুলিয়া",
    "azimpur": "আজিমপুর",
    "babu bazar": "বাবু বাজার",
    "bahadur bazar": "বাহাদুর বাজার",
    "badda": "বাড্ডা",
    "baily road": "বেইলি রোড",
    "bakshibazar": "বকশিবাজার",
    "baridhara": "বারিধারা",
    "banasree": "বনশ্রী",
    "banani": "বনানী",
    "banglamotor": "বাংলামটর",
    "bangshal": "বংশাল",
    "banianagar": "বানিয়ানগর",
    "basabo": "বাসাবো",
    "bijoynagar": "বিজয়নগর",
    "bashundhora": "বসুন্ধরা",
    "begunbari": "বেগুনবাড়ি",
    "begum bazar": "বেগম বাজার",
    "beribadh": "বেড়িবাঁধ",
    "bokshi bazar": "বকশি বাজার",
    "bosila": "বসিলা",
    "buet area": "বুয়েট এলাকা",
    "cantonment": "ঢাকা সেনানিবাস",
    "central road": "সেন্ট্রাল রোড",
    "chankharpool": "চাঁনখারপুল",
    "chawk bazar": "চক বাজার",
    "dania": "দনিয়া",
    "dakshinkhan": "দক্ষিণখান",
    "dhakkeshori": "ঢাকেশ্বরী",
    "demra": "ডেমরা",
    "dhanmondi": "ধানমন্ডি",
    "dholaikhal": "ধোলাইখাল",
    "dholaipar": "ধোলাইপাড়",
    "dhalpur": "ধলপুর", 
    "doyaganj": "দয়াগঞ্জ",
    "elephant road": "এলিফ্যান্ট রোড",
    "eskaton": "ইস্কাটন",
    "faridabagh": "ফরিদাবাদ",
    "fakirapool": "ফকিরাপুল",
    "farmgate": "ফার্মগেট",
    "fulbaria": "ফুলবাড়িয়া",
    "farasganj": "ফরাশগঞ্জ",
    "farashganj": "ফরাশগঞ্জ",
    "forasganj": "ফরাশগঞ্জ",
    "forashganj": "ফরাশগঞ্জ",
    "gendaria": "গেন্ডারিয়া",
    "gausia": "গাওছিয়া",
    "gabtoli": "গাবতলী",
    "golartek": "গোলারটেক",
    "goran": "গোরান",
    "gonoktuli": "গণকটুলি",
    "gopibag": "গোপীবাগ",
    "golapbagh": "গোলাপবাগ",
    "green road": "গ্রীন রোড",
    "gulistan": "গুলিস্তান",
    "gulshan": "গুলশান",
    "hajipara": "হাজীপাড়া",
    "hatkhula": "হাটখোলা",
    "hatir jhil": "হাতিরঝিল",
    "hatirpool": "হাতিরপুল",
    "hazaribagh": "হাজারীবাগ",
    "ibrahimpur": "ইব্রাহীমপুর",
    "indira road": "ইন্দিরা রোড",
    "islambagh": "ইসলাামবাগ",
    "islampur": "ইসলামপুর",
    "jailgate": "জেলগেট",
    "jatrabari": "যাত্রাবাড়ী",
    "jigatala": "জিগাতলা",
    "jinjira": "জিঞ্জিরা",
    "jurain": "জুরাইন",
    "kajla": "কাজলা", 
    "kafrul": "কাফরুল", 
    "kallyanpur": "কল্যাণপুর",
    "kalabagan": "কলাবাগান",
    "kakrail": "কাকরাইল",
    "kathalbagan": "কাঁঠালবাগান",
    "kamalapur": "কমলাপুর",
    "kamrangir char": "কামরাঙ্গীর চর",
    "kazi para": "কাজীপাড়া",
    "kawran bazar": "কাওরান বাজার",
    "koratitola": "করাতিটোলা",
    "kochukhet": "কচুক্ষেত",
    "khilgaon": "খিলগাঁও",
    "khilkhet": "খিলক্ষেত",
    "koltabazar": "কলতাবাজার",
    "kodomtoli": "কদমতলি",
    "kosaituli": "কসাইটুলী",
    "kotowali": "কোতোয়ালী",
    "kuril": "কুড়িল",
    "kutubkhali": "কুতুবখালি",
    "lalmatia": "লালমাটিয়া",
    "lalbagh": "লালবাগ",
    "laxmibazar": "লক্ষ্মীবাজার",
    "madartek": "মাদারটেক",
    "malitola": "মালিটোলা",
    "malibagh": "মালিবাগ",
    "maniknagar": "মানিকনগর",
    "manda": "মানডা",
    "manikdi": "মানিকদি",
    "matuail": "মাতুয়াইল",
    "matikata": "মাটিকাটা",
    "merul": "মেরুল", 
    "meradia": "মেরাদিয়া", 
    "mintu road": "মিন্টু রোড", 
    "mirhajaribagh": "মীরহাজারিবাগ",
    "mirpur": "মিরপুর",
    "mirpur-1": "মিরপুর-১",
    "mirpur-2": "মিরপুর-২",
    "mirpur-6": "মিরপুর-৬",
    "mirpur 7": "মিরপুর-৭",
    "mirpur-7": "মিরপুর-৭",
    "mirpur-10": "মিরপুর-১০",
    "mirpur-11": "মিরপুর-১১",
    "mirpur-12": "মিরপুর-১২",
    "mirpur-13": "মিরপুর-১৩",
    "mirpur-14": "মিরপুর-১৪",
    "mitford": "মিটফোর্ড",
    "mogbazar": "মগবাজার",
    "monipur": "মনিপুর",
    "mohakhali": "মহাখালী",
    "mohonpur": "মোহনপুর",
    "mohammadpur": "মোহাম্মাদপুর",
    "motijeel": "মতিঝিল",
    "mugda": "মুগদা",
    "nawabpur": "নবাবপুর",
    "new market": "নিউমার্কেট",
    "nazirabazar": "নাজিরাবাজার",
    "nawabganj": "নবাবগঞ্জ",
    "narinda": "নারিন্দা",
    "nilkhet": "নীলক্ষেত",
    "nandi para": "নন্দীপাড়া",
    "nakhalpara": "নাখালপাড়া",
    "nayabazar": "নয়াবাজার",
    "neemtoli": "নিমতলী",
    "nikunja": "নিকুঞ্জ",
    "niketon": "নিকেতন",
    "paikpara": "পাইকপাড়া",
    "panthapath": "পান্থপথ",
    "paltan": "পল্টন", 
    "pallabi": "পল্লবী",
    "pirerbagh": "পীরেরবাগ",
    "poribagh": "পরীবাগ",
    "postogola": "পোস্তগোলা",
    "purana paltan": "পুরাণা পল্টন",
    "rajarbagh": "রাজারবাগ",
    "rampura": "রামপুরা",
    "ramna": "রমনা",
    "rasulbagh": "রসুলবাগ",
    "rayerbagh": "রায়েরবাগ",
    "raja bazar": "রাজা বাজার",
    "rosulpur": "রসুলপুর",
    "rupganj": "রূপগঞ্জ",
    "rayerbazar ": "রায়েরবাজার",
    "rayerbazar": "রায়েরবাজার",
    "sabujbagh": "সবুজবাগ",
    "sadarghat": "সদরঘাট",
    "sahjanpur": "শাহজাহানপুর",
    "sayedabad": "সায়েদাবাদ",
    "segunbagicha": "সেগুনবাগিচা",
    "science lab": "সায়েন্স ল্যাব",
    "shah ali bagh": "শাহ আলী বাগ",
    "shahbag": "শাহবাগ",
    "shakharibazar": "শাখাঁরীবাজার",
    "shantibagh": "শান্তিবাগ",
    "shampur": "শ্যামপুর",
    "shantinagar": "শান্তিনগর",
    "shaymoli": "শ্যামলী",
    "shewrapara": "শেওড়াপাড়া",
    "shekher tek": "শেখের টেক",
    "showari ghat": "সওয়ারী ঘাট",
    "sipahibag": "সিপাহীবাগ",
    "siddheshwari": "সিদ্ধেশ্বরী",
    "sonir akhra": "শনির আখড়া",
    "swamibagh": "স্বামীবাগ",
    "sher-e-bangla nagar": "শের-ই-বাংলা নগর",
    "sutrapur": "সূত্রাপুর",
    "tallabagh": "তল্লাবাগ",
    "taltola": "তালতলা",
    "tatibazar": "তাতীঁবাজার",
    "tikatoli": "টিকাটুলি",
    "tejkunipara": "তেজকুনিপাড়া",
    "tejgaon": "তেজগাঁও",
    "turag": "তুরাগ",
    "tezturi bazar": "তেজতুরী বাজার",
    "tolarbag": "টোলারবাগ",
    "tongi": "টঙ্গী",
    "urdu road": "উর্দু রোড",
    "uttara": "উত্তরা",
    "vatara": "ভাটারা",
    "vasantek": "ভাসানটেক",
    "wari": "ওয়ারী",
    "badam toli": "বাদামতলী",
    "english road": "ইংলিশ রোড",
    "sankar": "শংকর",
    "shankar": "শংকর",
    "shohid nagar": "শহীদ নগর",
    "airport": "এয়ারপোর্ট",
    "bangla bazar": "বাংলাবাজার",
    "sahjadpur": "শাহজাদপুর",
    "kanchpur": "কাঁচপুর",
    "katashur": "কাটাসুর",
    "baganbari": "বাগানবাড়ী",
    "gulbag": "গুলবাগ",
    "gudaraghat": "গুদারাঘাট",
    "katashpur": "কাটাশপুর",
    "konapara": "কোনাপাড়া",
    "mouchak": "মৌচাক",
    "nayapaltan": "নয়াপল্টন", 
    "rupnagar": "রুপনগর",
    "senpara": "সেনপাড়া",
    "sher-e-bangla\rnagar": "শেরেবাংলা নগর",
} 


try:
    df = tabula.read_pdf(f"./{month}/{date}/data_updated.pdf", pages='all', pandas_options={"header": None})
except FileNotFoundError:
    df = tabula.read_pdf(f"./{month}/{date}/data.pdf", pages='all', pandas_options={"header": None})


def get_district_info(df):  # Returns dataframe
    district_info = df[0].iloc[1:]
    columns_to_be_dropped = district_info.columns[[0, 3, 4]]
    district_info = district_info.drop(columns_to_be_dropped, axis=1).dropna(how='any')
    district_info.columns =  ['district', 'total']
    district_info.total = district_info.total.astype(int)
    district_info = district_info.replace({'district': {'Dhaka City':'Dhaka'}}).replace({'district': {'Dhaka (District)':'Dhaka'}}).groupby('district', as_index=False).sum().sort_values(by=['total'], ascending=False)

    print("Number of districts: ", district_info.shape[0])
    print("Total confirmed: ", district_info['total'].sum())
    print(district_info)

    return district_info

di = get_district_info(df)

def get_district_confirm_dict(district_info):
    district_confirm_dict = {}
    for d, t in zip(district_info['district'].tolist(), district_info['total'].tolist()):
        if d in iedcr2bcc_district.keys():
            d = iedcr2bcc_district[d]

        district_confirm_dict[d] = t

    return district_confirm_dict

dcd = get_district_confirm_dict(di)

def get_district_json(district_confirm_dict):
    base_json = json.load(open('base.json'))
    final_json = deepcopy(base_json)

    for ix, i in enumerate(base_json['features']):
        key = i['properties']['key']
        final_json['features'][ix]['properties']['confirmed'] = str(district_confirm_dict[key])

    return final_json

dj = get_district_json(dcd)

json.dump(dj, f, ensure_ascii=False)
f.close()

locations, cases = [], []

nan = float('nan')


for dframe in df[1:]:
    for i in (dframe.columns):
        if i%2 == 0:
            for j in dframe[i]:
                if type(j) == str and j.lower() != 'location' and j.lower() != 'nagar':
                    locations.append(j)
        else:
            for j in dframe[i] :
                if str(j) != 'nan' and j != 'Total' and j!= 'Tota\rl':
                    cases.append(int(j))
if len(locations) == len(cases):
    print("OK")
else:
    print("NOT OK")


# In[43]:


f_area = open(f"./{month}/{date}/dhaka.txt", "w+")
import json

print("Number of area: ", len(locations))
print("Total confirmed: ", sum(cases))

dhaka_dict = []

for a, t in zip(locations, cases):
    if a == 'Sher-E-Bangla':
        a += ' Nagar'
    elif a == "sher-e-bangla\rnagar":
        a = 'Sher-E-Bangla'
    elif a == 'bahadur\rbazar':
        a = 'bahadurbazar'
    area_data = {}
    
    area_data['name'] = a
    area_data['confirmed'] = t
    area_data['bnName'] = en2bn_dhk_area.get(a.lower())
    
    dhaka_dict.append(area_data)
    
json.dump(dhaka_dict, f_area, ensure_ascii=False)
f_area.close()

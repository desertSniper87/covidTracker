#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Author            : desertsniper87 <torshobuet@gmail.com>
# Date              : 28.06.2020
# Last Modified Date: 28.06.2020

import json
from pprint import pprint
from collections import OrderedDict
from pathlib import Path
import json
import copy
from pprint import pprint
import requests
from bs4 import BeautifulSoup as bs


iedcr2bcc_district = {
    "B. Baria": "Brahamanbaria",
    "Barishal": "Barisal",
    "Bogura": "Bogra",
    "Chapainawabganj": "Nawabganj",
    "Chattogram": "Chittagong",
    "Coxsbazar": "Cox's Bazar",
    "Cox’s bazar": "Cox's Bazar",
    "Cumilla": "Comilla",
    "Dhaka (District)": "Dhaka",
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
}

site_text = requests.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vQgQAWwlQYF4XTxVT8sYP5wwqz_KxaWfVNQk9B0FlyPPpDphAIv1cRIMV4ve_1gNbewGjcbkKNpi3Wm/pubhtml?single=true&gid=0&range=B2:c65&widget=false&chrome=false&headers=false').text
soup = bs(site_text)

district_confirm_dict = OrderedDict()

for t in soup.body.find_all("tr"):
    district = t.find("td", {"class": "s0"})
    confirmed = t.find("td", {"class": "s1"})
    if None in (district, confirmed):
        district = t.find("td", {"class": "s2 softmerge"})
        confirmed = t.find("td", {"class": "s3"})
    if None not in (district, confirmed):
        if district.text in iedcr2bcc_district.keys():
            district_confirm_dict[iedcr2bcc_district.get(district.text)] = confirmed.text
        else:
            district_confirm_dict[district.text] = confirmed.text


        
print("Number of districts", len(district_confirm_dict))    
pprint(district_confirm_dict)

date = 29
month = 'june'
month_n = 6

dir_path = f"./{month}/{date}"
try:
    Path(dir_path).mkdir()
except FileExistsError:
    print('File exists')


base_json = json.load(open('base.json'))
final_json = copy.deepcopy(base_json)

for fx, f in enumerate(base_json['features']):
#     print(fx, f)
    key = f['properties']['key']
    final_json['features'][fx]['properties']['confirmed'] = str(district_confirm_dict[key])
    
with open(f'{dir_path}/district.txt', 'w+') as f:
    json.dump(final_json, f, ensure_ascii=False)

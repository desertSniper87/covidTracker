import pandas as pd
import re

c_pos = pd.read_csv('country_pos.csv')
data = pd.read_csv('data.csv')

# print(c_pos.columns)
# print(data.columns)

pos_en_name = c_pos['eng_name'].tolist()
data_en_name = data['eng_name'].tolist()
# data_state = data['state'].tolist()
data['rest'] = data['code'] + ',' + data['bn_name']
c_pos['rest'] = c_pos['state'].astype(str) + ',' +  c_pos['lat'].astype(str) + ',' + c_pos['lon'].astype(str)

data_dict = dict(zip(data_en_name, data['rest'].tolist()))
c_pos_dict = dict(zip(pos_en_name, c_pos['rest'].tolist()))

# print(c_pos.to_string())
# print(c_pos['state'].to_string())




filename = 'matched_data.csv'
f = open(filename, 'w')

for eng_name_pos, rest_pos in zip(c_pos['eng_name'], c_pos['rest']):
    for eng_name_data in data['eng_name']:
        if eng_name_pos == eng_name_data:
            f.write(eng_name_pos + ',' + data_dict[eng_name_data] + ',' + rest_pos + '\n')


f.close()

filename = 'countryNotInData.csv'
f = open(filename, 'w')

for country in pos_en_name:
    if country not in data_en_name:
        f.write(country + ',' + c_pos_dict[country] + '\n')

f.close()

filename = 'countryNotInPositionData.csv'
f = open(filename, 'w')

for country in data_en_name:
    if country not in pos_en_name:
        f.write(country + ',' + str(data_dict[country]) + '\n')

f.close()

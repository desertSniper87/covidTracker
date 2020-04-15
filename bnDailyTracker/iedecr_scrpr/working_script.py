#!/usr/bin/env python3
# coding: utf-8

import tabula

date = 14
month = 'april'
month_n_string = '04'

f = open(f'{month}/{date}/{month}_{date}.csv', "w+")
f.write("date" + ',,' + f'{date}.{month_n_string}.2020' + '\n')

iedcr2bcc_district = {
                      "Cox’s bazar": "Cox's Bazar",
                      "B. Baria": "Brahamanbaria",
                      "Chattogram": "Chittagong",
                      "Cumilla": "Comilla"
                     }


df = tabula.read_pdf(f"./{month}/{date}/data.pdf", pages='all')
district_info = df[0].iloc[1:]

columns_to_be_dropped = district_info.columns[[0, 3]]
district_info = district_info.drop(columns_to_be_dropped, axis=1)

district_info.columns = ['district', 'total']
district_info.total = district_info.total.astype(int)
district_info = district_info.replace({'district': {'Dhaka City':'Dhaka'}}).replace({'district': {'Dhaka (District)':'Dhaka'}}).groupby('district', as_index=False).sum().sort_values(by=['total'], ascending=False)


for d, t in zip(district_info['district'].tolist(), district_info['total'].tolist()):
    if d in iedcr2bcc_district.keys():
        d = iedcr2bcc_district[d]
    f.write(d + ',,' + str(t) + "\n")

f.close()


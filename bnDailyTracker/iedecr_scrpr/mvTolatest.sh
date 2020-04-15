#!/bin/bash
# Author            : desertsniper87 <torshobuet@gmail.com>
# Date              : 15.04.2020
# Last Modified Date: 15.04.2020

month=`date +%B | tr A-Z a-z`
day=`date +%d`

cp $month/$day/data.csv ../latest/$month\_$day

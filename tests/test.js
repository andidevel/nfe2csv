{/*
NFe2CSV
Copyright (C) 2020  Anderson R. Livramento <catfishlabs.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/}

const NFeToCSV = require('../lib/nfe2csv')

const xmlParser = require('fast-xml-parser')
const fs = require('fs')
const path = require('path')

const xmlDataPath = './'
const csvFileOut = 'NFe2CSV.csv'
const xmlTestFile = 'nfe.xml'
//####[ Testing ]############################
const xmlTestData = fs.readFileSync(path.join(xmlDataPath, xmlTestFile), 'utf8')
const jsonObj = xmlParser.parse(xmlTestData, {parseNodeValue: false})
console.log(jsonObj)
//####[ Main ]###############################
console.log('Starting...')
console.log(xmlDataPath)
const nfe2csv = new NFeToCSV(xmlDataPath, csvFileOut)
nfe2csv.fit(fromHeader=false, toHeader=true)
console.log('Done.')
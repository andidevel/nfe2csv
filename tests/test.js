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

const xmlDataPath = './nfe'
const csvFileOut = 'NFe2CSV.test.csv'
const xmlTestFile = 'nfe-1.xml'
//####[ View XML structure ]############################
console.log('Object converted structure:')
const xmlTestData = fs.readFileSync(path.join(xmlDataPath, xmlTestFile), 'utf8')
const jsonObj = xmlParser.parse(xmlTestData, {parseNodeValue: false})
console.log(jsonObj)
//####[ Main ]###############################
console.log('Starting...')
console.log('XML path:', xmlDataPath)
const nfe2csv = new NFeToCSV(xmlDataPath)
nfe2csv.fit(csvFileOut, {fromHeader: false, toHeader: true})
console.log('Summary:')
console.log('-----------')
console.log('XML files found:', nfe2csv.xmlFilesCount)
console.log('NF-e files processed:', nfe2csv.nfeFilesCount)
console.log('-----------')
console.log('Done.')
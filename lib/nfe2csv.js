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

const xmlParser = require('fast-xml-parser')
const fs = require('fs')
const glob = require('glob')
const path = require('path')

csvDescriptor = (csvCol, xTag, xType) => {
    return {
        csvCol: csvCol,
        xTag: xTag,
        xType: xType || 'str'
    }
}

const INFNFE_ROOT = 'nfeProc/NFe/infNFe'

// Maybe turn this "fields" configurable
const HEADER_FIELDS = [
    csvDescriptor('NF-cUF', 'nfeProc/NFe/infNFe/ide/cUF'),
    csvDescriptor('NF-cNF', 'nfeProc/NFe/infNFe/ide/cNF'),
    csvDescriptor('NF-natOp', 'nfeProc/NFe/infNFe/ide/natOp'),
    csvDescriptor('NF-mod', 'nfeProc/NFe/infNFe/ide/mod'),
    csvDescriptor('NF-serie', 'nfeProc/NFe/infNFe/ide/serie'),
    csvDescriptor('NF-nNF', 'nfeProc/NFe/infNFe/ide/nNF'),
    csvDescriptor('NF-dhEmi', 'nfeProc/NFe/infNFe/ide/dhEmi', 'dtstr'),
    csvDescriptor('NF-dhSaiEnt', 'nfeProc/NFe/infNFe/ide/dhSaiEnt', 'dtstr'),
    csvDescriptor('NF-tpNF', 'nfeProc/NFe/infNFe/ide/tpNF'),
    csvDescriptor('NF-idDest', 'nfeProc/NFe/infNFe/ide/idDest'),
    csvDescriptor('NF-ref', 'nfeProc/NFe/infNFe/ide/NFref/refNFe'),
]

const FROM_FIELDS = [
    csvDescriptor('emit-CNPJ', 'nfeProc/NFe/infNFe/emit/CNPJ'),
    csvDescriptor('emit-Nome', 'nfeProc/NFe/infNFe/emit/xNome'),
    csvDescriptor('emit-NomeFant', 'nfeProc/NFe/infNFe/emit/xFant'),
    csvDescriptor('emit-Logradouro', 'nfeProc/NFe/infNFe/emit/enderEmit/xLgr'),
    csvDescriptor('emit-Numero', 'nfeProc/NFe/infNFe/emit/enderEmit/nro'),
    csvDescriptor('emit-Bairro', 'nfeProc/NFe/infNFe/emit/enderEmit/xBairro'),
    csvDescriptor('emit-Municipio', 'nfeProc/NFe/infNFe/emit/enderEmit/xMun'),
    csvDescriptor('emit-UF', 'nfeProc/NFe/infNFe/emit/enderEmit/UF'),
    csvDescriptor('emit-Pais', 'nfeProc/NFe/infNFe/emit/enderEmit/xPais'),
    csvDescriptor('emit-Fone', 'nfeProc/NFe/infNFe/emit/enderEmit/fone'),
    csvDescriptor('emit-IE', 'nfeProc/NFe/infNFe/emit/IE'),
    csvDescriptor('emit-CRT', 'nfeProc/NFe/infNFe/emit/CRT'),
]

const TO_FIELDS = [
    csvDescriptor('dest-CNPJ', 'nfeProc/NFe/infNFe/dest/CNPJ'),
    csvDescriptor('dest-Nome', 'nfeProc/NFe/infNFe/dest/xNome'),
    csvDescriptor('dest-NomeFant', 'nfeProc/NFe/infNFe/dest/xFant'),
    csvDescriptor('dest-Logradouro', 'nfeProc/NFe/infNFe/dest/enderDest/xLgr'),
    csvDescriptor('dest-Numero', 'nfeProc/NFe/infNFe/dest/enderDest/nro'),
    csvDescriptor('dest-Bairro', 'nfeProc/NFe/infNFe/dest/enderDest/xBairro'),
    csvDescriptor('dest-Municipio', 'nfeProc/NFe/infNFe/dest/enderDest/xMun'),
    csvDescriptor('dest-UF', 'nfeProc/NFe/infNFe/dest/enderDest/UF'),
    csvDescriptor('dest-Pais', 'nfeProc/NFe/infNFe/dest/enderDest/xPais'),
    csvDescriptor('dest-Fone', 'nfeProc/NFe/infNFe/dest/enderDest/fone'),
    csvDescriptor('dest-IE', 'nfeProc/NFe/infNFe/dest/IE'),
    csvDescriptor('dest-indIE', 'nfeProc/NFe/infNFe/dest/indIEDest'),
]

const FOOTER_FIELDS = [
    csvDescriptor('BaseCalc', 'nfeProc/NFe/infNFe/total/ICMSTot/vBC'),
    csvDescriptor('ICMS', 'nfeProc/NFe/infNFe/total/ICMSTot/vICMS'),
    csvDescriptor('ICMSDeson', 'nfeProc/NFe/infNFe/total/ICMSTot/vICMSDeson'),
    csvDescriptor('FCP', 'nfeProc/NFe/infNFe/total/ICMSTot/vFCP'),
    csvDescriptor('BCST', 'nfeProc/NFe/infNFe/total/ICMSTot/vBCST'),
    csvDescriptor('ST', 'nfeProc/NFe/infNFe/total/ICMSTot/vST'),
    csvDescriptor('TotalProd', 'nfeProc/NFe/infNFe/total/ICMSTot/vProd'),
    csvDescriptor('Frete', 'nfeProc/NFe/infNFe/total/ICMSTot/vFrete'),
    csvDescriptor('Desc', 'nfeProc/NFe/infNFe/total/ICMSTot/vDesc'),
    csvDescriptor('IPI', 'nfeProc/NFe/infNFe/total/ICMSTot/vIPI'),
    csvDescriptor('IPIDevol', 'nfeProc/NFe/infNFe/total/ICMSTot/vIPIDevol'),
    csvDescriptor('PIS', 'nfeProc/NFe/infNFe/total/ICMSTot/vPIS'),
    csvDescriptor('COFINS', 'nfeProc/NFe/infNFe/total/ICMSTot/vCOFINS'),
    csvDescriptor('Outros', 'nfeProc/NFe/infNFe/total/ICMSTot/vOutros'),
    csvDescriptor('vNF', 'nfeProc/NFe/infNFe/total/ICMSTot/vNF'),
    csvDescriptor('ChaveAcesso', 'nfeProc/protNFe/infProt/chNFe'),
]

const ITEMS_FIELDS = [
    csvDescriptor('cProd', 'prod/cProd'),
    csvDescriptor('xProd', 'prod/xProd'),
    csvDescriptor('NCM', 'prod/NCM'),
    csvDescriptor('CEST', 'prod/CEST'),
    csvDescriptor('CFOP', 'prod/CFOP'),
    csvDescriptor('uCom', 'prod/uCom'),
    csvDescriptor('qCom', 'prod/qCom'),
    csvDescriptor('vUnCom', 'prod/vUnCom'),
    csvDescriptor('vProd', 'prod/vProd'),
    csvDescriptor('uTrib', 'prod/uTrib'),
    csvDescriptor('pICMS', 'imposto/ICMS/*/pICMS'),
    csvDescriptor('vBaseCalcICMS', 'imposto/ICMS/*/vBC'),
    csvDescriptor('vICMS', 'imposto/ICMS/*/vICMS'),
    csvDescriptor('pPIS', 'imposto/PIS/*/pPIS'),
    csvDescriptor('vPIS', 'imposto/PIS/*/vPIS'),
    csvDescriptor('pCOFINS', 'imposto/COFINS/*/pCOFINS'),
    csvDescriptor('vCOFINS', 'imposto/COFINS/*/vCOFINS'),
]

const INSTALLMENT_FIELDS = [
    csvDescriptor('dVenc', 'dVenc', 'dtstr'),
    csvDescriptor('vDup', 'vDup'),
]

function isObject(o) {
    return (typeof o === 'object' && o !== null)
}

function getValue(element, path) {
    let xelement = element
    const paths = path.split('/')
    for (let i in paths ) {
        if (paths[i] === '*'){
            const next_path = paths.slice(parseInt(i, 10)+1).join('/')
            for (let k in xelement){
                let nested = getValue(xelement[k], next_path)
                if (nested){
                    return nested
                }
            }
            return null
        }
        else {
            if (isObject(xelement)){
                if (paths[i] in xelement) {
                    xelement = xelement[paths[i]]
                }
                else {
                    return null
                }
            }
            else {
                return null
            }
        }    
    }
    return xelement
}

module.exports = class NFe2CSV {
    constructor(xmlPath) {
        this.xmlPath = xmlPath
        this.nfeFiles = glob.sync(path.join(xmlPath, '*.xml'))
        this.xmlFilesCount = 0
        this.nfeFilesCount = 0
        if (this.nfeFiles) {
            this.xmlFilesCount = this.nfeFiles.length
            this.nfeFilesCount = this.nfeFiles.length
        }
    }

    getMaxInstallments() {
        const billPath = 'nfeProc/NFe/infNFe/cobr/dup'
        let maxInstallments = 0
        for (let nfe of this.nfeFiles) {
            let xmlData = fs.readFileSync(nfe, 'utf8')
            let nfeObj = xmlParser.parse(xmlData)
            let cobr = getValue(nfeObj, billPath)
            if (cobr) {
                let localNCobr = 1
                if (Array.isArray(cobr)){
                    localNCobr = cobr.length
                }
                if (localNCobr > maxInstallments) {
                    maxInstallments = localNCobr
                }
            }
        }
        return maxInstallments
    }
    
    dateToDateBr(dtstr) {
        let result = null
        if (dtstr) {
            let dt = dtstr.split('T')[0].split('-')
            result = `${dt[2]}/${dt[1]}/${dt[0]}`
        }
        return result
    }
    
    formatValue(value, xfield) {
        let result = ''
        if (xfield.xType === 'dtstr') {
            result = this.dateToDateBr(value)
        }
        else {
            result = value.toString()
        }
        return `"${result}"`
    }
    
    csvWriteSync(fd, csvLine) {
        fs.writeSync(fd, csvLine.join(';'))
        fs.writeSync(fd, '\n')
    }

    fit(csvFileOut, options={fromHeader: true, toHeader: true}) {
        // CSV Header
        let fixed_fields = []
        let csvHeader = []
        fixed_fields = fixed_fields.concat(HEADER_FIELDS)
        if (options.fromHeader) {
            fixed_fields = fixed_fields.concat(FROM_FIELDS)
        }
        if (options.toHeader) {
            fixed_fields = fixed_fields.concat(TO_FIELDS)
        }
        fixed_fields = fixed_fields.concat(FOOTER_FIELDS)
        // Building CSV header
        for (let h of fixed_fields) {
            csvHeader.push(h.csvCol)
        }
        let maxInstallments = this.getMaxInstallments()
        for (let i of Array(maxInstallments).keys()) {
            for (let k of INSTALLMENT_FIELDS) {
                csvHeader.push(`${k.csvCol}${(i+1).toString()}`)
            }
        }
        for (let h of ITEMS_FIELDS) {
            csvHeader.push(h.csvCol)
        }
        // Starting flush data to CSV file
        const fd = fs.openSync(csvFileOut, 'w')
        // Write header
        this.csvWriteSync(fd, csvHeader)
        for (let nfeFile of this.nfeFiles) {
            // CSV lines
            let csvLine = []
            let xmlData = fs.readFileSync(nfeFile, 'utf8')
            let nfeObj = xmlParser.parse(xmlData, {parseNodeValue: false})
            const infNFeRoot = getValue(nfeObj, INFNFE_ROOT)
            if (infNFeRoot){
                // Fixed fields
                for (let f of fixed_fields) {
                    let val = getValue(nfeObj, f.xTag)
                    if (val) {
                        csvLine.push(this.formatValue(val, f))
                    }
                    else {
                        csvLine.push('')
                    }
                }
                // Installment fields
                let installments = getValue(infNFeRoot, 'cobr/dup')
                for (let i of Array(maxInstallments).keys()) {
                    if (Array.isArray(installments)){
                        if (i < installments.length){
                            for (let k of INSTALLMENT_FIELDS) {
                                csvLine.push(this.formatValue(installments[i][k.xTag], k))
                            }
                        }
                        else {
                            for (let rest of Array(INSTALLMENT_FIELDS.length).keys()) {
                                csvLine.push('')
                            }
                        }
                    }
                    else {
                        if (installments) {
                            for (let k of INSTALLMENT_FIELDS){
                                csvLine.push(this.formatValue(installments[k.xTag], k))
                            }
                        }
                        else {
                            for (let rest of Array(INSTALLMENT_FIELDS.length).keys()) {
                                csvLine.push('')
                            }
                        }
                    }
                }
                // Finally, invoice items
                let csvDetLine = []
                if ('det' in infNFeRoot && infNFeRoot.det) {
                    if (Array.isArray(infNFeRoot.det)) {
                        for (let det of infNFeRoot.det) {
                            for (let detF of ITEMS_FIELDS) {
                                let val = getValue(det, detF.xTag)
                                if (val) {
                                    csvDetLine.push(this.formatValue(val, detF))
                                }
                                else {
                                    csvDetLine.push('')
                                }
                            }
                            this.csvWriteSync(fd, csvLine.concat(csvDetLine))
                            csvDetLine = []
                        }
                    }
                    else {
                        for (let detF of ITEMS_FIELDS) {
                            let val = getValue(infNFeRoot.det, detF.xTag)
                            if (val) {
                                csvDetLine.push(this.formatValue(val, detF))
                            }
                            else {
                                csvDetLine.push('')
                            }
                        }
                        this.csvWriteSync(fd, csvLine.concat(csvDetLine))
                        csvDetLine = []
                    }
                }
                else {
                    // If no items?!? Just let the fields empty
                    for (let detF in ITEMS_FIELDS) {
                        csvDetLine.push('')
                    }
                    this.csvWriteSync(fd, csvLine.concat(csvDetLine))
                    csvDetLine = []
                }
            }
            else {
                this.nfeFilesCount -= 1
            }
        }
        fs.closeSync(fd)
    }
}
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

const {app, ipcMain, dialog} = require('electron')
const path = require('path')
const NFeToCSV = require('../lib/nfe2csv')

ipcMain.on('get-app-version', (event) => {
    event.sender.send('got-app-version', app.getVersion())
})

//######[ XML Directory ]#################
ipcMain.on('open-xml-directory-dialog', (event) => {
    dialog.showOpenDialog(
        {
            title: 'Selecione a pasta com as NFe',
            properties: ['openDirectory']
        }
    ).then( (result) => {
        if (result.filePaths){
            event.sender.send('selected-xml-directory', result.filePaths)
        }
    })
})

//#######[ CSV File ]#######################
ipcMain.on('open-csv-file-dialog', (event) => {
    dialog.showSaveDialog(
        {
            title: 'Selecione o arquivo CSV de saída',
            filters: [
                {name: 'CSV', extensions: ['csv']},
                {name: 'Todos', extensions: ['*']}
            ]
        }
    ).then( (result) => {
        if (result.filePath){
            let csvFile = result.filePath
            const fileExt = path.extname(csvFile)
            if (!fileExt || fileExt == '.'){
                const pathObj = path.parse(csvFile)
                csvFile = path.join(pathObj.dir, pathObj.name+'.csv')
            }
            event.sender.send('selected-csv-file', csvFile)
        }
    })
})

//#######[ Start button ]#######################
ipcMain.on('start-convert', (event, params={}) => {
    if (params) {
        const nfeToCsv = new NFeToCSV(params.xmlDataPath)
        nfeToCsv.fit(
            params.csvFileOut,
            {
                fromHeader: params.fromHeader,
                toHeader: params.toHeader
            }
        )
        event.sender.send('start-convert-done')
    }
})

//#######[ Error Dialog - Parameters ]#######################
ipcMain.on('params-error', (event) => {
    dialog.showErrorBox('Oops!', '"Local dos arquivos NFe" e "Arquivo CSV de saída" são obrigatórios!')
})

//#######[ Info Dialog - Done ]#######################
ipcMain.on('info-convert-done', (event) => {
    dialog.showMessageBox({
        type: 'info',
        tile: 'NFe2CSV',
        message: 'Conversão finalizada.',
        buttons: ['OK']
    })
})
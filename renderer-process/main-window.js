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

const {ipcRenderer} = require('electron')

//################[ XML Select Folder ]################################################
document.getElementById('btXmlIn').addEventListener('click', (event) => {
    ipcRenderer.send('open-xml-directory-dialog')
})

ipcRenderer.on('selected-xml-directory', (event, path) => {
    document.getElementById('xmlFolder').value = path
})

//################[ CSV Select File ]##################################################
document.getElementById('btCsvOut').addEventListener('click', (event) => {
    ipcRenderer.send('open-csv-file-dialog')
})

ipcRenderer.on('selected-csv-file', (event, path) => {
    document.getElementById('csvOut').value = path
})

//################[ Start ]############################################################
document.getElementById('btGo').addEventListener('click', (event) => {
    const params = {
        xmlDataPath: document.getElementById('xmlFolder').value,
        csvFileOut: document.getElementById('csvOut').value,
        fromHeader: document.getElementById('ckEmit').checked,
        toHeader: document.getElementById('ckDest').checked,
    }
    if (params.xmlDataPath && params.csvFileOut) {
        document.getElementById('btGo').disabled = true
        ipcRenderer.send('start-convert', params)
    }
    else {
        ipcRenderer.send('params-error')
    }
})

ipcRenderer.on('start-convert-done', (event) => {
    document.getElementById('btGo').disabled = false
    ipcRenderer.send('info-convert-done')
})
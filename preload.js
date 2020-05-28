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

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('get-app-version')
    // document.getElementById('btGo').disabled = true

    ipcRenderer.on('got-app-version', (event, version) => {
        document.getElementById('appVersion').innerText = version
    })
})
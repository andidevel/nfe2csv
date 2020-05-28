const {Menu, shell} = require('electron')

const debug = /--debug/.test(process.argv[2])

if (!debug) {
    let template = [
        {
            label: 'File',
            submenu: [
                {
                    role: 'close'
                }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'About',
                    click: async () => {
                        await shell.openExternal('https://github.com/catfishlabs/nfe2csv')
                    }
                }
            ]
        }
    ]

    const mainMenu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(mainMenu)
}
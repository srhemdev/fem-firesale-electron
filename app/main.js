//Dialogs only work in main process

const { app, BrowserWindow,dialog, Menu } = require('electron');
const fs = require('fs')


let newWindow = null;
const windows = new Set()
const fileWatchers = new Map();

const createWindow = (file) => {
    newWindow = new BrowserWindow({ show: false });
    windows.add(newWindow)

    newWindow.loadURL(`file://${__dirname}/index.html`);

    newWindow.once('ready-to-show', () => {
        if(file) openFile(newWindow, file)
        newWindow.show();
    //getFileFromUserSelection()
    });

    newWindow.on('close', (event) => {
        if(newWindow.isDocumentEdited()) {
            event.preventDefault();
            const result = dialog.showMessageBox(newWindow, {
                type: 'warning',
                title: 'Quit with Unsaved changes?',
                message: 'Your changes will be lost if you do not save first.',
                buttons: [
                    'Quit Anyway',
                    'Cancel'
                ],
                defaultId: 0,
                cancelId: 1
            });

            if(result === 0) {
                newWindow.destroy()
            }
        }
    });

    newWindow.on('closed', () => {
        windows.delete(newWindow)
        stopWatchingFile(newWindow)
        newWindow = null;
    });
}

/**
 *
 Export this function from main.js so that it can be used by the renderer process
 using remote module in renderer.js
 We want to avoid using globals to avoid polluting the global mainspace
 */
const getFileFromUserSelection = exports.getgetFileFromUserSelection = (targetWindow) => {
    //which files you can pick, here only txt are allowed as per filters
    const files = dialog.showOpenDialog(targetWindow, {
        properties: ['openFile'],
        filters: [
            {name: 'Text files', extensions:['txt', 'text']},
            {name: 'Markdown files', extensions:['md', 'markdown']}
        ]
    });

    if(!files) return;

    return files[0];
};

const openFile = exports.openFile = (targetWindow, filePath) => {
    const file = filePath || getFileFromUserSelection(targetWindow);
    const content = fs.readFileSync(file).toString() // gets a string of buffer, not the actual content

    app.addRecentDocument(file)
    startWatchingFile(targetWindow, file)

    //open the file
    targetWindow.webContents.send('file-opened', file, content)
    //targetWindow.setTitle(`${file} - Fire Sale`)
    targetWindow.setRepresentedFilename(file)
}

const saveMarkdown = exports.saveMarkdown = (win, file, content) => {
    if(!file) {
        file = dialog.showSaveDialog(win, {
            title: 'Save Markdown',
            defaultPath: app.getPath('documents'),
            filters: [
                { name: 'Markdown Files', extensions: ['md', 'markdown']}
            ]
        })
    }

    if(!file) return;

    fs.writeFileSync(file, content);
    win.webContents.send('file-opened', file, content)
}

const startWatchingFile  = (targetWindow, file) => {
    stopWatchingFile(targetWindow);
    const watcher = fs.watch(file, (event) => {
        if(event === 'change') {
            const content = fs.readFileSync('file-changed').toString()
            targetWindow.webContents.send('file-changed', file, content)
        }
    })

    fileWatchers.set(targetWindow, watcher)
}

const stopWatchingFile  = (targetWindow) => {
    if(fileWatchers.has(targetWindow)) {
        fileWatchers.get(targetWindow).close()
        fileWatchers.delete(targetWindow)
    }
}

app.on('ready', () => {
    const template = [
        {
            label: 'Super Awesome',
            submenu: [
                {
                    label: 'Cut',
                    role: 'cut',
                    click: () => { console.log('yayy')},
                    accelerator: 'CommandOrControl+X'
                },
                {
                    label: 'Save',
                    role: 'save',
                    click: (item, focusedWindow) => {
                        if(focusedWindow) focusedWindow.webContents.send('save-file')
                    },
                    accelerator: 'CommandOrControl+S'
                }

            ]
        }
    ]

    if(process.platform === 'darwin') {
        template.unshift({
            label: 'No one will see me'
        })

    }
    const applicationMenu  = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(applicationMenu)
    createWindow()
});

app.on('will-finish-launching', () => {
    app.on('open-file', (event, filePath) => {
        createWindow(filePath)
    })
})

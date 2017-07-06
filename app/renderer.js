const marked = require('marked'); //marked lib
const {remote,ipcRenderer, shell} = require('electron')
const mainProcess = remote.require('./main')
const currentWindow = remote.getCurrentWindow()

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const openInDefaultButton = document.querySelector('#open-in-default');
const showFileButton = document.querySelector('#show-file');
                                                            
let filePath = null;
let originalContent = '';


const renderMarkdownToHtml = (markdown) => {
    const html = marked(markdown, {sanitize: true})
    htmlView.innerHTML = html;
}

const updatedEditedState = (isEdited) => {
    currentWindow.setDocumentEdited(isEdited)
    saveMarkdownButton.disabled = !isEdited;
    revertButton.disabled = !isEdited;

    let title = 'Fire Sale'

    if(filePath) title = `${filePath} - ${title}`
    if(isEdited) title = `${title} - (Edited)`
    currentWindow.setTitle(title)
}

markdownView.addEventListener('keyup', (event) => {
    const currentContent = event.target.value;
    renderMarkdownToHtml(event.target.value)
    updatedEditedState(currentContent !== originalContent)
});

newFileButton.addEventListener('click', () => {
    mainProcess.createWindow();
})

saveMarkdownButton.addEventListener('click', () => {
    mainProcess.saveMarkdown(currentWindow, filePath, markdownView.value);
})

openInDefaultButton.addEventListener('click', () => {
    shell.openItem(filePath)
})

showFileButton.addEventListener('click', () => {
    shell.showItemInFolder(filePath)
})

openFileButton.addEventListener('click', () => {
    mainProcess.openFile(currentWindow);
})

//listen to events from the main process
ipcRenderer.on('file-opened', (event, file, content) => {
    filePath = file;
    originalContent = content;
    markdownView.value = content;
    renderMarkdownToHtml(content);

    updatedEditedState(false)
})

ipcRenderer.on('file-changed', (event, file, content) => {
    console.log("am i coming here")
    filePath = file;
    originalContent = content;
    markdownView.value = content;
    renderMarkdownToHtml(content);

    updatedEditedState(false)
})                                                            
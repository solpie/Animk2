const { app, BrowserWindow, ipcMain } = require('electron');
// app.commandLine.appendSwitch('--enable-npapi')
app.commandLine.appendSwitch('enable-npapi')
var path = require('path');
var process = require('process');
console.log(process.execPath);
var win
var isDev;
isDev = /[\\/]projects[\\/]/.test(process.execPath);
// isDev = false;

function onReady() {
    console.log('onReady');
    openWin();
}

function openWin(serverConf) {
    win = new BrowserWindow({
        width: 1700,
        height: 1024,
        // width: 500, height: 540,
        frame: true,
        autoHideMenuBar: false,
        webPreferences: {
            plugins: true
        }
        // webaudio: false
    });
    // win.setMenu(null);
    win.setMenuBarVisibility(false);
    win.loadURL('file:///resources/app/index.html');
    // if (isDev)
    win.toggleDevTools({ mode: 'detach' });
    // win.loadURL(`file:///app/reload.html`);
    win.on('closed', function() {
        win = null;
    });
}

app.on('ready', onReady);
app.on('window-all-closed', () => {
    console.log('window-all-closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function() {
    if (win === null) {}
});
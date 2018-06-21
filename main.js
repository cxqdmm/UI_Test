const {app,Menu,BrowserWindow,BrowserView, globalShortcut,windowState} = require('electron')

app.commandLine.appendSwitch('remote-debugging-port', '9223');

let mainWindow;
function createWindow () {
  // Create the browser window.
    // 注册打开控制台的快捷键
  globalShortcut.register('CommandOrControl+Alt+P', function () {
    mainWindow.webContents.openDevTools();
  })
  mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: {webSecurity: false}})
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.openDevTools({mode:'rigth'});
  // Open the DevTools.
  console.log(process.pid)
  mainWindow.webContents.openDevTools()
  // Emitted loadFile
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
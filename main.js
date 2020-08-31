// Modules to control application life and create native browser window
const {app, Menu, BrowserWindow} = require('electron')
const path = require('path')
const capt = require('./src/third/capt')

function createWindow () {
  //隐藏菜单栏
  //Menu.setApplicationMenu(null)

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: './preload.js'
    }
  })


  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  //加载dist下的静态资源，build完发布后进行load
  //mainWindow.loadURL(`file://${__dirname}/dist/index.html`);//在窗口内要展示的内容index.html 就是打包生成的index.html
  //先启动node服务，在window中直接加载localhost地址
  mainWindow.loadURL('http://localhost:8080/')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

import path from 'path';
import url from 'url';
import electron, { app, crashReporter, BrowserWindow, Menu, Tray } from 'electron';
import ipcPromise from 'ipc-promise'

const isDevelopment = (process.env.NODE_ENV === 'development');

let mainWindow = null;
let tray = null;
let forceQuit = false;
let workerWindow = null

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const extensions = [
    //'REACT_DEVELOPER_TOOLS',
    //'REDUX_DEVTOOLS'
  ];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload);
    } catch (e) {
      console.log(`Error installing ${name} extension: ${e.message}`);
    }
  }
};

crashReporter.start({
  productName: 'YourName',
  companyName: 'YourCompany',
  submitURL: 'https://your-domain.com/url-to-submit',
  uploadToServer: false
});

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 640,
    minHeight: 480,
    show: false
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // show window once on first load
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    // Handle window logic properly on macOS:
    // 1. App should not terminate if window has been closed
    // 2. Click on icon in dock should re-open the window
    // 3. ⌘+Q should close the window and quit the app
    if (process.platform === 'darwin') {
      mainWindow.on('close', function (e) {
        if (!forceQuit) {
          e.preventDefault();
          mainWindow.hide();
        }
      });

      app.on('activate', () => {
        mainWindow.show();
      });

      app.on('before-quit', () => {
        forceQuit = true;
      });
    } else {
      mainWindow.on('closed', () => {
        mainWindow = null;
      });
    }
  });

  if (isDevelopment) {
    // auto-open dev tools
    mainWindow.webContents.openDevTools();

    // add inspect element on right click menu
    mainWindow.webContents.on('context-menu', (e, props) => {
      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(props.x, props.y);
        }
      }]).popup(mainWindow);
    });
  }

  const trayPaht = path.join(__dirname, 'reducers/tray.png');
  // const trayPaht = '/reducers/tray.png';
  tray = new Tray(trayPaht)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)

    workerWindow = new BrowserWindow({
        show: false//TODO
    })
    workerWindow.on('closed', () => {
        workerWindow = null;
    })

    workerWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'worker.html'),
        protocol: 'file:',
        slashes: true
    }))

    ipcPromise.on('ping', async function (arg) {
        return arg
    })

    electron.ipcMain.on('event-store', function (evt, arg) {
        //mainWindow.webContents.send('event-store', )
        console.log('ipc event-store', arg)
        workerWindow.webContents.send('event-store', arg)
    })

    electron.ipcMain.on('event-store-response', function (evt, arg) {
        console.log('ipc event-store-response', arg)
        mainWindow.webContents.send('event-store-response', arg)
    })
});

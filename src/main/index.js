/* eslint-disable prettier/prettier */
import { app, shell, BrowserWindow, Notification, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

// Disable SSL certificate errors
app.commandLine.appendSwitch("ignore-certificate-errors");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 980,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer based on electron-vite cli.
  // Load the remote URL for development or the local HTML file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}



// const NOTIFICATION_TITLE = 'Basic Notification'
// const NOTIFICATION_BODY = 'Notification from the Main process'

// function showNotification () {
//   new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
// }

// app.whenReady().then(createWindow).then(showNotification)

// Handle notifications from renderer
ipcMain.on("show-notification", (event, { title, body }) => {
  const notification = new Notification({
    title,
    body,
    icon: join(__dirname, "../../resources/icon.png"), // Adjust icon path if needed
  });
  notification.show();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for Windows
  electronApp.setAppUserModelId("electron");

  // showNotification()
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  app.on("ready", () => {
    if (Notification.isSupported()) {
      console.log("Notifications are supported");
    }
    autoUpdater.checkForUpdatesAndNotify();
  });

  // IPC test
  // ipcMain.on('ping', () => console.log('pong'))

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

import { autoUpdater } from "electron-updater";
import log from "electron-log";

// Configure logging
log.transports.file.level = "info";
autoUpdater.logger = log;

// Auto-update event listeners
autoUpdater.on("checking-for-update", () => {
  log.info("Checking for update...");
});

autoUpdater.on("update-available", (info) => {
  log.info("Update available.", info);
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send("update-available", info);
  });
});

autoUpdater.on("update-not-available", (info) => {
  log.info("Update not available.", info);
});

autoUpdater.on("error", (err) => {
  log.error("Error in auto-updater. " + err);
});

autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message = log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")";
  log.info(log_message);
});

autoUpdater.on("update-downloaded", (info) => {
  log.info("Update downloaded", info);
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send("update-downloaded", info);
  });
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

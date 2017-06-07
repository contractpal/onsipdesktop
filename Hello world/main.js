const electron = require('electron')
const Menu = require('electron').Menu
var path = require('electron').path
const app = electron.app
const BrowserWindow = electron.BrowserWindow
var Tray = require('electron').Tray
var nativeImage = require('electron').nativeImage
var tray = null
var myValue;
var mainWindow;
var webcontents;
const notifier = require('node-notifier');
var notified = 0;

// Modify the user agent for all requests to the following urls.
const filter = {
  urls: ['https://*.github.com/*', '*://electron.github.io', 'https://app.onsip.com/*']
}

    app.on('ready', function(){
        var icon1 = nativeImage.createFromPath(`${__dirname}/../build/onsip.png`)
        tray = new Tray(icon1)
        tray.setToolTip('Onsip')
        var icon2 = nativeImage.createFromPath(`${__dirname}/../build/onsip.png`)
    
        var contextMenu = Menu.buildFromTemplate([

        { label: 'Open Window', click:  function(){
            mainWindow.show();
        } },
        { label: 'Exit', click:  function(){
            app.isQuiting = true;
            app.quit();

        } 
        }
    ]);
        tray.setContextMenu(contextMenu)
        tray.setImage(icon1)
        tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
})
        mainWindow = new BrowserWindow()
        mainWindow.hide()
        mainWindow.loadURL('https://app.onsip.com/app')
        webcontents = mainWindow.webContents
       
        webcontents.on('did-stop-loading', function(){
            mainWindow.show()
            //Check for login
        })

        webcontents.on('media-started-playing', function(){
            //this means a call is coming in
            // Object 
            // only want to notify once
            if(notified % 10 == 1)
                {
                notifier.notify("message")
                notifier.notify({
                    'title': 'Onsip',
                    'message': "Incoming call",
                    'wait' : true
                });
                }
            notified++
            })
        
        notifier.on('click', function(notifierObject, options) {
                   mainWindow.show();
                   notified = 0;
        })
        
        notifier.on('timeout', function (notifierObject, options) {
  // Triggers if `wait: true` and notification closes 
            mainWindow.show();
                   notified = 0;
});
        mainWindow.on('minimize',function(event){
            event.preventDefault()
            mainWindow.hide();
        });
        
    mainWindow.on('close', function (event) {
        if( !app.isQuiting){
            event.preventDefault()
            mainWindow.hide();
        }
        return false;
    });
})
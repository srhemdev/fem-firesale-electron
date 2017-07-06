https://gist.github.com/stevekinney/4cc5c61e827c00dbea55409f26d1da02

# Fire Sale

A Markdown-to-HTML editor built on Electron and used to teach how to build applications in Electron.
DONT FORGET TO RUN
npm install
npm install electron-packager

CHROME(CHROMIUM) + NODE = ELECTRON
------------------------------------

Consists of two main processes:
MAIN PROCESS(ACCESS TO ALL WINDOW LEVEL COMPONENTS)
RENDERER PROCESS(HTML AND ALL WEB TECHNOLOGIES)
Can communicate with each other using IPC(Inter Process Communication)

Electron has prebuilt binaries for every version of OS.
-Used only for desktop applications


Electron Package
------------------------
If you provide no option it is gonna build for your current system
Else you can specify if you wanna build for 32 bit or 64 but machines

electron-packager . "Fire Sale" --out="dist" --icon="Icon.ics"

---Check dist folder to see your built application

It is going to exclude things in your dev dependencies

Source Code Protection
------------------------

Electron does not protect your source code
Do not have complete source protection
You however can obfuscate your source code

Right Click on your app(Fire Sale)
->Open Package contents
->Contents
->Resources
->app

So now you see your apps contents are openly available.
You can be able to change content at runtime (Oops!)

Now if you want to make this cryptic, you need to use some
sort of packaging mechanism
Here comes in ASAR Packaging(Similar to Zip archive, TAR packaging)
You can make your code read only and hence wont be able to change
content at runtime

You can unpack the app by doing npm install asar
------------------------------------------------
and run it on your asar package

Now you app is secure and can be distributed

For compiling your app, if you use jsx, less or sass,
(babel/less/sass compilers do the job for you)
------------------------------------------------------------
npm install electron-prebuilt-compile
npm install electron-packager-compile

Want to change window appearance
------------------------------------
npm install electron-osx-appearance

For OS boots
------------
npm install electron-auto-watch

Sudo
------------
npm install electron-sudo

Global shortcuts(hotkeys, local shortcuts)
------------------------------------------------
npm install electron local-shortcuts

Use greatest and latest Javascript(ES7) features:
------------------------------------------------------------
npm install babel-preset-electron

Manage State on main and renderer Process
------------------------------------------------
npm install electron-redux

Ember
------------
ember install ember-electron

Devtron-debugger
------------------------
Spectron-Testing framework

Books Resources:
------------------------
sindresorhus/awesome-electron

Electron in Action: http://bit.ly/electronjs

Squirl
------------
Pushes out updates to your app, you need a server side implementation


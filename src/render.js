// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
require('babel-polyfill');
const $ = require('jquery')
const CDP = require('chrome-remote-interface');
const request = require('request');
const puppeteer = require('puppeteer');
const electron = require('electron');
async function createPageForTarget(browser, targetId) {
  const target = await browser._targets.get(targetId);
  target._pagePromise = void 0;
  const page = await target.page();
  return page;
}
let webSocketDebuggerUrl, targetId, browser,client;
$('#getPageInfo').on('click', () => {
  //获取打开的标签页信息
  request('http://localhost:9223/json', async  (error, response, body) => {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      let remotePage = body.length && body[0];
      if (remotePage) {
        webSocketDebuggerUrl = remotePage.webSocketDebuggerUrl;
        targetId = remotePage.id;
        // webSocketDebuggerUrl = 'ws://localhost:56756/devtools/page/8C18261399342E946C87C0D1591144AC'
        // targetId = '8C18261399342E946C87C0D1591144AC'
          // if (!browser) {
          //   browser = await puppeteer.connect({browserWSEndpoint:webSocketDebuggerUrl});
          // }
          // const page = await createPageForTarget(browser, targetId);
          // page.goto('https://m.vip.com/')
          
        const options = {
          port: '9223',
          target: targetId
        }
         client = await connect(options);
         const {Network, Page,Runtime,DOM} = client;
          await Network.enable();
          await Page.enable();
          // let params = await DOM.getDocument({});
          // let node = await DOM.querySelector({nodeId:params.root.nodeId,selector:'input[name=mobile]'})
          console.log(1)
      }
    }
  })
  //获取协议版本号
  request('http://localhost:9223/json/version', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // 
    }
  })
})
function connect(options) {
  return new Promise((resolve, reject) => {
    CDP(options, (client) => {
      resolve(client)
    }).on('error', (err) => {
      console.error(err);
    });
  })
}
$('#go').on('click', () => {
    const { Network, Page,Runtime } = client;
    var command = $('#command').val();
    if (command) {
      eval(`(async () => {${command}})()`)
    }
})
$('#open').on('click', () => {
  // 新窗口的大小
  let win = new electron.remote.BrowserWindow({ width: 400, height: 320 })
  win.on('close', function () {
    // 窗口被关闭时清空资源
    win = null
  })
  // 加载网页
  win.loadURL('https://www.baidu.com')
  // 显示窗口
  win.show()
})
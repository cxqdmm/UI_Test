// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
require('babel-polyfill');
const $ = require('jquery')
const request = require('request');
const electron = require('electron');
const puppeteer = require('puppeteer'); 
// const {createPageForTarget} = require('./lib/puppeteer_utils.js')
async function createPageForTarget(browser, targetId) {
  const target = await browser._targets.get(targetId);
  target._pagePromise = void 0;
  const page = await target.page();
  return page;
}
let webSocketDebuggerUrl,targetId,browser;
$('#getPageInfo').on('click',() =>  {
  //获取打开的标签页信息
  request('http://localhost:9222/json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      let remotePage = body.length && body[0];
      if (remotePage) {
        webSocketDebuggerUrl = remotePage.webSocketDebuggerUrl;
        targetId = remotePage.id;
      }
    }
  })
  //获取协议版本号
  request('http://localhost:9222/json/version', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // 
    }
  })
})
$('#go').on('click', () => {
  if (webSocketDebuggerUrl) {   
    (async () => {
      if (!browser) {
        browser = await puppeteer.connect({browserWSEndpoint:webSocketDebuggerUrl});
      }
      const page = await createPageForTarget(browser, targetId);
      page.goto('www.qq.com')
    })();
  }
})
$('#open').on('click',() => {
  // 新窗口的大小
  let win = new electron.remote.BrowserWindow({ width: 400, height: 320 })
  win.on('close', function () {
    // 窗口被关闭时清空资源
    win = null
  })
  // 加载网页
  win.loadURL('https://www.baidu.com')
  win.openDevTools({mode:'rigth'});
  // 显示窗口
  win.show()
})
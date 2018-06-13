// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const $ = require('jquery')
import { remote } from 'electron';
$('.btn').on('click',() => {
  // 新窗口的大小
  console.log(2)
  let win = new remote.BrowserWindow({ width: 400, height: 320 })
  win.on('close', function () {
    // 窗口被关闭时清空资源
    win = null
  })
  // 加载网页
  win.loadURL('www.baidu.com')
  // 显示窗口
  win.show()
})
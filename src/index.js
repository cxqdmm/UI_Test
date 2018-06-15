const puppeteer = require('puppeteer');
const WebSocket = require('ws');
(async () => {
  // const browser = await puppeteer.launch({headless:false})
  //   const page = await browser.newPage();
  // await page.goto('https://baidu.com');
  let ws = new WebSocket('ws://localhost:9222/devtools/page/2d5f5746-ddf0-4fe7-8a8a-998e305d1907');

  // 打开WebSocket连接后立刻发送一条消息:
  function send(method, params = {}) {
    id = 1;
    const message = JSON.stringify({id, method, params});
    ws.send(message);
  }
  ws.on('open', function () {
    send('Target.getTargets')
  });

  // 响应收到的消息:
  ws.on('message', function (message) {
    console.log(`[CLIENT] Received: ${message}`);
  })

})();
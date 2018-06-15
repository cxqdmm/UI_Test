const puppeteer = require('puppeteer');
const WebSocket = require('ws');
(async () => {
  // const browser = await puppeteer.launch({headless:false})
  //   const page = await browser.newPage();
  // await page.goto('https://baidu.com');
  let ws = new WebSocket('ws://localhost:9222/devtools/page/63483d00-76b6-48a1-8787-13268e23c418');

  // 打开WebSocket连接后立刻发送一条消息:
  function send(method, params = {}) {
    id = 1;
    const message = JSON.stringify({id, method, params});
    ws.send(message);
  }
  ws.on('open', function () {
    // send('Target.getTargets')
    send('Page.navigate',{url:'https://note.youdao.com/web/#/file/recent/markdown/WEB9b210422e2ea8a9f5a761105e7e11177/'})
  });

  // 响应收到的消息:
  ws.on('message', function (message) {
    console.log(`[CLIENT] Received: ${message}`);
  })

})();
var EventEmitter = require('events');
var Puppeteer = require('puppeteer');
var lodash = require('lodash')
class Puppe extends EventEmitter {
    constructor() {
        super()
        this.browser = null;
    }
    async connect (webSocketDebuggerUrl){
        this.browser  = await Puppeteer.connect({
            browserWSEndpoint: webSocketDebuggerUrl,
            ignoreHTTPSErrors: true,
        })
        this.browser.on('disconnected', () => {
            this.browser = null;
        }) 
    }
    async pages() {
        if (this.browser) {
            let pages = await this.browser.pages();
            for (let page of pages) {
                let title = await page.title()
                page.webTitle = title;
            }
            return pages;
        }
        return [];
    }
    async newPage() {
        await this.browser.newPage();
    }
    close() {
        if (this.browser) {
            this.browser.disconnect();
        }
    }

    async runJs(options) {
        if (options.page && options.js) {
            let page = options.page;
            let evalJs = `(async () => {
                ${options.js}
            })()`
            let result = await eval(evalJs);
        }
    }
     
}
var puppe = new Puppe();
export default puppe;
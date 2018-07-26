<template>
    <div class="h-100 w-100 flex-column d-flex">
        <div class="vi-head d-flex align-items-center pt-2 pb-2">
            <Button v-if="linkstatus == 0 || linkstatus == 1" :loading="linkstatus == 1" type="primary" shape="circle" size="small" style="margin-left: 20px;box-shadow:0px 0px 1px 1px #ccc" @click="linkChrome">连接chrome</Button>
            <Button v-else @click="close">断开连接</Button>
            <!-- <Dropdown trigger="click" style="margin-left: 20px"> -->
                <!-- <a href="javascript:void(0)">
                    chrome页面
                    <Icon type="arrow-down-b"></Icon>
                </a> -->
                <!-- <DropdownMenu slot="list">
                    <DropdownItem :key="key" v-for="(value, key) in pages" style="padding:0;display:block">
                        <span @click="selectPage(value)" style="margin:7px 16px;display:block">{{ value.webTitle }}</span>
                    </DropdownItem>
                </DropdownMenu> -->
            <!-- </Dropdown> -->
            <Select filterable>
                <Option :key="item.key" :value="item.webTitle" v-for="item in pages" style="padding:0;display:block">
                      <span @click="selectPage(item)" style="margin:7px 16px;display:block">{{ item.webTitle }}</span>
                </Option>
            </Select>
            <!-- <span>title：{{selectedPage.webTitle}}</span> -->
        </div>
        <Modal title="Title" v-model="createModal.visible" @on-ok="createNew" :closable="false">
            <Form :label-width="80">
                <FormItem label="项目名：">
                    <Input v-model="createModal.name" placeholder="请输入项目名称" style="width: 300px"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Content class="d-flex">
            <ul class="v-list" :style="{width:'150px'}">
                <li class="v-item d-flex ml-1 align-items-center" :key="key" v-for="(value, key) in autoLogInModel">
                    <label for="" style="flex-grow:1;margin-bottom:0">{{value.name}}</label>
                    <Switch size="small" v-model="value.selected" @on-change="changeSwitch(value, key)"></Switch>
                </li>
                <li>
                    <Button @click="createModal.visible = true">新建</Button>
                </li>
            </ul>
            <div class="flex-grow-1 host d-flex flex-column">
                <div>
                    <Button @click="save">保存</Button>
                    <Button @click="logIn">登录</Button>
                </div>
                <textarea class="flex-grow-1" name="" id="host_mode" cols="30" rows="10" v-model="selectedModel.host"></textarea>
            </div>
            <div class="js-config flex-grow-1 d-flex flex-column">
                <textarea id="script_mode" class="flex-grow-1" name="" cols="30" rows="10" v-model="selectedModel.js"></textarea>
            </div>
        </Content>
    </div>
</template>


<script>
import { fetch } from '../utils/fetch.js'
import puppe from '../utils/puppe.js'
import lodash from 'lodash'
import Codemirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/shell/shell.js';

import { ipcRenderer } from 'electron'
const { clipboard } = require('electron')
var request = require('request')
var fs = require('fs')
var path = require('path')
export default {
    data() {
        return {
            pages: [],
            linkstatus: false,
            selectedPage:{},
            createModal: {
                visible: false,
                name: ''
            },
            selectedModel: { host: '',js:''}, //选择的项目
            autoLogInModel: []//项目列表
        }
    },
    created() {
        this.autoLogInModel = this.$electronstore.get('autoLogInModel') || []
        this.autoLogInModel.forEach(item => {
            if (item.selected) {
                this.selectedModel = lodash.assign({}, item)
            }
        })
    },
    mounted() {
        var jsEditor = Codemirror.fromTextArea(document.querySelector('#script_mode'), { //script_once_code为你的textarea的ID号
            lineNumbers: true,//是否显示行号
            theme:'darcula',
            mode:"javascript",　//默认脚本编码
            lineWrapping:true, //是否强制换行
        });
        var hostEditor = Codemirror.fromTextArea(document.querySelector('#host_mode'), { //script_once_code为你的textarea的ID号
            lineNumbers: true,//是否显示行号
            mode:"shell",　//默认脚本编码
            lineWrapping:true, //是否强制换行
        });
    },
    methods: {
        async refreshPages() {
            this.pages = await puppe.pages()
        },
        selectPage(value) {
            this.selectedPage = value;
        },
        fetchChromeRemoteDebugPort() {
            request('http://localhost:9223/json', async (error, response, body) => {
                body = JSON.parse(body)
                if (!error && response.statusCode == 200 && body.length) {
                    this.pages.length = 0
                    var index = lodash.findIndex(body, b => {
                        return b.type == 'page';
                    })
                    if (index != -1) {
                        if (!puppe.browser) {
                            console.log('开始连接')
                            //连接chrome
                            await puppe.connect(body[index].webSocketDebuggerUrl)
                            console.log('连接成功')
                            let pages = await puppe.browser.pages();
                            for (let page of pages) {
                                let title = await page.title()
                                page.webTitle = title || '未知';
                            }
                            this.pages = pages;
                            console.log(pages)
                            this.linkstatus = 2;
                            puppe.browser.on('disconnected', () => {
                                console.log('断开连接')
                                this.pages = [];
                                this.selectedPage = {};
                                this.linkstatus = 0;
                            })
                            puppe.browser.on('targetchanged', lodash.debounce(async() => {
                                console.log('targetchanged')
                                this.refreshPages();
                            }, 3000))
                        } else {
                            console.log('连接成功')
                            this.pages = await puppe.pages();
                        }
                    }
                }
            })
        },
        linkChrome() {
            this.linkstatus = 1;
            this.$nextTick(() => {
               this.fetchChromeRemoteDebugPort();
            })

        },
        save() {
            // const message = clipboard.readText()
            // this.selectedModel.host = message
            this.autoLogInModel.findIndex(item => {
                if (item.name == this.selectedModel.name) {
                    item.host = this.selectedModel.host
                    item.js = this.selectedModel.js
                    return true;
                }
            })
            this.$electronstore.set('autoLogInModel', this.autoLogInModel)
        },
        //新建项目
        createNew() {
            let autoLogInModel = this.$electronstore.get('autoLogInModel')
            autoLogInModel = autoLogInModel ? autoLogInModel : []
            autoLogInModel.push({
                name: this.createModal.name
            })
            this.$electronstore.set('autoLogInModel', autoLogInModel)
        },
        //切换项目
        changeSwitch(value) {
            console.log(value.name)
            this.selectedModel = lodash.assign({}, value)
            this.autoLogInModel.forEach(item => {
                if (item.name != value.name) {
                    item.selected = false
                }
            })
            this.$electronstore.set('autoLogInModel', this.autoLogInModel)
        },
        //切换host
        async switchHost() {
            try {
                let newhost = '',
                    file = fs.readFileSync(
                        path.resolve('C:/Windows/System32/drivers/etc', 'hosts')
                    ),
                    host = file.toString(),
                    strArr = host.match(/.*/g),
                    hostList = []
                for (let s of strArr) {
                    if (s) {
                        if (s.includes('# --------------------------------------------------')) {
                            hostList.push(s)
                            break
                        } else {
                            hostList.push(s)
                        }
                    }
                }
                newhost = lodash.reduce(
                    hostList,
                    (a, b) => {
                        a += b + '\r\n'
                        return a
                    },
                    ''
                )
                newhost += this.selectedModel.host
                fs.writeFileSync(path.resolve('C:/Windows/System32/drivers/etc', 'hosts'), newhost)
            } catch (e) {}
        },
        async logIn() {
            if (!this.selectedPage.webTitle) {
                this.$Message.warning('请选择连接页面');
                return
            }
            
            await this.switchHost()
            puppe.runJs({
                page:this.selectedPage,
                js:this.selectedModel.js
            })
        },
        close() {
                puppe.close();
        }
    }
}
</script>

<style lang="scss">
.vi-head {
    box-shadow: 3px -1px 2px 2px #ccc;
}
.v-list {
    .v-item {
        padding: 5px;
    }
}
</style>

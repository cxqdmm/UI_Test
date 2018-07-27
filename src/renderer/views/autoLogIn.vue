<template>
    <div class="h-100 w-100 flex-column d-flex">
        <div class="vi-head d-flex align-items-center pt-2 pb-2">
            <div class="command ml-2" :class="linkstatus == 2 ? 'command-on' : ''">
                <img class="chrome-icon active mr-2" v-if="linkstatus == 2" src="../images/chrome1.png" alt="">
                <img class="chrome-icon mr-2" v-if="linkstatus != 2" src="../images/chrome2.png" alt="">
                <Icon v-if="linkstatus == 0" @click="linkChrome" class="btn-icon" style="color:#228b22;" type="ios-circle-filled" title="连接chrome"></Icon>
                <Icon v-if="linkstatus == 1" type="ionic" class="btn-icon" title="连接中"></Icon>
                <Icon v-if="linkstatus == 2" @click="close" class="btn-icon" type="ios-close" title="断开连接"></Icon>
            </div>
            <Select filterable class="ml-2 mr-2">
                <Option :key="item.key" :value="item.webTitle" v-for="item in pages" style="padding:0;display:block">
                      <span @click="selectPage(item)" style="margin:7px 16px;display:block">{{ item.webTitle }}</span>
                </Option>
            </Select>
 
            <Button @click="logIn" type="primary" shape="circle" class="mr-2">登录</Button>
        </div>
        <Modal title="Title" v-model="createModal.visible" @on-ok="createNew" :closable="false">
            <Form :label-width="80">
                <FormItem label="项目名：">
                    <Input v-model="createModal.name" placeholder="请输入项目名称" style="width: 300px"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Content class="d-flex">
            <div class="d-flex flex-column model-menu">
                <ul class="v-list flex-grow-1" :style="{width:'150px'}">
                    <li class="v-item d-flex ml-1 align-items-center" :key="key" v-for="(value, key) in autoLogInModel">
                        <label for="" style="flex-grow:1;margin-bottom:0">{{value.name}}</label>
                        <Switch size="small" style="" v-model="value.selected" @on-change="changeSwitch(value, key)"></Switch>
                    </li>
                </ul>
                <div class="model-menu-footer">
                    <Icon @click="createModal.visible = true" type="plus-circled" title="添加项目"></Icon>
                </div>
            </div>
            <div class="flex-grow-1 d-flex model-c">
                <div class="host d-flex flex-grow-1 flex-column">
                    <codemirror
                        ref="host"
                        :value="selectedModel.host"
                        :options="hostcmOptions"
                        @changes="changeHost"
                        class="code"
                    ></codemirror>
                    <!-- <textarea class="flex-grow-1" name="" id="host_mode" cols="30" rows="10" v-model="selectedModel.host"></textarea> -->
                </div>
                <div class="js-config flex-grow-1 d-flex flex-column">
                    <codemirror
                        ref="jsconfig"
                        :value="selectedModel.js"
                        :options="jscmOptions"
                        @changes="changeJs"
                        class="code"
                    ></codemirror>
                    <!-- <textarea id="script_mode" class="flex-grow-1" name="" cols="30" rows="10" v-model="selectedModel.js"></textarea> -->
                </div>
                <div class="btn-panel d-flex flex-column">
                    <div class="r-btn" @click="save" title="保存">
                        <img class="chrome-icon" src="../images/save.png" alt="">
                    </div>
                </div>
            </div>
        </Content>
    </div>
</template>


<script>
import { fetch } from '../utils/fetch.js'
import puppe from '../utils/puppe.js'
import lodash from 'lodash'
// import 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/shell/shell.js';
import { codemirror } from 'vue-codemirror'

import { ipcRenderer } from 'electron'
const { clipboard } = require('electron')
var request = require('request')
var fs = require('fs')
var path = require('path')
export default {
    data() {
        return {
            hostcmOptions: {
                tabSize: 4,
                mode: 'javascript',
                lineNumbers: true,
                line: true,
            },
            jscmOptions: {
                tabSize: 4,
                mode: 'shell',
                lineNumbers: true,
                line: true,
            },
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
        // var jsEditor = Codemirror.fromTextArea(document.querySelector('#script_mode'), { //script_once_code为你的textarea的ID号
        //     lineNumbers: true,//是否显示行号
        //     // theme:'darcula',
        //     mode:"javascript",　//默认脚本编码
        //     lineWrapping:true, //是否强制换行
        // });
        // var hostEditor = Codemirror.fromTextArea(document.querySelector('#host_mode'), { //script_once_code为你的textarea的ID号
        //     lineNumbers: true,//是否显示行号
        //     mode:"shell",　//默认脚本编码
        //     lineWrapping:true, //是否强制换行
        // });
    },
    methods: {
        changeHost(codemirror) {
            this.selectedModel.host = codemirror.getValue();
        },
        changeJs(codemirror) {
            this.selectedModel.js = codemirror.getValue();
        },
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
                            console.log('开始连接。。。')
                            //连接chrome
                            await puppe.connect(body[index].webSocketDebuggerUrl)
                            console.log('连接成功')
                       
                            console.log('获取页面。。。')
                            await this.refreshPages();
                            console.log('获取页面成功')

                            this.linkstatus = 2;

                            puppe.browser.on('disconnected', () => {
                                console.log('断开连接')
                                this.pages = [];
                                this.selectedPage = {};
                                this.linkstatus = 0;
                            })
                            
                            puppe.browser.on('targetchanged', lodash.debounce(async() => {
                                console.log('targetchanged')
                                await this.refreshPages();
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
                name: this.createModal.name,
                host:'',
                js:''
            })
            this.autoLogInModel = autoLogInModel;
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
    },
    components:{
        codemirror
    }
}
</script>

<style lang="scss">
@keyframes transRotate
{
    from {transform: rotate(0deg);}
    to {transform:rotate(360deg);}
}
.host {
    // flex-basis: 300px;
}

.chrome-icon {
    display: inline-block;
    width: 20px;
    &.active {
        animation: transRotate 3s linear 0s infinite;
        -webkit-animation: transRotate 3s linear 0s infinite;
    }
}
.btn-icon {
    cursor: pointer;
    font-size: 18px;
}
.vi-head {
    box-shadow: 3px -1px 2px 2px #ccc;
}
.command {
    height: 30px;
    background: linear-gradient(90deg,#ccc, #f3f3f3);
    padding: 0 10px;
    display: flex;
    align-items: center;
    border-radius: 20px;
    transform: background 1s linear;
}
.command-on {
    background: linear-gradient(90deg,rgba(25, 190, 107, 0.39), #ffc107);
}
.v-list {
    overflow: auto;
    .v-item {
        padding: 5px;
        &:hover {
            background-color: #f3f3f3;
        }
    }
}

.model-menu {
    .model-menu-footer {
        display: flex;
        padding: 0 20px;
        align-items: center;
        height: 40px;
        i {
            cursor: pointer;
            color: #2d8cf0;
            font-size: 20px;
        }
    }
}
.model-c {
    .CodeMirror {
        height: 100%;
    }
    .host, .js-config,  {
        margin: 10px;
        box-shadow: 0px 0px 6px -1px #ccc;
    }
    .btn-panel {
        margin: 10px;
    }
}
.r-btn {
    cursor: pointer;
    display: inline-block;
    padding: 5px;
    border-radius: 20px;
    background: white;
    transition: background .3s linear;
    transition: box-shadow .3s linear;
    transition: transform .3s linear;
    &:hover {
        background: linear-gradient(90deg,rgba(25, 190, 107, 0.39), #ffc107);
        box-shadow: 0px 1px 2px 1px rgba(255, 193, 7, 0.46);
        transform: translateY(-2px)
    }
}
.vue-codemirror {
    height: 100%;
}
</style>

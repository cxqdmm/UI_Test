<template>
    <div class="h-100 w-100 flex-column ml-1 d-flex">
        <div>
            <Dropdown trigger="click" style="margin-left: 20px">
                <a href="javascript:void(0)">
                    目标页面
                    <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem :key="key" v-for="(value, key) in pages">{{ value.title }}</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Button type="primary" style="margin-left: 20px" @click="fetchPort">搜索页面</Button>
            <Button @click="showCreate">新建</Button>
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
            </ul>
            <div class="flex-grow-1 host d-flex flex-column">
                <div>
                    <Button @click="paste">粘贴</Button>
                    <Button @click="logIn">登录</Button>
                </div>
                <textarea class="flex-grow-1" name="" id="" cols="30" rows="10" v-model="selectedModel.host"></textarea>
            </div>
        </Content>
    </div>
</template>


<script>
import { fetch } from '../utils/fetch.js'
import lodash from 'lodash'
import { ipcRenderer } from 'electron'
const { clipboard } = require('electron')
var request = require('request')
var fs = require('fs')
var path = require('path')
export default {
    data() {
        return {
            pages: [],
            createModal: {
                visible: false,
                name: ''
            },
            selectedModel: { host: '' },
            autoLogInModel: []
        }
    },
    created() {
        this.autoLogInModel = this.$electronstore.get('autoLogInModel') || []
        this.autoLogInModel.forEach(item => {
            if (item.selected) {
                this.selectedModel = lodash.assign({}, item)
            }
        })

        ipcRenderer.on('paste', function(e, data) {
            console.log(data)
        })
    },
    methods: {
        fetchPort() {
            request('http://localhost:9223/json', (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    this.pages.length = 0
                    lodash.forEach(JSON.parse(body), b => {
                        if (b.type == 'page')
                            this.pages.push({
                                title: b.title,
                                webSocketDebuggerUrl: b.webSocketDebuggerUrl
                            })
                    })
                }
            })
        },
        paste() {
            const message = clipboard.readText()
            this.selectedModel.host = message
            this.autoLogInModel.forEach(item => {
                if (item.name == this.selectedModel.name) {
                    item.host = this.selectedModel.host
                }
            })
            this.$electronstore.set('autoLogInModel', this.autoLogInModel)
        },
        showCreate: function() {
            this.createModal.visible = true
        },
        createNew() {
            let autoLogInModel = this.$electronstore.get('autoLogInModel')
            autoLogInModel = autoLogInModel ? autoLogInModel : []
            autoLogInModel.push({
                name: this.createModal.name
            })
            this.$electronstore.set('autoLogInModel', autoLogInModel)
        },
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
        switchHost() {
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
        logIn() {
            this.switchHost()
            // ipcRenderer.send('switchHost','23');
        }
    }
}
</script>

<style lang="scss">
.v-list {
    .v-item {
        padding: 5px;
    }
}
</style>

 <template>
    <div class="d-flex test-container">
        <Tree :data="data5" :render="renderContent"></Tree>
        <div class="right-panel d-flex flex-column flex-grow-1">
            <div class="content-header w-100 d-flex command-box">
                <div class="command-item">
                    <Icon type="play"></Icon>
                    <label for="">执行</label>
                </div>
                <div class="command-item">
                    <Icon type="ios-briefcase"></Icon>
                    <label for="">保存</label>
                </div>
            </div>
            <div class="content-body w-100"></div>
            <div class="content-footer w-100"></div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            data5: [
                {
                    title: 'parent 1',
                    expand: true,
                    render: (h, { root, node, data }) => {
                        return h(
                            'span',
                            {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            },
                            [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ]),
                                h(
                                    'span',
                                    {
                                        style: {
                                            display: 'inline-block',
                                            float: 'right',
                                            marginRight: '32px'
                                        }
                                    },
                                    [
                                        h('Button', {
                                            props: Object.assign(
                                                {},
                                                this.buttonProps,
                                                {
                                                    icon: 'ios-plus-empty',
                                                    type: 'primary'
                                                }
                                            ),
                                            style: {
                                                width: '52px'
                                            },
                                            on: {
                                                click: () => {
                                                    this.append(data)
                                                }
                                            }
                                        })
                                    ]
                                )
                            ]
                        )
                    },
                    // children: [
                    //     {
                    //         title: 'child 1-1',
                    //         expand: true,
                    //         children: [
                    //             {
                    //                 title: 'leaf 1-1-1',
                    //                 expand: true
                    //             },
                    //             {
                    //                 title: 'leaf 1-1-2',
                    //                 expand: true
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         title: 'child 1-2',
                    //         expand: true,
                    //         children: [
                    //             {
                    //                 title: 'leaf 1-2-1',
                    //                 expand: true
                    //             },
                    //             {
                    //                 title: 'leaf 1-2-1',
                    //                 expand: true
                    //             }
                    //         ]
                    //     }
                    // ]
                }
            ],
            buttonProps: {
                type: 'ghost',
                size: 'small'
            }
        }
    },
    methods: {
        renderContent(h, { root, node, data }) {
            return h(
                'span',
                {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                },
                [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ]),
                    h(
                        'span',
                        {
                            style: {
                                display: 'inline-block',
                                float: 'right',
                                marginRight: '32px'
                            }
                        },
                        [
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'ios-plus-empty'
                                }),
                                style: {
                                    marginRight: '8px'
                                },
                                on: {
                                    click: () => {
                                        this.append(data)
                                    }
                                }
                            }),
                            h('Button', {
                                props: Object.assign({}, this.buttonProps, {
                                    icon: 'ios-minus-empty'
                                }),
                                on: {
                                    click: () => {
                                        this.remove(root, node, data)
                                    }
                                }
                            })
                        ]
                    )
                ]
            )
        },
        append(data) {
            const children = data.children || []
            children.push({
                title: 'appended node',
                expand: true
            })
            this.$set(data, 'children', children)
        },
        remove(root, node, data) {
            const parentKey = root.find(el => el === node).parent
            const parent = root.find(el => el.nodeKey === parentKey).node
            const index = parent.children.indexOf(data)
            parent.children.splice(index, 1)
        }
    }
}
</script>
<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
.content-header {
    width: 100%;
    height: 40px;
    background-color: #fff;
}
.content-body {
    width: 100%;
}
.content-footer {
    width: 100%;
}
.command-box {
    .command-item {
        padding: 0 5px;
    }
}

</style>

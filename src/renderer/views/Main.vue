<template>
	<div class="d-flex h-100 w-100 flex-column main-container">
		<main class="d-flex h-100">
			<transition name="fade" mode="out-in">
				<template>
					<Row class="left-menu">
						<Col>
						<Menu @on-select="push">
							<Submenu name="1">
								<template slot="title">
									<Icon type="ios-paper"></Icon>
									项目管理
								</template>
								<MenuItem name="/main/autoLogIn">自动切换</MenuItem>
							</Submenu>
						</Menu>
						</Col>
					</Row>
				</template>

			</transition>
			<transition name="fade">
				<router-view></router-view>
			</transition>
		</main>
	</div>
</template>

<script>
export default {
    data() {
        return {
            name: '123'
        }
	},
    methods: {
		push: function(url) {
			this.$router.push(url)
        }
    }
}
</script>

<style lang="scss">
.left-menu {
    box-shadow: 1px 3px 1px 0px #ccc;
}
.main-container .ivu-menu-vertical.ivu-menu-light:after {
    background: white;
}
</style>

<template>
	<div class="d-flex h-100 w-100 flex-column main-container">
		<main class="d-flex h-100">
			<transition name="fade" mode="out-in">
				<template>
					<Row class="left-menu">
						<Col>
						    <Menu @on-select="push">
							<MenuGroup title="账户">
								<MenuItem name="/main/autoLogIn">
									<Icon type="document-text"></Icon>
									自动登录
								</MenuItem>
							</MenuGroup>
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

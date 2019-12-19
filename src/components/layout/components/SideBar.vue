<template>
	<div id="sidebar">
		<el-scrollbar wrapClass="scrollbar-wrapper" style="height: 100%;">
			<el-menu
				background-color="#009688"
				text-color="#b3e0dc"
				:default-active="$route.path"
				active-text-color="#fff"
				:unique-opened="uniqueOpened">
				<!-- <el-menu-item index="1">
					<router-link to="/overview">
						<i class="iconfont icon-home"></i>
						<span></span>
					</router-link>
				</el-menu-item> -->
				 <template v-for="item in menuList">
					<el-menu-item 
						v-if="!item.children" 
						:key="item.path"
						:index="item.path">
						<router-link :to="item.path">{{ item.meta.title }}</router-link>
					</el-menu-item>
					<sub-menu v-else :key="item.path" :menu-data="item"></sub-menu>
				</template>
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<script>
import { routes } from "../../../router";
import SubMenu from "./SubMenu"

export default {
	data() {
		return {
			uniqueOpened: true,
			menuList: []
		}
	},
	components: {
		SubMenu
	},
	created() {
		console.log(this.$route.path)
		this.menuList = this.filterMenuList(routes);
	},
	methods: {
		filterMenuList(routes) {
			return routes.filter(item => {
				if (item.meta && item.meta.title) {
					return true;
				} else {
					return false;
				}
			});
		}
	}
}
</script>

<style lang="less" scoped>

.iconfont {
	font-size: 16px;
	font-weight: 700;
	color: #7AADDF;
}
.iconfont + span {
	font-weight: 700;
	color: #7AADDF;
}

.el-menu--inline li {
	background-color: #00695f !important;
	color: #333;
}

.scrollbar-wrapper {
	overflow-x: hidden !important;
}
</style>
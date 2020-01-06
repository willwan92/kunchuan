<template>
	<div id="sidebar">
		<el-scrollbar wrapClass="scrollbar-wrapper" style="height: 100%;">
			<el-menu
				background-color="#009688"
				text-color="#b3e0dc"
				:default-active="$route.path"
				:default-openeds="activeSubmenu"
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
						<router-link class="menu-link" :to="item.path">{{ item.meta.title }}</router-link>
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
			roleType: null,
			menuList: []
		}
	},
	computed: {
		activeSubmenu() {
			return this.$route.path.match(/^\/\w+/g);
		}
	},
	components: {
		SubMenu
	},
	created() {
		this.roleType = sessionStorage.getItem('roleType');
		this.menuList = this.filterMenuList(routes);
	},
	methods: {
		filterMenuList(routes) {
			let filtedList = [];
			let tmpMenu = null;
			routes.forEach(item => {
				const meta = item.meta;
				if (meta && meta.title && meta.roleType && meta.roleType.indexOf(this.roleType) !== -1) {
					tmpMenu = this._.clone(item);
					tmpMenu.children = null;

					if (Array.isArray(item.children)) {
						tmpMenu.children = this.filterMenuList(item.children);
					}

					filtedList.push(tmpMenu); 
				}
			});

			return filtedList;
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
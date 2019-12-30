<template functional>
  <el-submenu :index="props.menuData.path">
    <template slot="title">
        <i class=""></i>
        <span>{{ props.menuData.meta.title }}</span>
    </template>
    <template v-for="item in props.menuData.children">
        <el-menu-item v-if="!item.children"
            :key="item.path"
            :index="item.path">
						<router-link class="menu-link" active-class="active-menu-link" :to="`${props.menuData.path}/${item.path}`">{{ item.meta.title }}</router-link>
        </el-menu-item>
        <sub-menu v-else :key="item.path" :menu-data="item"></sub-menu>
    </template>
  </el-submenu>
</template>
<script>
export default {
  props: ["menuData"],
  created() {
    console.log(this.menuData)
  }
};
</script>

<style lang="less">
.menu-link {
  color: #ffffffb3;
}

.active-menu-link {
  color: #fff;
}

.el-submenu__title i {
    color: #ffffffb3;
}
</style>
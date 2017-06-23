<li
    :class="{
      'el-submenu': true,
      'is-active': active,
      'is-opened': opened
    }"
  >
    <div class="el-submenu__title" ref="submenu-title" :style="paddingStyle">
      <slot name="title"></slot>
      <i :class="{
        'el-submenu__icon-arrow': true,
        'el-icon-arrow-down': rootMenu.mode === 'vertical',
        'el-icon-caret-bottom': rootMenu.mode === 'horizontal'
      }">
      </i>
    </div>
    <template v-if="rootMenu.mode === 'horizontal'">
      <transition name="el-zoom-in-top">
        <ul class="el-menu" v-show="opened"><slot></slot></ul>
      </transition>
    </template>
    <collapse-transition v-else>
      <ul class="el-menu" v-show="opened"><slot></slot></ul>
    </collapse-transition>
  </li>
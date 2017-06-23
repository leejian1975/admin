
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <ul class="el-dropdown-menu" v-show="showPopper">
      <slot></slot>
    </ul>
  </transition>
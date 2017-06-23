<transition :name="closeTransition ? '' : 'el-zoom-in-center'">
    <span
      class="el-tag"
      :class="[type ? 'el-tag--' + type : '', {'is-hit': hit}]"
      :style="{backgroundColor: color}">
      <slot></slot>
      <i class="el-tag__close el-icon-close"
        v-if="closable"
        @click="handleClose"></i>
    </span>
  </transition>
<span>
    <transition :name="transition" @after-leave="doDestroy">
      <div
        class="el-popover"
        :class="[popperClass]"
        ref="popper"
        v-show="!disabled && showPopper"
        :style="{ width: width + 'px' }">
        <div class="el-popover__title" v-if="title" v-text="title"></div>
        <slot>{{ content }}</slot>
      </div>
    </transition>
    <slot name="reference"></slot>
  </span>
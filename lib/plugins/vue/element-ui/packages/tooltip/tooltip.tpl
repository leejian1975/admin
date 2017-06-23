<div
    class="el-tooltip"
    @mouseenter="handleShowPopper"
    @mouseleave="handleClosePopper">
    <div class="el-tooltip__rel" ref="reference">
      <slot></slot>
    </div>

    <transition :name="transition" @after-leave="doDestroy">
      <div
        class="el-tooltip__popper"
        :class="['is-' + effect, popperClass]"
        ref="popper"
        v-show="!disabled && showPopper">
        <slot name="content"><div v-text="content"></div></slot>
      </div>
    </transition>
  </div>
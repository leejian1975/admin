<el-input
    class="el-date-editor"
    :class="'el-date-editor--' + type"
    :readonly="!editable || readonly"
    :disabled="disabled"
    :size="size"
    v-clickoutside="handleClose"
    :placeholder="placeholder"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown.native="handleKeydown"
    :value="displayValue"
    @change.native="displayValue = $event.target.value"
    ref="reference">
    <i slot="icon"
      class="el-input__icon"
      @click="handleClickIcon"
      :class="[showClose ? 'el-icon-close' : triggerClass]"
      @mouseenter="handleMouseEnterIcon"
      @mouseleave="showClose = false"
      v-if="haveTrigger">
    </i>
  </el-input>
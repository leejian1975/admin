<transition name="el-zoom-in-top" @after-leave="$emit('dodestroy')">
    <div
      v-show="visible"
      :style="{ width: width + 'px' }"
      :class="popperClass"
      class="el-picker-panel time-select">
      <el-scrollbar noresize wrap-class="el-picker-panel__content">
        <div class="time-select-item"
          v-for="item in items"
          :class="{ selected: value === item.value, disabled: item.disabled }"
          :disabled="item.disabled"
          @click="handleClick(item)">{{ item.value }}</div>
      </el-scrollbar>
    </div>
  </transition>
<transition name="el-zoom-in-top" @after-leave="$emit('dodestroy')">
    <div
      v-show="currentVisible"
      :style="{width: width + 'px'}"
      class="el-time-panel"
      :class="popperClass">
      <div class="el-time-panel__content" :class="{ 'has-seconds': showSeconds }">
        <time-spinner
          ref="spinner"
          @change="handleChange"
          :show-seconds="showSeconds"
          @select-range="setSelectionRange"
          :hours="hours"
          :minutes="minutes"
          :seconds="seconds">
        </time-spinner>
      </div>
      <div class="el-time-panel__footer">
        <button
          type="button"
          class="el-time-panel__btn cancel"
          @click="handleCancel">{{ t('el.datepicker.cancel') }}</button>
        <button
          type="button"
          class="el-time-panel__btn confirm"
          @click="handleConfirm()">{{ t('el.datepicker.confirm') }}</button>
      </div>
    </div>
  </transition>
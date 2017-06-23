<transition
    name="el-zoom-in-top"
    @before-enter="panelCreated"
    @after-leave="$emit('dodestroy')">
    <div
      v-show="visible"
      :style="{ width: width + 'px' }"
      class="el-time-range-picker el-picker-panel"
      :class="popperClass">
      <div class="el-time-range-picker__content">
        <div class="el-time-range-picker__cell">
          <div class="el-time-range-picker__header">{{ t('el.datepicker.startTime') }}</div>
          <div
            :class="{ 'has-seconds': showSeconds }"
            class="el-time-range-picker__body el-time-panel__content">
            <time-spinner
              ref="minSpinner"
              :show-seconds="showSeconds"
              @change="handleMinChange"
              @select-range="setMinSelectionRange"
              :hours="minHours"
              :minutes="minMinutes"
              :seconds="minSeconds">
            </time-spinner>
          </div>
        </div>
        <div class="el-time-range-picker__cell">
          <div class="el-time-range-picker__header">{{ t('el.datepicker.endTime') }}</div>
          <div
            :class="{ 'has-seconds': showSeconds }"
            class="el-time-range-picker__body el-time-panel__content">
            <time-spinner
              ref="maxSpinner"
              :show-seconds="showSeconds"
              @change="handleMaxChange"
              @select-range="setMaxSelectionRange"
              :hours="maxHours"
              :minutes="maxMinutes"
              :seconds="maxSeconds">
            </time-spinner>
          </div>
        </div>
      </div>
      <div class="el-time-panel__footer">
        <button
          type="button"
          class="el-time-panel__btn cancel"
          @click="handleCancel()">{{ t('el.datepicker.cancel') }}</button>
        <button
          type="button"
          class="el-time-panel__btn confirm"
          @click="handleConfirm()"
          :disabled="btnDisabled">{{ t('el.datepicker.confirm') }}</button>
      </div>
    </div>
  </transition>
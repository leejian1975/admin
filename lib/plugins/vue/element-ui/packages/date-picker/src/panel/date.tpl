<transition name="el-zoom-in-top" @after-leave="$emit('dodestroy')">
    <div
      v-show="visible"
      :style="{
        width: width + 'px'
      }"
      class="el-picker-panel el-date-picker"
      :class="[{
        'has-sidebar': $slots.sidebar || shortcuts,
        'has-time': showTime
      }, popperClass]">
      <div class="el-picker-panel__body-wrapper">
        <slot name="sidebar" class="el-picker-panel__sidebar"></slot>
        <div class="el-picker-panel__sidebar" v-if="shortcuts">
          <button
            type="button"
            class="el-picker-panel__shortcut"
            v-for="shortcut in shortcuts"
            @click="handleShortcutClick(shortcut)">{{ shortcut.text }}</button>
        </div>
        <div class="el-picker-panel__body">
          <div class="el-date-picker__time-header" v-if="showTime">
            <span class="el-date-picker__editor-wrap">
              <el-input
                :placeholder="t('el.datepicker.selectDate')"
                :value="visibleDate"
                size="small"
                @change.native="visibleDate = $event.target.value" />
            </span>
            <span class="el-date-picker__editor-wrap">
              <el-input
                ref="input"
                @focus="timePickerVisible = !timePickerVisible"
                :placeholder="t('el.datepicker.selectTime')"
                :value="visibleTime"
                size="small"
                @change.native="visibleTime = $event.target.value" />
              <time-picker
                ref="timepicker"
                :date="date"
                :picker-width="pickerWidth"
                @pick="handleTimePick"
                :visible="timePickerVisible">
              </time-picker>
            </span>
          </div>
          <div class="el-date-picker__header" v-show="currentView !== 'time'">
            <button
              type="button"
              @click="prevYear"
              class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left">
            </button>
            <button
              type="button"
              @click="prevMonth"
              v-show="currentView === 'date'"
              class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-arrow-left">
            </button>
            <span
              @click="showYearPicker"
              class="el-date-picker__header-label">{{ yearLabel }}</span>
            <span
              @click="showMonthPicker"
              v-show="currentView === 'date'"
              class="el-date-picker__header-label"
              :class="{ active: currentView === 'month' }">{{t(`el.datepicker.month${ month + 1 }`)}}</span>
            <button
              type="button"
              @click="nextYear"
              class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right">
            </button>
            <button
              type="button"
              @click="nextMonth"
              v-show="currentView === 'date'"
              class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-arrow-right">
            </button>
          </div>

          <div class="el-picker-panel__content">
            <date-table
              v-show="currentView === 'date'"
              @pick="handleDatePick"
              :year="year"
              :month="month"
              :date="date"
              :value="value"
              :week="week"
              :selection-mode="selectionMode"
              :first-day-of-week="firstDayOfWeek"
              :disabled-date="disabledDate">
            </date-table>
            <year-table
              ref="yearTable"
              :year="year"
              :date="date"
              v-show="currentView === 'year'"
              @pick="handleYearPick"
              :disabled-date="disabledDate">
            </year-table>
            <month-table
              :month="month"
              :date="date"
              v-show="currentView === 'month'"
              @pick="handleMonthPick"
              :disabled-date="disabledDate">
            </month-table>
          </div>
        </div>
      </div>

      <div
        class="el-picker-panel__footer"
        v-show="footerVisible && currentView === 'date'">
        <a
          href="JavaScript:"
          class="el-picker-panel__link-btn"
          @click="changeToNow">{{ t('el.datepicker.now') }}</a>
        <button
          type="button"
          class="el-picker-panel__btn"
          @click="confirm">{{ t('el.datepicker.confirm') }}</button>
      </div>
    </div>
  </transition>
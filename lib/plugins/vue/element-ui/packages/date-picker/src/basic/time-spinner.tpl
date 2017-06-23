<div class="el-time-spinner" :class="{ 'has-seconds': showSeconds }">
    <el-scrollbar
      @mouseenter.native="emitSelectRange('hours')"
      @mousewheel.native="handleScroll('hour')"
      class="el-time-spinner__wrapper"
      wrap-style="max-height: inherit;"
      view-class="el-time-spinner__list"
      noresize
      tag="ul"
      ref="hour">
      <li
        @click="handleClick('hours', { value: hour, disabled: disabled }, true)"
        v-for="(disabled, hour) in hoursList"
        track-by="hour"
        class="el-time-spinner__item"
        :class="{ 'active': hour === hours, 'disabled': disabled }"
        v-text="hour"></li>
    </el-scrollbar>
    <el-scrollbar
      @mouseenter.native="emitSelectRange('minutes')"
      @mousewheel.native="handleScroll('minute')"
      class="el-time-spinner__wrapper"
      wrap-style="max-height: inherit;"
      view-class="el-time-spinner__list"
      noresize
      tag="ul"
      ref="minute">
      <li
        @click="handleClick('minutes', key, true)"
        v-for="(minute, key) in 60"
        class="el-time-spinner__item"
        :class="{ 'active': key === minutes }"
        v-text="key"></li>
    </el-scrollbar>
    <el-scrollbar
      v-show="showSeconds"
      @mouseenter.native="emitSelectRange('seconds')"
      @mousewheel.native="handleScroll('second')"
      class="el-time-spinner__wrapper"
      wrap-style="max-height: inherit;"
      view-class="el-time-spinner__list"
      noresize
      tag="ul"
      ref="second">
      <li
        @click="handleClick('seconds', key, true)"
        v-for="(second, key) in 60"
        class="el-time-spinner__item"
        :class="{ 'active': key === seconds }"
        v-text="key"></li>
    </el-scrollbar>
  </div>
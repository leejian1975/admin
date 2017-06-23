<div class="el-slider">
    <el-input-number
      v-model="inputValue"
      v-if="showInput"
      class="el-slider__input"
      @keyup.native="onInputChange"
      ref="input"
      :step="step"
      :disabled="disabled"
      :controls="showInputControls"
      :min="min"
      :max="max"
      size="small">
    </el-input-number>
    <div class="el-slider__runway"
      :class="{ 'show-input': showInput, 'disabled': disabled }"
      @click="onSliderClick" ref="slider">
      <div class="el-slider__bar" :style="{ width: currentPosition }"></div>
      <div
        class="el-slider__button-wrapper"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @mousedown="onButtonDown"
        :class="{ 'hover': hovering, 'dragging': dragging }"
        :style="{left: currentPosition}"
        ref="button">
        <el-tooltip placement="top" ref="tooltip">
          <span slot="content">{{ value }}</span>
          <div class="el-slider__button" :class="{ 'hover': hovering, 'dragging': dragging }"></div>
        </el-tooltip>
      </div>
      <div class="el-slider__stop" v-for="item in stops" :style="{ 'left': item + '%' }" v-if="showStops"></div>
    </div>
  </div>
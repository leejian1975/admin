<transition name="el-message-fade">
    <div
      class="el-message"
      :class="customClass"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer">
      <img class="el-message__img" :src="typeImg" alt="" v-if="!iconClass">
      <div class="el-message__group" :class="{ 'is-with-icon': iconClass }">
        <i class="el-message__icon" :class="iconClass" v-if="iconClass"></i>
        <p>{{ message }}</p>
        <div v-if="showClose" class="el-message__closeBtn el-icon-close" @click="close"></div>
      </div>
    </div>
  </transition>
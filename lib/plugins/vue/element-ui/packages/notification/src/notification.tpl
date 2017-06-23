<transition name="el-notification-fade">
    <div
      class="el-notification"
      :class="customClass"
      v-show="visible"
      :style="{ top: top ? top + 'px' : 'auto' }"
      @mouseenter="clearTimer()"
      @mouseleave="startTimer()">
      <i
        class="el-notification__icon"
        :class="[ typeClass, iconClass ]"
        v-if="type || iconClass">
      </i>
      <div class="el-notification__group" :class="{ 'is-with-icon': typeClass || iconClass }">
        <h2 class="el-notification__title" v-text="title"></h2>
        <div class="el-notification__content"><slot>{{ message }}</slot></div>
        <div class="el-notification__closeBtn el-icon-close" @click="close"></div>
      </div>
    </div>
  </transition>
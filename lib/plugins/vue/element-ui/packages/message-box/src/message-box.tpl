<transition name="msgbox-fade">
    <div class="el-message-box__wrapper" v-show="value" @click.self="handleWrapperClick">
      <div class="el-message-box" :class="customClass">
        <div class="el-message-box__header" v-if="title !== undefined">
          <div class="el-message-box__title">{{ title || t('el.messagebox.title') }}</div>
          <i class="el-message-box__close el-icon-close" @click="handleAction('cancel')" v-if="showClose"></i>
        </div>
        <div class="el-message-box__content" v-if="message !== ''">
          <div class="el-message-box__status" :class="[ typeClass ]"></div>
          <div class="el-message-box__message" :style="{ 'margin-left': typeClass ? '50px' : '0' }"><p>{{ message }}</p></div>
          <div class="el-message-box__input" v-show="showInput">
            <el-input v-model="inputValue" :placeholder="inputPlaceholder" ref="input"></el-input>
            <div class="el-message-box__errormsg" :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }">{{ editorErrorMessage }}</div>
          </div>
        </div>
        <div class="el-message-box__btns">
          <el-button
            :loading="cancelButtonLoading"
            :class="[ cancelButtonClasses ]"
            v-show="showCancelButton"
            @click.native="handleAction('cancel')">
            {{ cancelButtonText || t('el.messagebox.cancel') }}
          </el-button>
          <el-button
            :loading="confirmButtonLoading"
            ref="confirm"
            :class="[ confirmButtonClasses ]"
            v-show="showConfirmButton"
            @click.native="handleAction('confirm')">
            {{ confirmButtonText || t('el.messagebox.confirm') }}
          </el-button>
        </div>
      </div>
    </div>
  </transition>
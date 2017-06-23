
define(function (require, exports, module) {
  const Vue = require('vue');
  const merge = require('../merge.js');
  const PopupManager = require('./popup-manager.js');
  let idSeed = 1;
  const transitions = [];

  const hookTransition = function(transition) {
    if (transitions.indexOf(transition) !== -1) return;

    const getVueInstance = function(element) {
      let instance = element.__vue__;
      if (!instance) {
        const textNode = element.previousSibling;
        if (textNode.__vue__) {
          instance = textNode.__vue__;
        }
      }
      return instance;
    };

    Vue.transition(transition, {
      afterEnter(el) {
        const instance = getVueInstance(el);

        if (instance) {
          instance.doAfterOpen && instance.doAfterOpen();
        }
      },
      afterLeave(el) {
        const instance = getVueInstance(el);

        if (instance) {
          instance.doAfterClose && instance.doAfterClose();
        }
      }
    });
  }
  ;

  let scrollBarWidth;
  const getScrollBarWidth = function(){
    if (Vue.prototype.$isServer) return;
    if (scrollBarWidth !== undefined) return scrollBarWidth;

    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';

    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }
  ;

  const getDOM = function (dom) {
    if (dom.nodeType === 3) {
      dom = dom.nextElementSibling || dom.nextSibling;
      getDOM(dom);
    }
    return dom;
  };

  module.exports =  {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      transition: {
        type: String,
        default: ''
      },
      openDelay: {},
      closeDelay: {},
      zIndex: {},
      modal: {
        type: Boolean,
        default: false
      },
      modalFade: {
        type: Boolean,
        default: true
      },
      modalClass: {},
      lockScroll: {
        type: Boolean,
        default: true
      },
      closeOnPressEscape: {
        type: Boolean,
        default: false
      },
      closeOnClickModal: {
        type: Boolean,
        default: false
      }
    },

    created() {
      if (this.transition) {
        hookTransition(this.transition);
      }
    },

    beforeMount() {
      this._popupId = 'popup-' + idSeed++;
      PopupManager.register(this._popupId, this);
    },

    beforeDestroy() {
      PopupManager.deregister(this._popupId);
      PopupManager.closeModal(this._popupId);
      if (this.modal && this.bodyOverflow !== null && this.bodyOverflow !== 'hidden') {
        document.body.style.overflow = this.bodyOverflow;
        document.body.style.paddingRight = this.bodyPaddingRight;
      }
      this.bodyOverflow = null;
      this.bodyPaddingRight = null;
    },

    data() {
      return {
        opened: false,
        bodyOverflow: null,
        bodyPaddingRight: null,
        rendered: false
      };
    },
    watch: {
      value: function value(val) {
        var _this = this;

        if (val) {
          if (this._opening) return;
          if (!this.rendered) {
            this.rendered = true;
            Vue.nextTick(function () {
              _this.open();
            });
          } else {
            this.open();
          }
        } else {
          this.close();
        }
      }
    },

    methods: {
      open:function(options) {
        if (!this.rendered) {
          this.rendered = true;
          this.$emit('input', true);
        }

        const props = merge({}, this, options);

        if (this._closeTimer) {
          clearTimeout(this._closeTimer);
          this._closeTimer = null;
        }
        clearTimeout(this._openTimer);

        const openDelay = Number(props.openDelay);
        if (openDelay > 0) {
          this._openTimer = setTimeout(function(){
            this._openTimer = null;
          this.doOpen(props);
        },
          openDelay
        )
          ;
        } else {
          this.doOpen(props);
        }
      },

      doOpen(props) {
        if (this.$isServer) return;
        if (this.willOpen && !this.willOpen()) return;
        if (this.opened) return;

        this._opening = true;

        // 使用 vue-popup 的组件，如果需要和父组件通信显示的状态，应该使用 value，它是一个 prop，
        // 这样在父组件中用 v-model 即可；否则可以使用 visible，它是一个 data
        this.visible = true;
        this.$emit('input', true);

        const dom = getDOM(this.$el);

        const modal = props.modal;

        const zIndex = props.zIndex;
        if (zIndex) {
          PopupManager.zIndex = zIndex;
        }

        if (modal) {
          if (this._closing) {
            PopupManager.closeModal(this._popupId);
            this._closing = false;
          }
          PopupManager.openModal(this._popupId, PopupManager.nextZIndex(), dom, props.modalClass, props.modalFade);
          if (props.lockScroll) {
            if (!this.bodyOverflow) {
              this.bodyPaddingRight = document.body.style.paddingRight;
              this.bodyOverflow = document.body.style.overflow;
            }
            scrollBarWidth = getScrollBarWidth();
            let bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
            if (scrollBarWidth > 0 && bodyHasOverflow) {
              document.body.style.paddingRight = scrollBarWidth + 'px';
            }
            document.body.style.overflow = 'hidden';
          }
        }

        if (getComputedStyle(dom).position === 'static') {
          dom.style.position = 'absolute';
        }

        dom.style.zIndex = PopupManager.nextZIndex();
        this.opened = true;

        this.onOpen && this.onOpen();

        if (!this.transition) {
          this.doAfterOpen();
        }
      },

      doAfterOpen() {
        this._opening = false;
      },

      close: function close() {
        var _this3 = this;

        if (this.willClose && !this.willClose()) return;

        if (this._openTimer !== null) {
          clearTimeout(this._openTimer);
          this._openTimer = null;
        }
        clearTimeout(this._closeTimer);

        var closeDelay = Number(this.closeDelay);

        if (closeDelay > 0) {
          this._closeTimer = setTimeout(function () {
            _this3._closeTimer = null;
            _this3.doClose();
          }, closeDelay);
        } else {
          this.doClose();
        }
      },

      doClose: function doClose() {
        var _this4 = this;

        this.visible = false;
        this.$emit('input', false);
        this._closing = true;

        this.onClose && this.onClose();

        if (this.lockScroll) {
          setTimeout(function () {
            if (_this4.modal && _this4.bodyOverflow !== 'hidden') {
              document.body.style.overflow = _this4.bodyOverflow;
              document.body.style.paddingRight = _this4.bodyPaddingRight;
            }
            _this4.bodyOverflow = null;
            _this4.bodyPaddingRight = null;
          }, 200);
        }

        this.opened = false;

        if (!this.transition) {
          this.doAfterClose();
        }
      },

      doAfterClose() {
        PopupManager.closeModal(this._popupId);
        this._closing = false;
      }
    }
  }


})

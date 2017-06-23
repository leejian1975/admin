define(function (require,exports,module) {
    const CARD_SCALE = 0.83;
    module.exports = {
        name: 'ElCarouselItem',
        template:require('./carousel-item.tpl'),
        props: {
            name: String
        },

        data() {
            return {
                hover: false,
                translate: 0,
                scale: 1,
                active: false,
                ready: false,
                inStage: false
            };
        },

        methods: {
            processIndex(index, activeIndex, length) {
                if (activeIndex === 0 && index === length - 1) {
                    return -1;
                } else if (activeIndex === length - 1 && index === 0) {
                    return length;
                } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
                    return length + 1;
                } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
                    return -2;
                }
                return index;
            },

            calculateTranslate(index, activeIndex, parentWidth) {
                if (this.inStage) {
                    return parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1) / 4;
                } else if (index < activeIndex) {
                    return -(1 + CARD_SCALE) * parentWidth / 4;
                } else {
                    return (3 + CARD_SCALE) * parentWidth / 4;
                }
            },

            translateItem(index, activeIndex) {
                const parentWidth = this.$parent.$el.offsetWidth;
                const length = this.$parent.items.length;

                if (this.$parent.type === 'card') {
                    if (index !== activeIndex && length > 2) {
                        index = this.processIndex(index, activeIndex, length);
                    }
                    this.inStage = Math.round(Math.abs(index - activeIndex)) <= 1;
                    this.active = index === activeIndex;
                    this.translate = this.calculateTranslate(index, activeIndex, parentWidth);
                    this.scale = this.active ? 1 : CARD_SCALE;
                } else {
                    this.active = index === activeIndex;
                    this.translate = parentWidth * (index - activeIndex);
                }
                this.ready = true;
            },

            handleItemClick() {
                const parent = this.$parent;
                if (parent && parent.type === 'card') {
                    const index = parent.items.indexOf(this);
                    parent.setActiveItem(index);
                }
            }
        },

        created() {
            this.$parent && this.$parent.handleItemChange();
        },

        destroyed() {
            this.$parent && this.$parent.handleItemChange();
        }
    };
})
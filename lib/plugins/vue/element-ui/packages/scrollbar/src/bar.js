
define(function (require, exports, module) {
  const on = require('../../../src/utils/dom.js').on;
  const off = require('../../../src/utils/dom.js').off;
  const renderThumbStyle = require('./util.js').renderThumbStyle;
  const BAR_MAP = require('./util.js').BAR_MAP;
  /* istanbul ignore next */
    module.exports = {
        name: 'Bar',

        props: {
            vertical: Boolean,
            size: String,
            move: Number
        },

        computed: {
            bar: function bar() {
                return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
            },
            wrap: function wrap() {
                return this.$parent.wrap;
            }
        },

        render: function render(h) {
            var size = this.size,
                move = this.move,
                bar = this.bar;


            return h(
                'div',
                {
                    'class': ['el-scrollbar__bar', 'is-' + bar.key],
                    on: {
                        'mousedown': this.clickTrackHandler
                    }
                },
                [h(
                    'div',
                    {
                        ref: 'thumb',
                        'class': 'el-scrollbar__thumb',
                        on: {
                            'mousedown': this.clickThumbHandler
                        },

                        style: (0, renderThumbStyle)({ size: size, move: move, bar: bar }) },
                    []
                )]
            );
        },


        methods: {
            clickThumbHandler: function clickThumbHandler(e) {
                this.startDrag(e);
                this[this.bar.axis] = e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]);
            },
            clickTrackHandler: function clickTrackHandler(e) {
                var offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
                var thumbHalf = this.$refs.thumb[this.bar.offset] / 2;
                var thumbPositionPercentage = (offset - thumbHalf) * 100 / this.$el[this.bar.offset];

                this.wrap[this.bar.scroll] = thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100;
            },
            startDrag: function startDrag(e) {
                e.stopImmediatePropagation();
                this.cursorDown = true;

                (0, on)(document, 'mousemove', this.mouseMoveDocumentHandler);
                (0, on)(document, 'mouseup', this.mouseUpDocumentHandler);
                document.onselectstart = function () {
                    return false;
                };
            },
            mouseMoveDocumentHandler: function mouseMoveDocumentHandler(e) {
                if (this.cursorDown === false) return;
                var prevPage = this[this.bar.axis];

                if (!prevPage) return;

                var offset = (this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1;
                var thumbClickPosition = this.$refs.thumb[this.bar.offset] - prevPage;
                var thumbPositionPercentage = (offset - thumbClickPosition) * 100 / this.$el[this.bar.offset];

                this.wrap[this.bar.scroll] = thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100;
            },
            mouseUpDocumentHandler: function mouseUpDocumentHandler(e) {
                this.cursorDown = false;
                this[this.bar.axis] = 0;
                (0, off)(document, 'mousemove', this.mouseMoveDocumentHandler);
                document.onselectstart = null;
            }
        },

        destroyed: function destroyed() {
            (0, off)(document, 'mouseup', this.mouseUpDocumentHandler);
        }
    };

})
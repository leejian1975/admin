define(function(require,exports,module) {
    module.exports = {
        name: 'ElUploadDrag',
        template: require('./upload-dragger.tpl'),
        data: function data() {
            return {
                dragover: false
            };
        },

        methods: {
            onDrop: function onDrop(e) {
                this.dragover = false;
                this.$emit('file', e.dataTransfer.files);
            }
        }
    }
})
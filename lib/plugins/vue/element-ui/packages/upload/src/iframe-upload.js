define(function(require,exports,module) {
    const UploadDragger = require('./upload-dragger');
    exports.default = {
        components: {
            UploadDragger: UploadDragger
        },
        props: {
            type: String,
            data: {},
            action: {
                type: String,
                required: true
            },
            name: {
                type: String,
                default: 'file'
            },
            withCredentials: Boolean,
            accept: String,
            onStart: Function,
            onProgress: Function,
            onSuccess: Function,
            onError: Function,
            beforeUpload: Function,
            onPreview: {
                type: Function,
                default: function _default() {}
            },
            onRemove: {
                type: Function,
                default: function _default() {}
            },
            drag: Boolean,
            listType: String
        },

        data: function data() {
            return {
                mouseover: false,
                domain: '',
                file: null,
                disabled: false
            };
        },


        methods: {
            isImage: function isImage(str) {
                return str.indexOf('image') !== -1;
            },
            handleClick: function handleClick() {
                this.$refs.input.click();
            },
            handleChange: function handleChange(ev) {
                var file = ev.target.value;
                if (file) {
                    this.uploadFiles(file);
                }
            },
            uploadFiles: function uploadFiles(file) {
                if (this.disabled) return;
                this.disabled = true;
                this.file = file;
                this.onStart(file);

                var formNode = this.getFormNode();
                var dataSpan = this.getFormDataNode();
                var data = this.data;
                if (typeof data === 'function') {
                    data = data(file);
                }
                var inputs = [];
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        inputs.push('<input name="' + key + '" value="' + data[key] + '"/>');
                    }
                }
                dataSpan.innerHTML = inputs.join('');
                formNode.submit();
                dataSpan.innerHTML = '';
            },
            getFormNode: function getFormNode() {
                return this.$refs.form;
            },
            getFormDataNode: function getFormDataNode() {
                return this.$refs.data;
            }
        },

        created: function created() {
            this.frameName = 'frame-' + Date.now();
        },
        mounted: function mounted() {
            var self = this;
            !this.$isServer && window.addEventListener('message', function (event) {
                if (!self.file) return;
                var targetOrigin = new URL(self.action).origin;
                if (event.origin !== targetOrigin) return;
                var response = event.data;
                if (response.result === 'success') {
                    self.onSuccess(response, self.file);
                } else if (response.result === 'failed') {
                    self.onError(response, self.file);
                }
                self.disabled = false;
                self.file = null;
            }, false);
        },
        render: function render(h) {
            var drag = this.drag,
                uploadFiles = this.uploadFiles,
                listType = this.listType,
                frameName = this.frameName;

            var oClass = { 'el-upload': true };
            oClass['el-upload--' + listType] = true;

            return h(
                'div',
                {
                    'class': oClass,
                    on: {
                        'click': this.handleClick
                    },
                    nativeOn: {
                        'drop': this.onDrop,
                        'dragover': this.handleDragover,
                        'dragleave': this.handleDragleave
                    }
                },
                [h(
                    'iframe',
                    {
                        on: {
                            'load': this.onload
                        },

                        ref: 'iframe',
                        attrs: { name: frameName
                        }
                    },
                    []
                ), h(
                    'form',
                    { ref: 'form', attrs: { action: this.action, target: frameName, enctype: 'multipart/form-data', method: 'POST' }
                    },
                    [h(
                        'input',
                        {
                            'class': 'el-upload__input',
                            attrs: { type: 'file',

                                name: 'file',

                                accept: this.accept },
                            ref: 'input', on: {
                            'change': this.handleChange
                        }
                        },
                        []
                    ), h(
                        'input',
                        {
                            attrs: { type: 'hidden', name: 'documentDomain', value: this.$isServer ? '' : document.domain }
                        },
                        []
                    ), h(
                        'span',
                        { ref: 'data' },
                        []
                    )]
                ), drag ? h(
                        'upload-dragger',
                        {
                            on: {
                                'file': uploadFiles
                            }
                        },
                        [this.$slots.default]
                    ) : this.$slots.default]
            );
        }
    };

})
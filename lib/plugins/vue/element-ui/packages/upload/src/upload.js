define(function(require,exports,module) {
    const ajax = require('./ajax');
    const UploadDragger = require('./upload-dragger');


    module.exports = {
        components: {
            UploadDragger: UploadDragger
        },
        props: {
            type: String,
            action: {
                type: String,
                required: true
            },
            name: {
                type: String,
                default: 'file'
            },
            data: Object,
            headers: Object,
            withCredentials: Boolean,
            multiple: Boolean,
            accept: String,
            onStart: Function,
            onProgress: Function,
            onSuccess: Function,
            onError: Function,
            beforeUpload: Function,
            drag: Boolean,
            onPreview: {
                type: Function,
                default: function _default() {}
            },
            onRemove: {
                type: Function,
                default: function _default() {}
            },
            fileList: Array,
            autoUpload: Boolean,
            listType: String
        },

        data: function data() {
            return {
                mouseover: false
            };
        },


        methods: {
            isImage: function isImage(str) {
                return str.indexOf('image') !== -1;
            },
            handleChange: function handleChange(ev) {
                var files = ev.target.files;

                if (!files) return;
                this.uploadFiles(files);
                this.$refs.input.value = null;
            },
            uploadFiles: function uploadFiles(files) {
                var _this = this;

                var postFiles = Array.prototype.slice.call(files);
                if (!this.multiple) {
                    postFiles = postFiles.slice(0, 1);
                }

                if (postFiles.length === 0) {
                    return;
                }

                postFiles.forEach(function (rawFile) {
                    if (!_this.thumbnailMode || _this.isImage(rawFile.type)) {
                        _this.onStart(rawFile);
                        if (_this.autoUpload) _this.upload(rawFile);
                    }
                });
            },
            upload: function upload(rawFile, file) {
                var _this2 = this;

                if (!this.beforeUpload) {
                    return this.post(rawFile);
                }

                var before = this.beforeUpload(rawFile);
                if (before && before.then) {
                    before.then(function (processedFile) {
                        if (Object.prototype.toString.call(processedFile) === '[object File]') {
                            _this2.post(processedFile);
                        } else {
                            _this2.post(rawFile);
                        }
                    }, function () {
                        if (file) _this2.onRemove(file);
                    });
                } else if (before !== false) {
                    this.post(rawFile);
                } else {
                    if (file) this.onRemove(file);
                }
            },
            post: function post(rawFile) {
                var _this3 = this;

                (0, ajax)({
                    headers: this.headers,
                    withCredentials: this.withCredentials,
                    file: rawFile,
                    data: this.data,
                    filename: this.name,
                    action: this.action,
                    onProgress: function onProgress(e) {
                        _this3.onProgress(e, rawFile);
                    },
                    onSuccess: function onSuccess(res) {
                        _this3.onSuccess(res, rawFile);
                    },
                    onError: function onError(err) {
                        _this3.onError(err, rawFile);
                    }
                });
            },
            handleClick: function handleClick() {
                this.$refs.input.click();
            }
        },

        render: function render(h) {
            var handleClick = this.handleClick,
                drag = this.drag,
                handleChange = this.handleChange,
                multiple = this.multiple,
                accept = this.accept,
                listType = this.listType,
                uploadFiles = this.uploadFiles;

            var data = {
                class: {
                    'el-upload': true
                },
                on: {
                    click: handleClick
                }
            };
            data.class['el-upload--' + listType] = true;
            return h(
                'div',
                data,
                [drag ? h(
                        'upload-dragger',
                        {
                            on: {
                                'file': uploadFiles
                            }
                        },
                        [this.$slots.default]
                    ) : this.$slots.default, h(
                    'input',
                    { 'class': 'el-upload__input', attrs: { type: 'file', multiple: multiple, accept: accept },
                        ref: 'input', on: {
                        'change': handleChange
                    }
                    },
                    []
                )]
            );
        }
    };
})
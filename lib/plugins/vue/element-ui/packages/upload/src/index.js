define(function(require,exports,module) {
    const UploadList = require('./upload-list.js');
    const Upload = require('./upload.js');

    const IframeUpload = require('./iframe-upload.js');
    const ElProgress = require('../../progress/index');

    const Migrating = require('../../../src/mixins/migrating');
    function noop() {
    }

    module.exports = {
        name: 'ElUpload',

        mixins: [Migrating],

        components: {
            ElProgress: ElProgress,
            UploadList: UploadList,
            Upload: Upload,
            IframeUpload: IframeUpload
        },

        props: {
            action: {
                type: String,
                required: true
            },
            headers: {
                type: Object,
                default: function _default() {
                    return {};
                }
            },
            data: Object,
            multiple: Boolean,
            name: {
                type: String,
                default: 'file'
            },
            drag: Boolean,
            dragger: Boolean,
            withCredentials: Boolean,
            showFileList: {
                type: Boolean,
                default: true
            },
            accept: String,
            type: {
                type: String,
                default: 'select'
            },
            beforeUpload: Function,
            onRemove: {
                type: Function,
                default: noop
            },
            onChange: {
                type: Function,
                default: noop
            },
            onPreview: {
                type: Function
            },
            onSuccess: {
                type: Function,
                default: noop
            },
            onProgress: {
                type: Function,
                default: noop
            },
            onError: {
                type: Function,
                default: noop
            },
            fileList: {
                type: Array,
                default: function _default() {
                    return [];
                }
            },
            autoUpload: {
                type: Boolean,
                default: true
            },
            listType: {
                type: String,
                default: 'text' // text,picture,picture-card
            }
        },

        data: function data() {
            return {
                uploadFiles: [],
                dragOver: false,
                draging: false,
                tempIndex: 1
            };
        },


        watch: {
            fileList: {
                immediate: true,
                handler: function handler(fileList) {
                    var _this = this;

                    this.uploadFiles = fileList.map(function (item) {
                        item.uid = item.uid || Date.now() + _this.tempIndex++;
                        item.status = 'success';
                        return item;
                    });
                }
            }
        },

        methods: {
            handleStart: function handleStart(rawFile) {
                rawFile.uid = Date.now() + this.tempIndex++;
                var file = {
                    status: 'ready',
                    name: rawFile.name,
                    size: rawFile.size,
                    percentage: 0,
                    uid: rawFile.uid,
                    raw: rawFile
                };

                try {
                    file.url = URL.createObjectURL(rawFile);
                } catch (err) {
                    console.error(err);
                    return;
                }

                this.uploadFiles.push(file);
            },
            handleProgress: function handleProgress(ev, rawFile) {
                var file = this.getFile(rawFile);
                this.onProgress(ev, file, this.uploadFiles);
                file.status = 'uploading';
                file.percentage = ev.percent || 0;
            },
            handleSuccess: function handleSuccess(res, rawFile) {
                var file = this.getFile(rawFile);

                if (file) {
                    file.status = 'success';
                    file.response = res;

                    this.onSuccess(res, file, this.uploadFiles);
                    this.onChange(file, this.uploadFiles);
                }
            },
            handleError: function handleError(err, rawFile) {
                var file = this.getFile(rawFile);
                var fileList = this.uploadFiles;

                file.status = 'fail';

                fileList.splice(fileList.indexOf(file), 1);

                this.onError(err, file, this.uploadFiles);
                this.onChange(file, this.uploadFiles);
            },
            handleRemove: function handleRemove(file) {
                var fileList = this.uploadFiles;
                fileList.splice(fileList.indexOf(file), 1);
                this.onRemove(file, fileList);
            },
            getFile: function getFile(rawFile) {
                var fileList = this.uploadFiles;
                var target;
                fileList.every(function (item) {
                    target = rawFile.uid === item.uid ? item : null;
                    return !target;
                });
                return target;
            },
            clearFiles: function clearFiles() {
                this.uploadFiles = [];
            },
            submit: function submit() {
                var _this2 = this;

                this.uploadFiles.filter(function (file) {
                    return file.status === 'ready';
                }).forEach(function (file) {
                    _this2.$refs['upload-inner'].upload(file.raw, file);
                });
            },
            getMigratingConfig: function getMigratingConfig() {
                return {
                    props: {
                        'default-file-list': 'default-file-list is renamed to file-list.',
                        'show-upload-list': 'show-file-list is renamed to show-file-list.',
                        'thumbnail-mode': 'thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan'
                    }
                };
            }
        },

        render: function render(h) {
            var uploadList;

            if (this.showFileList) {
                uploadList = h(
                    UploadList,
                    {
                        attrs: {
                            listType: this.listType,
                            files: this.uploadFiles,

                            handlePreview: this.onPreview },
                        on: {
                            'remove': this.handleRemove
                        }
                    },
                    []
                );
            }

            var uploadData = {
                props: {
                    type: this.type,
                    drag: this.drag,
                    action: this.action,
                    multiple: this.multiple,
                    'before-upload': this.beforeUpload,
                    'with-credentials': this.withCredentials,
                    headers: this.headers,
                    name: this.name,
                    data: this.data,
                    accept: this.accept,
                    fileList: this.uploadFiles,
                    autoUpload: this.autoUpload,
                    listType: this.listType,
                    'on-start': this.handleStart,
                    'on-progress': this.handleProgress,
                    'on-success': this.handleSuccess,
                    'on-error': this.handleError,
                    'on-preview': this.onPreview,
                    'on-remove': this.handleRemove
                },
                ref: 'upload-inner'
            };

            var trigger = this.$slots.trigger || this.$slots.default;
            var uploadComponent = typeof FormData !== 'undefined' || this.$isServer ? h(
                    'upload',
                    uploadData,
                    [trigger]
                ) : h(
                    'iframeUpload',
                    uploadData,
                    [trigger]
                );

            return h(
                'div',
                null,
                [this.listType === 'picture-card' ? uploadList : '', this.$slots.trigger ? [uploadComponent, this.$slots.default] : uploadComponent, this.$slots.tip, this.listType !== 'picture-card' ? uploadList : '']
            );
        }
    };
})
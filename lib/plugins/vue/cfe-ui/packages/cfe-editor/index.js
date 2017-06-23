define(function(require,exports,module){
   // window.wangEditorJQueryPath = '../../../../jquery/jquery.min.js'
    const WangEditor = require('./wangEditor/js/wangEditor.js')
    require('./wangEditor/css/wangEditor.css');
    const store = require('./store.js');
    function noop(){
        
    }
    module.exports = {
        name: 'CfeEditor',
        install:function(Vue){
            Vue.component(this.name, this);
        },
        template:require('./editor.tpl'),
        props:{
            value:String,
            picOnLoad:{
                type:Function,
                default:noop
            },
            uploadImgUrl:{
                type:String,
                default:null
            },
            downloadImgBaseUrl:{
                type:String,
                default:null
            },
            uploadImgParams : {
                type: Object,
                default:null
            },
            uploadFileUrl:{
                type:String,
                default:null
            },
            downloadFileBaseUrl:{
                type:String,
                default:null
            },
            uploadFileParams : {
                type: Object,
                default:null
            },
            uploadImgFns:{
                onload:{
                    type:Function,
                    default:noop
                },
                ontimeout:{
                    type:Function,
                    default:noop
                },
                onerror:{
                    type:Function,
                    default:noop
                }
            },
            uploadFileFns:{
                onload:{
                    type:Function,
                    default:null
                },
                ontimeout:{
                    type:Function,
                    default:null
                },
                onerror:{
                    type:Function,
                    default:null
                }
            }
        },
        computed: {
            newsContent: function() {
                return store.state.newsContent
            }
        },
        watch: {
            'value':function (val,oldVal) {
                if(val !== oldVal){
                    store.state.newsContent = val;
                }
            },
            // 监控newsContent,变化后更新编辑器内容
            'newsContent': function() {
                editor.$txt.html(this.newsContent);
                this.$emit('change-content', this.newsContent )
            }
        },
        mounted: function () {
            // 初始化
            var _this = this;
            store.state.newsContent = this.value;
            WangEditor.config.printLog = false;
            editor = new WangEditor('editor')
            // 菜单
            editor.config.menus = ['bold', 'underline', 'italic', 'strikethrough', 'eraser', 'forecolor', 'bgcolor', '|', 'quote', 'unorderlist', 'orderlist', 'alignleft', 'aligncenter', 'alignright', '|', 'link', 'unlink', 'table', 'img', 'file','|', 'undo', 'redo', 'fullscreen']
            editor.config.pasteFilter = true;
            editor.config.uploadImgFileName = 'file'
            //editor.config.menus = ['source', '|', 'bold', 'underline', 'italic', 'strikethrough', 'eraser', 'forecolor', 'bgcolor', '|', 'quote', 'fontfamily', 'fontsize', 'head', 'unorderlist', 'orderlist', 'alignleft', 'aligncenter', 'alignright', '|', 'link', 'unlink', 'table', 'emotion', 'img', 'video', 'insertcode', '|', 'undo', 'redo', 'fullscreen']
            // 图片

            editor.config.uploadFileFileName = "file";
            if(_this.uploadImgUrl){
                editor.config.uploadImgUrl = _this.uploadImgUrl;
                if(_this.uploadImgParams){
                    editor.config.uploadImgParams = _this.uploadImgParams;
                }
                if(_this.downloadImgBaseUrl){
                    editor.config.downloadImgBaseUrl = _this.downloadImgBaseUrl;
                }
                editor.config.uploadImgFns.onload = function (resultText, xhr) {
                    if(resultText==""){
                        alert('上传错误，请重新上传');
                        return;
                    }
                    resultText = JSON.parse(resultText)
                    // 将结果插入编辑器
                    // modify by zhou
                    if(resultText.errorCode == 0){
                        // resultText 服务器端返回值
                        // xhr 是 xmlHttpRequest 对象，IE8、9中不支持

                        // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
                        var originalName = editor.uploadImgOriginalName || '';

                        // 如果 resultText 是图片的url地址，可以这样插入图片：
                        var src = resultText.data[0];
                        var html = '<img src="' + _this.downloadImgBaseUrl+src + '" alt="' + originalName + '" style="max-width:100%;"/>';
                        editor.command(null, 'insertHtml', html);
                        // 如果不想要 img 的 max-width 样式，也可以这样插入：
                        // editor.command(null, 'InsertImage', resultText);
                    }else{
                        alert('上传错误，请重新上传')
                    }

                };
                // 自定义timeout事件
                editor.config.uploadImgFns.ontimeout = function (xhr) {
                    // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
                    alert('上传超时，请重新上传');
                };

                // 自定义error事件
                editor.config.uploadImgFns.onerror = function (xhr) {
                    // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
                    alert('上传错误，请重新上传');
                };
            };
            if(_this.uploadFileUrl){
                editor.config.uploadFileUrl = _this.uploadFileUrl;
                if(_this.uploadFileParams){
                    editor.config.uploadFileParams = _this.uploadFileParams;
                }
                if(_this.downloadFileBaseUrl){
                    editor.config.downloadFileBaseUrl = _this.downloadFileBaseUrl;
                }
                editor.config.uploadFileFns.onload = function (resultText, xhr) {
                    if(resultText==""){
                        alert('上传错误，请重新上传');
                        return;
                    }
                    resultText = JSON.parse(resultText)
                    // 将结果插入编辑器
                    // modify by zhou
                    if(resultText.errorCode == 0){
                        // resultText 服务器端返回值
                        // xhr 是 xmlHttpRequest 对象，IE8、9中不支持

                        // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
                        var originalName = "附件：" + editor.uploadImgOriginalName || '';

                        // 如果 resultText 是图片的url地址，可以这样插入图片：
                        var src = resultText.data[0];
                        var html = '<p><a href="' + _this.downloadFileBaseUrl+src + '" style="max-width:100%;">'+ originalName +"</a></p>";
                        editor.command(null, 'insertHtml', html);
                        // 如果不想要 img 的 max-width 样式，也可以这样插入：
                        // editor.command(null, 'InsertImage', resultText);
                    }else{
                        alert('上传错误，请重新上传')
                    }

                };
                // 自定义timeout事件
                editor.config.uploadFileFns.ontimeout = function (xhr) {
                    // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
                    alert('上传超时，请重新上传');
                };

                // 自定义error事件
                editor.config.uploadFileFns.onerror = function (xhr) {
                    // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
                    alert('上传错误，请重新上传');
                };
            }

            
            // 创建
            editor.create()
            // 自定义方法，编辑器失去焦点，派发内容到store
            editor.$txt.on('focusout', function () {
                store.commit('newsContent',{
                    text:editor.$txt.html()
                });

            })
        }
    }
})
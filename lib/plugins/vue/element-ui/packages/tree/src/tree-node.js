define(function(require,exports,module) {
    const CollapseTransition = require('../../../src/transitions/collapse-transition');
    const ElCheckbox = require('../../checkbox/index');
    const emitter = require('../../../src/mixins/emitter');

    module.exports = {
        name: 'ElTreeNode',
        template:require('./tree-node.tpl'),
        componentName: 'ElTreeNode',

        mixins: [emitter],

        props: {
            node: {
                default() {
                    return {};
                }
            },
            props: {},
            renderContent: Function
        },

        components: {
            ElCheckbox,
            CollapseTransition,
            NodeContent: {
                props: {
                    node: {
                        required: true
                    }
                },
                render: function render(h) {
                    var parent = this.$parent;
                    var node = this.node;
                    var data = node.data;
                    var store = node.store;
                    return parent.renderContent ? parent.renderContent.call(parent._renderProxy, h, { _self: parent.tree.$vnode.context, node: node, data: data, store: store }) : h(
                        'span',
                        { 'class': 'el-tree-node__label' },
                        [this.node.label]
                    );
                }
            }
        },

        data() {
            return {
                tree: null,
                expanded: false,
                childNodeRendered: false,
                showCheckbox: false,
                oldChecked: null,
                oldIndeterminate: null
            };
        },

        watch: {
            'node.indeterminate'(val) {
                this.handleSelectChange(this.node.checked, val);
            },

            'node.checked'(val) {
                this.handleSelectChange(val, this.node.indeterminate);
            },

            'node.expanded'(val) {
                this.expanded = val;
                if (val) {
                    this.childNodeRendered = true;
                }
            }
        },

        methods: {
            getNodeKey(node, index) {
                const nodeKey = this.tree.nodeKey;
                if (nodeKey && node) {
                    return node.data[nodeKey];
                }
                return index;
            },

            handleSelectChange(checked, indeterminate) {
                if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
                    this.tree.$emit('check-change', this.node.data, checked, indeterminate);
                }
                this.oldChecked = checked;
                this.indeterminate = indeterminate;
            },

            handleClick() {
                const store = this.tree.store;
                store.setCurrentNode(this.node);
                this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
                this.tree.currentNode = this;
                if (this.tree.expandOnClickNode) {
                    this.handleExpandIconClick();
                }
                this.tree.$emit('node-click', this.node.data, this.node, this);
            },

            handleExpandIconClick() {
                if (this.expanded) {
                    this.node.collapse();
                } else {
                    this.node.expand();
                    this.$emit('node-expand', this.node.data, this.node, this);
                }
            },

            handleUserClick() {
                if (this.node.indeterminate) {
                    this.node.setChecked(this.node.checked, !this.tree.checkStrictly);
                }
            },

            handleCheckChange(ev) {
                if (!this.node.indeterminate) {
                    this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
                }
            },

            handleChildNodeExpand(node) {
                this.broadcast('ElTreeNode', 'tree-node-expand', node);
            }
        },

        created() {
            const parent = this.$parent;

            if (parent.isTree) {
                this.tree = parent;
            } else {
                this.tree = parent.tree;
            }

            const tree = this.tree;
            if (!tree) {
                console.warn('Can not find node\'s tree.');
            }

            const props = tree.props || {};
            const childrenKey = props['children'] || 'children';

            this.$watch(`node.data.${childrenKey}`, () => {
                this.node.updateChildren();
        });

            this.showCheckbox = tree.showCheckbox;

            if (this.node.expanded) {
                this.expanded = true;
                this.childNodeRendered = true;
            }

            if(this.tree.accordion) {
                this.$on('tree-node-expand', node => {
                    if(this.node !== node) {
                    this.node.collapse();
                }
            });
            }
        }
    };
})
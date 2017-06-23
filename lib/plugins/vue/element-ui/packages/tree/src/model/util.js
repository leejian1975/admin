
define(function(require,exports,module) {
  const NODE_KEY = '$treeNodeId';

  const markNodeData = function(node, data) {
    if (data[NODE_KEY]) return;
    Object.defineProperty(data, NODE_KEY, {
      value: node.id,
      enumerable: false,
      configurable: false,
      writable: false
    });
  };

  const getNodeKey = function(key, data) {
    if (!key) return data[NODE_KEY];
    return data[key];
  };
  module.exports = {
    NODE_KEY:NODE_KEY,
    markNodeData:markNodeData,
    getNodeKey:getNodeKey
  }
})
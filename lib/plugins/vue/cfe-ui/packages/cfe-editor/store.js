define(function(require,exports,module) {
    const Vuex = require('vuex')
    module.exports = new Vuex.Store({
        state:{
            newsContent: ''
        },
        mutations:{
            newsContent: function(state, payload) {
                state.newsContent = payload.text
            }
        }

    })
})
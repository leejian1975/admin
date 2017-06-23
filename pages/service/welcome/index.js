define(function (require, exports, module) {
    const curvejs = require('curve');

    var welcome = {
        template: require("./index.html"),
        mounted: function () {
            var Stage = curvejs.Stage,
                Curve = curvejs.Curve,
                motion = curvejs.motion,
                Word = curvejs.Word,
                canvas = document.getElementById('myCanvas'),
                stage = new Stage(canvas);

            var lineCount = 10,
                random = function (min, max) {
                    return min + Math.floor(Math.random() * (max - min + 1))
                },
                randomColor = function () {
                    return ['#22CAB3', '#90CABE', '#A6EFE8', '#C0E9ED', '#C0E9ED', '#DBD4B7', '#D4B879', '#ECCEB2', '#F2ADA6', '#FF7784'][util.random(0, 9)];
                    // return '#'+(Math.random()*0xffffff<<0).toString(16);
                },
                randomSpeed = function () {
                    return (Math.random() > 0.5 ? 1 : -1) * Math.random() * 2
                }

            function generatePosition() {

                stage.add(new Word('u', {
                    color: '#22CAB3',
                    motion: motion.noise,
                    data: {angle: 0, r: 5, step: Math.PI / 50}

                }))


                stage.add(new Word('u', {
                    color: '#22CAB3',
                    x: 60,
                    motion: motion.dance,
                    data: {angle: 0, r: 5, step: Math.PI / 50}
                }))

                stage.add(new Word('r', {
                    color: '#22CAB3',
                    x: 145,
                    motion: motion.dance,
                    data: {angle: 0, r: 5, step: Math.PI / 50}
                }))

                stage.add(new Word('v', {
                    color: '#22CAB3',
                    x: 210,
                    y: 10,
                    motion: motion.dance,
                    data: {angle: 0, r: 5, step: Math.PI / 50}
                }))

                stage.add(new Word('e', {
                    color: '#22CAB3',
                    x: 280,
                    y: -5,
                    motion: motion.dance,
                    data: {angle: 0, r: 5, step: Math.PI / 50}
                }))

                stage.add(new Word('j', {
                    color: '#FF7784',
                    x: 350,
                    motion: motion.dance,
                    data: {angle: 0, r: 5, step: Math.PI / 50}
                }))

                stage.add(new Word('s', {
                    color: '#FF7784',
                    x: 400,
                    motion: motion.dance,
                    data: {angle: 0, r: 5, step: Math.PI / 50}
                }))
            }


            function tick() {
                stage.update()
                requestAnimationFrame(tick)
            }


            generatePosition();
            tick()

        }

    }
    module.exports = welcome;
})
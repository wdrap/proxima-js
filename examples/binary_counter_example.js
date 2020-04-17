var Proxima = require('../src/proxima')

var training_data = [
    {inputs: [0,0,0], targets: [0,0,1]},
    {inputs: [0,0,1], targets: [0,1,0]},
    {inputs: [0,1,0], targets: [0,1,1]},
    {inputs: [0,1,1], targets: [1,0,0]},
    {inputs: [1,0,0], targets: [1,0,1]},
    {inputs: [1,0,1], targets: [1,1,0]},
    {inputs: [1,1,0], targets: [1,1,1]},
    {inputs: [1,1,1], targets: [0,0,0]}
]

var hyperParameters = {
    neural_network: [3,5,3],
    learning_rate: 0.5,
    max_iterations: 1500,
    cost_threshold: 0.005,
    log_after_x_iterations: 100
}

var p = new Proxima(hyperParameters)
p.train(training_data)

console.log(p.predict([0,0,0]))
console.log(p.predict([0,0,1]))
console.log(p.predict([0,1,0]))
console.log(p.predict([0,1,1]))
console.log(p.predict([1,0,0]))
console.log(p.predict([1,0,1]))
console.log(p.predict([1,1,0]))
console.log(p.predict([1,1,1]))

var Proxima = require('../src/proxima')

var xor_training_data = [
    {inputs: [0, 1], targets: [1]},
    {inputs: [1, 0], targets: [1]},
    {inputs: [0, 0], targets: [0]},
    {inputs: [1, 1], targets: [0]}
]

var hyperParameters = {
    neural_network: [2,3,1],
    learning_rate: 0.5,
    max_iterations: 15000,
    cost_threshold: 0.005,
    log_after_x_iterations: 0,
}

var p = new Proxima(hyperParameters)
p.train(xor_training_data)
console.log(p.predict([0,1]))
console.log(p.predict([1,0]))
console.log(p.predict([0,0]))
console.log(p.predict([1,1]))
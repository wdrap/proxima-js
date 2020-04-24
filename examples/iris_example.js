var Proxima = require('../src/proxima')
var data = require('./bezdek_iris_data.json')

var hyperParameters = {
    neural_network: [4,4,3],
    learning_rate: 0.1,
    epoch_limit: 25000,
    cost_threshold: 0.002,
    log_after_x_epochs: 500,
}

var p = new Proxima(hyperParameters)
p.train(data, ["Iris-setosa", "Iris-versicolor", "Iris-virginica"])


console.log(p.predict([5.0,3.3,1.4,0.2]))  // 1, 0, 0
console.log(p.predict([5.7,2.8,4.1,1.3]))  // 0, 1, 0
console.log(p.predict([5.9,3.0,5.1,1.8]))  // 0, 0, 1

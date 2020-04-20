# Proxima
Proxima is a **fully connected neural network** micro library written in javascript for browsers and nodejs.
 
_Support Proxima development by donating or becoming a sponsor._   
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=878QVT5YLAQC2&currency_code=EUR&source=url)
[![Donate](http://img.shields.io/liberapay/patrons/wdrap.svg?logo=liberapay)](https://liberapay.com/wdrap/donate)
 
## Installation
```
npm install proxima --save
```
## Usage
```javascript
var Proxima = require('proxima-js') // only for nodejs

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
```
The above program will print something like this to the console
```
training: 32.45ms error: 0.004967480795865376 iterations: 1301
training: 37.64ms
[ 0.9003734502498547 ]
[ 0.9000429398063956 ]
[ 0.09926572660491863 ]
[ 0.09967427748286291 ]
```
### Configuration options

```javascript
var hyperParameters = {
    neural_network: [2,3,1],    // 3 layered neural network with 1 input layer with 2 nodes, 1 hidden layer with 3 nodes and 1 output layer with 1 node
    learning_rate: 0.5,         // η Defaults to 0.5
    max_iterations: 15000,      // Maximum training iterations if the cost_threshold in not reached
    cost_threshold: 0.005,      // Stops training when the result of the cost/loss function is less, defaults to 0.05  
    log_after_x_iterations: 0,  // Outputs the error after x iterations, 0 means no output
}
```

# What's behind Proxima
## Activation functions
- Sigmoid (default)
- Tanh (todo)
- ReLu (todo)
- Leaky ReLu (todo)
- Swish (todo)

## Cost functions
- Squared Error (default)
- Mean Squared Error (todo)
- Root Mean Square (todo)
- The Sum of Square Errors (todo)

## Gradient descent methods
- Stochastic gradient descent (default)
- Mini-batch gradient descent (todo)
- Batch gradient descent (todo)

## Gradient descent optimization algorithms
- Regular gradient descent (default)
- Momentum based gradient descent (todo)             
- Implement other gradient descent optimization algorithms (todo)
 

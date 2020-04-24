;(function () {
    'use strict'
    var nn, weights, bias_weights, outputs, gradients, error, labels

    function setup(hyperParams) {
        nn = hyperParams.neural_network
        weights = new Array(nn.length - 2)
        bias_weights = new Array(nn.length - 2)
        outputs = new Array(nn.length)
        gradients = new Array(nn.length-1)

        for (var l = 0, layers = nn.length; l < layers; l++) {
            // initialize the output and gradient vector with a value of 0
            outputs[l] = new Array(nn[l])
            gradients[l] = new Array(nn[l])
            for (var n = 0, nodes = nn[l]; n < nodes; n++) {
                outputs[l][n] = 0
                gradients[l][n] = 0
            }

            if (l === layers - 1) break
            // Initialize the bias vectors and weight matrices with a value between -1 and 1
            bias_weights[l] = new Array(nn[l+1])
            weights[l] = new Array(nn[l+1])
            for (var i = 0; i < nn[l+1]; i++) {
                bias_weights[l][i] = Math.random() * 2 - 1
                weights[l][i] = new Array(nn[l])
                for (var j = 0; j < nn[l]; j++) {
                    weights[l][i][j] = Math.random() * 2 - 1
                }
            }
        }
    }

    function feedForward(inputs) {
        outputs[0] = inputs
        for (var l = 0; l < nn.length - 1; l++) {
            for (var n = 0; n < nn[l+1]; n++) {
                var sum = bias_weights[l][n]
                for (var s = 0; s < nn[l]; s++) {
                    sum += outputs[l][s] * weights[l][n][s]
                }
                outputs[l + 1][n] = 1 / (1 + Math.exp(-sum)) // sigmoid activation function
            }
        }
        return outputs[nn.length - 1]
    }

    function costFunction(targets) {
        var output = outputs[outputs.length - 1]
        var error = 0
        for (var i = 0; i < output.length; i++) {
            error += Math.pow(targets[i] - output[i], 2)
        }
        var se = 0.5 * error
        return se
    }

    function backPropagation(targets) {
        for (var l = nn.length - 1; l >= 0; l--) {
            for (var n = 0, nodes = nn[l]; n < nodes; n++) {
                var error = 0
                if (l === nn.length - 1) {
                    error = targets[n] - outputs[l][n]
                } else {
                    for (var g = 0; g < gradients[l+1].length; g++) {
                        error +=  gradients[l+1][g] * weights[l][g][n]
                    }
                }
                gradients[l][n] = error * outputs[l][n] * (1 - outputs[l][n])
            }
        }
    }

    function updateWeights(learningRate) {
        for (var l = 0; l < nn.length - 1; l++) {
            for (var n = 0; n < nn[l+1]; n++) {
                bias_weights[l][n] += gradients[l+1][n] * learningRate
                for (var s = 0; s < nn[l]; s++) {
                    weights[l][n][s] += gradients[l+1][n] * learningRate * outputs[l][s]
                }
            }
        }
    }

    function flattenOutputs(outputs, error) {
        var threshold = parseFloat(error.toFixed(2))
        var flattened = new Array(outputs.length)
        for (var i = 0; i < outputs.length; i++) {
                flattened[i] = (outputs[i] < threshold / 10 || outputs[i] > threshold) ?
                    Math.round(outputs[i]) : outputs[i]
        }
        return flattened
    }

    function labelOutputs(outputs, labels) {
        var labelled = new Array(outputs.length)
        for (var i = 0; i < outputs.length; i++) {
            if (labels !== undefined && outputs[i] === 1) {
                return labels[i]
            }
            labelled[i] = !!outputs[i]
        }
        return labelled
    }

    function Proxima(hyperParameters) {
        hyperParameters = hyperParameters || {}
        hyperParameters.neural_network = hyperParameters.neural_network || [2,3,1]
        hyperParameters.learning_rate = hyperParameters.learning_rate || 0.3

        var epoch_limit = hyperParameters.epoch_limit || 15000
        var cost_threshold = hyperParameters.cost_threshold || 0.005
        var log_after_x_epochs = hyperParameters.log_after_x_epochs || 0
        setup(hyperParameters)
        return {
            train: function(data, target_labels) {
                labels = target_labels
                error = 1
                console.time('training')
                for (var epoch = 0; epoch < epoch_limit && error > cost_threshold;) {
                    for (var j = 0, length = data.length; j < length; j++) {
                        feedForward(data[j].inputs)
                        error = costFunction(data[j].targets)
                        if (++epoch % log_after_x_epochs === 0 || error <= cost_threshold)
                            console.timeLog('training', 'error: ' + error + ' epochs: ' + epoch)
                        if (error <= cost_threshold) break;
                        backPropagation(data[j].targets)
                        updateWeights(hyperParameters.learning_rate)
                    }
                }
                console.timeEnd('training')
            },
            predict: function(inputs) {
                var outputs = feedForward(inputs)
                var flattened = flattenOutputs(outputs, error)
                var labeled =  labelOutputs(flattened, labels)
                return {
                    outputs: outputs,
                    flattened: flattened,
                    labeled: labeled
                }
            },
            export: function() {
                return JSON.stringify({
                    nn: nn,
                    weights: weights,
                    bias_weights: bias_weights,
                    gradients: gradients,
                    error: error,
                    labels: labels
                })
            },
            import: function(state) {
                var s = JSON.parse(state)
                nn = s.nn
                weights = s.weights
                bias_weights = s.bias_weights
                gradients = s.gradients
                error = s.error
                labels = s.labels
            },
            /* start-test-block */
            _feedForward: feedForward,
            _costFunction: costFunction,
            _backPropagation: backPropagation,
            _updateWeights: updateWeights,
            _flattenOutputs: flattenOutputs,
            _labelOutputs: labelOutputs,
            _nn: function() { return nn },
            _outputs: function () { return outputs },
            _gradients: function() { return gradients },
            _weights: function() { return weights },
            /* end-test-block */
        }
    }

    if (typeof exports !== 'undefined' && module.exports) {
        module.exports = Proxima
    } else {
        this.Proxima = Proxima
    }
})()
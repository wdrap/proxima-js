;(function () {
    'use strict'
    var nn, weights, bias_weights, outputs, gradients

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

    function Proxima(hyperParameters) {
        hyperParameters = hyperParameters || {}
        hyperParameters.neural_network = hyperParameters.neural_network || [2,3,1]
        hyperParameters.learning_rate = hyperParameters.learning_rate || 0.3

        var max_iterations = hyperParameters.max_iterations || 15000
        var cost_threshold = hyperParameters.cost_threshold || 0.005
        var log_after_x_iterations = hyperParameters.log_after_x_iterations || 0
        setup(hyperParameters)
        return {
            train: function(data) {
                console.time('training')
                var se = 1
                for (var i = 0; i < max_iterations && se > cost_threshold; i++) {
                    for (var j = 0, length = data.length; j < length; j++) {
                        feedForward(data[j].inputs)
                        se = costFunction(data[j].targets)
                        if (i % log_after_x_iterations === 0)
                            console.timeLog('training', 'error: ' + se)

                        if (se > cost_threshold) {
                            backPropagation(data[j].targets)
                            updateWeights(hyperParameters.learning_rate)
                        }
                    }
                }
                console.timeLog('training', 'error: ' + se, 'iterations: ' + i )
                console.timeEnd('training')
            },
            predict: function(inputs) {
                return feedForward(inputs)
            }
        }
    }

    /* start-test-block */
    // For now, no need for a testing framework. Code between xxx-test-block comments will be removed by grunt.
    function test() {
        setup({neural_network: [2,2,2]})
        bias_weights = [[0.8, 0.25], [0.15, 0.7]]
        weights = [[[0.1, 0.12], [0.2, 0.17]], [[0.05, 0.33], [0.4, 0.07]]]

        JSON.stringify(weights) === JSON.stringify([
            [[0.1, 0.12], [0.2, 0.17]],
            [[0.05, 0.33], [0.4, 0.07]]
        ]) ? console.log('passed setup weights') : console.error('failed setup weights')

        JSON.stringify(bias_weights) === JSON.stringify([
            [0.8, 0.25],
            [0.15, 0.7]
        ]) ? console.log('passed setup bias weights') : console.error('failed setup bias weights')

        feedForward([.15, .35])
        JSON.stringify(outputs) === JSON.stringify([
            [.15,.35],
            [0.7020334875314546,0.5840690618470776],
            [0.593353109032932,0.7353032619293852]
        ]) ? console.log('passed feedforward') : console.error('failed feedforward')

        var se = costFunction([0, 1])
        se === 0.21106613757213508 ? console.log('passed costFunction') : console.error('failed costFunction')

        backPropagation([0, 1])
        JSON.stringify(gradients) === JSON.stringify([
            [-0.00023446365814264232, -0.0003332022601439299],
            [0.0028133067134372743, -0.010601306617214415],
            [-0.14316732182367956, 0.051518554765687945]
        ]) ? console.log('passed gradients') : console.error('failed gradients')

        updateWeights(.5)
        JSON.stringify(weights) === JSON.stringify([
            [[0.1002109980035078, 0.12049232867485152], [0.19920490200370894, 0.1681447713419875]],
            [[-0.00025412712020794065, 0.2881901983276424], [0.41808387533736807, 0.08504519697485632]]
        ]) ? console.log('passed updated weights') : console.error('failed updated weights')
        JSON.stringify(bias_weights) === JSON.stringify(
            [[0.8014066533567187, 0.2446993466913928],
                [0.07841633908816022, 0.725759277382844]
        ]) ? console.log('passed updated bias weights') : console.error('failed updated bias weights')
    }

    test()
    /* end-test-block */

    if (typeof exports !== 'undefined' && module.exports) {
        module.exports = Proxima
    } else {
        this.Proxima = Proxima
    }
})()
importScripts('../../../src/proxima.js')

var startTraining = function(clamp) {
    var p = Proxima({
        neural_network: clamp.nn.split(','),
        learning_rate: clamp.lr,
        cost_threshold: clamp.ct,
        cost_function: clamp.cf,
        epoch_limit: clamp.me,
        log_after_x_epochs: clamp.le
    })

    var cost = []
    var accuracy = []
    var trainingData = JSON.parse(clamp.trainingData)
    var targetLabels = clamp.tl.split(',')
    p.train(trainingData, targetLabels, function(error, epoch, avg) {
        cost.push({ x : epoch, y : error })
        accuracy.push({ x: epoch, y: avg })
    })

    return { cost: cost, accuracy: accuracy, state: p.export()}
}

self.addEventListener('message', function(e) {
    var result = startTraining(e.data)
    self.postMessage(result)
    self.close()
})

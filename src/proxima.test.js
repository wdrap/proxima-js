var Proxima = require('./proxima')
var expect = require('chai').expect;

describe('Proxima internal members test', function() {
    var p
    beforeEach(function() {
        p = Proxima({ neural_network: [2,2,2] })
    })

    it('#setup()', function() {
        expect(p._nn()).to.eql([2,2,2])
    })

    it('#feedForward()', function() {
        p.import(JSON.stringify({
            "nn":[2,2,2],
            "weights": [[[0.1, 0.12], [0.2, 0.17]], [[0.05, 0.33], [0.4, 0.07]]],
            "bias_weights":[[0.8, 0.25], [0.15, 0.7]],
            "gradients":[[0,0],[0,0],[0,0]]
        }))

        p._feedForward([.15, .35])

        expect(p._outputs()).to.eql([
            [.15,.35],
            [0.7020334875314546,0.5840690618470776],
            [0.593353109032932,0.7353032619293852]
        ])
    })

    it('#costFunction()', function() {
        p.import(JSON.stringify({
            "nn":[2,2,2],
            "weights": [[[0.1, 0.12], [0.2, 0.17]], [[0.05, 0.33], [0.4, 0.07]]],
            "bias_weights":[[0.8, 0.25], [0.15, 0.7]],
            "gradients":[[0,0],[0,0],[0,0]]
        }))

        p._feedForward([.15, .35])
        var se = p._costFunction([0, 1])

        expect(se).to.equal(0.21106613757213508)
    })

    it('#backPropagation()', function() {
        p.import(JSON.stringify({
            "nn":[2,2,2],
            "weights": [[[0.1, 0.12], [0.2, 0.17]], [[0.05, 0.33], [0.4, 0.07]]],
            "bias_weights":[[0.8, 0.25], [0.15, 0.7]],
            "gradients":[[0,0],[0,0],[0,0]]
        }))
        p._feedForward([.15, .35])

        p._backPropagation([0, 1])

        expect(p._gradients()).to.eql([
            [-0.00023446365814264232, -0.0003332022601439299],
            [0.0028133067134372743, -0.010601306617214415],
            [-0.14316732182367956, 0.051518554765687945]
        ])
    })

    it('#flattenOutputs()', function() {
        expect(p._flattenOutputs([.91], .9 )).to.deep.equal([1])
        expect(p._flattenOutputs([.9], .9 )).to.deep.equal([.9])
        expect(p._flattenOutputs([.09], .9 )).to.deep.equal([.09])
        expect(p._flattenOutputs([.089], .9 )).to.deep.equal([0])
    })
})

describe('Proxima public api', function() {
    var p
    beforeEach(function() {
        p = new Proxima()
    })

    it('#export()', function() {
        var state = JSON.parse(p.export())

        expect(state.nn).to.deep.equal([2,3,1])
        expect(state.weights).to.have.length(2)
        expect(state.bias_weights).to.have.length(2)
        expect(state.gradients).to.deep.equal([[0,0],[0,0,0],[0]])
    })

    it('#export()', function() {
        var state = "{" +
            "\"nn\":[2,3,1]," +
            "\"weights\":[[[0.6554717212349654,0.5305102561681427]," +
                          "[0.353978150120847,-0.09435837659557977]," +
                          "[0.5852378605247415,-0.9249122090210036]]," +
                          "[[0.2902240501124158,0.8207726520360872,-0.571895961747471]]]," +
            "\"bias_weights\":[[-0.29607653317283145,0.17364299876628264,0.5532288779047021],[-0.4348789349863531]]," +
            "\"gradients\":[[0,0],[0,0,0],[0]]}"
        p.import(state)

        expect(p.export()).to.eql(state)
    })
})
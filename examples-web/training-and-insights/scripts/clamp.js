;(function() {
    // wip a rough implementation for two-way binding, it serves my needs for now.
    // nobody should use this!
    'use strict'
    var elements = document.querySelectorAll('[clamp]')
    var clamp = {}
    var cursorPosition = 0

    elements.forEach(function(element) {
        if (element instanceof HTMLInputElement
            || element instanceof HTMLTextAreaElement) {
            var propToBind = element.getAttribute('clamp')
            register(propToBind)
            if (element.type === 'text' || element.type === 'textarea') {
                element.onkeyup = function () { clamp[propToBind] = element.value }
            } else if (element.type === 'number') {
                element.oninput = function () { clamp[propToBind] = element.value }
            } else if (element instanceof HTMLSpanElement && element.contentEditable === true) {
                element.oninput = function(e) {
                    // preserve cursor position
                    var range = window.getSelection().getRangeAt(0)
                    var startRange = range.cloneRange()
                    startRange.selectNodeContents(element)
                    startRange.setEnd(range.startContainer, range.startOffset)
                    cursorPosition = startRange.toString().length
                    clamp[propToBind] = element.textContent
                }
            }
        }

        // add focus when parent node is clicked
        element.parentNode.addEventListener('click', function(e) {
            element.focus()
        })
    })

    function register(prop) {
        if (!clamp.hasOwnProperty(prop)) {
            var prevValue
            Object.defineProperty(clamp, prop, {
                set: function (value) {
                    prevValue = value
                    console.log(prevValue)
                    console.log(value)
                    elements.forEach(function (element) {
                        if (element.getAttribute('clamp') === prop) {
                            if (element.type && (element.type === 'text'
                                || element.type === 'textarea'
                                || element.type === 'number')) {
                                element.value = value
                            } else if(element instanceof HTMLSpanElement) {
                                element.innerHTML = value
                                if (element.childNodes.length) { // restore cursor position if there is text
                                    var range = document.createRange()
                                    range.setStart(element.childNodes[0], cursorPosition)
                                    range.collapse(true)
                                    var sel = window.getSelection()
                                    sel.removeAllRanges()
                                    sel.addRange(range)
                                }
                            } else if (!element.type) {
                                element.innerHTML = value
                            }
                        }
                    })
                },
                get: function() {
                    return prevValue
                },
                enumerable: true
            })
        }
    }

    window.clamp = clamp
})()
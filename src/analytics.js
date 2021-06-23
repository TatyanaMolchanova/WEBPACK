import * as $ from 'jquery'

function createAnalytics() {
    let counter = 0
    let destroyed = false

    console.log('test')

    const listener = () => counter++

    // document.addEventListener('click', listener)
    $(document).on('click', listener)

    return {
        destroy() {
            // document.removeEventListener('click', listener)
            $(document).off('click', listener)
            destroyed = true
        },

        getClicks() {
            if (destroyed) {
                return `Analytics is destroyed. Total clicks = ${counter}`
            }
            return counter
        }
    }
}

// window.analytics = createAnalytics()
window['analytics'] = createAnalytics()
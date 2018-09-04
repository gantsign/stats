package index

import kotlinext.js.require
import kotlinext.js.requireAll
import react.dom.render
import stats.ui.app
import kotlin.browser.document

fun main(args: Array<String>) {
    requireAll(require.context("src", true, js("/\\.css$/")))

    render(document.getElementById("root")) {
        app()
    }
}

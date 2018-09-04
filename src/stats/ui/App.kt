package stats.ui

import ext.materialui.core.styles.MTheme
import ext.materialui.core.styles.createMuiTheme
import kotlinext.js.js
import react.RBuilder
import react.RComponent
import react.RProps
import react.RState
import stats.ui.summarytable.summaryTable
import kotlin.js.Date

class App : RComponent<RProps, RState>() {

    override fun RBuilder.render() {
        summaryTable()
    }
}

fun RBuilder.app() = child(App::class) {}

val darkTheme: MTheme = createMuiTheme(js {
    palette = js {
        type = "dark"
    }
})

fun String?.parseIsoDateToMillis(): Double? {
    if (this == null) {
        return null
    }
    return Date.parse(this)
}

fun String?.reformatIsoAsLocaleDate(): String {
    if (this == null) {
        return ""
    }
    return Date(this).toLocaleDateString()
}

fun String?.reformatIsoAsLocaleDatetime(): String {
    if (this == null) {
        return ""
    }
    val date = Date(this)
    return "${date.toLocaleDateString()} ${date.toLocaleTimeString()}"
}

fun Int?.toLocaleString(): String {
    if (this == null) {
        return ""
    }
    return asDynamic().toLocaleString() as String
}

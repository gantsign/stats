package ext.semver

import ext.semver.JsInternalSemver.compare

@JsModule("semver")
external object JsInternalSemver {

    @JsName("compare")
    fun compare(v1: String, v2: String): Int
}

object Semver {
    fun comparator(): Comparator<String?> =
        nullsFirst(Comparator(::compare))
}

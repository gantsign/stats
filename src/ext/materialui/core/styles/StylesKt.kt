package ext.materialui.core.styles

import ext.materialui.core.styles.JsInternalStyles.withStyles
import react.Component
import react.RClass
import react.RProps

@JsModule("@material-ui/core/styles")
external object JsInternalStyles {

    @JsName("withStyles")
    fun <P : RProps, C : RClass<P>> withStyles(styleSupplier: (theme: dynamic) -> dynamic): (rClass: C) -> C
}

fun <P : RProps> RClass<P>.withStyles(stylesSupplier: (theme: dynamic) -> dynamic): RClass<P> =
    withStyles<P, RClass<P>>(stylesSupplier)(this)

inline fun <P : RProps, reified C : Component<P, *>> withStyles(
    noinline stylesSupplier: (theme: dynamic) -> dynamic
): RClass<P> {

    @Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE", "UNCHECKED_CAST")
    val rClass = C::class.js as RClass<P>

    return rClass.withStyles(stylesSupplier)
}

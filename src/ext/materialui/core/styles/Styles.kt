@file:JsModule("@material-ui/core/styles")

package ext.materialui.core.styles

import react.RClass

@JsName("createMuiTheme")
external fun createMuiTheme(config: dynamic): MTheme

@JsName("MuiThemeProvider")
external val muiThemeProvider: RClass<MuiThemeProviderProps>

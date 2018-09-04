package ext.axios

import kotlin.js.Promise

@JsModule("axios")
external object Axios {
    fun <T> get(url: String): Promise<AxiosResponse<T>>
}

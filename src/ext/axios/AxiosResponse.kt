package ext.axios

external interface AxiosResponse<T> {
    val data: T
    val status: Number
}

import { http } from './http'

const ApiService = {

    removeHeader() {
        http.defaults.headers.common = {}
    },

    get(resource) {
        return http.get(resource)
    },

    getParams(resource, data) {
        return http.get(resource, data)
    },

    post(resource, data) {
        return http.post(resource, data)
    },

    put(resource, data) {
        return http.put(resource, data)
    },

    delete(resource) {
        return http.delete(resource)
    },

    deleteParams(resource, data) {
        return http.delete(resource, data)
    },

    customRequest(data) {
        return http(data)
    },
}

export default ApiService

import { ofetch } from 'ofetch'
import { API_URL } from "../services/config"

export const $api = ofetch.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  baseURL: API_URL || '/api',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
})

import axios from 'axios';
import { API_URL } from './config';

export const http = axios.create({
  baseURL: API_URL,
});

export function setupInterceptors(messageStore, router) {
  http.interceptors.request.use((config) => {
    const token = useCookie('accessToken').value;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['Accept-Language'] = 'en';
    config.headers['Accept'] = 'application/json';

    return config;
  }, error => {
    return Promise.reject(error);
  });

  http.interceptors.response.use(
    (response) => {
      return response;
    }, async (error) => {
      if (error.response.status === 401 || error.response.data.message === "Unauthenticated.") {
        messageStore.responseMessage({
          type: 'warning',
          text: 'No tiene una sesión activa, por favor vuelva a iniciar sesión.',
          title: 'Sesión Expirada!',
          modal: true,
        });

        await router.push({ path: '/login' });
      }

      if (error.response.status >= 500) {
        let responseError = error.response.data.errors;
        let message = responseError ? responseError.message : 'Se produjo un error interno. Inténtalo de nuevo más tarde.';
        messageStore.responseMessage({
          type: 'error',
          text: message,
          title: 'Error',
          modal: true,
        });
      }

      return Promise.reject(error);
    }
  );
}

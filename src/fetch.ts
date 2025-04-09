import { createFetch } from '@vueuse/core';
import { useStore } from './stores/main';

export const useBackendFetch = createFetch({
  baseUrl: import.meta.env.APP_BACKEND_API_ENDPOINT,
  options: {
    async beforeFetch({ options }) {
      const store = useStore();

      if (store.token !== null && store.token !== '') {
        if (options.headers === undefined) {
          options.headers = {};
        }

        (options.headers as Record<string, string>)['Authorization'] = `Bearer ${store.token}`;
      }

      return { options };
    },
  },
  fetchOptions: {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  },
});

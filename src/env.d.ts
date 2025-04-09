/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_BACKEND_API_ENDPOINT: string;
  readonly APP_FMS_TYPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

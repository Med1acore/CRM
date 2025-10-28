/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_TELEGRAM_BOT_TOKEN?: string;
  readonly VITE_AI_SERVICE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

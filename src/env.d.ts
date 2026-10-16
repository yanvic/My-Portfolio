interface ImportMetaEnv {
  /** Endpoint do coletor de analytics (ex.: https://1-2-3-4.sslip.io/e). Vazio = rastreio desligado. */
  readonly PUBLIC_COLLECTOR_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

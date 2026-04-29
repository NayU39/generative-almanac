import type { Connect } from 'vite';
type ReceiptApiPluginOptions = {
    apiKey?: string;
    model: string;
};
export declare function receiptApiPlugin(options: ReceiptApiPluginOptions): {
    name: string;
    configureServer(server: {
        middlewares: Connect.Server;
    }): void;
    configurePreviewServer(server: {
        middlewares: Connect.Server;
    }): void;
};
export {};

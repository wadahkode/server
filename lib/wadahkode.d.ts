declare const http: any;
declare type callback = (request: typeof http.IncomingMessage, response: typeof http.ServerResponse) => void;
declare type Router = {
    get: (path: string, callback: callback) => void;
    post: (path: string, callback: callback) => void;
};
declare const app: any, wadahkode: () => any;

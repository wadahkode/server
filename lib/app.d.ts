/// <reference types="node" />
declare const createServer: any, IncomingMessage: any, ServerResponse: any, parse: any, extname: any, join: any, resolve: any, lstatSync: any, readFileSync: any, view: any, qs: any;
declare type Settings = {};
declare type method = (request: typeof IncomingMessage, response: typeof ServerResponse) => void;
declare type bodyParserCallback = (request: typeof qs) => void;
declare type chunk = typeof Buffer;
declare let settings: any;

declare type flash = (name: string, value: string) => void;
declare const Session: () => {
    destroy: any;
    flash: flash;
    get: any;
    has: any;
    start: any;
    set: any;
    unset: any;
};

export declare function saveToStorage (key: string, value): void;
export declare function loadFromStorage (key: string, defaultValue?: any): any;
export declare function loadFromStorage (key: string, defaultValue: any, autoCache?: boolean): any;
export declare function removeFromStorage (key: string): void;
export declare function clearStorage (): void;
export declare function getCacheData (key: string, dataLoader?: Function): any;
export declare function getCacheData (key: string, dataLoader: Function, duration: number): any;

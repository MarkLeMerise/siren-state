export interface IEntityMap {
    [key: string]: any;
}

export interface IEntityIndexer {
    getEntry(key: string): any | undefined;
    clearEntry(key: string): void;
    indexEntity(key: string, value: any): void;
}

export default (index: IEntityMap = {}): IEntityIndexer => {
    function getEntry(key: string) {
        return index[key];
    }

    function clearEntry(key: string) {
        delete index[key];
    }

    function indexEntity(key: string, value: any) {
        index[key] = value;
    }

    return { clearEntry, getEntry, indexEntity };
};
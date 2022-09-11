type Block = Map<string, KeyValue>;
export type VariableTypes = "let" | "const";
export type VariableValues = number | boolean;
interface InterfaceStack {
    set(name: string, value: KeyValue): void;
    get(name: string): VariableValues | undefined;
    pop(): Map<string, KeyValue> | undefined;
    push(map: Map<string, KeyValue>): void;
    peek(): Map<string, KeyValue> | undefined;
    size(): number;
}

interface KeyValue {
    variableValue: VariableValues;
    variableType: VariableTypes;
}

export class MapStack implements InterfaceStack {
    private storage: Array<Block> = [];

    //set on the most recent block
    set(name: string, value: KeyValue): void {
        this.storage[this.size()].set(name, value);
    }

    //get value from current block and check previous blocks
    get(name: string): VariableValues | undefined {
        for (let i = this.size(); i >= 0; i--) {
            const currentBlock = this.storage[i];
            if (currentBlock.has(name)) {
                return currentBlock.get(name)?.variableValue;
            }
        }

        return undefined;
    }

    //Get variable value and type... if exists.
    getInformation(name: string): KeyValue | undefined {
        for (let i = this.size(); i >= 0; i--) {
            const currentBlock = this.storage[i];
            if (currentBlock.has(name)) {
                const key: KeyValue | undefined = currentBlock.get(name);
                return !key ? undefined : key;
            }
        }

        return undefined;
    }

    pop(): Map<string, KeyValue> | undefined {
        return this.storage.pop();
    }

    push(map: Map<string, KeyValue>) {
        this.storage.push(map);
    }

    peek(): Map<string, KeyValue> | undefined {
        return this.storage[this.size()];
    }

    size(): number {
        return this.storage.length - 1;
    }

    empty(): void {
        this.storage.splice(0);
    }

    getScopeNumber(input: string): number {
        //Takes a blockAnalysis in our case and search the stack array for and return the index to which scope number this is
        //-2 because we dont want to start in the same scope we are defining the variable
        for (let i = this.size() - 1; i >= 0; i--) {
            if (this.storage[i].has(input)) {
                return i;
            }
        }

        return -1;
    }

    //SearchShadow looks everywhere BUT the scope we are operating on.
    searchShadow(name: string): boolean {
        for (let i = this.size() - 1; i >= 0; i--) {
            if (this.storage[i].has(name)) {
                return true;
            }
        }

        return false;
    }

    addNew(): void {
        const newScope: Block = new Map<string, KeyValue>();
        this.storage.push(newScope);
    }
}

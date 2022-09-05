interface InterfaceStack {
    set(name: string, value: [number | boolean, string]): void;
    get(name: string): number | boolean | undefined;
    pop(): Map<string, [number | boolean, string]> | undefined;
    push(map: Map<string, [number | boolean, string]>): void;
    peek(): Map<string, [number | boolean, string]> | undefined;
    size(): number;
}

interface keyValue {
    variableValue: number | boolean;
    variableType: string;
}
//TODO: make it compatible with boolean

export class MapStack implements InterfaceStack {
    private storage: Array<Map<string, [number | boolean, string]>> = [];

    set(name: string, value: [number | boolean, string]): void {
        this.storage[this.size()].set(name, value);
    }

    get(name: string): number | boolean | undefined {
        for (let i = this.size(); i >= 0; i--) {
            if (this.storage[i].has(name)) {
                return this.storage[i].get(name)?.[0];
            }
        }

        return undefined;
    }

    getInformation(name: string): keyValue | undefined {
        for (let i = this.size(); i >= 0; i--) {
            if (this.storage[i].has(name)) {
                const key: [number | boolean, string] | undefined =
                    this.storage[i].get(name);
                return key === undefined
                    ? undefined
                    : { variableValue: key[0], variableType: key[1] };
            }
        }

        return undefined;
    }

    pop(): Map<string, [number | boolean, string]> | undefined {
        return this.storage.pop();
    }

    push(map: Map<string, [number | boolean, string]>) {
        this.storage.push(map);
    }

    peek(): Map<string, [number | boolean, string]> | undefined {
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
        this.storage.push(new Map<string, [number | boolean, string]>());
    }
}

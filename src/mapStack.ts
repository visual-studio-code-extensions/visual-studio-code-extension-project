interface InterfaceStack {
    set(name: string, value: number): void;
    pop(): Map<string, number> | undefined;
    push(map: Map<string, number>): void;
    peek(): Map<string, number> | undefined;
    size(): number;
}

export class MapStack implements InterfaceStack {
    private storage: Array<Map<string, number>> = [];

    set(name: string, value: number): void {
        this.storage[this.size() - 1].set(name, value);
    }

    pop(): Map<string, number> | undefined {
        return this.storage.pop();
    }

    push(map: Map<string, number>) {
        this.storage.push(map);
    }

    peek(): Map<string, number> | undefined {
        return this.storage[this.size() - 1];
    }

    size(): number {
        return this.storage.length;
    }

    empty(): void {
        this.storage.splice(0);
    }

    updateLast(input: Map<string, number>): void {
        this.storage[this.size() - 1] = input;
    }

    getScopeNumber(input: string): number {
        //Takes a blockAnalysis in our case and search the stack array for and return the index to which scope number this is
        //-2 because we dont want to start in the same scope we are defining the variable
        for (let i = this.size() - 2; i >= 0; i--) {
            if (this.storage[i].has(input)) {
                return i;
            }
        }

        return -1;
    }

    search(name: string): boolean {
        for (let i = this.size() - 2; i >= 0; i--) {
            if (this.storage[i].has(name)) {
                return true;
            }
        }

        return false;
    }

    addNew(): void {
        this.storage.push(new Map<string, number>());
    }
}

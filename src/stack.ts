interface IStack<T> {
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
}

export class Stack<T> implements IStack<T> {
    private storage: T[] = [];

    push(item: T): void {
        this.storage.push(item);
    }

    pop(): T | undefined {
        return this.storage.pop();
    }

    peek(): T | undefined {
        return this.storage[this.size() - 1];
    }

    size(): number {
        return this.storage.length;
    }

    empty(): void {
        this.storage.splice(0);
    }

    getScopeNumber(input: T): number {
        //Takes a blockAnalysis in our case and search the stack array for and return the index to which scope number this is
        return this.storage.findIndex((scopes) => {
            return scopes === input;
        });
    }
}

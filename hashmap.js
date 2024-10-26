export default class HashMap {
    constructor() {
        this.#init();
    }

    #init() {
        this.capacity = 16;
        this.LOAD_FACTOR = 0.75;
        this.buckets = [];
        this.length = 0;

        for (let i = 0; i < this.capacity; i++) {
            this.buckets.push([]);
        }
    }

    checkLoad() {
        if(this.length > this.LOAD_FACTOR * this.capacity) {
            this.capacity *= 2;
            const entries = this.getEntries();
            this.buckets = [];
            this.length = 0;

            for (let i = 0; i < this.capacity; i++) {
                this.buckets.push([]);
            }

            entries.forEach(entry => {
                this.set(entry[0], entry[1]);
            });
        }
    }

    hash(key) {
        let hashCode = 0;
        const primeNumber = 31;

        for(let i = 0; i < key.length; i++) {
            hashCode = (hashCode * primeNumber + key.charCodeAt(i)) % this.capacity;
        }

        return hashCode;
    }

    getBucket(key) {
        const hashCode = this.hash(key);
        if (hashCode < 0 || hashCode >= this.capacity) {
            throw new Error("Trying to access index out of bound");
        }

        return this.buckets[hashCode];
    }

    set(key, value) {
        const bucket = this.getBucket(key);
        let entryFound = false;
        bucket.forEach(entry => {
            if(entry[0] === key) {
                entry[1] = value;
                entryFound = true;
            }
        });
        if(entryFound) return;
        bucket.push([key, value]);
        this.length++;
        this.checkLoad();
    }

    get(key) {
        const bucket = this.getBucket(key);
        let value = null;
        bucket.forEach(entry => {
            if(entry[0] === key) {
                value = entry[1];
            }
        });

        return value;
    }

    has(key) {
        const bucket = this.getBucket(key);
        let foundKey = false;
        bucket.forEach(entry => {
            if(entry[0] === key) {
                foundKey = true;
            }
        });
        return foundKey;
    }

    remove(key) {
        const bucket = this.getBucket(key);
        let foundKey = false;
        bucket.forEach((entry, index) => {
            if(entry[0] === key) {
                bucket.splice(index, 1);
                this.length--;
                foundKey = true;
            }
        });

        return foundKey;
    }

    getLength() {
        return this.length;
    }

    clear() {
        this.#init();
    }

    getKeys() {
        const keysArr = [];
        this.buckets.forEach(bucket => {
            bucket.forEach(entry => {
                keysArr.push(entry[0]);
            });
        });

        return keysArr;
    }

    getValues() {
        const valuesArr = [];
        this.buckets.forEach(bucket => {
            bucket.forEach(entry => {
                valuesArr.push(entry[1])
            });
        });

        return valuesArr;
    }

    getEntries() {
        const entriesArr = [];
        this.buckets.forEach(bucket => {
            bucket.forEach(entry => {
                entriesArr.push(entry);
            });
        });

        return entriesArr;
    }

    showBuckets() {
        this.buckets.forEach(bucket => {
            console.log(bucket);
        });
    }
}
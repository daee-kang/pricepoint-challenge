"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EdgeDB {
    constructor() {
        this.edges = new Map();
    }
    addEdge(params) {
        if (params.length !== 4) {
            return false;
        }
        //check if any params are empty
        for (let param of params) {
            if (param === '') {
                return false;
            }
        }
        let [origin, destination, mileageS, durationS] = params;
        //check to see if last two params are numbers
        if (isNaN(Number(durationS)) || isNaN(Number(mileageS))) {
            return false;
        }
        //create our edge and add
        let edgeDetails = {
            duration: Number(durationS),
            mileage: Number(mileageS)
        };
        //create a map value if key doesn't exist
        if (!this.edges.has(origin)) {
            this.edges.set(origin, new Map());
        }
        else {
            //just check to see if the edge has already been added
            if (this.edges.get(origin).has(destination)) {
                return false;
            }
        }
        //set our edge :-)
        this.edges.get(origin).set(destination, edgeDetails);
        this.write('EDGE', params);
        return true;
    }
    query(params) {
        if (params.length !== 2) {
            return false;
        }
        let [origin, destination] = params;
        //get an array of all results
        let results = [];
        let path = [origin];
        this.backtrack(origin, destination, 0, new Set(), path, results);
        if (results.length === 0)
            return false;
        results.sort((a, b) => {
            return a.cost - b.cost;
        });
        this.write("QUERY", [origin, destination]);
        for (let result of results) {
            let params = [result.cost.toFixed(2).toString(), ...result.path];
            this.write("PATH", params);
        }
        return true;
    }
    write(command, params) {
        process.stdout.write(command);
        process.stdout.write(" ");
        for (let i = 0; i < params.length; i++) {
            process.stdout.write(params[i]);
            if (i !== params.length - 1) {
                process.stdout.write(',');
            }
        }
        process.stdout.write('\n');
    }
    //this is our big bad boy algorithm to search
    backtrack(current, destination, cost, seen, //we need this for encountering cycles
    path, results) {
        if (current === destination) {
            results.push({ cost, path });
            return;
        }
        let paths = this.edges.get(current);
        paths === null || paths === void 0 ? void 0 : paths.forEach((details, key) => {
            if (!seen.has(key)) {
                let newCost = Number((cost + (details.mileage * 15) + (details.duration * 30)).toFixed(2));
                let newPath = [...path, key];
                seen.add(key);
                this.backtrack(key, destination, newCost, seen, newPath, results);
                seen.delete(key);
            }
        });
    }
}
exports.default = EdgeDB;
;
//# sourceMappingURL=edgedb.js.map
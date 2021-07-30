"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const edgedb_1 = __importDefault(require("./edgedb"));
const readline = require('readline');
//our entry point
(function main() {
    //create our db class
    let db = new edgedb_1.default();
    //handle our stdin 
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on('line', (line) => {
        let params = line.split(',');
        if (params.length === 0)
            return;
        //grab our command
        let firstSplit = params[0].split(' ');
        //firstSplit[0] will be our command
        let command = firstSplit[0];
        if (firstSplit.length > 1) {
            //rebuild our firstSplit array removing our command
            firstSplit.shift();
            params[0] = firstSplit.join(' ');
        }
        //now we have our commands split up properly
        if (command !== "ADD" && command !== "QUERY") {
            writeMalformedError(line);
            return;
        }
        if (command === 'ADD' && !db.addEdge(params)) {
            writeMalformedError(line);
            return;
        } //if addedge returns true, it will write the input to stdout
        if (command === 'QUERY' && !db.query(params)) {
            writeMalformedError(line);
            return;
        } //if query return true, it will write the results to stdout
    });
}());
function writeMalformedError(line) {
    process.stderr.write("MALFORMED ");
    process.stderr.write(line);
    process.stderr.write("\n");
}
//# sourceMappingURL=solution.js.map
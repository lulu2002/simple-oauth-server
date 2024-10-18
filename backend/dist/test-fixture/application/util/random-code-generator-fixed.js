"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RandomCodeGeneratorFixed {
    char;
    constructor(char) {
        this.char = char;
    }
    generate(length) {
        return this.char.repeat(length);
    }
}
exports.default = RandomCodeGeneratorFixed;

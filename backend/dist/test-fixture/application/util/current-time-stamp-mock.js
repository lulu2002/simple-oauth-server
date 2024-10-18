"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CurrentTimeStampMock {
    time;
    constructor(time) {
        this.time = time;
    }
    get() {
        return this.time;
    }
}
exports.default = CurrentTimeStampMock;

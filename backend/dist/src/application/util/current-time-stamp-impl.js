"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CurrentTimeStampImpl {
    get() {
        return Date.now();
    }
}
exports.default = CurrentTimeStampImpl;

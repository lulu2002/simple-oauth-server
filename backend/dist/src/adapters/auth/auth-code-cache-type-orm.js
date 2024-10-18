"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEntryEntity = void 0;
const typeorm_1 = require("typeorm");
class AuthCodeCacheTypeOrm {
    dataSource;
    currentTimeStamp;
    authRepository;
    constructor(dataSource, currentTimeStamp) {
        this.dataSource = dataSource;
        this.currentTimeStamp = currentTimeStamp;
        this.authRepository = dataSource.getRepository(AuthEntryEntity);
    }
    async saveCode(clientId, userId, code, expiresAt) {
        const entry = this.authRepository.create({ clientId, userId, code, expiresAt });
        await this.authRepository.save(entry);
    }
    async getAuthEntry(code) {
        const time = this.currentTimeStamp.get();
        const entry = await this.authRepository.findOne({
            where: {
                expiresAt: (0, typeorm_1.MoreThanOrEqual)(time),
                code: code
            }
        });
        return entry?.toAuthEntry() ?? null;
    }
    async getCode(clientId, userId) {
        const entry = await this.authRepository.findOneBy({ clientId, userId });
        if (entry && entry.expiresAt > Date.now()) {
            return entry.code;
        }
        return null;
    }
    async removeCode(clientId, userId) {
        await this.authRepository.delete({ clientId, userId });
    }
}
exports.default = AuthCodeCacheTypeOrm;
let AuthEntryEntity = class AuthEntryEntity {
    id;
    clientId;
    userId;
    code;
    expiresAt;
    toAuthEntry() {
        return {
            clientId: this.clientId,
            userId: this.userId,
            code: this.code,
            expiresAt: this.expiresAt
        };
    }
};
exports.AuthEntryEntity = AuthEntryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AuthEntryEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar"),
    __metadata("design:type", String)
], AuthEntryEntity.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar"),
    __metadata("design:type", String)
], AuthEntryEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar"),
    __metadata("design:type", String)
], AuthEntryEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], AuthEntryEntity.prototype, "expiresAt", void 0);
exports.AuthEntryEntity = AuthEntryEntity = __decorate([
    (0, typeorm_1.Entity)()
], AuthEntryEntity);

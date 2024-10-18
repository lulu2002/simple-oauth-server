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
exports.OauthClientEntity = void 0;
const typeorm_1 = require("typeorm");
class OauthClientRepositoryTypeOrm {
    dataSource;
    repository;
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.repository = dataSource.getRepository(OauthClientEntity);
    }
    async findById(id) {
        return (await this.repository.findOneBy({ id }))?.toClient() ?? undefined;
    }
    async create(client) {
        try {
            await this.repository.insert(toEntity(client));
            return client;
        }
        catch (error) {
            console.error("Failed to create client:", error);
            return undefined;
        }
    }
}
exports.default = OauthClientRepositoryTypeOrm;
let OauthClientEntity = class OauthClientEntity {
    id;
    name;
    secret;
    redirectUris;
    allowOrigins;
    constructor(id, name, secret, redirectUris, allowOrigins) {
        this.id = id;
        this.name = name;
        this.secret = secret;
        this.redirectUris = redirectUris;
        this.allowOrigins = allowOrigins;
    }
    toClient() {
        return {
            id: this.id,
            name: this.name,
            secret: this.secret,
            redirectUris: this.redirectUris,
            allowOrigins: this.allowOrigins
        };
    }
};
exports.OauthClientEntity = OauthClientEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ unique: true, type: "varchar" }),
    __metadata("design:type", String)
], OauthClientEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar"),
    __metadata("design:type", String)
], OauthClientEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar"),
    __metadata("design:type", String)
], OauthClientEntity.prototype, "secret", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], OauthClientEntity.prototype, "redirectUris", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], OauthClientEntity.prototype, "allowOrigins", void 0);
exports.OauthClientEntity = OauthClientEntity = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, Array, Array])
], OauthClientEntity);
function toEntity(client) {
    return new OauthClientEntity(client.id, client.name, client.secret, client.redirectUris, client.allowOrigins);
}

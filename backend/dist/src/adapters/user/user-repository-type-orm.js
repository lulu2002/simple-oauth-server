"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryTypeOrm = void 0;
const user_entity_1 = require("@src/adapters/user/user-entity");
class UserRepositoryTypeOrm {
    dataSource;
    userRepository;
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.userRepository = this.dataSource.getRepository(user_entity_1.UserEntity);
    }
    async findById(id) {
        return (await this.userRepository.findOneBy({ id }))?.toUser();
    }
    async findByEmail(email) {
        return (await this.userRepository.findOneBy({ email: email }))?.toUser();
    }
    async create(email, password) {
        const user = this.userRepository.create({ email, password });
        return await this.userRepository.save(user);
    }
}
exports.UserRepositoryTypeOrm = UserRepositoryTypeOrm;

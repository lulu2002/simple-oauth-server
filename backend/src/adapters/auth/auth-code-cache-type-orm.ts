import AuthCodeCache, {AuthEntry} from "@src/application/auth/auth-code-cache";
import {Column, DataSource, Entity, MoreThanOrEqual, PrimaryGeneratedColumn, Repository} from 'typeorm';
import CurrentTimeStamp from "@src/application/util/current-time-stamp";

export default class AuthCodeCacheTypeOrm implements AuthCodeCache {

  private authRepository: Repository<AuthEntryEntity>;

  constructor(
    private dataSource: DataSource,
    private currentTimeStamp: CurrentTimeStamp
  ) {
    this.authRepository = dataSource.getRepository(AuthEntryEntity);
  }

  async saveCode(clientId: string, userId: string, code: string, expiresAt: number): Promise<void> {
    const entry = this.authRepository.create({clientId, userId, code, expiresAt});
    await this.authRepository.save(entry);
  }

  async getAuthEntry(code: string): Promise<AuthEntry | null> {
    const time = this.currentTimeStamp.get();
    const entry = await this.authRepository.findOne({
      where: {
        expiresAt: MoreThanOrEqual(time),
        code: code
      }
    })

    return entry?.toAuthEntry() ?? null;
  }

  async getCode(clientId: string, userId: string): Promise<string | null> {
    const entry = await this.authRepository.findOneBy({clientId, userId});
    if (entry && entry.expiresAt > Date.now()) {
      return entry.code;
    }
    return null;
  }

  async removeCode(clientId: string, userId: string): Promise<void> {
    await this.authRepository.delete({clientId, userId});
  }

}

@Entity()
export class AuthEntryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  clientId!: string;

  @Column("varchar")
  userId!: string;

  @Column("varchar")
  code!: string;

  @Column("int")
  expiresAt!: number;

  toAuthEntry(): AuthEntry {
    return {
      clientId: this.clientId,
      userId: this.userId,
      code: this.code,
      expiresAt: this.expiresAt
    }
  }

}
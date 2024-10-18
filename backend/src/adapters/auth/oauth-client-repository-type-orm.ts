import OauthClientRepository from "@src/application/auth/oauth-client-repository";
import {Column, DataSource, Entity, PrimaryColumn, Repository} from "typeorm";
import OauthClient from "@src/domain/oauth-client";

export default class OauthClientRepositoryTypeOrm implements OauthClientRepository {

  private repository: Repository<OauthClientEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(OauthClientEntity);
  }

  async findById(id: string): Promise<OauthClient | undefined> {
    return (await this.repository.findOneBy({id}))?.toClient() ?? undefined;
  }

  async create(client: OauthClient): Promise<OauthClient | undefined> {
    try {
      await this.repository.insert(toEntity(client));
      return client;
    } catch (error) {
      console.error("Failed to create client:", error);
      return undefined;
    }
  }

}

@Entity()
export class OauthClientEntity {
  @PrimaryColumn({unique: true, type: "varchar"})
  id: string;

  @Column("varchar")
  name: string;

  @Column("varchar")
  secret: string;

  @Column("simple-array")
  redirectUris: string[];

  @Column("simple-array")
  allowOrigins: string[];

  constructor(
    id: string,
    name: string,
    secret: string,
    redirectUris: string[],
    allowOrigins: string[]
  ) {
    this.id = id;
    this.name = name;
    this.secret = secret;
    this.redirectUris = redirectUris;
    this.allowOrigins = allowOrigins;
  }

  toClient(): OauthClient {
    return {
      id: this.id,
      name: this.name,
      secret: this.secret,
      redirectUris: this.redirectUris,
      allowOrigins: this.allowOrigins
    }
  }
}

function toEntity(client: OauthClient): OauthClientEntity {
  return new OauthClientEntity(
    client.id,
    client.name,
    client.secret,
    client.redirectUris,
    client.allowOrigins
  );
}
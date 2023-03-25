import { Service, Inject } from 'typedi';
import Client from '../models/client';
import { IClient, IClientInput } from '../types/Client';
@Service()
export default class ClientService {
  constructor(@Inject('ClientModel') private clientModel: typeof Client, @Inject('logger') private logger) {}

  public async addClient(body): Promise<boolean> {
    try {
      const { name, workspace_id, created_by, updated_by } = body;
      const client = await this.clientModel.findOrCreate({
        where: {
          name: name.trim(),
          workspace_id,
        },
        defaults: {
          name: name.trim(),
          workspace_id,
          created_by,
          updated_by,
        },
      });
      return client[1];
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getClientsByWorkspaceId(where = {}): Promise<{ clients: IClientInput[] }> {
    try {
      const clients = await this.clientModel.findAll({ where, raw: true });
      return { clients };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getClientNameByClientID(id): Promise<string> {
    try {
      const clients = await this.clientModel.findByPk(id);
      return clients.name;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async updateClient(body: IClientInput): Promise<number> {
    try {
      const { id, name, workspace_id, archive_status } = body;
      const opArgs = {
        id,
        workspace_id,
      };
      if (name) {
        const isExist = await this.clientModel.findOne({
          where: {
            name,
            workspace_id,
          },
        });
        if (!isExist) {
          opArgs.name = name;
        } else {
          return 0;
        }
      } else {
        opArgs.archive_status = archive_status;
      }
      const [isUpdated] = await this.clientModel.update(opArgs, {
        where: { id, workspace_id },
      });
      return isUpdated;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeClient(id: any): Promise<number> {
    try {
      const isRemoved = await this.clientModel.destroy({ where: id });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getFilteredClients(opArgs, where = {}): Promise<{ clients: IClient[]; count: number }> {
    try {
      const { rows: clients, count } = await this.clientModel.findAndCountAll({
        ...opArgs,
        ...where,
      });
      return { clients, count };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}

import { Service, Inject } from 'typedi';
import Tag from '../models/tag';
import { ITag, ITagInput } from '../types/Tag';

@Service()
export default class TagService {
  constructor(@Inject('TagModel') private tagModel: typeof Tag, @Inject('logger') private logger) {}

  public async addTag(body: ITagInput): Promise<boolean> {
    try {
      const { tag_name, workspace_id } = body;
      const isTagAdded = await this.tagModel.findOrCreate({
        where: { tag_name, workspace_id },
        defaults: body,
      });
      return isTagAdded[1];
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async tags(opArgs, where = {}): Promise<{ tags: ITag[]; count: number }> {
    try {
      const { rows: tags, count } = await this.tagModel.findAndCountAll({
        ...opArgs,
        ...where,
      });
      return { tags, count };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getTag(where = {}): Promise<{ tag: ITag }> {
    try {
      const tag = await this.tagModel.findOne({ where, raw: true });
      return { tag };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateTag(body: ITagInput): Promise<number> {
    try {
      const { id, tag_name, workspace_id, archive_status } = body;
      const opArgs = {
        id,
        workspace_id,
      };

      if (tag_name) {
        const isExist = await this.tagModel.findOne({ where: { tag_name, workspace_id } });
        if (!isExist) {
          opArgs['tag_name'] = tag_name;
        } else {
          return 0;
        }
      } else {
        opArgs['archive_status'] = archive_status;
      }

      const [isUpdated] = await this.tagModel.update(opArgs, { where: { id, workspace_id } });
      return isUpdated;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeTag(id: { id: number }): Promise<number> {
    try {
      const isRemoved = await this.tagModel.destroy({ where: id });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}

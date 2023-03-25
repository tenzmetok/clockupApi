import { Container } from 'typedi';
import TagService from '../services/tag';

const addTag = async (body): Promise<boolean> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addTag with body: %o', body);
  try {
    const tagServiceInstance = Container.get(TagService);
    const isTagAdded = await tagServiceInstance.addTag(body);
    return isTagAdded;
  } catch (e) {
    logger.error('🔥 error while adding tag: %o', e);
    return e;
  }
};

const tags = async opArgs => {
  const logger: any = Container.get('logger');
  logger.debug('Calling tags with param: %o', opArgs);
  try {
    const tagServiceInstance = Container.get(TagService);
    const { tags, count } = await tagServiceInstance.tags(opArgs);
    if (!tags) {
      throw new Error('Record Not Found');
    }
    return { tags, count };
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

const getTag = async id => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getTag with param: %o', id);
  try {
    const tagServiceInstance = Container.get(TagService);
    const { tag } = await tagServiceInstance.getTag({ id });
    if (!tag) {
      throw new Error('Record Not Found');
    }
    return tag;
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

const updateTag = async (body): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateTag with id ${body.id}: and body %o`, body);
  try {
    const tagServiceInstance = Container.get(TagService);
    const isUpdated = await tagServiceInstance.updateTag(body);
    return isUpdated;
  } catch (e) {
    logger.error('🔥 error while updating tag: %o', e);
    return e;
  }
};

const removeTag = async (id): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling removeTag with param: %o', id);
  try {
    const tagServiceInstance = Container.get(TagService);
    const isRemoved = await tagServiceInstance.removeTag(id);
    return isRemoved;
  } catch (e) {
    console.error('🔥 error while removing tag: %o', e);
    return e;
  }
};

export { addTag, tags, getTag, updateTag, removeTag };

import { Repository, DeepPartial } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class ModelRepository<T> extends Repository<T> {
  async getEntities(
    query: any,
    relations: string[] = [],
    throwsException = false,
  ): Promise<T[] | null> {
    return await this.find({
      where: { ...query },
      relations,
    })
      .then(entity => {
        if (!entity && throwsException) {
          return Promise.reject(new NotFoundException('Model not found.'));
        }

        return Promise.resolve(entity);
      })
      .catch(error => Promise.reject(error));
  }

  async getEntityById(id: number, relations: string[] = []): Promise<T | null> {
    const query: { id } = { id };
    return await this.findOne({
      where: { ...query },
      relations,
    })
      .then(entity => {
        return Promise.resolve(entity);
      })
      .catch(error => Promise.reject(error));
  }

  async createEntity(
    inputs: DeepPartial<T>,
    relations: string[] = [],
  ): Promise<T> {
    return this.save(inputs)
      .then(async entity => {
        return await this.getEntityById((entity as any).id, relations);
      })
      .catch(error => Promise.reject(error));
  }

  async updateEntity(
    entity: any,
    inputs: QueryDeepPartialEntity<T>,
    relations: string[] = [],
  ): Promise<T> {
    return this.update(entity.id, inputs)
      .then(async () => await this.getEntityById((entity as any).id, relations))
      .catch(error => Promise.reject(error));
  }
}

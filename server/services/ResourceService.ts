import { Model } from 'mongoose';
import * as pluralize from 'pluralize';

export class ResourceService {
  protected whitelist: any = {};

  protected default_populate: any;

  constructor(protected model: Model<any>) {}

  get resource(): string {
    return this.model.modelName;
  }

  get resources(): string {
    return pluralize(this.model.modelName);
  }

  /**
   * @description Create a new document on the Model
   * @param pipeline Aggregate pipeline to execute
   * @returns Returns the results of the query
   */
  aggregate(pipeline: any): any {
    return this.model.aggregate(pipeline).exec();
  }

  /**
   * @description Create a new document on the Model
   * @param body Body object to create the new document with
   * @returns Returns the results of the query
   */
  async create(body: any): Promise<any> {
    const data = this.beforeCreate(body);
    const doc = await this.model.create(data);
    if (doc !== undefined) {
      await this.afterCreate(doc, data);
      return doc;
    }
  }

  protected beforeCreate(body: any): any {
    return body;
  }

  protected afterCreate(doc, data?: any): any {}

  protected beforeDelete(doc): any {}

  protected afterDelete(doc): any {}

  /**
   * @description Count the number of documents matching the query criteria
   * @param query Query to be performed on the Model
   * @returns Returns the number of documents matching the query
   */
  async count(query: any): Promise<number> {
    return await this.model.find(query).countDocuments().exec();
  }

  async findDeleted(query: any): Promise<any> {
    return await (this.model as any).findDeleted(query).exec();
  }

  /**
   * @description Delete an existing document on the Model
   * @param id ID for the object to delete
   * @returns Returns the results of the query
   */
  async delete(id: string): Promise<any> {
    await this.beforeDelete(id);
    return await this.model.findByIdAndDelete(id).exec();
  }

  async deleteById(id: string): Promise<any> {
    await this.beforeDelete(id);
    return await (this.model as any).deleteById(id).exec();
  }

  async deleteOne(query: any): Promise<any> {
    // await this.beforeDelete(id)
    return await (this.model as any).delete(query).exec();
  }

  async deleteMany(query: any): Promise<any> {
    return await (this.model as any).delete(query).exec();
  }

  async deleteManyById(ids: string[]): Promise<any> {
    ids.map(this.beforeDelete);
    return await (this.model as any).delete({ _id: { $in: ids } }).exec();
  }

  /**
   * @description Remove an existing document on the Model
   * @param id ID for the object to remove
   * @returns Returns the results of the query
   */
  async remove(query: any): Promise<any> {
    return await this.model.remove(query).exec();
  }

  async removeOne(query: any): Promise<any> {
    return await this.model.findOneAndRemove(query).exec();
  }

  /**
   * @description Retrieve distinct "fields" which are in the provided status
   * @param query Object that maps to the status to retrieve docs for
   * @param field The distinct field to retrieve
   * @returns Returns the results of the query
   */
  async findDistinct(query: any, field: any): Promise<any[]> {
    return await this.model.find(query).distinct(field).exec();
  }

  /**
   * @description Retrieve a single document from the Model with the provided
   *   query
   * @param query Query to be performed on the Model
   * @param projection Optional: Fields to return or not return from
   * query
   * @param options Optional options to provide query
   * @returns Returns the results of the query
   */
  async findOne(query: any, projection: any = {}, options: any = {}): Promise<any> {
    const doc =  await this.model.findOne(query, projection, options).exec();
    // if(!doc){
    //   throw new Error(`${this.resource} was not found`);
    // }
    return doc
  }

  /**
   * @description Retrieve multiple documents from the Model with the provided
   *   query
   * @param query Query to be performed on the Model
   * @param projection Optional: Fields to return or not return from
   * query
   * @param sort - Optional argument to sort data
   * @param options Optional options to provide query
   * @returns Returns the results of the query
   */
  protected async fetch(
    query: any,
    projection: any = {},
    sort: any = { createdAt: -1 },
    skip: number = 0,
    limit: number = 10,
    options: any = {},
  ): Promise<any[]> {
    return await this.model.find(query, projection, options).sort(sort).skip(skip).limit(limit).exec();
  }

  async find(
    query: any,
    projection: any = {},
    sort: any = { createdAt: -1 },
    skip: number = 0,
    limit: number = 10,
    options: any = {},
  ): Promise<any[]> {
    return await this.model.find(query, projection, options).sort(sort).skip(skip).limit(limit).exec();
  }

  protected beforePaginate(query): any {
    return query;
  }

  async paginate(
    query: any,
    page = 1,
    page_size = 12,
    sortOrder: { [x: string]: any } = { createdAt: -1 },
    fields = {},
  ): Promise<any> {
    // tslint:disable-next-line:no-parameter-reassignment
    query = this.beforePaginate(query);
    // const projection = this.whitelist;
    const projection = fields;
    const sort = sortOrder;
    const skip = (page - 1) * page_size;
    const limit = page_size;
    const count = await this.count(query);
    const data = {};
    const response = await this.fetch(query, projection, sort, skip, limit);
    if(!response){
      return false;
    }
    data[this.resources] = response
    return {
      page_size,
      page,
      count,
      data,
      success: 1,
    };
  }

  /**
   * @description Retrieve a single document matching the provided ID, from the
   *   Model
   * @param id Required: ID for the object to retrieve
   * @param projection Optional: Fields to return or not return from
   * query
   * @param options Optional: options to provide query
   * @returns Returns the results of the query
   */
  async findById(id: string, projection: any = {}, options: any = {}): Promise<any> {
    const doc = await this.model.findById(id, projection, options).exec();
    if (doc !== undefined) {
      return doc;
    }
    throw new Error(`${this.resource} with id: ${id} does not exist`);
  }

  async findByIdOrFail(id: string, projection: any = {}, options: any = {}): Promise<any> {
    return await this.model.findById(id, projection, options).orFail();
  }

  /**
   * @description Update a document matching the provided ID, with the body
   * @param id ID for the document to update
   * @param body Body to update the document with
   * @param options Optional options to provide query
   * @returns Returns the results of the query
   */
  async update(id: string, body: any, options: any = { new: true }): Promise<any> {
    const data = this.beforeUpdate(body);
    const doc = await this.model.findByIdAndUpdate(id, data, options).exec();
    if(!doc){
      throw new Error(`${this.resource} with id: ${id} was not updated`);
    }
    this.afterUpdate(doc);
    return doc;
  }

  protected beforeUpdate(body: any): any {
    return body;
  }

  protected afterUpdate(doc: any): any {
    // attempts to debit card of business if business approves
    // create transactions and all  
    return doc;
  }

  async updateOne(query: any, body: any, options: any = { new: true }): Promise<any> {
    const data = this.beforeUpdate(body);
    const doc = await this.model.findOneAndUpdate(query, data, options).exec();
    if(!doc){
      throw new Error(`${this.resource} was not updated`);
    }
    this.afterUpdate(doc);
    return doc;
  }

  async updateMany(query: any, data: any, options?: any): Promise<any> {
    return await this.model.updateMany(query, data, { ...options, multi: true }).exec();
  }
}

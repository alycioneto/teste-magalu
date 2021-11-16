import Joi from "@hapi/joi";

class Schema {
  public body: Joi.Schema;

  public params: Joi.Schema;

  public query: Joi.Schema;

  public headers: Joi.Schema;

  constructor(body?: Joi.Schema, params?: Joi.Schema, query?: Joi.Schema, headers?: Joi.Schema) {
    this.body = body || Joi.object();
    this.params = params || Joi.object();
    this.query = query || Joi.object();
    this.headers = headers || Joi.object();
  }
}

export { Schema };

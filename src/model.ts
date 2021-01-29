let Model = Object.create(null);

Model = (client: object|any) => {
  Model.db = client;
  Model.db.connect();

  return Model;
};

Model.findAll = (query: string) => new Promise((resolve, reject) => Model.db.query(query, (err: object|null|any, snapshot: object|any) => !err ? resolve(snapshot.rows) : reject(err)));

Model.findById = (query: string, params: Array<string>) => new Promise((resolve, reject) => Model.db.query(query, params, (err: object|null|any, snapshot: object|any) => !err ? resolve(snapshot.rows) : reject(err)));

Model.push = (query: string, values: Array<string>) => new Promise(resolve => Model.db.query(query, values, (err: object|null|any) => resolve(err)));

Model.update = (query: string) => new Promise(resolve => Model.db.query(query, (err: object|null|any) => resolve(err)));

Model.delete = (query: string) => new Promise(resolve => Model.db.query(query, (err: object|null|any) => resolve(err)));

module.exports = Model;
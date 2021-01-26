let Model = Object.create(null);

Model = (client: any) => {
  Model.db = client;
  Model.db.connect();

  return Model;
};

Model.findAll = (query: string) => new Promise((resolve, reject) => Model.db.query(query, (err: any, snapshot: any) => !err ? resolve(snapshot.rows) : reject(err)));

Model.findById = (query: string, params: Array<string>) => new Promise((resolve, reject) => Model.db.query(query, params, (err: any, snapshot: any) => !err ? resolve(snapshot.rows) : reject(err)));

Model.push = (query: string, values: Array<string>) => new Promise(resolve => Model.db.query(query, values, (err: any) => resolve(err)));

module.exports = Model;
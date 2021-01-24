let Model = Object.create(null);

Model = (client: any) => {
  Model.db = client;
  Model.db.connect();

  return Model;
};

Model.findAll = (query: string) => new Promise((resolve, reject) => Model.db.query(query, (err: any, snapshot: any) => !err ? resolve(snapshot.rows) : reject(err)));

Model.findById = (query: string, params: Array<string>) => new Promise((resolve, reject) => Model.db.query(query, params, (err: any, snapshot: any) => !err ? resolve(snapshot.rows) : reject(err)));


module.exports = Model;
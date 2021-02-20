/**
 * Model
 *
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.1.8
 */
let Model = Object.create(null);
const date = new Date(),
  seconds: number = date.getMilliseconds();

/**
 * Constructor or Function
 *
 * @return Model
 */
Model = (client: object | any) => {
  Model.db = client;
  Model.db.connect();

  return Model;
};

/**
 * Mengambil semua data dari database
 *
 * @param query string
 * @param sort array|number|any
 * @param prepend boolean
 */
Model.findAll = (
  query: string,
  sort: Array<string | number | any>,
  prepend: boolean = false
) => {
  if (prepend && sort.length > 1) {
    let orderBy: string | undefined,
      limit: number | undefined = 1,
      keyword: string | undefined;

    if (sort.length > 2) {
      orderBy = sort.shift();
      limit = sort.pop();
      keyword = sort.pop();

      query = query + ` ORDER BY ${orderBy} ${keyword} LIMIT ${limit}`;
    } else {
      orderBy = sort.shift();
      keyword = sort.pop();

      query = query + ` ORDER BY ${orderBy} ${keyword}`;
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Model.db.query(
          query,
          (err: object | null | any, snapshot: object | any) =>
            err != null
              ? reject(true)
              : snapshot.rows.length >= 1
              ? resolve(snapshot.rows)
              : reject(true)
        );
      }, seconds);
    });
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Model.db.query(
        query,
        (err: object | null | any, snapshot: object | any) =>
          !err ? resolve(snapshot.rows) : reject(err)
      );
    }, seconds);
  });
};

/**
 * Mengambil data dari database berdasarkan username atau email
 *
 * @param query string
 * @param params array
 */
Model.findById = (query: string, params: Array<string>) => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () =>
        Model.db.query(
          query,
          params,
          (err: object | null | any, snapshot: object | any) =>
            err != null
              ? reject(true)
              : snapshot.rows.length >= 1
              ? resolve(snapshot.rows)
              : reject(true)
        ),
      seconds
    );
  });
};

/**
 * Menyimpan data kedalam database
 *
 * @param query string
 * @param values array
 */
Model.push = (query: string, values: Array<string>) =>
  new Promise((resolve) =>
    Model.db.query(query, values, (err: object | null | any) => resolve(err))
  );

/**
 * Memperbarui data yang tersimpan didatabase
 *
 * @param query string
 */
Model.update = (query: string) =>
  new Promise((resolve) =>
    Model.db.query(query, (err: object | null | any) => resolve(err))
  );

/**
 * Menghapus data dari database
 *
 * @param query string
 */
Model.delete = (query: string) =>
  new Promise((resolve) =>
    Model.db.query(query, (err: object | null | any) => resolve(err))
  );

// Export Model
module.exports = Model;

/**
 * Firebase
 *
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.2.0
 */
let Firebase = Object.create(null);
Firebase.date = new Date();
Firebase.seconds = Firebase.date.getMilliseconds();

Firebase = (app: Object | any) => {
  Firebase.auth = app.auth();
  Firebase.db = app.database();

  return Firebase;
};

/**
 * Mengambil semua data dari realtime database
 *
 * @param tableName string
 */
Firebase.findAll = (tableName: string) => {
  const ref: any = Firebase.db.ref(tableName);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      ref.on(
        'value',
        (snapshot: any) => resolve(snapshot),
        (error: any) => reject(true)
      );
    }, Firebase.seconds);
  });
};

/**
 *
 * @param tableName string
 * @param params array
 */
Firebase.signInWithEmailAndPassword = (
  tableName: string,
  params: Array<string>
) => {
  const auth: any = Firebase.auth;
  const ref: any = Firebase.db.ref(tableName);
  const [email, password] = params;

  return auth.signInWithEmailAndPassword(email, password);
};

module.exports = Firebase;

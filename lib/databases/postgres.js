"use strict";
var Postgres = Object.create(null);
var date = new Date(), seconds = date.getMilliseconds();
Postgres = function (client) {
    Postgres.db = client;
    Postgres.db.connect();
    return Postgres;
};
Postgres.findAll = function (query, sort, prepend) {
    if (prepend === void 0) { prepend = false; }
    if (prepend && sort.length > 1) {
        var orderBy = void 0, limit = 1, keyword = void 0;
        if (sort.length > 2) {
            orderBy = sort.shift();
            limit = sort.pop();
            keyword = sort.pop();
            query = query + (" ORDER BY " + orderBy + " " + keyword + " LIMIT " + limit);
        }
        else {
            orderBy = sort.shift();
            keyword = sort.pop();
            query = query + (" ORDER BY " + orderBy + " " + keyword);
        }
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                Postgres.db.query(query, function (err, snapshot) {
                    return err != null
                        ? reject(true)
                        : snapshot.rows.length >= 1
                            ? resolve(snapshot.rows)
                            : reject(true);
                });
            }, seconds);
        });
    }
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            Postgres.db.query(query, function (err, snapshot) {
                return !err ? resolve(snapshot.rows) : reject(err);
            });
        }, seconds);
    });
};
Postgres.findById = function (query, params) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            return Postgres.db.query(query, params, function (err, snapshot) {
                return err != null
                    ? reject(true)
                    : snapshot.rows.length >= 1
                        ? resolve(snapshot.rows)
                        : reject(true);
            });
        }, seconds);
    });
};
Postgres.push = function (query, values) {
    return new Promise(function (resolve) {
        return Postgres.db.query(query, values, function (err) { return resolve(err); });
    });
};
Postgres.update = function (query) {
    return new Promise(function (resolve) {
        return Postgres.db.query(query, function (err) { return resolve(err); });
    });
};
Postgres.delete = function (query) {
    return new Promise(function (resolve) {
        return Postgres.db.query(query, function (err) { return resolve(err); });
    });
};
module.exports = Postgres;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGF0YWJhc2VzL3Bvc3RncmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLEVBQ25CLE9BQU8sR0FBVyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFPM0MsUUFBUSxHQUFHLFVBQUMsTUFBb0I7SUFDOUIsUUFBUSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUM7SUFDckIsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUV0QixPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDLENBQUM7QUFTRixRQUFRLENBQUMsT0FBTyxHQUFHLFVBQ2pCLEtBQWEsRUFDYixJQUFrQyxFQUNsQyxPQUF3QjtJQUF4Qix3QkFBQSxFQUFBLGVBQXdCO0lBRXhCLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzlCLElBQUksT0FBTyxTQUFvQixFQUM3QixLQUFLLEdBQXVCLENBQUMsRUFDN0IsT0FBTyxTQUFvQixDQUFDO1FBRTlCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDbkIsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN2QixLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ25CLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFckIsS0FBSyxHQUFHLEtBQUssSUFBRyxlQUFhLE9BQU8sU0FBSSxPQUFPLGVBQVUsS0FBTyxDQUFBLENBQUM7U0FDbEU7YUFBTTtZQUNMLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdkIsT0FBTyxHQUFHLElBQUksQ0FBQyxH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LENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsVUFBQyxHQUF3QixJQUFLLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFaLENBQVksQ0FBQztJQUFwRSxDQUFvRSxDQUNyRTtBQUZELENBRUMsQ0FBQztBQUdKLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFBvc3RncmVzXHJcbiAqXHJcbiAqIEBhdXRob3Igd2FkYWhrb2RlIDxtdnAuZGVkZWZpbGFyYXNAZ21haWwuY29tPlxyXG4gKiBAc2luY2UgdmVyc2lvbiAxLjEuOFxyXG4gKi9cclxubGV0IFBvc3RncmVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxubGV0IGRhdGUgPSBuZXcgRGF0ZSgpLFxyXG4gIHNlY29uZHM6IG51bWJlciA9IGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCk7XHJcblxyXG4vKipcclxuICogQ29uc3RydWN0b3Igb3IgRnVuY3Rpb25cclxuICpcclxuICogQHJldHVybiBQb3N0Z3Jlc1xyXG4gKi9cclxuUG9zdGdyZXMgPSAoY2xpZW50OiBvYmplY3QgfCBhbnkpID0+IHtcclxuICBQb3N0Z3Jlcy5kYiA9IGNsaWVudDtcclxuICBQb3N0Z3Jlcy5kYi5jb25uZWN0KCk7XHJcblxyXG4gIHJldHVybiBQb3N0Z3JlcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBNZW5nYW1iaWwgc2VtdWEgZGF0YSBkYXJpIGRhdGFiYXNlXHJcbiAqXHJcbiAqIEBwYXJhbSBxdWVyeSBzdHJpbmdcclxuICogQHBhcmFtIHNvcnQgYXJyYXl8bnVtYmVyfGFueVxyXG4gKiBAcGFyYW0gcHJlcGVuZCBib29sZWFuXHJcbiAqL1xyXG5Qb3N0Z3Jlcy5maW5kQWxsID0gKFxyXG4gIHF1ZXJ5OiBzdHJpbmcsXHJcbiAgc29ydDogQXJyYXk8c3RyaW5nIHwgbnVtYmVyIHwgYW55PixcclxuICBwcmVwZW5kOiBib29sZWFuID0gZmFsc2VcclxuKSA9PiB7XHJcbiAgaWYgKHByZXBlbmQgJiYgc29ydC5sZW5ndGggPiAxKSB7XHJcbiAgICBsZXQgb3JkZXJCeTogc3RyaW5nIHwgdW5kZWZpbmVkLFxyXG4gICAgICBsaW1pdDogbnVtYmVyIHwgdW5kZWZpbmVkID0gMSxcclxuICAgICAga2V5d29yZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGlmIChzb3J0Lmxlbmd0aCA+IDIpIHtcclxuICAgICAgb3JkZXJCeSA9IHNvcnQuc2hpZnQoKTtcclxuICAgICAgbGltaXQgPSBzb3J0LnBvcCgpO1xyXG4gICAgICBrZXl3b3JkID0gc29ydC5wb3AoKTtcclxuXHJcbiAgICAgIHF1ZXJ5ID0gcXVlcnkgKyBgIE9SREVSIEJZICR7b3JkZXJCeX0gJHtrZXl3b3JkfSBMSU1JVCAke2xpbWl0fWA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvcmRlckJ5ID0gc29ydC5zaGlmdCgpO1xyXG4gICAgICBrZXl3b3JkID0gc29ydC5wb3AoKTtcclxuXHJcbiAgICAgIHF1ZXJ5ID0gcXVlcnkgKyBgIE9SREVSIEJZICR7b3JkZXJCeX0gJHtrZXl3b3JkfWA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBQb3N0Z3Jlcy5kYi5xdWVyeShcclxuICAgICAgICAgIHF1ZXJ5LFxyXG4gICAgICAgICAgKGVycjogb2JqZWN0IHwgbnVsbCB8IGFueSwgc25hcHNob3Q6IG9iamVjdCB8IGFueSkgPT5cclxuICAgICAgICAgICAgZXJyICE9IG51bGxcclxuICAgICAgICAgICAgICA/IHJlamVjdCh0cnVlKVxyXG4gICAgICAgICAgICAgIDogc25hcHNob3Qucm93cy5sZW5ndGggPj0gMVxyXG4gICAgICAgICAgICAgID8gcmVzb2x2ZShzbmFwc2hvdC5yb3dzKVxyXG4gICAgICAgICAgICAgIDogcmVqZWN0KHRydWUpXHJcbiAgICAgICAgKTtcclxuICAgICAgfSwgc2Vjb25kcyk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBQb3N0Z3Jlcy5kYi5xdWVyeShcclxuICAgICAgICBxdWVyeSxcclxuICAgICAgICAoZXJyOiBvYmplY3QgfCBudWxsIHwgYW55LCBzbmFwc2hvdDogb2JqZWN0IHwgYW55KSA9PlxyXG4gICAgICAgICAgIWVyciA/IHJlc29sdmUoc25hcHNob3Qucm93cykgOiByZWplY3QoZXJyKVxyXG4gICAgICApO1xyXG4gICAgfSwgc2Vjb25kcyk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogTWVuZ2FtYmlsIGRhdGEgZGFyaSBkYXRhYmFzZSBiZXJkYXNhcmthbiB1c2VybmFtZSBhdGF1IGVtYWlsXHJcbiAqXHJcbiAqIEBwYXJhbSBxdWVyeSBzdHJpbmdcclxuICogQHBhcmFtIHBhcmFtcyBhcnJheVxyXG4gKi9cclxuUG9zdGdyZXMuZmluZEJ5SWQgPSAocXVlcnk6IHN0cmluZywgcGFyYW1zOiBBcnJheTxzdHJpbmc+KSA9PiB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIHNldFRpbWVvdXQoXHJcbiAgICAgICgpID0+XHJcbiAgICAgICAgUG9zdGdyZXMuZGIucXVlcnkoXHJcbiAgICAgICAgICBxdWVyeSxcclxuICAgICAgICAgIHBhcmFtcyxcclxuICAgICAgICAgIChlcnI6IG9iamVjdCB8IG51bGwgfCBhbnksIHNuYXBzaG90OiBvYmplY3QgfCBhbnkpID0+XHJcbiAgICAgICAgICAgIGVyciAhPSBudWxsXHJcbiAgICAgICAgICAgICAgPyByZWplY3QodHJ1ZSlcclxuICAgICAgICAgICAgICA6IHNuYXBzaG90LnJvd3MubGVuZ3RoID49IDFcclxuICAgICAgICAgICAgICA/IHJlc29sdmUoc25hcHNob3Qucm93cylcclxuICAgICAgICAgICAgICA6IHJlamVjdCh0cnVlKVxyXG4gICAgICAgICksXHJcbiAgICAgIHNlY29uZHNcclxuICAgICk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogTWVueWltcGFuIGRhdGEga2VkYWxhbSBkYXRhYmFzZVxyXG4gKlxyXG4gKiBAcGFyYW0gcXVlcnkgc3RyaW5nXHJcbiAqIEBwYXJhbSB2YWx1ZXMgYXJyYXlcclxuICovXHJcblBvc3RncmVzLnB1c2ggPSAocXVlcnk6IHN0cmluZywgdmFsdWVzOiBBcnJheTxzdHJpbmc+KSA9PlxyXG4gIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxyXG4gICAgUG9zdGdyZXMuZGIucXVlcnkocXVlcnksIHZhbHVlcywgKGVycjogb2JqZWN0IHwgbnVsbCB8IGFueSkgPT4gcmVzb2x2ZShlcnIpKVxyXG4gICk7XHJcblxyXG4vKipcclxuICogTWVtcGVyYmFydWkgZGF0YSB5YW5nIHRlcnNpbXBhbiBkaWRhdGFiYXNlXHJcbiAqXHJcbiAqIEBwYXJhbSBxdWVyeSBzdHJpbmdcclxuICovXHJcblBvc3RncmVzLnVwZGF0ZSA9IChxdWVyeTogc3RyaW5nKSA9PlxyXG4gIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxyXG4gICAgUG9zdGdyZXMuZGIucXVlcnkocXVlcnksIChlcnI6IG9iamVjdCB8IG51bGwgfCBhbnkpID0+IHJlc29sdmUoZXJyKSlcclxuICApO1xyXG5cclxuLyoqXHJcbiAqIE1lbmdoYXB1cyBkYXRhIGRhcmkgZGF0YWJhc2VcclxuICpcclxuICogQHBhcmFtIHF1ZXJ5IHN0cmluZ1xyXG4gKi9cclxuUG9zdGdyZXMuZGVsZXRlID0gKHF1ZXJ5OiBzdHJpbmcpID0+XHJcbiAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+XHJcbiAgICBQb3N0Z3Jlcy5kYi5xdWVyeShxdWVyeSwgKGVycjogb2JqZWN0IHwgbnVsbCB8IGFueSkgPT4gcmVzb2x2ZShlcnIpKVxyXG4gICk7XHJcblxyXG4vLyBFeHBvcnQgUG9zdGdyZXNcclxubW9kdWxlLmV4cG9ydHMgPSBQb3N0Z3JlcztcclxuIl19
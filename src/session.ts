const queryString = require('querystring');

let session: any = {};

exports.start = function(){
  for (let key in process.env) {
    session[key] = process.env[key];
  }
};

exports.has = function(sessionid: string){
  return process.env[sessionid];
};

exports.set = function(name: string, value: string) {
  session[name] = makeId(value.length);
  process.env[name] = session[name];
}

exports.get = function(name: string) {
  return process.env[name];
}

exports.setStore = function(id: string, data: any) {
  session[id] =JSON.stringify(data);
  process.env[id] = session[id];
};

exports.getStore = function(id: string){
  return process.env[id];
};

const makeId = (length: number) => {
   let result: string = '';
   let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength: number = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
};
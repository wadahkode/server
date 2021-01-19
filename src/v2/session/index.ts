/**
 * Session
 */
const Session = function() {
  const start = function() {
    return (typeof document == 'undefined')
      ? require('jsdom-global')()
      : false;
  };
  
  const get = function(key: string) {
    let sessid: string = key + '=',
      sess: string[] = document.cookie.split(';');
    
    for (let i = 0; i < sess.length; i++) {
      let s = sess[i];
      
      while (s.charAt(0) == ' ') {
        s = s.substring(1);
      }
      if (s.indexOf(sessid) == 0) {
        return s.substring(sessid.length, s.length);
      }
    }
  };
  
  const has = function(key: string) {
    return get(key) ? true : false;
  };
  
  const set = function(name: string, value: string, expired: number, path: string) {
    let date = new Date();
    
    date.setTime(date.getTime() + (expired * 24 * 60 * 60 * 1000));
    let expires = "expires="+date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=" + path;
  };
  
  return {
    get,
    has,
    start,
    set
  };
};

module.exports = Session;
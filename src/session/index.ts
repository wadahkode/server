/**
 * Session Handler
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.1.3
 */
const Session = function() {
  let get: any,
    has: any,
    set: any,
    destroy: any,
    start: any,
    unset: any;
  
  destroy = function() {
    let name:string = document.cookie;

    if (name != null || name != "") {
      document.cookie = name + '; expires=Thu, 01 Jan 1980 00:00:00 UTC; path=/;';
    }
  },
  
  start = function() {
    return (typeof document == 'undefined')
      ? require('jsdom-global')()
      : false;
  };
  
  get = function(key: string) {
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
    return "";
  };
  
  has = function(key: string) {
    return get(key) != "" ? true : false;
  };
  
  set = function(name: string, value: string, expired: number = 1) {
    let date = new Date();
    
    date.setTime(date.getTime() + (expired * 24 * 60 * 60 * 1000));
    let expires = "expires="+date.toUTCString();
    
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

  unset = function(name: string) {
    let user: string = get(name);

    if (user != null || user != "") {
      document.cookie = name + '=' + user + '; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  };
  
  return {
    destroy,
    get,
    has,
    start,
    set,
    unset
  };
};

module.exports = Session;
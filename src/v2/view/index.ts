/**
 * View
 */
const View = function(view: any) {
  if (typeof view.engine == 'object') {
    const {renderFile} = view.engine,
      data: any = view.hasOwnProperty('data') ? view.data : {},
      options: any = view.hasOwnProperty('options') ? view.options : {
        delimiter: '%'
      };
      
    return {
      render: function(callback: any) {
        return renderFile(view.filename, data, options, (err: any, str: any) => callback(err, str));
      }
    };
    
  }
}

module.exports = View;
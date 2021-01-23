/**
 * View
 */
const View = function(view: any) {
  if (typeof view.engine == 'object') {
    const {renderFile} = view.engine;
      
    return {
      render: function(callback: any) {
        return renderFile(view.filename, view.data, view.options, (err: any, str: any) => callback(err, str));
      }
    };
    
  }
}

module.exports = View;
"use strict";
var View = function (view) {
    if (typeof view.engine == 'object') {
        var renderFile_1 = view.engine.renderFile;
        return {
            render: function (callback) {
                return renderFile_1(view.filename, view.data, view.options, function (err, str) { return callback(err, str); });
            }
        };
    }
};
module.exports = View;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdjIvdmlldy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EsSUFBTSxJQUFJLEdBQUcsVUFBUyxJQUFTO0lBQzdCLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVEsRUFBRTtRQUMzQixJQUFBLFlBQVUsR0FBSSxJQUFJLENBQUMsTUFBTSxXQUFmLENBQWdCO1FBRWpDLE9BQU87WUFDTCxNQUFNLEVBQUUsVUFBUyxRQUFhO2dCQUM1QixPQUFPLFlBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFDLEdBQVEsRUFBRSxHQUFRLElBQUssT0FBQSxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUM7WUFDeEcsQ0FBQztTQUNGLENBQUM7S0FFSDtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFZpZXdcclxuICovXHJcbmNvbnN0IFZpZXcgPSBmdW5jdGlvbih2aWV3OiBhbnkpIHtcclxuICBpZiAodHlwZW9mIHZpZXcuZW5naW5lID09ICdvYmplY3QnKSB7XHJcbiAgICBjb25zdCB7cmVuZGVyRmlsZX0gPSB2aWV3LmVuZ2luZTtcclxuICAgICAgXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uKGNhbGxiYWNrOiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gcmVuZGVyRmlsZSh2aWV3LmZpbGVuYW1lLCB2aWV3LmRhdGEsIHZpZXcub3B0aW9ucywgKGVycjogYW55LCBzdHI6IGFueSkgPT4gY2FsbGJhY2soZXJyLCBzdHIpKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWaWV3OyJdfQ==
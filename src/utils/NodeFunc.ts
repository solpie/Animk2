export let walkDir = (dirPath, callback?): Array<string> => {
    const fs = require('fs')
    const path = require('path')
    var fileArr = [];
    var dirArr = fs.readdirSync(dirPath);
    dirArr.forEach(function (item) {
        if (fs.statSync(dirPath + '/' + item).isDirectory()) {
            //walk(path + '/' + item);
        } else {
            var filename = path.join(dirPath, item);
            fileArr.push(filename);
            if (callback)
                callback(filename)
        }
    });
    return fileArr;
}
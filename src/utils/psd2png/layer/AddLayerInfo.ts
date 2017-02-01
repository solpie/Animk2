var _layerId = {
    id: 'lyid',
    parse: function (file) {
        return file.readInt()
    }
};
var _layerName = {
    id: 'luni',
    parse: function (file) {
        return file.readUnicodeString();
    }
};
///

// var _typeTool = {
//     id: 'TySh',
//     parse: function (file) {
//     }
// };
///
var _sectionDivider = {
    id: 'lsct',
    parse: function (file) {
        var type = file.readInt();
        file.seek(4); // sig
        var blendMode = file.readInt(),
            subType = file.readInt();

        return {
            type: type,
            blendMode: blendMode,
            subType: subType
        }
    }
};
var ref = [
        _layerId,
        _layerName,
        // _typeTool,
        _sectionDivider
    ],

    LAYER_INFO = {};

ref.forEach(function (o) {
    LAYER_INFO[o.id] = o;
});

export function parseAdditional(file, endPos) {
    var o = {};
    while (file.now() < endPos) {
        var sig = file.readString(4),
            key = file.readString(4),
            len = file.pad2(file.readInt()),
            end = file.now() + len;

        if (LAYER_INFO[key]) {
            o[key] = LAYER_INFO[key].parse(file);
        }
        file.seek(end - file.now());
    }

    return o;
}
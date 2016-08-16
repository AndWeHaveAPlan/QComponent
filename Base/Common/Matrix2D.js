var QObject = require('../QObject');

var Matrix2D = QObject.extend('Matrix2D', {
    multiply: function (matrix) {
        var m1 = this.m;
        var m2 = matrix.m;
        var mRet = [[], [], []];

        mRet[0][0] = m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0] + m1[0][2] * m2[2][0];
        mRet[0][1] = m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1] + m1[0][2] * m2[2][1];
        mRet[0][2] = m1[0][0] * m2[0][2] + m1[0][1] * m2[1][2] + m1[0][2] * m2[2][2];
        mRet[1][0] = m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0] + m1[1][2] * m2[2][0];
        mRet[1][1] = m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1] + m1[1][2] * m2[2][1];
        mRet[1][2] = m1[1][0] * m2[0][2] + m1[1][1] * m2[1][2] + m1[1][2] * m2[2][2];
        mRet[2][0] = m1[2][0] * m2[0][0] + m1[2][1] * m2[1][0] + m1[2][2] * m2[2][0];
        mRet[2][1] = m1[2][0] * m2[0][1] + m1[2][1] * m2[1][1] + m1[2][2] * m2[2][1];
        mRet[2][2] = m1[2][0] * m2[0][2] + m1[2][1] * m2[1][2] + m1[2][2] * m2[2][2];

        this.m = mRet;
        return this;
    },
    toStyleString: function () {
        return 'matrix(' + [this.m[0][0], this.m[0][1], this.m[1][0], this.m[1][1], this.m[2][0], this.m[2][1]].join(',') + ')';
    }
}, function (cfg) {
    QObject.call(this, cfg);
    this.m = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
});

// Static
Matrix2D.createEmpty = function () {
    return new Matrix2D();
};

Matrix2D.createRotation = function (a) {
    var cos = Math.cos;
    var sin = Math.sin;
    var ret = new Matrix2D();
    ret.m = [[cos(a), sin(a), 0], [-sin(a), cos(a), 0], [0, 0, 1]];
    return ret;
};

Matrix2D.createTranslation = function (x, y) {
    var ret = new Matrix2D();
    ret.m = [[1, 0, 0], [0, 1, 0], [x, y, 1]];
    return ret;
};

Matrix2D.createScale = function (x, y) {
    var ret = new Matrix2D();
    ret.m = [[x, 0, 0], [0, y, 0], [0, 0, 1]];
    return ret;
};

Matrix2D.createScew = function (x, y) {
    var ret = new Matrix2D();
    ret.m = [[1, x, 0], [y, 1, 0], [0, 0, 1]];
    return ret;
};

module.exports = Matrix2D;
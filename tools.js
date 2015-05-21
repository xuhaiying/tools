/*
 * The original built-in class extension method based on common(v1.0)
 * by Team on 2015/05/12
 */
~function () {
    var aryPro = Array.prototype, strPro = String.prototype;
    aryPro.myDistinct = function () {
        var obj = {};
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            if (obj[cur] == cur) {
                this.splice(i, 1);
                i--;
                continue;
            }
            obj[cur] = cur;
        }
        obj = null;
        return this;
    };
    aryPro.myForEach = function () {
        var context = arguments[1] || this;
        var fn = arguments[0];
        if (Array.prototype.forEach) {
            this.forEach(fn, context);
            return this;
        }
        for (var i = 0; i < this.length; i++) {
            fn.call(context, this[i], i, this);
        }
        return this;
    };
    aryPro.myClone = function () {
        return this.slice(0);
    };

    strPro.myTrim = function () {
        return this.replace(/(^\s*|\s*$)/g, "");
    };
    strPro.myFormatTime = function () {
        var reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:\s+)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})$/g;
        var ary = [];
        this.replace(reg, function () {
            for (var i = 1; i <= 6; i++) {
                var cur = Number(arguments[i]);
                cur = cur < 10 ? "0" + cur : cur;
                ary.push(cur);
            }
        });
        var format = arguments[0] || "{0}年{1}月{2}日 {3}:{4}:{5}";
        return format.replace(/{(\d+)}/g, function () {
            return ary[arguments[1]];
        });
    };
    strPro.mySub = function () {
        var len = arguments[0] || 10;
        var isD = arguments[1] || false;//默认是不加的，想加的话传true
        var str = "", n = 0;
        for (var i = 0; i < this.length; i++) {
            var s = this.charAt(i);
            /[\u4e00-\u9fa5]/.test(s) ? n += 2 : n++;
            if (n > len) {
                isD ? str += "..." : void 0;
                break;
            }
            str += s;
        }
        return str;
    }
}();

/*
 * Detection of data type
 * by Team on 2015/05/12
 */
~function () {
    var parObj = {
        isNum: "Number",
        isStr: "String",
        isBoo: "Boolean",
        isNul: "Null",
        isUnd: "Undefined",
        isObj: "Object",
        isAry: "Array",
        isFun: "Function",
        isReg: "RegExp",
        isDat: "Date"
    };
    var isType = function (type) {
        return function (val) {
            return Object.prototype.toString.call(val) === "[object " + type + "]";
        }
    };
    var cT = {};
    for (var key in parObj) {
        cT[key] = isType(parObj[key]);
    }
    window.cT = cT;
}();

/*
 * Tool library
 * by Team on 2015/05/12
 */
~function (window, undefined) {
    var zQuery = function () {
        this.flag = document.getElementsByClassName ? true : false;
        this.likeToArray = function () {
            var likeArray = arguments[0];
            if (this.flag) {
                return [].slice.call(likeArray, 0);
            }
            var ary = [];
            for (var i = 0; i < likeArray.length; i++) {
                ary.push(likeArray[i]);
            }
            return ary;
        };
        this.formatJson = function () {
            var jsonStr = arguments[0];
            try {
                return JSON.parse(jsonStr);
            } catch (e) {
                return eval("(" + jsonStr + ")");
            }
        }
    };
    var pro = zQuery.prototype = {
        constructor: zQuery,
        extend: function (obj) {
            for (var key in obj) {
                pro[key] = obj[key];
            }
        },
        byId: function () {
            return document.getElementById(arguments[0]);
        }
    };

    /*handle style*/
    pro.extend({
        byClass: function () {
            var cName = arguments[0], context = arguments[1] || document;
            if (this.flag) {
                return this.likeToArray(context.getElementsByClassName(cName));
            }
            var ary = [], allNode = this.likeToArray(context.getElementsByTagName("*")), reg = new RegExp("(?:^| +)" + cName + "(?: +|$)");
            allNode.myForEach(function (item) {
                if (reg.test(item.className)) {
                    ary.push(item);
                }
            });
            return ary;
        },
        hasClass: function () {
            var cName = arguments[0], ele = arguments[1], reg = new RegExp("(?:^| +)" + cName + "(?: +|$)", "g");
            return reg.test(ele.className);
        },
        addClass: function () {
            var cName = arguments[0], ele = arguments[1];
            if (!this.hasClass(cName, ele)) {
                ele.className += " " + cName;
            }
        },
        removeClass: function () {
            var cName = arguments[0], ele = arguments[1], reg = new RegExp("(?:^| +)" + cName + "(?: +|$)", "g");
            if (this.hasClass(cName, ele)) {
                ele.className = ele.className.replace(reg, "");
            }
        },
        getWin: function (attr) {
            return document.documentElement[attr] || document.body[attr];
        }
    });

    /*handle get element*/
    pro.extend({
        getIndex: function () {
            return this.getPres(arguments[0]).length;
        },
        getPre: function () {
            var ele = arguments[0], pre = ele.previousSibling;
            while (pre && pre.nodeType != 1) {
                pre = pre.previousSibling;
            }
            return pre;
        },
        getPres: function () {
            var ele = arguments[0], pre = ele.previousSibling, ary = [];
            while (pre) {
                pre.nodeType === 1 ? ary.unshift(pre) : void 0;
                pre = pre.previousSibling;
            }
            return ary;
        },
        getNext: function () {
            var ele = arguments[0], next = ele.nextSibling;
            while (next && next.nodeType != 1) {
                next = next.nextSibling;
            }
            return next;
        },
        getNexts: function () {
            var ele = arguments[0], next = ele.nextSibling, ary = [];
            while (next) {
                next.nodeType === 1 ? ary.push(next) : void 0;
                next = next.nextSibling;
            }
            return ary;
        },
        getSibling: function () {
            var ele = arguments[0], ary = [], aryFn = ["getPre", "getNext"], that = this;
            aryFn.myForEach(function (item) {
                var val = that[item](ele);
                val ? ary.push(val) : void 0;
            });
            return ary;
        },
        getSiblings: function () {
            var ele = arguments[0], ary = [], aryFn = ["getPres", "getNexts"], that = this;
            aryFn.myForEach(function (item) {
                var val = that[item](ele);
                ary = (val && val.length > 0) ? ary.concat(val) : ary.concat([]);
            });
            return ary;
        },
        getChildren: function () {
            var ele = arguments[0], tar = arguments[1] || false, ary = [];
            var all = this.likeToArray(ele.childNodes);
            all.myForEach(function (item) {
                if (item.nodeType === 1) {
                    if (tar) {
                        if (item.nodeName.toLowerCase() === tar.toLowerCase()) {
                            ary.push(item);
                        }
                    } else {
                        ary.push(item);
                    }
                }
            });
            return ary;
        },
        getFirst: function () {
            var ele = arguments[0], tar = arguments[1] || false, res = null;
            var all = this.getChildren(ele, tar);
            if (all && all.length > 0) {
                res = all[0];
            }
            return res;
        },
        getLast: function () {
            var ele = arguments[0], tar = arguments[1] || false, res = null;
            var all = this.getChildren(ele, tar);
            if (all && all.length > 0) {
                res = all[all.length - 1];
            }
            return res;
        }
    });

    /*handle not get element*/
    pro.extend({
        create: function () {
            /*
             * obj:tagName,id...
             */
            var obj = arguments[0], res = null;
            res = document.createElement(obj.tagName);
            for (var key in obj) {
                if (key !== "tagName") {
                    if (key === "style") {
                        for (var attr in obj[key]) {
                            res["style"][attr] = obj[key][attr];
                        }
                    } else {
                        res[key] = obj[key];
                    }
                }
            }
            return res;
        },
        insertAfter: function () {
            var newEle = arguments[0], oldEle = arguments[1], oldEleNext = this.getNext(oldEle);
            if (oldEleNext) {
                oldEleNext.parentNode.insertBefore(newEle, oldEleNext);
            } else {
                oldEle.parentNode.appendChild(newEle);
            }
        },
        prepend: function () {
            var newEle = arguments[0], par = arguments[1], first = this.getFirst(par);
            if (first) {
                par.insertBefore(newEle, first);
            } else {
                par.appendChild(newEle);
            }
        },
        html: function () {
            var ele = arguments[0], str = arguments[1] || "";
            if (str) {
                ele.innerHTML += str;
                return;
            }
            return ele.innerHTML;
        }
    });

    /*handle pos*/
    pro.extend({
        getCss: function () {
            var ele = arguments[0], attr = arguments[1], val;
            var reg = /float|dispaly|position|margin|padding/i;
            val = this.flag ? window.getComputedStyle(ele, null)[attr] : ele.currentStyle[attr];
            return !reg.test(attr) ? parseFloat(val) : val;
        },
        offset: function () {
            var ele = arguments[0], par = ele.offsetParent, top = ele.offsetTop, left = ele.offsetLeft, obj = {};
            while (par) {
                top += par.offsetTop;
                left += par.offsetLeft;
                if (window.navigator.userAgent.indexOf("MSIE 8.0") <= -1) {
                    top += par.clientTop;
                    left += par.clientLeft;
                }
                par = par.offsetParent;
            }
            return {
                top: top,
                left: left
            };
        },
        setCss: function () {
            var ele = arguments[0], attr = arguments[1], value = arguments[2];
            with (ele) {
                switch (attr) {
                    case "float":
                        style["cssFloat"] = value;
                        style["styleFloat"] = value;
                        break;
                    case "opacity":
                        if (value <= 1 && value >= 0) {
                            style["opacity"] = value;
                            style["filter"] = "alpha(opacity=" + (value * 100) + ")";
                        }
                        break;
                    default:
                        style[attr] = value;
                }
            }
        },
        setGroupCss: function () {
            var eleObj = arguments[0], cssObj = arguments[1];
            var eleAry = [];
            !cT.isAry(eleObj) ? eleAry.push(eleObj) : eleAry = eleObj;
            for (var i = 0; i < eleAry.length; i++) {
                var cur = eleAry[i];
                for (var key in cssObj) {
                    this.setCss(cur, key, cssObj[key]);
                }
            }
        }
    });

    window.zQuery = window.$ = new zQuery();
}(window);

//http://tool.css-js.com/
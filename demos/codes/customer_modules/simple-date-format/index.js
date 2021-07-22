function format() {
    var e=arguments[0],
        t = arguments.length > 1 && void 0 !== arguments[1] 
            ? arguments[1] 
            : "yyyy-MM-dd HH:mm:ss"
    if (!e)
        return ""
    if (!(e instanceof Date) && "number" != typeof e)
        throw new TypeError("Parameter source:" + e + " is not a Date or Number.")
    if (!t || "string" != typeof t)
        throw new Error("Parameter pattern:" + t + " is not a valid date format pattern.")
    "number" == typeof e && (e = new Date(e))
    var n = {
        yy: e.getFullYear() % 100,
        yyyy: e.getFullYear(),
        MM: e.getMonth() + 1,
        dd: e.getDate(),
        hh: e.getHours() % 12,
        HH: e.getHours(),
        mm: e.getMinutes(),
        ss: e.getSeconds()
    }
    return t.replace(/yyyy|yy|MM|dd|HH|hh|mm|ss/g, function(e) {
        var t = "0000" + n[e]
        return t.substr(- e.length)
    })
}

module.exports = format
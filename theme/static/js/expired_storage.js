!function (e) {
    "use strict";

    function t(e) {
        if (!(e = e || ("undefined" != typeof localStorage ? localStorage : null))) throw new Error("ExpiredStorage: No storage base class provided and 'localStorage' is undefined! Please provide a valid base storage class.");
        if (!(e.setItem && e.getItem && e.removeItem && e.clear)) throw new Error("ExpiredStorage: Storage class  don't support one or more of the required API functions: getItem, setItem, removeItem or clear.");
        this._storage = e
    }

    t.prototype = {
        _storage: null, _expiration_key_prefix: "__expired_storage_ts__", getTimestamp: function () {
            return Math.floor((new Date).getTime() / 1e3)
        }, setItem: function (e, t, r) {
            var i = this._storage.setItem(e, t);
            return r && this.updateExpiration(e, r), i
        }, getItem: function (e) {
            return this.isExpired(e) ? (this.removeItem(e), null) : this._storage.getItem(e)
        }, peek: function (e) {
            var t = {value: this._storage.getItem(e), timeLeft: this.getTimeLeft(e)};
            return t.isExpired = null !== t.timeLeft && t.timeLeft <= 0, t
        }, getTimeLeft: function (e) {
            var t = parseInt(this._storage.getItem(this._expiration_key_prefix + e));
            return t && !isNaN(t) ? t - this.getTimestamp() : null
        }, isExpired: function (e) {
            var t = this.getTimeLeft(e);
            return null !== t && t <= 0
        }, updateExpiration: function (e, t) {
            return this._storage.setItem(this._expiration_key_prefix + e, this.getTimestamp() + t)
        }, removeItem: function (e) {
            var t = this._storage.removeItem(e);
            return this._storage.removeItem(this._expiration_key_prefix + e), t
        }, setJson: function (e, t, r) {
            if (void 0 === t) throw new Error("Cannot set undefined value as JSON!");
            return this.setItem(e, JSON.stringify(t), r)
        }, getJson: function (e) {
            var t = this.getItem(e);
            return null === t ? null : JSON.parse(t)
        }, keys: function (e) {
            var t = [], r = this;
            return this._iterKeys(function (i) {
                0 !== i.indexOf(r._expiration_key_prefix) && (!e && r.isExpired(i) || t.push(i))
            }), t
        }, _iterKeys: function (e) {
            if ("function" == typeof this._storage.keys) for (var t = this._storage.keys(), r = 0; r < t.length; ++r) e(t[r]); else if ("function" == typeof Object && Object.keys) for (var t = Object.keys(this._storage), r = 0; r < t.length; ++r) e(t[r]); else if (void 0 !== this._storage.length && "function" == typeof this._storage.key) {
                for (var t = [], r = 0, i = this._storage.length; r < i; ++r) t.push(this._storage.key(r));
                for (r = 0; r < t.length; ++r) e(t[r])
            } else for (var o in this._storage) e(o)
        }, clear: function () {
            this._storage.clear()
        }, clearExpired: function () {
            var e = [], t = (this.getTimestamp(), this);
            return this._iterKeys(function (r) {
                if (0 === r.indexOf(t._expiration_key_prefix)) {
                    var i = r.substr(t._expiration_key_prefix.length);
                    t.isExpired(i) && (t.removeItem(i), e.push(i))
                }
            }), e
        }
    }, t.version = "1.0.2", t.author = "Ronen Ness", t.gitUrl = "https://github.com/RonenNess/ExpiredStorage", "function" == typeof define && define.amd ? define(function () {
        return t
    }) : "object" == typeof module && module.exports ? module.exports = t : "object" == typeof exports && exports ? exports = t : e && !e.ExpiredStorage && (e.ExpiredStorage = t)
}(this);

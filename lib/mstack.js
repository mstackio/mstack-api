(function () {
    var Mstack, encode, handleResponse, request, defaultHeaders;
    request = require('request');
    querystring = require('querystring');
    encode = encodeURIComponent;
    defaultHeaders = {};
    Mstack = (function () {
        function Mstack() {
            this.basehost = 'https://api.mstack.io/';
        }
        Mstack.prototype.request = function (method, path, body, cb) {
            var req;
            defaultHeaders['Content-Type'] = "application/x-www-form-urlencoded";
            req = {
                uri: this.basehost + encodeURI(path),
                method: method,
                body: querystring.stringify(body),
                headers: defaultHeaders
            };
            return request(req, handleResponse(cb));
        }
        Mstack.prototype.get = function (path, cb) {
            return this.request("GET", path, null, cb);
        };
        Mstack.prototype.post = function (path, body, cb) {
            return this.request("POST", path, body, cb);
        };
        Mstack.prototype.del = function (path, body, cb) {
            return this.request("DELETE", path, body, cb);
        };
        Mstack.prototype.register = function (username, password, email, cb) {
            var postdata;
            postdata = {
                username,
                password,
                email
            }
            return this.post("user/register", postdata, cb);
        }
        Mstack.prototype.getToken = function (username, password, cb) {
            var postdata;
            postdata = {
                username,
                password
            }
            return this.post("user/gettoken", postdata, cb);
        }
        Mstack.prototype.get_regions = function (cb) {
            return this.get("regions", cb);
        };
        Mstack.prototype.getRsa = function (cb) {
            return this.get("user/keys", cb);
        };
        Mstack.prototype.addRsa = function (key, cb) {
            var postdata;
            postdata = {
                sshkey: key

            }
            return this.post("user/addkey", postdata, cb);
        }
        Mstack.prototype.deleteRsa = function (token, cb) {
            return this.del("user/key", {
                token
            });
        };
        Mstack.prototype.getInstance = function (instance, cb) {
            return this.get("instances/" + instance, cb);
        }
        Mstack.prototype.getInstances = function (cb) {
            return this.get("instances/", cb);
        }
        Mstack.prototype.CreateInstance = function (appname, region = '', cb) {
            var postdata;
            postdata = {
                appname,
                region
            };
            return this.post("instances", postdata, cb);
        }
        Mstack.prototype.DeleteInstance = function (appname, cb) {
            return this.del("instances/" + appname, null, cb);
        }
        Mstack.prototype.setToken = function (token) {
            defaultHeaders['authorization'] = "Bearer " + token;
        }

        return Mstack;
    })();

    handleResponse = function (cb) {
        var _this = this;
        return function (err, res, body) {
            var errCause, errCode, error, success;
            success = JSON.parse(body);
            cb(success);
        };
    };
    module.exports.mstack = Mstack;

}).call(this);
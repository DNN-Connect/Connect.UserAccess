define(['jquery'], function ($) {
    return {
        init: function (wrapper, util, params, callback) {
            $.ajax({
                dataType: "script",
                cache: true,
                url: "modules/Connect.UserAccess/scripts/bootstrap.min.js",
                success: function () {
                    $.ajax({
                        dataType: "script",
                        cache: true,
                        url: "modules/Connect.UserAccess/scripts/bundles/connect-useraccess.js",
                        success: function () {
                            window.connect.useraccess.init(util, params);
                        },
                    });
                },
            });
            if (typeof callback === 'function') {
                callback();
            }
        },
        load: function (params, callback) {
            window.connect.useraccess.load(params);
            if (typeof callback === 'function') {
                callback();
            }
        }
    };
});

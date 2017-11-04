exports.mobileRouter = function (router) {
    require("./user").mobileRouter(router);
    require("./lucydraw").mobileRouter(router);
};
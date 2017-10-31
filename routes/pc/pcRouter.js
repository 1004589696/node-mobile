exports.pcRouter = function(router){
    require("./lucydraw").pcRouter(router);
    require("./admin").pcRouter(router);
};
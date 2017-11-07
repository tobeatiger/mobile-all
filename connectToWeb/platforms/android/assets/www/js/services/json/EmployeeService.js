var EmployeeService = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "http://192.168.1.102:5000/employees";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    };

    this.findById = function(id) {
        return $.ajax({url: url + "/" + id});
    };

    this.findByName = function(searchKey) {
        //alert(url + "?name=" + searchKey);
        return $.ajax({url: url + "?name=" + searchKey});
    };

};
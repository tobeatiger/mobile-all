var HomeView = function (service) {

    var employeeListView;

    this.initialize = function () {
        // Define a div wrapper for the view (used to attach events)
        this.$el = $('<div/>');
        employeeListView = new EmployeeListView();
        this.render();
    };

    this.render = function() {
        this.$el.html(this.template());
        $('.content', this.$el).html(employeeListView.$el);
        return this;
    };

    this.bindEvents = function () {
        this.$el.off().on('keyup', '.search-key', this.findByName);
        return this;
    };

    this.findByName = function() {
        service.findByName($('.search-key').val()).done(function(employees) {
            employeeListView.setEmployees(employees);
        }).fail(function(err) {
            alert(JSON.stringify(err));
        });
    };

    this.initialize();

};
var EmployeeView = function() {

    this.initialize = function() {
        this.$el = $('<div/>');
    };

    this.render = function(employee) {
        this.$el.html(this.template(employee));
        return this;
    };

    this.bindEvents = function () {
        this.$el.find('header span.icon-left-nav').off('click').on('click', function() {
            backHandler();
        });
        return this;
    };

    this.initialize();

};
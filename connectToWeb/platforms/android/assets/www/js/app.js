// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    requirejs.config({
        baseUrl: '.',
        waitSeconds: 0,
        paths: {
            text: 'lib/require/text'
        },
        shim: {},
        config: {}
    });

    var body$ = $('body');
    window.backHandler = function() {
        history.go(-1);
    };

    require([
        'text!./assets/templates/home-tpl.html',
        'text!./assets/templates/employee-list-tpl.html',
        'text!./assets/templates/employee-tpl.html',
        'text!./assets/templates/compose-msg.html'
    ], function (home, employeeList, employeee, composeMsg) {
        /* ---------------------------------- Local Variables ---------------------------------- */
        var slider = new PageSlider(body$);
        var service = new EmployeeService();
        //var homeTpl = Handlebars.compile($("#home-tpl").html());
        //var employeeListTpl = Handlebars.compile($("#employee-list-tpl").html());
        HomeView.prototype.template = Handlebars.compile(home);
        EmployeeListView.prototype.template = Handlebars.compile(employeeList);
        EmployeeView.prototype.template = Handlebars.compile(employeee);
        ComposeMsgView.prototype.template = Handlebars.compile(composeMsg);
        service.initialize().done(function () {
            console.log("Service initialized");
            //renderHomeView();
            //$('body').html(new HomeView(service).render().$el);
            var homeView = new HomeView(service).render();
            router.addRoute('', function() {
                //$('body').html(new HomeView(service).render().$el);
                slider.slidePage(homeView.bindEvents().$el);
            });

            var employeeView = new EmployeeView();
            router.addRoute('employees/:id', function(id) {
                service.findById(parseInt(id)).done(function(employee) {
                    //$('body').html(new EmployeeView(employee).render().$el);
                    slider.slidePage(employeeView.render(employee).bindEvents().$el);
                });
            });

            var composeMsgView = new ComposeMsgView();
            router.addRoute('composemsg', function() {
                slider.slidePage(composeMsgView.$el);
                composeMsgView.render();
            });

            router.start();
        });
    });

    /* --------------------------------- Event Registration -------------------------------- */
    //$('.search-key').on('keyup', findByName);
    //$('.help-btn').on('click', function() {
    //    alert("Employee Directory v3.4");
    //});

    /* ---------------------------------- Local Functions ---------------------------------- */
    //function findByName() {
    //    service.findByName($('.search-key').val()).done(function (employees) {
    //        $('.content').html(employeeListTpl(employees));
    //    });
    //}

    //function renderHomeView() {
    //    $('body').html(homeTpl());
    //    $('.search-key').on('keyup', findByName);
    //}
}());
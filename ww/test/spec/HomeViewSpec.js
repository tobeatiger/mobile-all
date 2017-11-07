define(['boot',
    'text!./../../www/assets/templates/home-tpl.html',
    'text!./../../www/assets/templates/employee-list-tpl.html',
    'text!./../../www/assets/templates/employee-tpl.html',
    'text!./../../www/assets/templates/compose-msg.html'], function (jasmine, home, employeeList, employeee, composeMsg) {

    HomeView.prototype.template = Handlebars.compile(home);
    EmployeeListView.prototype.template = Handlebars.compile(employeeList);
    EmployeeView.prototype.template = Handlebars.compile(employeee);
    ComposeMsgView.prototype.template = Handlebars.compile(composeMsg);

    var body$ = $('#home_demo');
    var slider = new PageSlider(body$);

    describe('Home view: ', function() {

        var service = new EmployeeService('www/');

        beforeAll(function(done) {
            service.initialize().done(function() {
                done();
            });
        });

        it('EmployeeService ready', function() {
            expect(typeof service.findById).toBe('function');
            expect(typeof service.findByName).toBe('function');
        });

        describe('EmployeeService - findById: ', function() {
            var employee;
            beforeAll(function(done) {
                service.findById(4).done(function(data) {
                    employee = data;
                    done();
                });
            });
            it('findById(4) should find the record of id 4', function() {
                expect(employee).toBeTruthy();
                expect(employee.id).toBe(4);
            });
        });
        describe('EmployeeService - findByName: ', function() {
            var employees;
            beforeAll(function(done) {
                service.findByName('pa').done(function(data) {
                    employees = data;
                    done();
                });
            });
            it('findByName("pa") should find the records with "firstName" or "lastName" contains "pa"(non case sensitive)', function() {
                expect(employees.length).toBe(2);
                $.each(employees, function(index, epl) {
                    expect((epl.firstName + ' ' + epl.lastName).toLowerCase().indexOf('pa')).toBeGreaterThan(-1);
                });
            });
        });
        describe('create home view: ', function() {
            var homeView = new HomeView(service).render();
            it('home dom elements - created with home template', function() {
                expect(homeView.$el).toBeTruthy();
                expect(homeView.$el.find('.content').get(0)).toBeTruthy();
            });
            it('home dom elements - created employeeList dom by employee list template', function() {
                expect(homeView.$el.find('.content').find('ul.table-view').get(0)).toBeTruthy();
            });
            it('home dom elements - created employeeList dom by employee list template - no employee items created before a search', function() {
                expect(homeView.$el.find('.content').find('ul.table-view').find('li.table-view-cell').get(0)).toBeFalsy();
            });
        });
        describe('perform a search with key word "pa": ', function() {
            var homeView = new HomeView(service).render();
            slider.slidePage(homeView.bindEvents().$el);
            var input$ = homeView.$el.find('.search-key');
            function enterSearchText (text) {
                input$.val(text).trigger('keyup');
            }
            beforeAll(function(done) {
                enterSearchText('j');
                setTimeout(function() {
                    enterSearchText('ja');
                    setTimeout(function() {
                        enterSearchText('pa');
                        setTimeout(function() {
                            done();
                        }, 1);
                    }, 500);
                }, 500);
            });
            it('some employee items created after a search', function() {
                expect(homeView.$el.find('.content').find('ul.table-view').find('li.table-view-cell').get(0)).toBeTruthy();
            });
            it('search results contains "pa"(non case sensitive) in the "firstName" or "lastName"', function() {
                var lis$ = homeView.$el.find('.content').find('ul.table-view').find('li.table-view-cell');
                var contains = false;
                lis$.each(function() {
                    if($(this).find('div.media-body').text().toLowerCase().indexOf('pa') >= 0) {
                        contains = true;
                    }
                });
                expect(contains).toBe(true);
            });
        });

    });
});
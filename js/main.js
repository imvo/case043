(function () {
    var App = function () {
        this.routes = {};

        this.route = function (path, callback) {
            this.routes[path] = {callback: callback};
        };

        this.router = function () {
            var url = window.location.pathname.split("/").pop();
            var route = this.routes[url];
            if (route.callback) {
                route.callback()
            }
        };
        this.filter = function () {

            var data = this.value.split(" ");
            var rows = $("tbody").find("tr");
            if (this.value == "") {
                rows.show();
                return;
            }

            rows.hide();

            //filter the jquery object to get results.
            rows.filter(function (i, v) {

                var $t = $(this);
                var result = true;
                for (var d = 0; d < data.length; ++d) {
                    result = $t.is(":xcontains('" + data[d] + "')") && result
                }
                return result;
            }).show();
        };
    };

    //case insensitive
    $.expr[":"].xcontains = $.expr.createPseudo(function (arg) {
        return function (elem) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });


    var app = new App;

    app.route('directories.html', function () {
        $.getJSON('json/getDirectories.json')
            .done(function (data) {
                var ul = '';
                $.each(data.response.directories, function (i, item) {
                    ul += '<li><a href="#">' + item.name + '</a></li>';
                });
                $('ul').append(ul);
            })
    });
    app.route('directory.html', function () {
        $.getJSON('json/getDirectory.json')
            .done(function (data) {
                var tr = '';
                $.each(data.response.directory.items, function (i, item) {
                    tr = '<tr><td><a href="#">' + item.name + '</a></td><td>' + item.weight + '</td><td>' + ('' + item.point).replace('.', ',') + '</td><td>' + item.endDate + '</td></tr>';
                    $('tbody').append(tr);
                });

                $("#filter").keyup(function () {
                    app.filter.call(this)
                });
            })

    });
    app.route('entry.html', function () {
        $.getJSON('json/getEntry.json')
            .done(function (data) {
                var currentDir = '<span><a href="#">' + data.response.entry.directory.name + '</a></span>';
                var entryName = data.response.entry.name;
                $('.breadcrumbs').append(currentDir);
                $('section>h1').html(entryName);
                $.each(data.response.entry.items, function (i, item) {
                    var el = $("#" + item.id);
                    switch (item.type) {
                        case 'TEXTAREA':
                            el.html(item.value);
                            break;
                        case 'SELECT':
                            var options = '';
                            $.each(item.values, function (i, option) {
                                options += '<option value="' + option.id + '" ' + ' ' + (option.selected ? 'selected' : '') + '>' + option.name + '</option>';
                                el.val(option.selected ? option.name : false)
                            });
                            el.append(options);
                            break;
                        case 'FLOAT':
                            el.val(('' + item.value).replace('.', ','));
                            break;
                        case 'INTEGER':
                            el.val(item.value);
                            break;
                        case 'TEXT':
                            el.val(item.value);
                            break;
                        case 'DATE':
                            el.val(item.value);
                            break
                    }
                });

                $(".datepicker").pickmeup({
                    format: 'd.m.Y'
                });
            })
    });

    window.addEventListener('load', app.router.call(app));
})();

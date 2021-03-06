tasksController = function() {
    var taskPage;
    var initialized = false;

    return {
        init: function(page) {
            if (!initialized) {
                taskPage = page;
                $(taskPage).find('[required="required"]')
                    .prev('label')
                    .append('<span>*</span>')
                    .children('span')
                    .addClass('required');
                $(taskPage).find('tbody tr:even')
                    .addClass('even');
                $(taskPage).find('#btnAddTask').click(function(evt) {
                        evt.preventDefault();
                        $(taskPage).find('#taskCreation').removeClass('not');
                    });
                $(taskPage).find('tbody tr').click(function(evt) {
                        $(evt.target)
                            .closest('td')
                            .siblings().addBack()
                            .toggleClass('rowHighlight');
                    });
                $(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', function(evt) {
                        evt.preventDefault();
                        $(evt.target).parents('tr').remove();
                    });
                $(taskPage).find('#saveTask').click(function(evt) {
                    evt.preventDefault();
                    if ($(taskPage).find('form').valid()) {
                        var task = $('form').toObject();
                        $('#taskRow').tmpl(task)
                            .appendTo($(taskPage )
                            .find('#tblTasks tbody'));
                    }
                });
                initialized = true;
            }
        }
    }
}();

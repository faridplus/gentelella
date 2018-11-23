$().ready(function() {
    $(document).on('click', 'a.ajaxcreate, .ajaxupdate, .ajaxview', function(event) {
        event.preventDefault();
        window.scrollTo(0, 0);
        showLoading();
        slidingFormWrapper = getSlidingFormWrapper($(this));
        slidingFormWrapper.slideUp(300);
        $.ajax({
            url: $(this).attr('href'),
            type: 'post',
            dataType: 'json',
            success: function(data) {
                hideLoading();
                slidingFormWrapper.html(data.content).slideDown(500);
            }
        });
    });

    $(document).on('click', 'a.close-sliding-form-button', function(event) {
        event.preventDefault();
        getSlidingFormWrapper($(this)).slideUp(300);
    });

    $(document).on('submit', 'form.sliding-form', function(event) {
        event.preventDefault();
        showLoading();
        $(this).find('button.submit').attr('disabled', 'disabled');
        wrapper = getSlidingFormWrapper($(this));
        $.ajax({
            url: $(this).attr('action'),
            type: 'post',
            dataType: 'json',
            data: new FormData($(this)[0]),
            cache: false,
            contentType: false,
            processData: false,
            async: false
        }).done(function(data) {
            hideLoading();
            if (data.status == 'success' || data.status == 'danger') {
                $(this).slideUp(300);
                $(this).empty();
                showAlert(data.message, data.status);
                refreshGrid();
            } else {
                wrapper.html(data.content);
                $(this).find('button.submit').removeAttr('disabled');
            }
        });
    });

    $(document).on('click', 'a.ajaxdelete', function(event) {
        event.preventDefault();
        showLoading();
        if (confirm($(this).attr('data-confirmmsg'))) {
            getSlidingFormWrapper($(this)).slideUp(300);
            $.ajax({
                url: $(this).attr('href'),
                type: 'post',
                dataType: 'json'
            }).done(function(data) {
                hideLoading();
                showAlert(data.message, data.status);
                refreshGrid();
            });
        } else {
            hideLoading();
        };
    });

    $(document).on('click', 'a.ajaxrequest', function(event) {
        event.preventDefault();
        showLoading();
        getSlidingFormWrapper($(this)).slideUp(500);
        $.ajax({
            url: $(this).attr('href'),
            type: 'post',
            dataType: 'json'
        }).done(function(data) {
            hideLoading();
            showAlert(data.message, data.status);
            refreshGrid();
        });
    });

    function getSlidingFormWrapper(element)
    {
        slidingFormId = element.attr('data-sliding-form-id');
        if (slidingFormId) {
            return $('#' + slidingFormId);
        }
        return $('div.sliding-form-wrapper');
    }

    function showLoading() {
        loadingDiv = $('<div class="loading-gif"><i class="fa fa-spinner fa-pulse fa-3x"></i></div>');
        $('body').prepend(loadingDiv);
    }

    function hideLoading() {
        $('.loading-gif').css('display', 'none');
    }

    function refreshGrid() {
        idOfPjax = $('a.ajaxcreate').attr('data-gridpjaxid');
        $.pjax.defaults.timeout = false;
        $.pjax.reload({container:'#'+idOfPjax});
    }

    function showAlert(message, status) {
        status = status || 'success';
        if (!Array.isArray(message)) {
            message = [message];
        }
        message.forEach(function(message) {
            alertDiv = $('<div class="alert-' + status + ' alert fade in"></div>');
            alertDiv.html(message);
            $(".flash-message-container").append(alertDiv);
        });
        $(".flash-message-container").children().each(function(index) {
            var $alertDiv = $(this);
            setTimeout(function() {
                $alertDiv.alert('close');
            }, (index * 4000) + 4000);
        });
    }
});

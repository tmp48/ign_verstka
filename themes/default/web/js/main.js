$(document).ready(function () {
    $(document).on('click', '.product-add-set-btn', function () {
        $this = $(this);
        var selectedAttribute = $(this).parents('.card').find('.product-color-select-menu input[type="radio"]:checked');
        $.ajax({
            url: $this.attr('data-url'),
            type: 'POST',
            dataType: 'json',
            data: {'YUPE_TOKEN': yupeToken, 'attribute_id': selectedAttribute.val()},
            success: function (response) {
                if (response.result) {
                    $('#beauty-detailed-list').html(response.data);
                    if (!$.isEmptyObject(response.change_step)) {
                        $.pjax.reload({
                            'container': response.change_step.container,
                            'timeout': 100000,
                            'url': response.change_step.url,
                            'push': false,
                            'replace': false
                        });
                        $('.create-box-tabs .create-box-tabs-btn').removeClass('active');
                        $('.create-box-tabs-btn.products-tab').addClass('active');
                    }
                } else {
                }
                if (response.message != '') {
                    showNotify($this, '', response.message);
                }
            },
            error: function () {
            }
        });
    });
	$(document).on('submit', '#card-text-form', function () {
        $this = $(this);
		var message='';
        $.ajax({
            url: $this.attr('action'),
            type: 'POST',
            dataType: 'json',
            data: $this.serialize(),
            success: function (response) {
                if (response.result) {
                    $('#beauty-detailed-list').html(response.data);
					setTimeout(function(){$('.modal').modal('hide')},2000);
                }
                if (response.message != '') {
					$.each(response.message,function(e,k){
						message+=k;
					});					
					showNotify($this, '', message);
                }
            }
        });
		return false;
    });
	$(document).on('show.bs.modal', '#card-text-modal', function (e) {
		var link=$(e.relatedTarget);
		$(this).find('.modal-content-wrapper').load(link.data('url'));
    });
    $('.sort-items a').click(function (e) {
        e.preventDefault();
        container = $(this).parents('.sort-items').attr('data-list-container');
        if ($(this).attr('data-sort-attr') != '') {
            $.fn.yiiListView.update(container, {'data': $(this).attr('data-sort-attr')});
        } else {
            $.fn.yiiListView.update(container, {'data': ''});
        }
        name = $(this).attr('data-name');
        $(this).parents('.catalog-filter-item').find('.js-dropdown-btn').html(name);
    });
    $('.product-attributes input[type="radio"]').change(function () {
        $('#js-product-page-slider-big').slick('slickGoTo', $(this).attr('data-position'));
    });
    $(document).on('click', '.choose-accessories-btn', function (e) {
        e.preventDefault();
        url = $(this).attr('data-url');
        $('.create-box-tabs .create-box-tabs-btn').removeClass('active');
        $('.create-box-tabs-btn.accessories-tab').addClass('active');
        $.pjax.reload({
            'container': '#products-wrapper',
            'timeout': 100000,
            'url': url,
            'push': false,
            'replace': false
        });
    });
    $(document).on('click', '.btn-set-clear,.btn-set-delete,.remove-set-item-btn', function () {
        $this = $(this);
        $.ajax({
            url: $this.attr('data-url'),
            type: 'POST',
            dataType: 'json',
            data: {'YUPE_TOKEN': yupeToken},
            success: function (response) {
                if (response.result) {
                    $('#beauty-detailed-list').html(response.data);
                    $('.create-box-tabs .create-box-tabs-btn').removeClass('active');
                    $('.create-box-tabs-btn.base-tab').addClass('active');
                    if ($this.hasClass('btn-set-delete')) {
                        $.pjax.reload({
                            'container': '#products-wrapper',
                            'timeout': 100000,
                            'url': response.url,
                            'push': false,
                            'replace': false
                        });
                    }
                    return true;
                } else {
                    showNotify($this, '', response.data);
                }
            },
            error: function () {
            }
        });
    });
    $(document).on('click', '.beauty-box-cart-add', function () {
        $this = $(this);
        $.ajax({
            url: $this.attr('data-url'),
            type: 'POST',
            dataType: 'json',
            data: {'YUPE_TOKEN': yupeToken},
            success: function (response) {
                if (response.result) {
                    $('#shopping-cart-widget').load($('#cart-widget').data('cart-widget-url'));
                }
                showNotify($this, '', response.message);
            },
            error: function () {
            }
        });
    });
    $(document).on('change', '.delivery-variant input[type="radio"].delivery-radio-item', function () {
        $.pjax.reload({
            'container': $(this).attr('data-container'),
            'timeout': 100000,
            'url': $(this).attr('data-url'),
            'push': false,
            'replace': false
        });
    });
    $(document).on('change', '.delivery-variant input[type="radio"].payment-radio-item', function () {
        $this = $(this);
        $.ajax({
            url: $this.attr('data-url'),
            type: 'POST',
            dataType: 'json',
            data: {'YUPE_TOKEN': yupeToken},
        });
    });	
    $(document).on('pjax:success', function (event, data, status, xhr, options) {
        if (options.container === '#products-wrapper') {
            if ($(options.target).attr('data-target-id') == 'accessories') {
                $('.create-box-tabs .create-box-tabs-btn').removeClass('active');
                $('.create-box-tabs-btn.accessories-tab').addClass('active');
                return true;
            }
            if ($(options.target).attr('data-target-id') != 'category' && $(options.target).attr('data-target-id') == 'step') {
                $('.create-box-tabs .create-box-tabs-btn').removeClass('active');
                $(options.target).addClass('active');
            }
        }
    });
    var windowW;
    $(window).resize(function () {
        windowW = $(window).width();
        if (windowW >= 768) {
            $('#js-menu').removeAttr('style');
            $('.js-submenu').removeAttr('style');
            $('#js-menu-btn').removeClass('open');
        }
        if (windowW <= 1199) {
            fixMenu();
        }
    });
    $(window).trigger('resize');
    //scroll menu
    var menu = $('#js-menu-wrapper');
    var menuTop = menu.offset().top;
    $(window).scroll(function () {
        if (windowW <= 1199) {
            fixMenu();
        }
    });
    function fixMenu() {
        if ($(window).scrollTop() >= menuTop) {
            $('header').addClass('fixed');
            $('body').addClass('fixed');
        } else {
            $('header').removeClass('fixed');
            $('body').removeClass('fixed');
        }
    }
    //mobile menu
    $('#js-menu-btn').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('open');
        $('#js-menu').slideToggle();
    });
    $('.js-submenu-item').click(function (e) {
        if (windowW <= 767) {
            e.preventDefault();
            $(this).toggleClass('active');
            $(this).next('.js-submenu').slideToggle();
        }
    });
    //dropdown
    $(document).on('focusout', '.js-dropdown-btn', function () {
        $this = $(this);
        setTimeout(function () {
            $this.removeClass('active');
            $this.next('.js-dropdown-menu').slideToggle(150);
        }, 200);
    });
    $(document).on('click', '.js-dropdown-btn', function () {
        $(this).toggleClass('active');
        $(this).next('.js-dropdown-menu').slideToggle(150);
    });
    //accordion
    if ($('*').is('.js-accordion-item')) {
        var accordionBtn = $('.js-accordion-btn');
        $(accordionBtn).click(function (e) {
            e.preventDefault();
            var currentAccordionBtn = $(this);
            var currentAccordionContent = currentAccordionBtn.next('.catalog-menu-link').next('.js-accordion-content');
            currentAccordionBtn.toggleClass('open');
            $(currentAccordionContent).toggleClass('open');
            $(currentAccordionContent).slideToggle();
        });
    }
    $('.icons-menu-link-search').click(function(e) {
        e.preventDefault();
        $('#header-search').toggleClass('open');
    })	
    //reviews-slider
    if ($('*').is('#js-reviews-slider')) {
        $('#js-reviews-slider').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                    }
                }
            ]
        });
    }
    if ($('*').is('.js-product-slider')) {
        $.each($('.js-product-slider'), function (a, b) {
            $(b).on('init', function (event, slick) {
                var slider = b;
                slick.slickPause();
                setTimeout(
                    function () {
                        slick.slickPlay();
                    },
                    $(slider).parent().attr('data-slider-speed'));
            });
            $(b).slick({
                infinite: true,
                autoplay: true,
                pauseOnHover: true,
                autoplaySpeed: 4000,
                slidesToShow: 3,
                slidesToScroll: 1,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                        }
                    }
                ]
            });
        });
    }
    if ($('*').is('#js-product-page-slider-big') && $('*').is('#js-product-page-slider-small')) {
        $('#js-product-page-slider-big').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '#js-product-page-slider-small'
        });
        $('#js-product-page-slider-small').slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            asNavFor: '#js-product-page-slider-big',
            focusOnSelect: true,
            responsive: [
                {
                    breakpoint: 361,
                    settings: {
                        slidesToShow: 1,
                    }
                }
            ]
        });
        $('.swipebox').swipebox({
            useCSS: true,
            useSVG: false,
            removeBarsOnMobile: false
        });
    }
    //product color select
/*    if ($('*').is('.js-product-color-select')) {
        $(document).on('change', '.js-product-color-input', function () {
            var currentProductColorSelect = $(this).closest('.js-product-color-select');
            var currentProductColorItem = $(this).parent('.js-product-color-select-menu-item');
            $(currentProductColorItem).addClass('selected');
            $(currentProductColorSelect).find('.js-product-color-select-menu-item').not(currentProductColorItem).removeClass('selected');
            var bg = $(this).next('.js-product-color').children('div').css('background');
            currentProductColorSelect.find('.js-product-color-current').css('background', bg);
            $(currentProductColorSelect).find('.js-dropdown-menu').slideUp();
            $(currentProductColorSelect).find('.js-dropdown-btn').removeClass('open');
        });
    }
*/

    var productColorSelect = $('.js-product-color-select');
    var productColorItems = $('.js-product-color-select-menu-item');
    var productColorCurrent = $('.js-product-color-current');
    $(document).on('change','.js-product-color-input',function() {
        var currentProductColorSelect = $(this).parents('.js-product-color-select');
        var currentProductColorItem = $(this).parent('.js-product-color-select-menu-item');
        $(currentProductColorItem).addClass('selected');
        $(currentProductColorSelect).find('.js-product-color-select-menu-item').not(currentProductColorItem).removeClass('selected');
        var bg = $(this).parent('.product-color-select-menu-item').find('.js-product-color div').css('background');
        currentProductColorSelect.find('.js-product-color-current').css('background', bg);
        $(currentProductColorSelect).find('.js-dropdown-btn').removeClass('open');
    });
    //profile
    $('.js-profile-edit-btn').click(function (e) {
        e.preventDefault();
        var currentBtn = $(this);
        var currentFormControl = currentBtn.closest('.js-profile-form-group').find('.js-profile-form-control');
        $(currentFormControl).removeAttr('readonly').focus();
    });
    $('.js-profile-form-control').blur(function (e) {
        $(this).attr('readonly', true);
    });
    $('.js-orders-history-table-link').click(function (e) {
        e.preventDefault();
        var currentHiddenTr = $(this).closest('tr').next('.hidden-tr');
        if ($(currentHiddenTr).is(':hidden')) {
            $(currentHiddenTr).slideDown(500);
        }
    });
    $('.js-orders-history-hidden-btn').click(function (e) {
        e.preventDefault();
        var currentHiddentTr = $(this).closest('.hidden-tr');
        $(currentHiddentTr).slideUp(500);
    });
    //modals
    $('#forgot-password-popup').on('shown.bs.modal', function () {
        $('#authorization-popup').modal('hide');
    });
    //review form add photo
    $('.js-file').change(function () {
        var file = $(this),
            fileValue = file.val(),
            label = file.next('.js-file-label');
        if (fileValue !== '') {
            label.text(fileValue);
        }
    });
    if ($('*').is('#js-welcome-slider')) {
        $('#js-welcome-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
            dots: true,
            autoplaySpeed: 3000,
            pauseOnHover: true,
        });
    }	
});
function showNotify(obj, result_status, data) {
    $('#notifications').html(data);
    $('#notifications').addClass('active');
    setTimeout(function () {
        $('#notifications').removeClass('active');
    }, 3000);
}
function orderSendForm(form, data, hasError) {
    $('#notifications').html("");
    $.ajax({
        url: form[0].action,
        type: 'POST',
        dataType: 'json',
        data: form.serialize(),
        success: function (response) {
            if (response.result) {
                document.getElementById($(form[0]).attr('id')).reset();
                $('#notifications').html(response.message);
                if (response.url) {
                    setTimeout(function () {
                        document.location.href = response.url
                    }, 3000);
                }
            } else {
                $('#notifications').append('<ul class="text-left"></ul>');
                $.each(response.data, function (e, k) {
                    $('#notifications').find('ul').append('<li>' + k + '</li>');
                });
            }
            $('#notifications').addClass('active');
            setTimeout(function () {
                $('#notifications').removeClass('active');
            }, 3000);
        },
        error: function () {
        }
    });
    return false;
}
function init(map,address) {
    if (document.getElementById(map) == null) {
        return false;
    }
    myMap = new ymaps.Map(map, {
        center: [55.753994, 37.622093],
        zoom: 12
    });
	$.each(address,function(a,b){
		ymaps.geocode(b, {
			results: 1
		}).then(function (res) {
			var firstGeoObject = res.geoObjects.get(0),
				coords = firstGeoObject.geometry.getCoordinates(),
				bounds = firstGeoObject.properties.get('boundedBy');
			firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
			firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());
			myMap.geoObjects.add(firstGeoObject);
			myMap.setBounds(bounds, {
				checkZoomRange: true,
				// callback:function(){}
			}).then(function(){myMap.setZoom(12);});
			$('#' + map).addClass('active');
		});
	});
}
function authSendForm(form, data, hasError) {
    $('#notifications').html("");
    $.ajax({
        url: form[0].action,
        type: 'POST',
        dataType: 'json',
        data: form.serialize(),
        success: function (response) {
            if (response.result) {
                document.getElementById($(form[0]).attr('id')).reset();
                $('#notifications').html(response.message);
                setTimeout(function () {
                    $('.modal').modal('hide');
                    if (response.url) {
                        document.location.href = response.url
                    }
                }, 5000);
            } else {
                $('#notifications').html(response.message);
            }
            $('#notifications').addClass('active');
            setTimeout(function () {
                $('#notifications').removeClass('active');
            }, 3000);
        },
        error: function () {
        }
    });
    return false;
}

!(function (e) {
    (jQuery.browser = jQuery.browser || {}).mobile =
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            e
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            e.substr(0, 4)
        );
})(navigator.userAgent || navigator.vendor || window.opera),
    $(function () {
        var t = {
            Started: {
                pageLoadingClose: function () {
                    $(".page-loading").fadeOut(300, function () {
                        $(this).remove();
                    });
                },
                scrolllRun: function (e) {
                    var o = $(".layout .content .chat .chat-body");
                    if (0 < o.length)
                        if (1200 <= $(window).width()) {
                            var t = { cursorcolor: "rgba(66, 66, 66, 0.20)", cursorwidth: "4px", cursorborder: "0px" };
                            o.scrollTop(o.get(0).scrollHeight, -1).niceScroll(t),
                                $(".layout .content .sidebar .sidebar-body").niceScroll(t),
                                e && (o.scrollTop(o.get(0).scrollHeight, -1).getNiceScroll().resize(), $(".layout .content .sidebar .sidebar-body").getNiceScroll().resize());
                        } else o.scrollTop(o.get(0).scrollHeight, -1);
                },
                mobileBrowserVhProblemFixed: function () {
                    var e = 0.01 * window.innerHeight;
                    document.documentElement.style.setProperty("--vh", e + "px");
                },
                init: function () {
                    this.pageLoadingClose(),
                        this.scrolllRun(),
                        this.mobileBrowserVhProblemFixed(),
                        $("body").hasClass("rtl") && $(".dropdown-menu.dropdown-menu-right").removeClass("dropdown-menu-right"),
                        feather.replace(),
                        $(window).width() < 768 && ($("body").addClass("no-blur-effect"), $(".layout .content .sidebar-group .sidebar .list-group-item .users-list-body .users-list-action").removeClass("action-toggle"));
                },
            },
        };
        $('[data-toggle="tooltip"]').tooltip(),
            $(document).ready(function () {
                t.Started.init();
            }),
            $(document).on("click", ".dark-light-switcher", function () {
                return $(this).tooltip("dispose"), $("body").hasClass("dark") ? ($("body").removeClass("dark"), $(this).attr("title", "Dark mode")) : ($("body").addClass("dark"), $(this).attr("title", "Light mode")), $(this).tooltip(), !1;
            }),
            $(document).on("click", ".mobile-navigation-button", function () {
                return $("body").addClass("navigation-open"), !1;
            }),
            $(document).on("click", "body.navigation-open", function () {
                return $("body").removeClass("navigation-open"), !1;
            }),
            $(window).on("resize", function () {
                t.Started.mobileBrowserVhProblemFixed();
            }),
            $(document).on("click", '[data-toggle="tooltip"]', function () {
                $(this).tooltip("hide");
            }),
            $(document).on("click", "[data-navigation-target]", function () {
                var e = $(this).data("navigation-target"),
                    o = $(".sidebar-group .sidebar#" + e);
                o.closest(".sidebar-group").find(".sidebar").removeClass("active"),
                    o.addClass("active"),
                    o.find("form input:first").focus(),
                    $("[data-navigation-target]").removeClass("active"),
                    $('[data-navigation-target="' + e + '"]').addClass("active"),
                    $(".sidebar-group").removeClass("mobile-open"),
                    o.closest(".sidebar-group").addClass("mobile-open"),
                    t.Started.scrolllRun(!0);
            }),
            $(document).on("click", ".sidebar-close", function (e) {
                $(window).width() < 1200 ? $(".sidebar-group").removeClass("mobile-open") : $(this).closest(".sidebar.active").removeClass("active"), t.Started.scrolllRun(!0);
            }),
            $(document).on("click", "#pageTour button.start-tour", function () {
                return (
                    $("#pageTour")
                        .modal("hide")
                        .on("hidden.bs.modal", function (e) {
                            var o = new EnjoyHint({});
                            o.set([
                                { 'next .sidebar>header>ul>li>[data-navigation-target="friends"]': "You can create a new chat here." },
                                { 'next .sidebar>header>ul>li>[data-target="#newGroup"]': "You can start a new group to chat with all your friends." },
                                { 'next [data-navigation-target="favorites"]': "Chats and messages you've added to your favorites appear here." },
                                { 'next [data-navigation-target="archived"]': "Chats and messages you've archived appear here." },
                                { 'next [data-target="#call"]': "Start voice call from here" },
                                { 'next [data-target="#videoCall"]': "Start a video call from here" },
                                { "next .navigation>.nav-group>ul>li.brackets+li+li": "Here you can manage your personal information and settings." },
                            ]),
                                o.run();
                        }),
                    !1
                );
            });
    });
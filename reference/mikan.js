function InitAvatarPlugin() {
  var n = $(".imageBox").cropbox(avataroptions);
  $("#file").on("change", function () {
    var t = new FileReader();
    t.onload = function (t) {
      avataroptions.imgSrc = t.target.result;
      n = $(".imageBox").cropbox(avataroptions);
    };
    t.readAsDataURL(this.files[0]);
  });
  $("#btnSaveManageInfo").on("click", function () {
    if ($(".imageBox").css("background-position") != "24px 24px") {
      var t = n.getDataURL("image/png");
      $(document).waiting({ size: 50, dotSize: 10, fullScreen: !0 });
      $("#PropertyModel_Avatar").val(
        t.replace(/^data:image\/(png|jpg);base64,/, "")
      );
    }
    return !0;
  });
  $("#btnCrop").on("click", function () {
    var t = n.getDataURL("image/png");
    $(document).waiting({ size: 50, dotSize: 10, fullScreen: !0 });
    $.ajax({
      type: "POST",
      url: "/Account/UploadAvatar",
      data: JSON.stringify({
        ImageData: t.replace(/^data:image\/(png|jpg);base64,/, ""),
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (n) {
        n.success &&
          setTimeout(function () {
            $(document).waiting("done");
            window.location.href =
              "/Account/Manage?Message=UpdatePropertiesSuccess";
          }, 500);
      },
    });
  });
  $("#btnZoomIn").on("click", function () {
    n.zoomIn();
  });
  $("#btnZoomOut").on("click", function () {
    n.zoomOut();
  });
}
function UpdateBangumiCoverFlow(n, t) {
  var r = $(n).data("year"),
    u = $(n).data("season"),
    f = $("#sk-body"),
    i;
  $(document).waiting({ size: 50, dotSize: 10, fullScreen: !0 });
  i = "/Home/BangumiCoverFlowByDayOfWeek";
  t || (i = "/Home/BangumiCoverFlow");
  $.ajax({
    type: "GET",
    url: i,
    data: { year: r, seasonStr: u },
    contentType: "application/json; charset=utf-8",
    error: function () {},
    success: function (n) {
      $(".sk-col.date-text").html(
        r + " " + u + 'å­£ç•ªç»„ <span class="caret"></span>'
      );
      setTimeout(function () {
        $(document).waiting("done");
        $("#sk-body").html(n);
        InitExpandBangumi();
        InitToggleButton();
        InitSubscribeBangumi();
        scrollBangumi();
        var t = new Blazy();
      }, 500);
    },
  });
}
function InitMangetTooltip() {
  var n = new Clipboard(".js-magnet");
  n.on("success", function (n) {
    var t = n.trigger;
    $(t).addClass("tooltipped");
    $(t).attr("aria-label", "å·²å¤åˆ¶");
    setTimeout(function () {
      $(t).removeClass("tooltipped");
      $(t).removeAttr("aria-label");
    }, 1e3);
  });
  n.on("error", function (n) {
    var t = n.trigger;
    $(t).addClass("tooltipped");
    $(t).attr(
      "aria-label",
      "å¤åˆ¶å¤±è´¥ï¼Œè¯·ç›´æŽ¥å³é”®å·¦ä¾§æ ‡é¢˜å¹¶é€‰æ‹©å¤åˆ¶é“¾æŽ¥"
    );
    setTimeout(function () {
      $(t).removeClass("tooltipped");
      $(t).removeAttr("aria-label");
    }, 1e3);
  });
}
function InitExpandEpisodeTable(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-expand-episode").each(function () {
    var n = $(this),
      t = n.data("bangumiid"),
      i = n.data("subtitlegroupid");
    n.click(function () {
      var r = $(this),
        u = r.data("take");
      $.ajax({
        type: "GET",
        url: "/Home/ExpandEpisodeTable",
        data: { bangumiId: t, subtitleGroupId: i, take: u },
        contentType: "application/json; charset=utf-8",
        error: function () {},
        success: function (t) {
          n.prev().replaceWith(t);
          u != n.prev().find("tbody > tr").length
            ? r.hide()
            : r.data("take", Number(r.data("take")) + 50);
          InitMangetTooltip();
        },
      });
    });
  });
}
function InitExpandMobileEpisodeTable(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-m-expand-episode").each(function () {
    var n = $(this),
      t = n.data("bangumiid"),
      i = n.data("subtitlegroupid");
    n.click(function () {
      var r = $(this),
        u = r.data("take");
      $(n).waiting({ size: 50, dotSize: 2, fullScreen: !1 });
      $.ajax({
        type: "GET",
        url: "/Home/ExpandMobileEpisodeTable",
        data: { bangumiId: t, subtitleGroupId: i, take: u },
        contentType: "application/json; charset=utf-8",
        error: function () {},
        success: function (t) {
          n.prev().html(t);
          u != n.prev().find(".m-bangumi-item").length
            ? r.hide()
            : r.data("take", Number(r.data("take")) + 50);
          setTimeout(function () {
            $(n).waiting("done");
          }, 500);
        },
      });
    });
  });
}
function InitSubgroupScroll() {
  $("[class*=subgroup-name]").each(function () {
    var n = $(this);
    n.click(function (n) {
      var t = $(this);
      n.preventDefault();
      $(window)
        .stop(!0)
        .scrollTo($(t.data("anchor")).offset().top, {
          axis: "y",
          duration: 1e3,
          interrupt: !0,
        });
    });
  });
}
function InitLeftBarNavStick() {
  var n = $(window).scrollTop(),
    t = $("#leftbar-nav-anchor").offset().top;
  n > t
    ? $(".leftbar-nav").addClass("stick")
    : $(".leftbar-nav").removeClass("stick");
}
function InitExpandBangumi(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-expand_bangumi").each(function () {
    var n = $(this),
      u = n.data("bangumiid"),
      f = n.data("showsubscribed"),
      t = n.data("bangumiindex"),
      r = n.parents(".an-box"),
      i = n.parents("li");
    n.click(function () {
      var e, o, s;
      i.waiting({ size: 50, dotSize: 10 });
      r.find("li").removeClass("active");
      $(".js-expand_bangumi").parent().removeClass("active");
      n.parent().addClass("active");
      e = r.next(".an-res-row-frame");
      o = e.find(".js-arrow-up");
      r.next(".an-res-row-frame:visible").length > 0 &&
      o.data("arrowupindex") == t
        ? (i.waiting("done"),
          $(".page-dock").hide(),
          e.slideUp(),
          n.parent().removeClass("active"))
        : ((s = $(this)),
          $.ajax({
            type: "GET",
            url: "/Home/ExpandBangumi",
            data: { bangumiId: u, showSubscribed: f },
            contentType: "application/json; charset=utf-8",
            error: function () {
              i.waiting("done");
            },
            success: function (n) {
              i.waiting("done");
              n == "" && (n = "<div>å¹¶æ²¡æœ‰ä»€ä¹ˆæ•°æ®</div>");
              e.html(n.replace(/###bgmindex###/g, t));
              e.prepend(
                '<div style="display:none;" class="js-arrow-up arrow-up-' +
                  t +
                  '" data-arrowupindex="' +
                  t +
                  '"></div>'
              );
              $(".page-dock:visible").length == 0 && $(".page-dock").show();
              e.slideDown("normal", function () {
                $(".page-dock").show();
              });
              var r = e.children(".an-res-row");
              InitBangumiSubgroup(r);
              InitSubscribeBangumi(r);
              InitSubscribeBangumiPopover(r);
              InitToggleButton(r);
              InitSubgroupPaging(r);
              InitDotsNav();
              InitMangetTooltip();
              $(".an-res-row-frame").not(e).find(".page-dock").hide();
              $(".an-res-row-frame").not(e).slideUp();
              $(".res-mid").mCustomScrollbar({ axis: "y" });
              $(".res-mid").bind("mousewheel DOMMouseScroll", function (n) {
                var t = n.originalEvent,
                  i = t.wheelDelta || -t.detail;
                this.scrollTop += (i < 0 ? 1 : -1) * 30;
                n.preventDefault();
              });
            },
          }));
    });
  });
}
function InitDotsNav() {
  [].slice
    .call(document.querySelectorAll(".dotstyle > ul"))
    .forEach(function (n) {
      new DotNav(n, { callback: function () {} });
    });
}
function InitBangumiSubgroup(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-expand_bangumi-subgroup").each(function () {
    var t = $(this);
    t.hover(function () {
      var t = $(this),
        i = t.data("bangumisubgroupindex");
      n.find(".js-expand_bangumi-subgroup").removeClass("active");
      t.addClass("active");
      n.find("div.res-mid-frame").hide();
      n.find("div.js-expand_bangumi-subgroup-" + i + "-episodes").show();
    });
    n.find(".js-expand_bangumi-subgroup").length > 0 &&
      $(n.find(".js-expand_bangumi-subgroup")[0]).trigger("mouseenter");
  });
}
function InitToggleButton(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-toggle-button").each(function () {
    var t = $(this);
    n.find(".js-subscribed").length == 0
      ? (t
          .bootstrapToggle({ size: "mini", height: 20 })
          .bootstrapToggle("disable"),
        t.prop("checked") ||
          t
            .bootstrapToggle("enable")
            .bootstrapToggle("on")
            .bootstrapToggle("disable"))
      : t
          .bootstrapToggle({ size: "mini", height: 20 })
          .bootstrapToggle("enable");
    t.change(function () {
      var i, t;
      if (
        ($(this).prop("checked")
          ? n.find(".js-expand_bangumi-subgroup").show()
          : n.find(".js-expand_bangumi-subgroup").not(".js-subscribed").hide(),
        (i = n.find(".js-expand_bangumi-subgroup:visible")),
        $(i[0]).trigger("mouseenter"),
        $(this).prop("checked")
          ? n
              .find(".page-dock")
              .html(
                '<div class="dock-left">1/</div><div class="dock-right">' +
                  Math.ceil(n.find(".js-expand_bangumi-subgroup").length / 6) +
                  "</div>"
              )
          : n
              .find(".page-dock")
              .html(
                '<div class="dock-left">1/</div><div class="dock-right">' +
                  Math.ceil(i.length / 6) +
                  "</div>"
              ),
        n.find(".page-num").children().empty(),
        i.length > 6)
      )
        for (t = 0; t < Math.ceil(i.length / 6); t++)
          t == 0
            ? n
                .find(".page-num")
                .children()
                .append(
                  '<li data-scroll="' +
                    240 * t +
                    '" class="js-subgroup-paging current"><a></a></li>'
                )
            : n
                .find(".page-num")
                .children()
                .append(
                  '<li data-scroll="' +
                    240 * t +
                    '" class="js-subgroup-paging"><a></a></li>'
                );
      $(".res-ul").scrollTo(0);
      InitDotsNav();
      InitSubgroupPaging(n);
    });
  });
}
function InitSubgroupPaging(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-subgroup-paging").each(function () {
    var n = $(this),
      t = $(this).data("scroll");
    n.click(function () {
      $(".res-ul").scrollTo(t, { axis: "y", duration: 800 });
      $(".popover:visible").popoverX("hide");
    });
  });
}
function ToggleActive(n) {
  $(n).hasClass("active")
    ? $(n).removeClass("active")
    : $(n).addClass("active");
}
function createCookie(n, t, i) {
  var u, r;
  i
    ? ((r = new Date()),
      r.setTime(r.getTime() + i * 864e5),
      (u = "; expires=" + r.toGMTString()))
    : (u = "");
  document.cookie =
    encodeURIComponent(n) + "=" + encodeURIComponent(t) + u + "; path=/";
}
function readCookie(n) {
  for (
    var t,
      r = encodeURIComponent(n) + "=",
      u = document.cookie.split(";"),
      i = 0;
    i < u.length;
    i++
  ) {
    for (t = u[i]; t.charAt(0) === " "; ) t = t.substring(1, t.length);
    if (t.indexOf(r) === 0)
      return decodeURIComponent(t.substring(r.length, t.length));
  }
  return null;
}
function eraseCookie(n) {
  createCookie(n, "", -1);
}
function ShowNavSearch() {
  $(".m-nav-search").css("display", "flex");
  $(".m-nav-search").show();
}
function HideNavSearch() {
  $(".m-nav-search").hide();
}
function InitDotDotDot() {
  setTimeout(function () {
    $(".js-dotdotdot").dotdotdot();
  }, 500);
}
function ExpandEpisodesUpdate(n) {
  $(n).parent(".m-subscribe-list").find(".item").show("fast");
  $(n).hide();
  InitDotDotDot();
}
function SetActive(n) {
  $(".m-home-week-item").removeClass("active");
  $(n).addClass("active");
}
function SortItems(n) {
  var t = [],
    i = [],
    r = [];
  $("#" + n)
    .find(".js-sort-item-head")
    .each(function () {
      i.push({ index: -1, item: $(this) });
    });
  $("#" + n)
    .find(".js-sort-item")
    .each(function () {
      t.push({ index: $(this).data("index"), item: $(this) });
    });
  $("#" + n)
    .find(".js-sort-item-tail")
    .each(function () {
      r.push({ index: 999, item: $(this) });
    });
  t[0].index == 0
    ? t.sort(function (n, t) {
        return n.index > t.index ? -1 : 1;
      })
    : t.sort(function (n, t) {
        return n.index > t.index ? 1 : -1;
      });
  $("#" + n).empty();
  $(i).each(function () {
    $("#" + n).append(this.item);
  });
  $(t).each(function () {
    $("#" + n).append(this.item);
  });
  $(r).each(function () {
    $("#" + n).append(this.item);
  });
}
function ShowSubscribedOnly(n) {
  $("#" + n)
    .find(".js-m-subgroup-item")
    .each(function () {
      $(this).find("i.active").length == 0 && $(this).toggle();
    });
}
function BangumiSubgroupShowEpisode(n) {
  $("#" + n).fadeIn();
  $("#bangumi-m-main").hide();
}
function BangumiSubgroupHideEpisode(n) {
  $(n).parents(".m-bangumi-list-content").hide();
  $("#bangumi-m-main").fadeIn();
}
function sticky_relocate() {
  var n = $(window).scrollTop(),
    t = $("#sk-data-nav-anchor").offset().top;
  n > t
    ? $("#sk-data-nav").addClass("stick")
    : $("#sk-data-nav").removeClass("stick");
}
function scrollBangumi() {
  var n, i, t;
  return $(window).scrollTop() == 0
    ? ((n = $($(".sk-bangumi")[0]).data("dayofweek")),
      $("[class*=date-li]").removeClass("active"),
      $(".date-li-" + n).addClass("active"),
      !0)
    : $(window).scrollTop() + $(window).height() == $(document).height()
    ? ((n = $($(".sk-bangumi")[8]).data("dayofweek")),
      $("[class*=date-li]").removeClass("active"),
      $(".date-li-" + n).addClass("active"),
      !0)
    : ((i = $(window).height()),
      (t = $(window).scrollTop() + i / 2),
      $(".sk-bangumi").each(function () {
        var n = $(this).offset().top,
          i = n + $(this).height(),
          r = $(this).data("dayofweek");
        n < t &&
          i > t &&
          ($("[class*=date-li]").removeClass("active"),
          $(".date-li-" + r).addClass("active"));
      }),
      !0);
}
function InitNavLi() {
  $("[class*=date-li]").each(function () {
    var n = $(this);
    n.click(function (n) {
      var e = $(this),
        i = $(e.data("anchor"));
      n.preventDefault();
      var r = i.offset().top,
        u = i.parent().height(),
        f = $(window).height() - 70,
        t;
      t = u < f ? r - (f / 2 - u / 2) : r;
      window.pageYOffset < 84 && (t -= 70);
      $(window)
        .stop(!0)
        .scrollTo(t - 70, { axis: "y", duration: 1e3, interrupt: !0 });
    });
  });
}
function InitBackToTop() {
  if ($(".cd-top").length > 0) {
    var t = 300,
      i = 700,
      r = 700,
      n = $(".cd-top");
    $back_to_top_btn = $(".cd-top-btn");
    $(window).scroll(function () {
      $(this).scrollTop() > t
        ? n.addClass("cd-is-visible")
        : n.removeClass("cd-is-visible cd-fade-out");
      $(this).scrollTop() > i && n.addClass("cd-fade-out");
    });
    $back_to_top_btn.on("click", function (n) {
      n.preventDefault();
      $("body,html").animate({ scrollTop: 0 }, r);
    });
  }
}
function InitTorrentFileSelector(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-torrentFile").on("fileselect", function (n, t, i) {
    $(this).parents(".input-group").find(":text").val(i);
  });
  n.find(".js-torrentFile").on("change", function () {
    var n = $(this),
      t = n.get(0).files ? n.get(0).files.length : 1,
      i = n.val().replace(/\\/g, "/").replace(/.*\//, "");
    n.trigger("fileselect", [t, i]);
  });
}
function InitSelectizeForPublishPage() {
  var n = !1;
  localStorage.publishDataLastUpdate == null ||
  localStorage.publishDataLastUpdate == undefined
    ? (n = !0)
    : isNaN(parseInt(localStorage.publishDataLastUpdate))
    ? (n = !0)
    : parseInt(localStorage.publishDataLastUpdate) + 36e5 <
        new Date().getTime() && (n = !0);
  n &&
    $.ajax({
      type: "POST",
      url: "/Home/PublishData",
      data: "",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      error: function () {},
      success: function (n) {
        localStorage.setItem("bangumiData", JSON.stringify(n.bangumiData));
        localStorage.setItem(
          "subtitleGroupData",
          JSON.stringify(n.subtitleGroupData)
        );
        localStorage.setItem(
          "userSubtitleGroupData",
          JSON.stringify(n.userSubtitleGroupData)
        );
        localStorage.setItem("publishDataLastUpdate", new Date().getTime());
      },
    });
  $selectSubtitleGroup = $(".js-selectize-subgroup").selectize({
    valueField: "subtitleGroupId",
    labelField: "name",
    searchField: ["name"],
    persist: !0,
    searchConjunction: "or",
    render: {
      option: function (n, t) {
        return "<div><div>" + t(n.name) + "</div></div>";
      },
    },
    load: function (n, t) {
      if (!n.length) return t();
      searchStrSimp = ChineseConverter.toSimplifiedChinese(n);
      var r = JSON.parse(localStorage.subtitleGroupData),
        i = JSON.search(r, '//*[contains(name, "' + searchStrSimp + '")]');
      i.length > 0 && t(i);
    },
  });
  window.subtitleGroupSelectize = $selectSubtitleGroup[0].selectize;
  $selectBangumi = $(".js-selectize-bangumi").selectize({
    valueField: "bangumiId",
    labelField: "chsName",
    searchField: [
      "chsName",
      "jpnName",
      "romanName",
      "simpleNameA",
      "simpleNameB",
    ],
    persist: !0,
    searchConjunction: "or",
    render: {
      option: function (n, t) {
        return (
          "<div><div>" + t(n.chsName) + "  -  " + t(n.jpnName) + "</div></div>"
        );
      },
    },
    load: function (n, t) {
      if (!n.length) return t();
      searchStrSimp = ChineseConverter.toSimplifiedChinese(n);
      var i = JSON.parse(localStorage.bangumiData),
        u = JSON.search(
          i,
          '//*[contains(chsName|romanName|simpleNameA|simpleNameB, "' +
            searchStrSimp +
            '")]'
        ),
        f = JSON.search(i, '//*[contains(romanName, "' + n + '")]'),
        r = u.concat(f);
      r.length > 0 && t(r);
    },
  });
  window.bangumiSelectize = $selectBangumi[0].selectize;
  $(".js-publish-episodename").blur(function () {
    var r = ChineseConverter.toSimplifiedChinese(
        $(".js-publish-episodename").val()
      ),
      t = [],
      u = JSON.parse(localStorage.bangumiData);
    $(u).each(function () {
      try {
        var i = new RegExp(this.regex, "g"),
          n = r.match(i);
        n != null && n.length > 0 && t.push(this);
      } catch (u) {}
    });
    var n = [],
      f = JSON.parse(localStorage.subtitleGroupData),
      i = [],
      e = JSON.parse(localStorage.userSubtitleGroupData);
    $(f).each(function () {
      var u, t, f;
      try {
        u = new RegExp(this.regex, "g");
        t = r.match(u);
        t != null &&
          t.length > 0 &&
          (n.push(this),
          (f = JSON.search(
            e,
            '//*[contains(subtitleGroupId, "' + this.subtitleGroupId + '")]'
          )),
          f.length > 0 && i.push(this));
      } catch (o) {}
    });
    i.length > 0 && (n = i);
    t.length > 0
      ? ($("#bangumiSuggestionLi").show(),
        $("#bangumiSuggestion").empty(),
        $(t).each(function () {
          $("#bangumiSuggestion").append(
            "<a onclick='SelectBangumiSuggestion(this)' class='publish-suggestion' data-name='" +
              this.chsName +
              "' data-jpnname='" +
              this.jpnName +
              "' data-bangumiid='" +
              this.bangumiId +
              "'>" +
              this.chsName +
              "</a>&nbsp;&nbsp;"
          );
        }))
      : $("#bangumiSuggestionLi").hide();
    n.length > 0
      ? ($("#subtitleGroupSuggestionLi").show(),
        $("#subtitleGroupSuggestion").empty(),
        $(n).each(function () {
          $("#subtitleGroupSuggestion").append(
            "<a onclick='SelectSubtitleGroupSuggestion(this)' class='publish-suggestion' data-name='" +
              this.name +
              "' data-subtitlegroupid='" +
              this.subtitleGroupId +
              "'>" +
              this.name +
              "</a>&nbsp;&nbsp;"
          );
        }))
      : $("#subtitleGroupSuggestion").hide();
  });
}
function SelectBangumiSuggestion(n) {
  var i = $(n).data("name"),
    r = $(n).data("jpnname"),
    t = $(n).data("bangumiid");
  $selectBangumi[0].selectize.addOption({
    bangumiId: t,
    chsName: i,
    jpnName: r,
  });
  $selectBangumi[0].selectize.addItem(t);
}
function SelectSubtitleGroupSuggestion(n) {
  var i = $(n).data("name"),
    t = $(n).data("subtitlegroupid");
  $selectSubtitleGroup[0].selectize.addOption({ subtitleGroupId: t, name: i });
  $selectSubtitleGroup[0].selectize.addItem(t);
}
function InitSubscribeBangumi(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-subscribe_bangumi").each(function () {
    var n = $(this),
      i = n.data("bangumiid"),
      r = n.data("subtitlegroupid") == "" ? null : n.data("subtitlegroupid"),
      t = n.parents("li");
    n.click(function () {
      if (!AdvancedSubscriptionEnabled || $(n).hasClass("an-info-icon")) {
        if ($(n).hasClass("an-info-icon")) t.waiting({ size: 50, dotSize: 10 });
        else {
          var u = Ladda.create(this);
          u.start();
        }
        n.hasClass("active")
          ? $.ajax({
              type: "POST",
              url: "/Home/UnsubscribeBangumi",
              data: JSON.stringify({ BangumiID: i, SubtitleGroupID: r }),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              error: function () {},
              success: function () {
                n.removeClass("active");
                n.attr("data-original-title", "è®¢é˜…");
                setTimeout(function () {
                  $(n).hasClass("an-info-icon")
                    ? (t.waiting("done"),
                      $(".ladda-button.js-subscribe_bangumi").removeClass(
                        "active"
                      ),
                      $(".js-subscribe_bangumi_popover").each(function () {
                        SetPopoverUnsubscribedView($(this));
                      }))
                    : (u.stop(),
                      $(".ladda-button.js-subscribe_bangumi.active").length ==
                        0 &&
                        $(".an-box")
                          .find("li.active")
                          .find(".an-info-icon")
                          .removeClass("active"));
                }, 500);
                t.removeClass("js-subscribed");
                InitToggleButton(t.parents(".an-res-row"));
              },
            })
          : $.ajax({
              type: "POST",
              url: "/Home/SubscribeBangumi",
              data: JSON.stringify({ BangumiID: i, SubtitleGroupID: r }),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              error: function () {},
              success: function () {
                n.addClass("active");
                n.attr("data-original-title", "å–æ¶ˆ");
                setTimeout(function () {
                  $(n).hasClass("an-info-icon")
                    ? (t.waiting("done"),
                      $(".ladda-button.js-subscribe_bangumi").addClass(
                        "active"
                      ),
                      $(".js-subscribe_bangumi_popover").each(function () {
                        SetPopoverSubscribedView($(this));
                      }))
                    : (u.stop(),
                      $(".an-box")
                        .find("li.active")
                        .find(".an-info-icon")
                        .addClass("active"));
                }, 500);
                t.addClass("js-subscribed");
                InitToggleButton(t.parents(".an-res-row"));
              },
            });
      }
    });
  });
}
function InitSubscribeBangumiPage(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-subscribe_bangumi_page").each(function () {
    var n = $(this),
      t = n.data("bangumiid"),
      i = n.data("subtitlegroupid") == "" ? null : n.data("subtitlegroupid");
    n.click(function () {
      (!AdvancedSubscriptionEnabled || $(n).hasClass("btn")) &&
        ($(document).waiting({ size: 50, dotSize: 10, fullScreen: !0 }),
        n.hasClass("active")
          ? $.ajax({
              type: "POST",
              url: "/Home/UnsubscribeBangumi",
              data: JSON.stringify({ BangumiID: t, SubtitleGroupID: i }),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              error: function () {},
              success: function () {
                n.removeClass("active");
                setTimeout(function () {
                  $(document).waiting("done");
                  n.hasClass("btn")
                    ? (n.html("è®¢é˜…ç•ªç»„"),
                      $(".subscribed-badge").hide(),
                      $(".subscribed").hide(),
                      $(".subscribed").html("å·²è®¢é˜…"),
                      $("a.js-subscribe_bangumi_page").removeClass("active"),
                      $("a.js-subscribe_bangumi_page").html("è®¢é˜…"),
                      $(".js-subscribe_bangumi_popover").each(function () {
                        SetPopoverUnsubscribedViewBangumiPage($(this));
                      }))
                    : (n.prev().hide(),
                      n.html("è®¢é˜…"),
                      $(".subscribed:visible").length == 0 &&
                        ($(".subscribed-badge").hide(),
                        $("button.js-subscribe_bangumi_page").removeClass(
                          "active"
                        ),
                        $("button.js-subscribe_bangumi_page").html(
                          "è®¢é˜…ç•ªç»„"
                        )));
                }, 500);
              },
            })
          : $.ajax({
              type: "POST",
              url: "/Home/SubscribeBangumi",
              data: JSON.stringify({ BangumiID: t, SubtitleGroupID: i }),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              error: function () {},
              success: function () {
                n.addClass("active");
                setTimeout(function () {
                  $(document).waiting("done");
                  n.hasClass("btn")
                    ? (n.html("å–æ¶ˆç•ªç»„è®¢é˜…"),
                      $(".subscribed-badge").show(),
                      $(".subscribed:hidden").html("å·²è®¢é˜…"),
                      $(".subscribed").show(),
                      $("a.js-subscribe_bangumi_page").addClass("active"),
                      $("a.js-subscribe_bangumi_page").html("ä¿®æ”¹è®¢é˜…"),
                      $(".js-subscribe_bangumi_popover").each(function () {
                        SetPopoverSubscribedViewBangumiPage($(this));
                      }))
                    : ($(".subscribed:visible").length == 0 &&
                        ($(".subscribed-badge").show(),
                        $("button.js-subscribe_bangumi_page").addClass(
                          "active"
                        ),
                        $("button.js-subscribe_bangumi_page").html(
                          "å–æ¶ˆç•ªç»„è®¢é˜…"
                        )),
                      n.prev().show(),
                      n.html("ä¿®æ”¹è®¢é˜…"));
                }, 500);
              },
            }));
    });
  });
}
function InitSubscribePublishGroupPage(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-subscribe_publishgroup_page").each(function () {
    var n = $(this),
      t = n.parents(".pubgroup-timeline-item");
    n.click(function () {
      t.waiting({ size: 50, dotSize: 10, fullScreen: !1 });
      var r = t.find("li").length,
        i = 0;
      n.hasClass("subscribe-all")
        ? t.find("li").each(function () {
            var u = $(this).data("bangumiid"),
              f =
                $(this).data("subtitlegroupid") == ""
                  ? null
                  : $(this).data("subtitlegroupid");
            $.ajax({
              type: "POST",
              url: "/Home/SubscribeBangumi",
              data: JSON.stringify({ BangumiID: u, SubtitleGroupID: f }),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              async: !1,
              error: function () {},
              success: function () {
                i++;
                i == r &&
                  setTimeout(function () {
                    t.find(".js-subscribe_bangumi").addClass("active");
                    n.addClass("unsubscribe-all");
                    n.removeClass("subscribe-all");
                    n.html("å…¨éƒ¨å–æ¶ˆ");
                    t.waiting("done");
                  }, 500);
              },
            });
          })
        : n.hasClass("unsubscribe-all") &&
          t.find("li").each(function () {
            var u = $(this).data("bangumiid"),
              f = $(this).data("subtitlegroupid");
            $.ajax({
              type: "POST",
              url: "/Home/UnsubscribeBangumi",
              data: JSON.stringify({ BangumiID: u, SubtitleGroupID: f }),
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              async: !1,
              error: function () {},
              success: function () {
                i++;
                i == r &&
                  setTimeout(function () {
                    t.find(".js-subscribe_bangumi").removeClass("active");
                    n.removeClass("unsubscribe-all");
                    n.addClass("subscribe-all");
                    n.html("å…¨éƒ¨è®¢é˜…");
                    t.waiting("done");
                  }, 500);
              },
            });
          });
      n.blur();
      setTimeout(function () {
        t.waiting("done");
      }, 5e3);
    });
  });
}
function InitMobileSubscribeBangumiPage(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-m-subscribe_bangumi_page").each(function () {
    var n = $(this),
      i = n.data("bangumiid"),
      r = n.data("subtitlegroupid") == "" ? null : n.data("subtitlegroupid"),
      t = n.parents(".item");
    n.click(function () {
      $(t).waiting({ size: 50, dotSize: 2, fullScreen: !1 });
      n.hasClass("active")
        ? $.ajax({
            type: "POST",
            url: "/Home/UnsubscribeBangumi",
            data: JSON.stringify({ BangumiID: i, SubtitleGroupID: r }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function () {},
            success: function () {
              n.removeClass("active");
              n.addClass("fa-heart-o");
              n.removeClass("fa-heart");
              setTimeout(function () {
                $(t).waiting("done");
              }, 500);
            },
          })
        : $.ajax({
            type: "POST",
            url: "/Home/SubscribeBangumi",
            data: JSON.stringify({ BangumiID: i, SubtitleGroupID: r }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function () {},
            success: function () {
              n.addClass("active");
              n.addClass("fa-heart");
              n.removeClass("fa-heart-o");
              setTimeout(function () {
                $(t).waiting("done");
              }, 500);
            },
          });
    });
  });
}
function InitSubscribeBangumiPopover(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-subscribe_bangumi_popover").each(function () {
    var n = $(this).find(".btn-language");
    n.click(function () {
      n.removeClass("active");
      $(this).addClass("active");
    });
  });
}
function PopoverSubscribe(n) {
  var u = $(n),
    t = u.parents(".js-subscribe_bangumi_popover"),
    e = t.data("bangumiid"),
    o = t.data("subtitlegroupid") == "" ? null : t.data("subtitlegroupid"),
    r = t.find(".btn-language.active").data("language"),
    f = u.parents("li"),
    i = t.prev(".js-subscribe_bangumi");
  $.ajax({
    type: "POST",
    url: "/Home/SubscribeBangumi",
    data: JSON.stringify({ BangumiID: e, SubtitleGroupID: o, Language: r }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    error: function () {},
    success: function () {
      var n, u, e;
      t.popoverX("hide");
      n = "è®¢";
      u = "all";
      r == 1 ? ((n = "ç®€"), (u = "chs")) : r == 2 && ((n = "ç¹"), (u = "cht"));
      e = Ladda.create(i[0]);
      e.start();
      setTimeout(function () {
        e.stop();
        $(".an-box").find("li.active").find(".an-info-icon").addClass("active");
        i.html(n);
        i.removeClass("all");
        i.removeClass("chs");
        i.removeClass("cht");
        i.addClass("active");
        i.addClass(u);
        f.addClass("js-subscribed");
        InitToggleButton(f.parents(".an-res-row"));
        SetPopoverSubscribedView(t);
      }, 500);
    },
  });
  t.find(".js-disable-advancedsubscription:checked").length > 0 &&
    $.ajax({
      type: "POST",
      url: "/Account/DisableAdvancedSubscription",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      error: function () {},
      success: function () {
        AdvancedSubscriptionEnabled = !1;
      },
    });
}
function SetPopoverSubscribedView(n) {
  n.find(".btn-cancel").length == 0 &&
    n
      .find(".btn-submit")
      .before(
        '<button type="button" class="btn btn-sm btn-cancel" onclick="PopoverUnsubscribe(this)">é€€è®¢</button>'
      );
  n.find(".btn-submit").html("ä¿®æ”¹");
}
function PopoverUnsubscribe(n) {
  var r = $(n),
    t = r.parents(".js-subscribe_bangumi_popover"),
    f = t.data("bangumiid"),
    e = t.data("subtitlegroupid") == "" ? null : t.data("subtitlegroupid"),
    u = r.parents("li"),
    i = t.prev(".js-subscribe_bangumi");
  $.ajax({
    type: "POST",
    url: "/Home/UnsubscribeBangumi",
    data: JSON.stringify({ BangumiID: f, SubtitleGroupID: e }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    error: function () {},
    success: function () {
      t.popoverX("hide");
      var n = Ladda.create(i[0]);
      n.start();
      setTimeout(function () {
        n.stop();
        i.html("è®¢");
        i.removeClass("all");
        i.removeClass("chs");
        i.removeClass("cht");
        i.removeClass("active");
        $(".ladda-button.js-subscribe_bangumi.active").length == 0 &&
          $(".an-box")
            .find("li.active")
            .find(".an-info-icon")
            .removeClass("active");
        SetPopoverUnsubscribedView(t);
      }, 500);
      u.removeClass("js-subscribed");
      InitToggleButton(u.parents(".an-res-row"));
    },
  });
  t.find(".js-disable-advancedsubscription:checked").length > 0 &&
    $.ajax({
      type: "POST",
      url: "/Account/DisableAdvancedSubscription",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      error: function () {},
      success: function () {
        AdvancedSubscriptionEnabled = !1;
      },
    });
}
function SetPopoverUnsubscribedView(n) {
  n.find(".btn-submit").html("è®¢é˜…");
  n.find(".btn-cancel").remove();
  n.find('[data-language="2"]').removeClass("active");
  n.find('[data-language="1"]').removeClass("active");
  n.find('[data-language="0"]').addClass("active");
  $(".ladda-button.js-subscribe_bangumi").each(function () {
    $(this).html("è®¢");
  });
}
function PopoverSubscribeBangumiPage(n) {
  var r = $(n),
    t = r.parents(".js-subscribe_bangumi_popover"),
    u = t.data("bangumiid"),
    f = t.data("subtitlegroupid") == "" ? null : t.data("subtitlegroupid"),
    i = t.find(".btn-language.active").data("language");
  $.ajax({
    type: "POST",
    url: "/Home/SubscribeBangumi",
    data: JSON.stringify({ BangumiID: u, SubtitleGroupID: f, Language: i }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    error: function () {},
    success: function () {
      t.popoverX("hide");
      var n = "å·²è®¢é˜…";
      i == 1 ? (n = "ç®€ä¸­") : i == 2 && (n = "ç¹ä¸­");
      $(document).waiting({ size: 50, dotSize: 10, fullScreen: !0 });
      setTimeout(function () {
        $(document).waiting("done");
        $(".subscribed:visible").length == 0 &&
          ($(".subscribed-badge").show(),
          $("button.js-subscribe_bangumi_page").addClass("active"),
          $("button.js-subscribe_bangumi_page").html("å–æ¶ˆç•ªç»„è®¢é˜…"));
        t.prev().prev().html(n);
        t.prev().prev().show();
        t.prev().html("ä¿®æ”¹è®¢é˜…");
        SetPopoverSubscribedViewBangumiPage(t);
      }, 500);
    },
  });
  t.find(".js-disable-advancedsubscription:checked").length > 0 &&
    $.ajax({
      type: "POST",
      url: "/Account/DisableAdvancedSubscription",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      error: function () {},
      success: function () {
        AdvancedSubscriptionEnabled = !1;
      },
    });
}
function SetPopoverSubscribedViewBangumiPage(n) {
  n.find(".btn-cancel").length == 0 &&
    n
      .find(".btn-submit")
      .before(
        '<button type="button" class="btn btn-sm btn-cancel" onclick="PopoverUnsubscribeBangumiPage(this)">é€€è®¢</button>'
      );
  n.find(".btn-submit").html("ä¿®æ”¹");
}
function PopoverUnsubscribeBangumiPage(n) {
  var i = $(n),
    t = i.parents(".js-subscribe_bangumi_popover"),
    r = t.data("bangumiid"),
    u = t.data("subtitlegroupid") == "" ? null : t.data("subtitlegroupid");
  $.ajax({
    type: "POST",
    url: "/Home/UnsubscribeBangumi",
    data: JSON.stringify({ BangumiID: r, SubtitleGroupID: u }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    error: function () {},
    success: function () {
      t.popoverX("hide");
      $(document).waiting({ size: 50, dotSize: 10, fullScreen: !0 });
      setTimeout(function () {
        $(document).waiting("done");
        t.prev().prev().hide();
        t.prev().html("è®¢é˜…");
        $(".subscribed:visible").length == 0 &&
          ($(".subscribed-badge").hide(),
          $("button.js-subscribe_bangumi_page").removeClass("active"),
          $("button.js-subscribe_bangumi_page").html("è®¢é˜…ç•ªç»„"));
        SetPopoverUnsubscribedViewBangumiPage(t);
      }, 500);
    },
  });
  t.find(".js-disable-advancedsubscription:checked").length > 0 &&
    $.ajax({
      type: "POST",
      url: "/Account/DisableAdvancedSubscription",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      error: function () {},
      success: function () {
        AdvancedSubscriptionEnabled = !1;
      },
    });
}
function SetPopoverUnsubscribedViewBangumiPage(n) {
  n.find(".btn-submit").html("è®¢é˜…");
  n.find(".btn-cancel").remove();
  n.find('[data-language="2"]').removeClass("active");
  n.find('[data-language="1"]').removeClass("active");
  n.find('[data-language="0"]').addClass("active");
}
function InitEpisodeUpdates(n) {
  (n == null || n == "" || n.length == 0) && (n = $(document));
  n.find(".js-episode-update").each(function () {
    var n = $(this),
      i = n.data("predate"),
      r = n.data("enddate"),
      u = n.data("maximumitems"),
      f = n.parents(".an-list-res"),
      t = n.parents("#an-list");
    n.click(function () {
      t.waiting({ size: 50, dotSize: 10 });
      $.ajax({
        type: "GET",
        url: "/Home/EpisodeUpdateRows",
        data: { predate: i, enddate: r, maximumitems: u },
        contentType: "application/json; charset=utf-8",
        error: function () {},
        success: function (i) {
          $(".my-rss-date").removeClass("active");
          n.addClass("active");
          setTimeout(function () {
            t.waiting("done");
            $("#an-episode-updates").html(i);
            InitMangetTooltip();
          }, 500);
        },
      });
    });
  });
  n.find(".js-mobile-episode-update").each(function () {
    var n = $(this),
      i = n.data("predate"),
      r = n.data("enddate"),
      u = n.data("maximumitems"),
      e = n.parents(".m-home-subscribe"),
      t = n.parents(".m-home-subscribe").find(".m-subscribe-list"),
      f = n.parents(".m-home-subscribe").find(".js-mobile-episode-update-date");
    n.click(function () {
      t.html('<div class="spinner moon" style="position:relative;"></div>');
      $.ajax({
        type: "GET",
        url: "/Home/MobileEpisodeUpdateRows",
        data: { predate: i, enddate: r, maximumitems: u },
        contentType: "application/json; charset=utf-8",
        error: function () {},
        success: function (i) {
          f.html(n.html());
          setTimeout(function () {
            t.html(i);
          }, 500);
          InitDotDotDot();
        },
      });
    });
  });
}
function ToggleEpisodeUpdates(n) {
  $("#an-episode-updates").slideToggle();
  $(n).children("i").hasClass("fa-angle-up")
    ? ($(n).children("i").removeClass("fa-angle-up"),
      $(n).children("i").addClass("fa-angle-down"))
    : ($(n).children("i").removeClass("fa-angle-down"),
      $(n).children("i").addClass("fa-angle-up"));
}
$(function () {
  var n = new Blazy();
});
$(function () {
  InitMangetTooltip();
  $("#leftbar-nav-anchor").length == 1 &&
    (InitExpandEpisodeTable(),
    InitExpandMobileEpisodeTable(),
    InitSubgroupScroll(),
    $(window).scroll(InitLeftBarNavStick),
    $(window).scroll());
});
$(function () {
  InitExpandBangumi();
  InitToggleButton();
});
var LoginModalController = {
  tabsElementName: ".logmod__tabs li",
  tabElementName: ".logmod__tab",
  inputElementsName: ".logmod__form .input",
  hidePasswordName: ".hide-password",
  inputElements: null,
  tabsElement: null,
  tabElement: null,
  hidePassword: null,
  activeTab: null,
  tabSelection: 0,
  findElements: function () {
    var n = this;
    return (
      (n.tabsElement = $(n.tabsElementName)),
      (n.tabElement = $(n.tabElementName)),
      (n.inputElements = $(n.inputElementsName)),
      (n.hidePassword = $(n.hidePasswordName)),
      n
    );
  },
  setState: function (n) {
    var t = this,
      i = null;
    return (
      n || (n = 0),
      t.tabsElement &&
        ((i = $(t.tabsElement[n])),
        i.addClass("current"),
        $("." + i.attr("data-tabtar")).addClass("show")),
      t
    );
  },
  getActiveTab: function () {
    var n = this;
    return (
      n.tabsElement.each(function (t, i) {
        $(i).hasClass("current") && (n.activeTab = $(i));
      }),
      n
    );
  },
  addClickEvents: function () {
    var n = this;
    n.hidePassword.on("click", function () {
      var n = $(this),
        t = n.prev("input");
      t.attr("type") == "password"
        ? (t.attr("type", "text"), n.text("Hide"))
        : (t.attr("type", "password"), n.text("Show"));
    });
    n.tabsElement.on("click", function (t) {
      var i = $(this).attr("data-tabtar");
      t.preventDefault();
      n.activeTab.removeClass("current");
      n.activeTab = $(this);
      n.activeTab.addClass("current");
      n.tabElement.each(function (n, t) {
        t = $(t);
        t.removeClass("show");
        t.hasClass(i) && t.addClass("show");
      });
      $(".js-login-error").remove();
    });
    n.inputElements.find("label").on("click", function () {
      var n = $(this),
        t = n.next("input");
      t.focus();
    });
    return n;
  },
  initialize: function (n) {
    var t = this;
    t.findElements().setState(n).getActiveTab().addClickEvents();
  },
};
$(function () {
  InitDotDotDot();
});
$(function () {
  $("#sk-data-nav-anchor").length == 1 &&
    ($(window).scroll(sticky_relocate),
    sticky_relocate(),
    InitNavLi(),
    $(window).scroll(scrollBangumi),
    scrollBangumi());
  DarkReader.auto({ brightness: 100, contrast: 90, sepia: 10 });
  InitBackToTop();
});
$(function () {
  InitTorrentFileSelector();
});
$(function () {
  InitSubscribeBangumi();
  InitSubscribeBangumiPage();
  InitSubscribePublishGroupPage();
  InitMobileSubscribeBangumiPage();
  $('[data-toggle="tooltip"]').tooltip();
  InitSubscribeBangumiPopover();
});
$(function () {
  InitEpisodeUpdates();
});

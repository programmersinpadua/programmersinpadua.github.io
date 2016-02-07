/*
* FeedEk jQuery RSS/ATOM Feed Plugin v3.0 with YQL API
* http://jquery-plugins.net/FeedEk/FeedEk.html  https://github.com/enginkizil/FeedEk
* Author : Engin KIZIL http://www.enginkizil.com
*/

(function ($) {
    $.fn.FeedEk = function (opt) {
        var def = $.extend({
            MaxCount: 5,
            ShowDesc: true,
            ShowPubDate: true,
            DescCharacterLimit: 0,
            TitleLinkTarget: "_blank",
            DateFormat: 'DD/MM/YYYY',
            DateFormatLang:"it"
        }, opt);

        var id = $(this).attr("id"), i, s = "", dt;
        $("#" + id).empty();
        if (def.FeedUrl == undefined) return;
        //$("#" + id).append('<img src="loader.gif" />');

        var YQLstr = 'SELECT channel.item FROM feednormalizer WHERE output="rss_2.0" AND url ="' + def.FeedUrl + '" LIMIT ' + def.MaxCount;

        $.ajax({
            url: "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(YQLstr) + "&format=json&diagnostics=false&callback=?",
            dataType: "json",
            success: function (data) {
                $("#" + id).empty();
                if (!(data.query.results.rss instanceof Array)) {
                    data.query.results.rss = [data.query.results.rss];
                }
                $.each(data.query.results.rss, function (e, itm) {
                  if(itm.channel.item.title.toLowerCase().indexOf("wallflux") == -1 && itm.channel.item.description.toLowerCase().indexOf("wallflux") == -1){
                    itm.channel.item.title = itm.channel.item.title.replace("Group wall post by" , "Pubblicato da :");
                    s += '<li class="icon fa-facebook"><h3><a href="' + itm.channel.item.link + '" target="' + def.TitleLinkTarget + '" >' + itm.channel.item.title + '</a></h3>';

                    if (def.ShowPubDate){
                        dt = new Date(itm.channel.item.pubDate);
                        s += '<p>';
                        if ($.trim(def.DateFormat).length > 0) {
                            try {
                                moment.locale(def.DateFormatLang);
                                s += '<b>'+moment(dt).format(def.DateFormat)+'</b> - ';
                            }
                            catch (e){s += dt.toLocaleDateString();}
                        }
                        else {
                            s += dt.toLocaleDateString();
                        }
                        s += '';
                    }
                    if (def.ShowDesc) {
                        s += '';
                          itm.channel.item.description = itm.channel.item.description.replace("posted a link to Programmers in Padua's wall:" , "-");
                          itm.channel.item.description = itm.channel.item.description.replace("wrote on Programmers in Padua's wall:" , "-");
                          itm.channel.item.description = itm.channel.item.description.replace("likes)" , "<i class='fa fa-thumbs-up'></i>)");
                         if (def.DescCharacterLimit > 0 && itm.channel.item.description.length > def.DescCharacterLimit) {
                            s += itm.channel.item.description.substring(0, def.DescCharacterLimit) + '...';
                        }
                        else {
                            s += itm.channel.item.description;
                         }
                         s += '</p>';
                    }
                  }
                });
                $("#" + id).append(s);
            }
        });
    };
})(jQuery);

var keywords = {};



var myTemplate = _.template(
    "<div class=\"product\">" +
        "<a href=\"<%= url %>\">" +
            "<img src=\"<%= Images[0].url_170x135 %>\" alt=\"<%= title %>\" class=\"product-image\">" +
        "</a>" +
        "<div class=\"listing-info\">" +
            "<a href=\"<%= url %>\" class=\"link-muted\">" +
                "<span><%= title %></span>" +
            "</a>" +
            "<div class=\"clearfix\">" +
                "<a href=\"<%= Shop.url %>\" class=\"product-shop pull-left\">" +
                    "<span><%= Shop.shop_name %></span>" +
                "</a>" +
                "<span class=\"product-price pull-right\"><%= price %></span>" +
            "</div>" +
        "</div>" +
    "</div>"
);




$(function(){
    var keywords;

    var getData = function(keywords, callback) {
        var params = {
            api_key: "niqoyrl7dver15xzb6mp2c7e",
            includes: "Images,Shop"
        };

        if (!callback && typeof keywords === "function") {
            callback = keywords;
            keywords = null;
        }

        if (keywords && keywords.length) {
            params.keywords = keywords;
        }

        $.ajax("https://openapi.etsy.com/v2/listings/active.js", {
            data: params,
            dataType: "jsonp",
            success: callback
        });
    };

    $(".search").on("submit", function(event){
        event.preventDefault();
        keywords = $(".search-input").val();
        console.log(keywords);
    });


    getData(function(data){
        var productsContainer = $(".products");
        productsContainer.empty();
      data.results.forEach(function(product) {

        if(product.title.length > 32) {
            product.title = product.title.substring(0, 32) + "...";
        }

        if(product.Shop.shop_name.length > 20) {
            product.Shop.shop_name = product.Shop.shop_name.substring(0, 20) + "...";
        }
        productsContainer.append(myTemplate(product));
      })
    });


});
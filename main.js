var keywords = {};
var keywordList;
var productsContainer;
var searchBox;
var countProducts;

var myTemplate = _.template(
    "<div class=\"product\">" +
        "<a href=\"<%= url %>\" class=\"product-image\" style=\"background-image: url(<%= Images[0].url_570xN %>);\">" +
        "</a>" +
        "<div class=\"listing-info\">" +
            "<a href=\"<%= url %>\" class=\"link-muted\">" +
                "<span><%= title %></span>" +
            "</a>" +
            "<div class=\"clearfix\">" +
                "<a href=\"<%= Shop.url %>\" class=\"product-shop pull-left\">" +
                    "<span><%= Shop.shop_name %></span>" +
                "</a>" +
                "<span class=\"product-price pull-right\"><% if(currency_code === \"GBP\") { var code = \"&pound;\" } else {var code = \"$\" } %><%= code %><%= price %> <%= currency_code %></span>" +
            "</div>" +
        "</div>" +
    "</div>"
);


// getting all uppercased titles to be more readable 
// and not so shouty
var capitalizeFirstLetter =  function(string) {
    var words = string.toLowerCase().split(" ");
    var capitalizedWords = [];

    words.forEach(function(word){
        var newWord = word.charAt(0).toUpperCase() + word.slice(1);
        capitalizedWords.push(newWord);
    });

    return capitalizedWords.join(" ");
};


var cleanUpData = function(data) {
    var productsContainer = $(".products");
    productsContainer.empty();
    data.results.forEach(function(product) {
        product.title = capitalizeFirstLetter(product.title);

        if(product.title.length > 28) {
            product.title = product.title.substring(0, 28) + "...";
        }

        if(product.Shop.shop_name.length > 20) {
            product.Shop.shop_name = product.Shop.shop_name.substring(0, 20) + "...";
        }
        productsContainer.append(myTemplate(product));

    });
};




$(function(){
    var keywordList = $(".search-results");
    var searchBox = $(".search-input");
    var productsContainer = $(".products");

    var getData = function(keywords, callback) {
        var params = {
            api_key: "7aru187n7uevb61x2e936hvz",
            includes: "Images,Shop",
            limit: 24
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

        keywords = searchBox.val();
        productsContainer.html("<div class=\"overlay\">Searching...</div>");

        getData(keywords, function(data){
            var countProducts = data.results.length;
            cleanUpData(data);
            keywordList.html("\"<strong>" + keywords + "</strong>\" We got " + countProducts + " results!");

        });
    });


    getData(function(data){
        cleanUpData(data);
    });


});
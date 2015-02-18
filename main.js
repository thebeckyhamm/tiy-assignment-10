var keywordList;
var productsContainer;
var searchBox;
var countProducts;
var cleanedData;
var filteredData;

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


// truncate titles and shops; capitalize titles
var cleanUpData = function(data) {
    cleanedData = [];
    data.results.forEach(function(product) {
        product.title = capitalizeFirstLetter(product.title);

        if(product.title.length > 28) {
            product.title = product.title.substring(0, 28) + "...";
        }

        if(product.Shop.shop_name.length > 20) {
            product.Shop.shop_name = product.Shop.shop_name.substring(0, 20) + "...";
        }
        cleanedData.push(product);

    });


};


// add whatever data (filtered or not) to page
var updateData = function(data) {
    var productsContainer = $(".products");
    productsContainer.empty();
   
    data.forEach(function(product) {
        productsContainer.append(myTemplate(product)); 
   });
};




$(function(){
    var keywordList = $(".search-results");
    var searchBox = $(".search-input");
    var productsContainer = $(".products");
    var options = {
        keywords: null,
        page: 1,
    };

    // getData({keywords: "whiskey", page: }, function(data){

    // })

    var getData = function(options, callback) {
        var params = {
            api_key: "7aru187n7uevb61x2e936hvz",
            includes: "Images,Shop,Category",
            limit: 24
        };

        if (!callback && typeof options === "function") {
            callback = options;
            //options = null;
        }

        if (options.keywords) {
            params.keywords = options.keywords;
        }

        if (options.page) {
            params.page = options.page;
        }

        $.ajax("https://openapi.etsy.com/v2/listings/active.js", {
            data: params,
            dataType: "jsonp",
            success: callback
        });

    };

    if (options.page === 1) {
        $("#previous").addClass("btn-disabled");
    }

    // when submitted,
    // * get keywords and add overlay
    // * count the number of products returned
    // * clean up the data
    // * add data to page
    // * display search term and # of results
    $(".search").on("submit", function(event){
        event.preventDefault();

        options.keywords = searchBox.val();
        productsContainer.html("<div class=\"overlay\">Searching...</div>");

        options.page = 1;
        getData(options, function(data){
            var countProducts = data.count;
            cleanUpData(data);
            updateData(cleanedData);
            keywordList.html("Page " + options.page + ": \"<strong>" + options.keywords + "</strong>\" We got " + countProducts + " results!");

        });
    });


    // when category clicked,
    // * get the data-name for the current element
    //   and set to category
    // * filter down based on if category matches 
    //   category_path
    // only works on already returned 25 items
    // $(".list").on("click", "a", function(event){
    //     event.preventDefault();
    //     var elem = event.currentTarget;
    //     elem = $(elem);

    //     var category = elem.data("name").toLowerCase();
    //     category = capitalizeFirstLetter(category);
    //     console.log(category);

    //     filteredData = [];

    //     filteredData = cleanedData.filter(function(product) {
    //         return _.contains(product.category_path, category);
    //     });

    //     console.log(filteredData);

    //     updateData(filteredData);

    // });

    $("#next").on("click", function(event){
        event.preventDefault();
        options.page++; 
        getData(options, function(data){
            var countProducts = data.count;
            cleanUpData(data);
            updateData(cleanedData);
            if(typeof options.keywords === "string") {
                keywordList.html("Page " + options.page + ": \"<strong>" + options.keywords + "</strong>\" We got " + countProducts + " results!");
            }
            else {
                keywordList.html("Page " + options.page + ": We got " + countProducts + " results!");
            }
            $("#previous").removeClass("btn-disabled");
            $("html, body").animate(
                { scrollTop: 0 },"slow");

        });
    });

    $("#previous").on("click", function(event){
        event.preventDefault();
        options.page--; 
        getData(options, function(data){
            var countProducts = data.count;
            cleanUpData(data);
            updateData(cleanedData);
            if(typeof options.keywords === "string") {
                keywordList.html("Page " + options.page + ": \"<strong>" + options.keywords + "</strong>\" We got " + countProducts + " results!");
            }
            else {
                keywordList.html("Page " + options.page + ": We got " + countProducts + " results!");
            }

            if (options.page === 1) {
                $("#previous").addClass("btn-disabled");
            }
            $("html, body").animate(
                { scrollTop: 0 },"slow");

        });
    });


    getData(function(data){
        console.log(data);
        cleanUpData(data);
        updateData(cleanedData); 
        keywordList.html("Page " + options.page + ": We got " + data.count + " results!");

    });


});
// Declare Globals
var user_search_string = "";
var user_recommendations_array = [];
var TASTEKID_BASE_URL = 'https://www.tastekid.com/api/similar';
var TASTEKID_API_KEY = '253651-ThomasDa-7TFMY069';
var GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
var GOOGLE_BOOKS_API_KEY = 'AIzaSyAdKIAWRNbTFTI2Xv_KdL_VAQdwvBjHOs8';

// Functions to check that called api key has content
function checkImages(imageURL) {
    if (typeof imageURL === 'undefined' || imageURL == null) {
        return "http://placehold.it/128x198";
    } else {
        return imageURL;
    }
}

function checkTexts(textValue) {
    if (typeof textValue === 'undefined' || textValue == null) {
        return "-";
    } else {
        return textValue;
    }
}

// Get data from API
function getDataFromTasteKid(searchTerm, callback) {
    var settings = {
        url: TASTEKID_BASE_URL,
        data: {
            q: searchTerm,
            k: TASTEKID_API_KEY,
            type: 'books',
            r: 'jsonp',
            limit: '4',
            info: 1
        },
        dataType: 'jsonp',
        type: 'GET',
        success: callback
    };
    var results = $.ajax(settings);
}

function storeTasteKidResults(data) {
    var tasteKidResults = [];
    // Return error code if "400" is returned by data object
    console.log("tastekid data: ", data);
    if (data.code == "400") {
        $(".recommendations").html("<p class = 'error'>Sorry! Database Query Limit Reached, Please Try Again Later!</p>");
    } else {
        if (data.Similar.Results.length === 0) {
            $(".recommendations").html("<p class = 'error'>Sorry! No Recommendations Available, please search another Title</p>");
        } else {

            if (data.Similar.Results) {
                data.Similar.Results.forEach(function(item) {
                    tasteKidResults.push(item.Name);
                });
            }
            user_recommendations_array = tasteKidResults;
            user_recommendations_array.forEach(function(item) {
                getDataFromGoogleBooks(item, displayRecommendations);
            });
        }
    }
}

function getDataFromGoogleBooks(searchTerm, callback) {
    var settings = {
        url: GOOGLE_BOOKS_BASE_URL,
        data: {
            key: GOOGLE_BOOKS_API_KEY,
            q: searchTerm,
            maxResults: 1
        },
        dataType: 'jsonp',
        type: 'GET',
        success: callback
    };
    var googleBookResults = $.ajax(settings);
}

function displayRecommendations(data) {
    console.log("google api data: ", data);
    //Return error code if "400" is returned by data object
    if (data.code == "400") {
        $(".recommendations").html("<p class = 'error'>Sorry! Database Query Limit Reached, Please Try Again Later!</p>");
    }
    else if(data.totalItems === 0){
        $(".recommendations").html("<p class = 'error'>Some Error Message</p>");
    }
    else{
    var renderedHTML = "";
    if (data.items) {
        data.items.forEach(function(item) {
            renderedHTML += '<div class = "item_wrapper">';
            renderedHTML += '<header class="recommendation_header">';
            renderedHTML += '<h2 class="title">' + checkTexts(item.volumeInfo.title) + '</h2>';
            renderedHTML += '</header>';
            renderedHTML += '<div class="thumbnail_section">';
            renderedHTML += '<img class="book_thumbnail" src="' + checkImages(item.volumeInfo.imageLinks.thumbnail) + '"/>';
            renderedHTML += '<p class="book_rating">Rating: ' + checkTexts(item.volumeInfo.averageRating) + '/5</p>';
            renderedHTML += '<button class = "buy_button"><a class="buy_link" target="_blank" href="' + checkTexts(item.volumeInfo.infoLink) +'">Buy</a></button>';
            renderedHTML += '</div>';
            renderedHTML += '<div class="book_information_section">';
            renderedHTML += '<p class="author">' + checkTexts(item.volumeInfo.authors) + '</p>';
            renderedHTML += '<p class="publication_info">' + item.volumeInfo.publisher +  ', ' + checkTexts(item.volumeInfo.publishedDate) + '</p>';
            renderedHTML += '<p class="book_specs">' + checkTexts(item.volumeInfo.categories) + ' - ' +  checkTexts(item.volumeInfo.pageCount) + ' pages</p>';
            renderedHTML += '</div>';
            renderedHTML += '<div class="book_description_section">';
            renderedHTML += '<p class="book_description">' + checkTexts(item.volumeInfo.description) + '</p>';
            renderedHTML += '</div>';
            renderedHTML += '</div>';
        });
    }

    $(".recommendations").append(renderedHTML);
}
}

$(document).ready(function() {

});

$(document).on('click', ".user_search_string_submit", function(event) {
    event.preventDefault();
    $(".recommendations").html("");
    user_search_string = $(".user_search_string").val();
    user_recommendations_array = [];
    getDataFromTasteKid(user_search_string, storeTasteKidResults);
    $(".recommendations").removeClass("hidden");

});

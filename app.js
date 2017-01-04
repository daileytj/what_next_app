// Declare Globals
var user_search_string = "";
var user_recommendations_array = [];
var TASTEKID_BASE_URL = 'https://www.tastekid.com/api/similar';
var TASTEKID_API_KEY = '253651-ThomasDa-7TFMY069';
var GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
var GOOGLE_BOOKS_API_KEY = 'AIzaSyAdKIAWRNbTFTI2Xv_KdL_VAQdwvBjHOs8';

// Get data from API
function getDataFromTasteKid(searchTerm, callback) {
  var settings = {
    url: TASTEKID_BASE_URL,
    data: {
      q: searchTerm,
      k: TASTEKID_API_KEY,
      type: 'books',
      r: 'jsonp',
      limit: '10'
    },
    dataType: 'jsonp',
    type: 'GET',
    success: callback
  };
  var results = $.ajax(settings);
  //console.log("results object: " + results);
}

function storeTasteKidResults(data){
  var tasteKidResults = [];
  if (data.Similar.Results){
      data.Similar.Results.forEach(function(item){
      tasteKidResults.push(item.Name);
    });
  }
  //console.log(data);
  //console.log(data.Similar.Results[0].Name);
  //console.log("taste kid results titles: " + tasteKidResults);
  user_recommendations_array = tasteKidResults;
  user_recommendations_array.forEach(function(item){
    getDataFromGoogleBooks(item, displayRecommendations);
  });
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
  //console.log(googleBookResults);
}

function displayRecommendations(data){
  renderedHTML = "";
  if (data.items){
    data.items.forEach(function(item){
      renderedHTML += "<img src=" + item.volumeInfo.imageLinks.thumbnail + "/>";
      renderedHTML += "<p>Title: " + item.volumeInfo.title + "</p>";
      renderedHTML += "<p>Author: " + item.volumeInfo.authors + "</p>";
      renderedHTML += "<p>Publisher: " + item.volumeInfo.publisher + "</p>";
      renderedHTML += "<p>Publication Date: " + item.volumeInfo.publishedDate + "</p>";
      if(item.volumeInfo.industryIdentifiers[0].identifier){
      renderedHTML += "<p>ISBN: " + item.volumeInfo.industryIdentifiers[0].identifier + "</p>";
    }
      else{
        renderedHTML += "<p>ISBN: Unknown</p>";
      }
      renderedHTML += "<p>Page Count: " + item.volumeInfo.pageCount + "</p>";
      renderedHTML += "<p>Average Rating: " + item.volumeInfo.averageRating + "</p>";
      renderedHTML += "<a href=" + item.volumeInfo.infoLink + ">Buy</a>";
      renderedHTML += "<p>Description: " + item.volumeInfo.description + "</p>";
    });
  }
  $(".recommendations").append(renderedHTML);
}

$(document).ready(function(){

});

$(".user_search_string_submit").click(function(event){
  event.preventDefault();
  user_search_string = $(".user_search_string").val();
  $(".recommendations").html("");
  user_recommendations_array = [];
  getDataFromTasteKid(user_search_string, storeTasteKidResults);
  console.log("user_recommendations_array: " + user_recommendations_array);
  if (user_recommendations_array == false){
    $(".recommendations").append("<p>Sorry! No Recommendations Available, please search another Title</p>");
  }
});

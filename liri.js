
  // -- Link to Moment.js should go here --
  // PROBLEM: Moment() keeps coming up "undefined"
  // src="https://cdn.jsdelivr.net/momentjs/2.12.0/moment.min.js"
 

// Program purpose:
// Takes in the command line arguments 2("command") & 3("title")
// "command" choices are
  //     * concert-this
  //     * spotify-this-song
  //     * movie-this
  //     * do-what-it-says
// "title" is in quotes
//       * title (of Artist, Song or Movie)

// require packages needed
// config for "dotenv" pacakage
require("dotenv").config();
var moment  =       require("moment");

var keys =    require("./keys.js");
var fs =      require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var title = process.argv[3];

// Main switch block for command provided in process.argument 2
switch (command) {
  case "concert-this":
    // search "BandsInTown API" using AXIOS
    concertThis();
    break;  
  case "spotify-this-song":
    // search "Spotify-Songs" using npm Spotify API package
    spotifySongs();
    break;  
  case "movie-this":
    // search "OMDB API" using AXIOS   
    movieThis();
    break;  
  case "do-what-it-says":
    // use fs package to readFile "random.txt" file containing
    //   my personal credentials for Spotify API search
    // using "title" of songs stored in .txt file
    // and command-type stored (in this case we use "spotify-this-song")
    //  for testing, title used is "I Like it That Way"
    doWhatItSays();
    break;
}
// ************** BEGIN FUNCTIONS **********************
// *****************************************************
function spotifySongs() {
  // search Spotify API using "my API credentials" stored in .env file
  // since .env file is not pushed to gitHub, my keys are kept private
  // using "require" keys.js to store key names for Spotify API call
spotify
  .search({ type: 'track', query: title, limit: 10 })
  .then(function(response) { 
    for (i = 0; i < 10; i++) {
      console.log("\n"+(i+1)+") --------------------------------------");
      console.log("Artist               : "+response.tracks.items[i].artists[0].name);  
      console.log("Song title           : "+response.tracks.items[i].name);
      console.log("Preview link to track: "+response.tracks.items[i].preview_url);
      console.log("Album                : "+response.tracks.items[i].album.name);   
    } // end for Loop
  })  // end .then call-back function
  .catch(function(err) {
    console.log(err);
  })
}  // end of function spotifySongs()
// **********************************************************
function doWhatItSays() {
    // Use fs package to read "random.txt" file
    // for purposed of assignement "random.txt" contains:
    // command "spotify-this-song" , "I want It That Way"
    // *******************************************************
      // search Spotify API using "my API credentials" stored in .env file
    // since .env file is not pushed to gitHub, my keys are kept private
  // using "require" keys.js to store key names for Spotify API call
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);    
    }
      // Split the data from "random.txt" by commas (to make it more usable)
    var dataArr = data.split(",");  // this works but below does not
    spotify.search({ type: 'track', query: dataArr[1], limit: 10 })
      .then(function(response) {
        // Loop through API results; console log each match of request
      for (i = 0; i < 10; i++) {
        console.log("\n"+(i+1)+") ----------------------------------");
        console.log("Artist               : "+response.tracks.items[i].artists[0].name);  
        console.log("Song title           : "+response.tracks.items[i].name);
        console.log("Preview link to track: "+response.tracks.items[i].preview_url);
        console.log("Album                : "+response.tracks.items[i].album.name);   
      } // end for Loop
      console.log("\n"+'< This is 10 instances of the song: "I Want It That Way">' );
      })  // end .then call-back function  
      .catch(function(err) {
        console.log(err);
      })
  });  // end fs.readFile
} // end function doWhatItSays()
// **************************************************************
function concertThis() {
  // Include the axios npm package
  var axios = require("axios");
    // Grab the artist name which will always be the third node argument.
    // If no movie is entered, we'll print out a console log message for now
  var artist = title;
  if (title === undefined) {
    console.log("Please enter an Artist to search for")
  }
  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    // This line is just to help us debug against the actual URL.
    // Axios get to receive the API data - then store it in var "results"
  axios.get(queryUrl).then(
    function(response) {
      var results = response.data;
      // keep track of total matches (ie. concerts)
      // store in var "hits" for "FYI" stat displayed for user
      var hits = 0;
      var time1 = 0;
      var time2 = 0;
      console.log("\n"+"These are the next shows nearest to you");
      console.log("---------------------------------------------------------");
      // loops thru results and take out only the concerts in Florida
      for (i = 0; i < results.length; i++) {
        if (results[i].venue.region === "FL") {
          hits  ++;
            // grab the Venue Time from API search results and store var
            // use "moment.js" node package to convert to readable format
          var venueTime = results[i].datetime;
          var time = moment(venueTime).format("L");
            // console.log" info we are searching for (hard coded in this assignment)
          console.log("Band Name    : "+artist);
          console.log("Venue        : "+results[i].venue.name);
          console.log("City/State   : "+results[i].venue.city+", "+results[i].venue.region);
          console.log("Date and Time: "+time); 
          console.log("\n"+"--------------------------------------------------");
        } else {
        }      
      }  // end for Loop
        // check if there were "no matches" (ie. no concerts in the US)
      if (hits === 0){
        console.log("Sorry, there were no shows found near you (In your State)");
        console.log("---------------------------------------------------------")
      } // display for "FYI" purposes only - since we're only showing concerts in Florida
        // may add "input" for search by State only or City
        console.log("Number of shows in Florida = "+hits);  
        console.log("Number of shows in the US  = "+i);      
    })  // end .then call back function (response)     
  .catch(function(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("---------------Data---------------");
      console.log(error.response.data);
      console.log("---------------Status---------------");
      console.log(error.response.status);
      console.log("---------------Status---------------");
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with on the error
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }  // end error function block
  }); // end callback .catch
}  // end function concertThis()
// **************************************
function movieThis(){
    // Include the axios npm package
  var axios = require("axios");
    // Grab the movieName which will always be the third node argument.
    // If no movie is entered, we'll default to "Mr. Nobody"
    // ... a good movie that Graydon recommends ...
  if (title === undefined) {
    title = "Mr. Nobody";
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    // This line is just to help us debug against the actual URL.
  axios.get(queryUrl).then(
    function(response) {      
      console.log("\n"+"------------------------------------");
      console.log("Title                 : "+response.data.Title);
      console.log("Year Relased          : "+response.data.Year);
      console.log("IMDB Rating           : " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      console.log("Country produced in   : " + response.data.Country);
      console.log("Language of the movie : " + response.data.Language);
      console.log("Actors                : " + response.data.Actors);        
      console.log("Plot                  : " + response.data.Plot);
      console.log("------------------------------------------") 
    if (title === "Mr. Nobody") {
      console.log('\n'+'*** Since you did not enter a movie, may I suggest: "Mr. Nobody" ***');
      console.log("It comes recommomended by our instructor, Graydon");
    }  // I added this statment for "FYI" and as a credit for Graydon's "personal pics"
    })  // end .then call back function (response)
  .catch(function(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("---------------Data---------------");
      console.log(error.response.data);
      console.log("---------------Status---------------");
      console.log(error.response.status);
      console.log("---------------Status---------------");
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  })  // end call back .catch function
}  // end function movieThis

// At the top of the `liri.js` file
// add code to read 
// and set any environment variables 
// with the dotenv package

// require("dotenv").config(); +++++++++++++++++

// Add the code required to 
// import the `keys.js` file 
// and store it in a variable.

// var keys = require("./keys.js"); ++++++++++++++

// You should then be able to access your keys information like so
// var spotify = new Spotify(keys.spotify); +++++++++++++++++++


// Program purpose:
// Takes in the command line arguments 2("command") & 3("title")
// "command" choices are
  //     * concert-this
  //     * spotify-this-song
  //     * movie-this
  //     * do-what-it-says
// "title" is in quotes
//       * title (of Artist, Song or Movie)

  // Next:  set up require packages needed
  // config for "dotenv" pacakage
require("dotenv").config();
  // Establish variables used
  // require statments needed:
  //    moment.js package for converting API time to preferred format to display
  //    fs package for readFile of "random.txt" file containing API credentials
  //    require "keys.js" file containing Spotify API property (keyed pairs) to search
  //    require Spotify API node to use Spotify API 
var moment  = require("moment");
var fs =      require("fs");
var keys =    require("./keys.js");
var Spotify = require("node-spotify-api");
  // create new Spotify containing "keys" for searching API 
  // this elminates my API credentials(eg ID and Secret) being in code block
  // we will not be pushing Spotify credentials in .env file up to gitHub
var spotify = new Spotify(keys.spotify);
  // grabing the second line argument using process.argv - storing in var command
var command = process.argv[2];
  // storing third line agrument entered in var title
var title = process.argv[3];
// ************************************************************
// Main switch block for command provided in process.argument 2
switch (command) {
  case "concert-this":
    // search "BandsInTown API" using AXIOS
    concertThis();
    break;  
  case "spotify-this-song":
    // search "Spotify-Songs" using npm Spotify API package
    if (title === undefined) {
      console.log ("\n"+"----------------------------");
      console.log ("ERROR: You forgot to enter a song title");
      console.log ("Please try again");
    } else {
    spotifySongs();
    }
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
  default:
    console.log ("\n"+"ERROR: Please enter a command.");
    console.log ('Example: node liri movie-this "Ben Hur"');
    break;
}
// ************** BEGIN FUNCTIONS **********************
// functions used:
//   spotifySongs()
//   doWhatItSays()
//   concertThis()
//   movieThis()
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
// **************************************
// **************************************
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
    var dataArr = data.split(",");  
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
// **************************************
// **************************************
function concertThis() {
  // Include the axios npm package
  var axios = require("axios");
    // Grab the artist name which will always be the third node argument.
    // If no movie is entered, we'll print out a console log message for now
  var artist = title;
    if (title === undefined) {
      // in case the user does not enter a title to search for
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
      // loops thru results and take out only the concerts in Florida
      console.log("\n"+"These are the next shows nearest to you");
      console.log("-------------------------------------------------");
        for (i = 0; i < results.length; i++) {
          if (results[i].venue.region === "FL") {
            hits  ++;
              // grab the Venue Time from API search results and store into var venueTime 
            var venueTime = results[i].datetime;
             // use "moment.js" node package to convert to readable format
            var time = moment(venueTime).format("L");
              // console.log" info we are searching for (hard coded in this assignment)
            console.log("Band Name    : "+artist);
            console.log("Venue        : "+results[i].venue.name);
            console.log("City/State   : "+results[i].venue.city+", "+results[i].venue.region);
            console.log("Date and Time: "+time); 
            console.log("\n"+"--------------------------------------------------");
          }  // end if statement catching matches in Florida and displaying them
        } // end for loop

        // check if there were "no matches" (ie. no concerts in the US)
        if (hits === 0){
          console.log("Sorry, there were no shows found near you (In your State)");
          console.log("---------------------------------------------------------")
        }      
        // display for "FYI" purposes only - since we're only showing concerts in Florida
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
    }  // end if error.response function block
      console.log(error.config);
  }); // end callback .catch
}  // end function concertThis()
// **************************************
// **************************************
function movieThis(){
    // Include the axios npm package
  var axios = require("axios");
    // Grab the movieName which will always be the third node argument.
    // If no movie is entered, we'll default to "Mr. Nobody"
    // ... a good movie apparently that Graydon recommends ...
    if (title === undefined) {
      title = "Mr. Nobody";
    }
  var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    // This line is just to help us debug against the actual URL.
  axios.get(queryUrl).then(
    function(response) {      
      console.log("\n"+"------------------------------------");
      console.log("Title                 : " +response.data.Title);
      console.log("Year Relased          : " +response.data.Year);
      console.log("IMDB Rating           : " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      console.log("Country produced in   : " + response.data.Country);
      console.log("Language of the movie : " + response.data.Language);
      console.log("Actors                : " + response.data.Actors);        
      console.log("Plot                  : " + response.data.Plot);
      console.log("------------------------------------------") 
        if (title === "Mr. Nobody") {
          console.log('\n'+'*** Since you did not enter a movie, may I suggest: "Mr. Nobody" ***');
          console.log("It comes recommended by our instructor, Graydon");
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
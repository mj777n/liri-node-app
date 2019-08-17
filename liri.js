
  // -- Link to Moment.js should go here --
  src="https://cdn.jsdelivr.net/momentjs/2.12.0/moment.min.js"
    
// Takes in all of the command line arguments
// var inputString = process.argv;
  // Capture the command line argument into array var:
  //  using "command" options:
  //    "concert-this"
  //    "spotify-this-song"
  //    "movie-this"
  //    "do-what-it-says"
var command = process.argv[2];
var title = process.argv[3];

// Main switch block for command provided in argument 2
switch (command) {
  case "concert-this":
    // search "BandsInTown API" using AXIOS
    concertThis();
    break;  
  case "spotify-this-song":
    // search "Spotify-Songs" using npm Spotify package

    spotifySongs();
    break;  
  case "movie-this":
    // search "OMDB API" using AXIOS   
    movieThis();
    break;  
  case "do-what-it-says":
    // use fs package to readFile ".txt" file for Spotify API search
    doWhatItSays();
    break;
}
// ************** BEGIN FUNCTIONS ***********************
function doWhatItSays() {
  var fs = require("fs");
  fs.readFile("random.txt", "utf8", function(error, data) {
      // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
      // Split the data by commas (to make it more readable)
    var dataArr = data.split(",");
    var Spotify = require('node-spotify-api');
 
    var spotify = new Spotify({
      id: "2eb938cc022044c9b7671bf61eaff967",
      secret: "f6b25c8747af4cfea971cbf503bfeef3"
    });
    
    spotify
      .search({ type: 'track', query: dataArr[1], limit: 10 })
      .then(function(response) {
      
      for (i = 0; i < 10; i++) {
        console.log("\n"+(i+1)+") -----------------------------");
        console.log("Artist: "+response.tracks.items[i].artists[0].name);  
        console.log("Song title: "+response.tracks.items[i].name);
        console.log("Preview link to track: "+response.tracks.items[i].preview_url);
        console.log("Album: "+response.tracks.items[i].album.name);   
      } // end for Loop
      console.log("\n"+'This is 10 instances of the song "I Want It THat Way"' );
      })  // end .then call-back function
    
      .catch(function(err) {
        console.log(err);
      })
  });  // end fs.readFile
} // end function doWhatItSays()

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
  axios.get(queryUrl).then(
    function(response) {
      var results = response.data;
      var hits = 0;
      var time1 = 0;
      var time2 = 0;
      console.log("\n"+"These are the next shows nearest to you");
      console.log("---------------------------------------------------------");
      for (i = 0; i < results.length; i++) {
        if (results[i].venue.region === "FL") {
          hits  ++;
            // moment() is "not defined" on run
            // ***** Under Construction *******
          venueTime = results[i].datetime;        
            // console.log("var venueTime = "+venueTime);
            // console.log(moment(venueTime).format("L"));
          console.log("Band Name    : "+artist);
          console.log("Venue        : "+results[i].venue.name);
          console.log("City/State   : "+results[i].venue.city+", "+results[i].venue.region);
          console.log("Date and Time: "+results[i].datetime); 
          console.log("\n"+"--------------------------------------------------");
        } else {
        }      
      }  // end for Loop
      if (hits === 0){
        console.log("Sorry, there were no shows found near you (In your State)");
        console.log("---------------------------------------------------------")
      }  
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
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request);
      console.log("IN THE ERROR LOG");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
    console.log("IN THE 2nd ERROR LOG");
  }); 
}  // end function concertThis()

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
// **************************************************
function spotifySongs() {
    var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: "2eb938cc022044c9b7671bf61eaff967",
  secret: "f6b25c8747af4cfea971cbf503bfeef3"
});

spotify
  .search({ type: 'track', query: title, limit: 10 })
  .then(function(response) {
  
  for (i = 0; i < 10; i++) {
    console.log("\n"+(i+1)+") -----------------------------");
    console.log("Artist: "+response.tracks.items[i].artists[0].name);  
    console.log("Song title: "+response.tracks.items[i].name);
    console.log("Preview link to track: "+response.tracks.items[i].preview_url);
    console.log("Album: "+response.tracks.items[i].album.name);   
  } // end for Loop
  })  // end .then call-back function

  .catch(function(err) {
    console.log(err);
  })
}  // end of function spotifySongs()



// At the top of the `liri.js` file
// add code to read 
// and set any environment variables 
// with the dotenv package:

// require("dotenv").config(); +++++++++++++++++

// Add the code required to 
// import the `keys.js` file 
// and store it in a variable.

// var keys = require("./keys.js"); ++++++++++++++

// You should then be able to access your keys information like so
// var spotify = new Spotify(keys.spotify); +++++++++++++++++++

// Make it so liri.js can take in one of the following commands:
// * `concert-this`
// * `spotify-this-song`
// * `movie-this`
// * `do-what-it-says`
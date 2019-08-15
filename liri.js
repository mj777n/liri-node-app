// Takes in all of the command line arguments
var inputString = process.argv;
  // Capture the command line argument into array var:
  //  using "command" options:
  //    "concert-this"
  //    "spotify-this-song"
  //    "movie-this"
  //    "do-what-it-says"
var command = process.argv[2];
var title = process.argv[3];

switch (command) {
  case "concert-this":
    // search "BandsInTown API"
    break;  
  case "spotify-this-song":
    // search "Spotify-Songs"
    console.log("Inside swtich statement");
    spotifySongs();
    break;  
  case "movie-this":
    // search OMDB using AXIOS
    
    movieThis();
    break;  
  case "do-what-it-says":
    // NOT SURE WHAT TO DO HERE
    break;
}
// ************** BEGIN FUNCTIONS ***********************8

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
      console.log("Title: "+response.data.Title)
      console.log("Year Relased: "+response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      console.log("Country produced in: " + response.data.Country);
      console.log("Language of the movie: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);    
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
  });
}  // end function movieThis

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
  })
  .catch(function(err) {
    console.log(err);
  });

// spotify.search({ type: 'track', query: 'Angie' }, function(err, data) {
//   if (err) {
//     return console.log('Error occurred: ' + err);
//   }
// console.log(data); 
// });
}  // end function spotifySongs()



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
// First, sign up for an account at https://themoviedb.org
// Once verified and signed-in, go to Settings and create a new
// API key; in the form, indicate that you'll be using this API
// key for educational or personal use, and you should receive
// your new key right away.

 

// For this exercise, we'll be using the "now playing" API endpoint
// https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US

// Note: image data returned by the API will only give you the filename;
// prepend with `https://image.tmdb.org/t/p/w500/` to get the 
// complete image URL

window.addEventListener('DOMContentLoaded', async function() {
  
  // Setup firestore db 
  let db = firebase.firestore()

  // Step 1: Construct a URL to get movies playing now from TMDB, fetch data and put the Array of movie Objects in a variable called movies. Write the contents of this array to the JavaScript console to ensure you've got good data
  // ⬇️ ⬇️ ⬇️  
  let apiKey = 'bca32aad30e09d5cb8a4f3c46e2c1283'

  let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`


  let response = await fetch(url)
  let movies = await response.json()
  console.log(movies)
  // ⬆️ ⬆️ ⬆️ 
  // End Step 1
  
  // Get data of watched movies 
  let snapshotWatched = await db.collection('watched').get()
      console.log(`Number of watched movies: ${snapshotWatched.size}`)
      let watchedMovies = snapshotWatched.docs
      // console.log(watchedMovies)

  
// Step 2 & 3 (incl. Bonus) & 4
  // ⬇️ ⬇️ ⬇️
    // Step 2:  Loop through the Array called movies and insert HTML, Include a "watched" button to click for each movie
    console.log(movies.results)

    for (let i = 0; i < movies.results.length; i++) {
      let movie = movies.results[i] 
      let movieId = movie.id
      let posterPath = movie.poster_path
      let movieTitle = movie.original_title
      console.log(movieId)

        // Step 3:
        // - Attach an event listener to each "watched button" - when clicked, changed the opacity
      document.querySelector('.movies').insertAdjacentHTML('beforeend', `
      <div class="w-1/5 p-4 movie-${movieId}">
      <img src="https://image.tmdb.org/t/p/w500${posterPath}" class="w-full">
      <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
      </div>
      `)

      // Check if movie is already in database and mark if so
      let movieDoc = await db.collection('watched').doc(`${movieId}`).get()
      console.log(movieDoc)   
          if (!movieDoc.exists) {
              console.log(`${movie.original_title} not in database and thus not yet watched`)
          } else {
              document.querySelector(`.movie-${movieId} .watched-button`).classList.add('opacity-20')
          }

    // Add event listener to buttons - will only do if clicked 
    document.querySelector(`.movie-${movieId} .watched-button`).addEventListener('click', async function(event) {
            event.preventDefault() 
            console.log('button was clicked')   
                  // - Bonus challenge: add code to "un-watch" the movie by
                  if (document.querySelector(`.movie-${movieId} .watched-button`).classList.contains('opacity-20') == true) {
                    document.querySelector(`.movie-${movieId} .watched-button`).classList.remove('opacity-20')
                    await db.collection('watched').doc(`${movieId}`).delete()
                    console.log(`new movie with ID ${movieId} deleted`) 
                  } else {
                    document.querySelector(`.movie-${movieId} .watched-button`).classList.add('opacity-20')   
                  await db.collection('watched').doc(`${movieId}`).set({})
                  console.log(`new movie with ID ${movieId} created`) 
                   
                  }
            
      })

    } 
  // ⬆️ ⬆️ ⬆️ 
  // End Step 2 & 3 (incl. Bonus) & 4

})
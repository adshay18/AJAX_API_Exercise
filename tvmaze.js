/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default image if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.
	const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
	const dataArr = res.data;
	const resArr = [];
	for (let index of dataArr) {
		const allData = index.show;
		const id = allData.id;
		const name = allData.name;
		const summary = allData.summary;
		let image = '';
		if (allData.image != null) {
			image = allData.image.original;
		} else {
			image = 'https://tinyurl.com/tv-missing';
		}
		const showObj = { id, name, summary, image };
		resArr.push(showObj);
	}
	return resArr;
}

/** Populate shows list:
 *     - given an array of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img src="${show.image}" class="card-img-top" alt="Image provided by ${show.name}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <form>        
              <button class="btn btn-secondary" type="submit">Episodes</button>
            </form>
           </div>     
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	const episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
	const episodesArr = episodes.data;
	const resArr = [];
	for (let episode of episodesArr) {
		const id = episode.id;
		const name = episode.name;
		const season = episode.season;
		const number = episode.number;
		const episodeObj = { id, name, season, number };
		resArr.push(episodeObj);
	}
	return resArr;
}

//Populate Episodes: Given an array of episodes, add episodes to DOM

function populateEpisodes(episodes) {
	const $episodesArea = $('#episodes-area');
	const $episodesList = $('#episodes-list');
	$episodesList.empty();
	for (let episode of episodes) {
		let $details = $(
			`<li>
        <div class="col-md-6 col-lg-3 Show" data-show-id="${episode.id}">
          <div class="card" data-show-id="${episode.id}">
            <div class="card-body">
              <h5 class="card-title">${episode.name}</h5>
              <p class="card-text">Season: ${episode.season} Episode: ${episode.number}</p>
            </div>
          </div>
        </div>
      </li>`
		);
		$episodesList.append($details);
	}

	$episodesArea.show();
}

// Add event listener on Episodes buttons

$('#shows-list').on('submit', async function(e) {
	e.preventDefault();
	let $id = $(e.target).closest('.Show').data('show-id');
	let episodes = await getEpisodes($id);

	populateEpisodes(episodes);
});

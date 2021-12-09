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
			image =
				'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80';
		}
		const showObj = { id, name, summary, image };
		resArr.push(showObj);
	}
	return resArr;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
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

// async function getEpisodes(id) {
// 	// TODO: get episodes from tvmaze
// 	//       you can get this by making GET request to
// 	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
// 	// TODO: return array-of-episode-info, as described in docstring above
// }

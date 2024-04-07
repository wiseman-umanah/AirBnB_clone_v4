$('document').ready( () => {
	getStatus();
	postPlace();
	let amenity_ids = {};
	$('.amenities .popover input').on("change", function () {
	if ($(this).is(":checked")) {
		amenity_ids[($(this).attr("data-name")).replace("_", " ")] = $(this).attr("data-id")
	}
	else if ($(this).is(":not(:checked)")) {
		delete amenity_ids[($(this).attr("data-name")).replace("_", " ")]
	}
	let [state, city] = getSC_ids()
	const name = Object.keys(amenity_ids)
	const amenities = Object.values(amenity_ids)
	state = Object.values(state)
	city = Object.values(city)
	$('.amenities h4').text(name.sort().join(', '));
	$('button').on("click", () => {
		postAmenities(state=state, city=city, amenity=amenities)
	});
})})

function getStatus() {
	const status = 'http://192.168.8.101:5001/api/v1/status';

	$.get(status, function (data) {
		if (data['status'] == "OK")
			$('#api_status').addClass('available')
		else $('#api_status').removeClass('available')
	});
}

function postPlace() {
	const PLACES_URL = `http://192.168.8.101:5001/api/v1/places_search/`;
	$.ajax({
		url: PLACES_URL,
		type: 'POST',
		headers: { 'Content-Type': 'application/json' },
		data: JSON.stringify({}),
		success: function (data) {
			for (const d of data) {
				const article = ['<article>',
				'<div class="title_box">',
				`<h2>${d.name}</h2>`,
				`<div class="price_by_night">$${d.price_by_night}</div>`,
				'</div>',
				'<div class="information">',
				`<div class="max_guest">${d.max_guest} Guest(s)</div>`,
				`<div class="number_rooms">${d.number_rooms} Bedroom(s)</div>`,
				`<div class="number_bathrooms">${d.number_bathrooms} Bathroom(s)</div>`,
				'</div>',
				'<div class="description">',
				`${d.description}`,
				'</div>',
				'</article>'];
				$('SECTION.places').append(article.join(''));
			}
		},
		error: function (error) {
		console.log(error);
		}
	});
}

function postAmenities(state=[], city=[], amenity=[]) {
	const PLACES_URL = `http://192.168.8.101:5001/api/v1/places_search/`;
	$.ajax({
		url: PLACES_URL,
		type: 'POST',
		headers: { 'Content-Type': 'application/json' },
		data: JSON.stringify({'states': state, 'cities': city, 'amenities': amenity}),
		success: function (data) {
			console.log(data.length)
			for (const d of data) {
				const article = ['<article>',
				'<div class="title_box">',
				`<h2>${d.name}</h2>`,
				`<div class="price_by_night">$${d.price_by_night}</div>`,
				'</div>',
				'<div class="information">',
				`<div class="max_guest">${d.max_guest} Guest(s)</div>`,
				`<div class="number_rooms">${d.number_rooms} Bedroom(s)</div>`,
				`<div class="number_bathrooms">${d.number_bathrooms} Bathroom(s)</div>`,
				'</div>',
				'<div class="description">',
				`${d.description}`,
				'</div>',
				'</article>'];
				$('SECTION.places').append(article.join(''));
			}
		},
		error: function (error) {
		console.log(error);
		}
	});
}

function getSC_ids() {
	let state_ids = {};
	let city_ids = {};
	$('.locations .popover input').on("change", function () {
		if ($(this).is(":checked")) {
			if ($(this).prop("tagName") === "H2")
				state_ids[($(this).attr("data-name")).replace("_", " ")] = $(this).attr("data-id")
			else
				city_ids[($(this).attr("data-name")).replace("_", " ")] = $(this).attr("data-id")
		}
		else if ($(this).is(":not(:checked)")) {
			if ($(this).prop("tagName") === "H2")
				delete state_ids[($(this).attr("data-name")).replace("_", " ")]
			else
				delete city_ids[($(this).attr("data-name")).replace("_", " ")]
		}
	})
	return (new Array(state_ids, city_ids))
}
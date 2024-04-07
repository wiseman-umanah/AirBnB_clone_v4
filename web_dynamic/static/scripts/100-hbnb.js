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
	const name = Object.keys(amenity_ids)
	$('.amenities h4').text(name.sort().join(', '));
	postAmenities(Object.values(amenity_ids));
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

function postAmenities(amenity_ids) {
	const PLACES_URL = `http://192.168.8.101:5001/api/v1/places_search/`;
	$.ajax({
		url: PLACES_URL,
		type: 'POST',
		headers: { 'Content-Type': 'application/json' },
		data: JSON.stringify({'amenities': amenity_ids}),
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
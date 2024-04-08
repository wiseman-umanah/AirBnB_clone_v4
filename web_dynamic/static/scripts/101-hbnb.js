const HOST = '127.0.0.1'
$(document).ready(() => {
	getStatus();
	bindAmenityCheckboxChange();
	bindLocationCheckboxChange();
	bindSearchButton();
  });
  
  // Global state to track selected filters
  const globalState = {
	amenities: {},
	states: {},
	cities: {}
  };
  
  function getStatus() {
	const statusUrl = `http://${HOST}:5001/api/v1/status`;
	$.get(statusUrl, (data) => {
	  if (data.status == "OK") {
		$('#api_status').addClass('available');
	  } else {
		$('#api_status').removeClass('available');
	  }
	});
  }
  
  function bindAmenityCheckboxChange() {
	$('.amenities .popover input').change(function () {
	  const amenityName = $(this).attr("data-name").replace("_", " ");
	  const amenityId = $(this).attr("data-id");
  
	  if ($(this).is(":checked")) {
		globalState.amenities[amenityName] = amenityId;
	  } else {
		delete globalState.amenities[amenityName];
	  }
  
	  updateAmenitiesText();
	});
  }
  
  function bindLocationCheckboxChange() {
	$('.locations .popover input').change(function () {
	  const isState = $(this).closest('.popover').hasClass('states');
	  const locationName = $(this).attr("data-name").replace("_", " ");
	  const locationId = $(this).attr("data-id");
	  const targetState = isState ? globalState.states : globalState.cities;
  
	  if ($(this).is(":checked")) {
		targetState[locationName] = locationId;
	  } else {
		delete targetState[locationName];
	  }
	});
  }
  
  function updateAmenitiesText() {
	const amenitiesText = Object.keys(globalState.amenities).sort().join(', ');
	$('.amenities h4').text(amenitiesText);
  }
  
  function bindSearchButton() {
	$('button').click(() => {
	  const amenities = Object.values(globalState.amenities);
	  const states = Object.values(globalState.states);
	  const cities = Object.values(globalState.cities);
	  postAmenities(states, cities, amenities);
	});
  }
  
  function postAmenities(states = [], cities = [], amenities = []) {
	const PLACES_URL = `http://${HOST}:5001/api/v1/places_search/`;
	$.ajax({
	  url: PLACES_URL,
	  type: 'POST',
	  contentType: 'application/json',
	  data: JSON.stringify({ states, cities, amenities }),
	  success: (data) => {
		renderPlaces(data);
	  },
	  error: (error) => {
		console.error("Error fetching places:", error);
	  }
	});
  }
  
  function renderPlaces(places) {
	const $placesSection = $('SECTION.places');
	$placesSection.empty();
  
	places.forEach(place => {
	  const placeHtml = createPlaceHtml(place);
	  $placesSection.append(placeHtml);
	  bindReviewToggle(place.id);
	});
  }
  
  function createPlaceHtml(place) {
	return `
	  <article>
		<div class="title_box">
		  <h2>${place.name}</h2>
		  <div class="price_by_night">$${place.price_by_night}</div>
		</div>
		<div class="information">
		  <div class="max_guest">${place.max_guest} Guest(s)</div>
		  <div class="number_rooms">${place.number_rooms} Bedroom(s)</div>
		  <div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>
		</div>
		<div class="description">${place.description}</div>
		<div>
			<span class="reviews">
		  		<h2>Reviews</h2>
		  		<div class="reviews-toggle" data-place-id="${place.id}">show</div>
			</span>
		  <ul></ul>
		</div>
	  </article>`;
  }
  
  function bindReviewToggle(placeId) {
	$(`.reviews-toggle[data-place-id="${placeId}"]`).off('click').on('click', function() {
		const $this = $(this);
		const $reviewsList = $this.parent().next('ul');
		const shouldHide = $this.text().trim().toLowerCase() === "hide";
  
	  if (shouldHide) {
		$reviewsList.empty();
		$this.text("show");
	  } else {
		getReviews(placeId, $reviewsList);
		$this.text("hide");
	  }
	});
  }
  
  function getReviews(placeId, $ulElement) {
	const reviewsUrl = `http://${HOST}:5001/api/v1/places/${placeId}/reviews`;
	$.get(reviewsUrl, (reviews) => {
	  $ulElement.empty();
	  reviews.forEach(review => {
		$ulElement.append(`<li>${review.text}</li>`);
	  });
	});
  }
  
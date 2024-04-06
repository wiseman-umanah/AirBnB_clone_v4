$('document').ready( () => {
	const status = 'http://0.0.0.0:5001/api/v1/status'
	$.get(status, function(data) {
		if (data['status'] == "OK")
			$('#api_status').addClass('available')
		else $('#api_status').removeClass('available')

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
})})})

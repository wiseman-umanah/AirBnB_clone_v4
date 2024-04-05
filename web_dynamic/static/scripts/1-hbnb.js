$('document').ready( () => {
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
})})

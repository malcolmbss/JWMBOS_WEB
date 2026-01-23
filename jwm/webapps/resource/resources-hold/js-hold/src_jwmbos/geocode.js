function initMap()
  {
    const input = document.getElementById("pac-input");
    const options =
                    {
                       fields: ["formatted_address", "geometry", "name"],
                       strictBounds: false,
                       types: ["(cities)"],
                    };

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");

  infowindow.setContent(infowindowContent);

  autocomplete.addListener("place_changed", () =>
  {
    infowindow.close();
    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location)
    {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent = place.formatted_address;

    searchRegions( document.getElementById("regionListTagUid").value,
                  place.formatted_address,
                  place.geometry.location );
  });
}

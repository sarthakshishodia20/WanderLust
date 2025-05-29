// Check if mapToken and coordinates are available
if (typeof mapToken === 'undefined' || !mapToken) {
  console.error('Map token is not defined');
  document.getElementById('map').innerHTML = '<div class="alert alert-warning">Map cannot be loaded: Missing API token</div>';
} else if (typeof coordinates === 'undefined' || !coordinates || coordinates.length !== 2) {
  console.error('Coordinates are not properly defined:', coordinates);
  document.getElementById('map').innerHTML = '<div class="alert alert-warning">Map cannot be loaded: Invalid coordinates</div>';
} else {
  try {
    // Set the access token
    mapboxgl.accessToken = mapToken;

    console.log('Initializing map with coordinates:', coordinates);

    // Create the map
    const map = new mapboxgl.Map({
      container: "map", // The ID of the container element
      style: "mapbox://styles/mapbox/streets-v12", // Changed to a more reliable style
      zoom: 13, // Initial zoom level
      center: coordinates, // Coordinates for the map's center [longitude, latitude]
    });

    // Add navigation controls to the map (zoom and rotation controls)
    map.addControl(new mapboxgl.NavigationControl());

    // Create a popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<div style="text-align: center;">
        <h6>Your Airbnb Location</h6>
        <p>Lat: ${coordinates[1]}<br>Lng: ${coordinates[0]}</p>
        <p><strong>Enjoy your stay!</strong></p>
      </div>`
    );

    // Add a marker with popup
    new mapboxgl.Marker({ color: '#fe424d' })
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map);

    // Handle map load event
    map.on('load', function() {
      console.log('Map loaded successfully');
    });

    // Handle map errors
    map.on('error', function(e) {
      console.error('Map error:', e);
      document.getElementById('map').innerHTML = '<div class="alert alert-danger">Map failed to load. Please try again later.</div>';
    });

  } catch (error) {
    console.error('Error initializing map:', error);
    document.getElementById('map').innerHTML = '<div class="alert alert-danger">Map initialization failed: ' + error.message + '</div>';
  }
}



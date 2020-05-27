(() => {
  const script = document.createElement("script");
  let map = null;
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCwabhh_jH8791rdu_pSL9JaLQL0330FEw&callback=initMap`;
  script.defer = true;
  script.async = true;
  window.initMap = function () {
    // JS API is loaded and available
    map = new google.maps.Map(document.getElementById("map"), {
      //37.5535865,126.962246
      //37.5482152,126.9858063
      center: { lat: 37.5482152, lng: 126.9858063 },
      zoom: 13,
    });
  };

  // Append the 'script' element to 'head'
  document.head.appendChild(script);
})();

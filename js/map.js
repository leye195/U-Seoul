(() => {
  const script = document.createElement("script");
  const getContent = (txt) => {
    return `<div id="content">
      <p style="font-weight:bold">${txt}</p>
    </div>`;
  };
  let map = null;

  window.initMap = function () {
    let coords = [
      { lat: 37.5826323, lng: 126.9831605, name: "북촌 한옥마을" },
      { lat: 37.5808977, lng: 126.9898217, name: "창덕궁" },
      { lat: 37.551133, lng: 126.9877098, name: "서울 N타워" },
    ];
    // JS API is loaded and available
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 37.5482152, lng: 126.9858063 },
      zoom: 13,
    });

    for (let i = 0; i < coords.length; i++) {
      const marker = new google.maps.Marker({
          position: { lat: coords[i].lat, lng: coords[i].lng },
          map,
        }),
        info = new google.maps.InfoWindow({
          content: getContent(coords[i].name),
        });

      marker.addListener("click", () => {
        info.open(map, marker);
      });
      info.open(map, marker);
    }
  };
  // Append the 'script' element to 'head'
  //37.5826323,126.9831605 북촌
  //37.5808977,126.9898217 창덕
  //37.551133,126.9877098 n 타워
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCwabhh_jH8791rdu_pSL9JaLQL0330FEw&callback=initMap`;
  script.defer = true;
  script.async = true;
  document.head.appendChild(script);
})();

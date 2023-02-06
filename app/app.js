mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lzZGV2ZWxvcG1hcCIsImEiOiJjamZrdmp3bWYwY280MndteDg1dGlmdzF3In0.4m2zz_ISrUCXyz27MdL8_Q';



$( "#closepopup" ).click(function() {
  $( "#popup" ).slideToggle( "slow", function() {});
});

$(document).ready(function(){
    $('.modal').modal();
  });


$('#downloadLink').click(function() {
        var img = map.getCanvas().toDataURL('image/png')
        this.href = img
    })

$( ".scoring_section" ).click(function() {
  var instance = M.Collapsible.getInstance($('.country_scores_main')); 
instance.close();
});

/* $( "#country_name" ).click(function() {
  var instance = M.Collapsible.getInstance($('.manual_scores')); 
instance.close();
}); */

$(document).ready(function(){
    $('.tooltipped').tooltip();
  });
  $(document).ready(function(){
    $('.collapsible').collapsible();
  });


  $( ".search_icon" ).click(function() {
    $( "#geocoder" ).slideToggle( "slow", function() {});
    $( "#country_var_dropdown" ).hide();
    $( ".sidebar" ).hide();
    $( ".calculation-box" ).hide();
  });

  $( ".legend_icon" ).click(function() {
    $( ".legend" ).slideToggle( "slow", function() {});
  });
  $( ".zoom_icon" ).click(function() {

map.flyTo({
    center: [20,20],
    zoom:1.5
});

});

var filterEl = document.getElementById('feature-filter');
var listingEl = document.getElementById('feature-listing');


function normalize(str) {
    return str.trim().toLowerCase();
}


function renderListings(features) {

  if (features.length) {
    features.forEach(function (feature) {
      var prop = feature.properties;
      var item = document.createElement("a");
      item.href = prop.wikipedia;
      item.target = "_blank";
      item.textContent = prop.adm0_code + " (" + prop.adm0_code + ")";
      item.addEventListener("mouseover", function () {
        popup
          .setLngLat(getFeatureCenter(feature))
          .setText(
           'klajlkdas'
          )
          .addTo(map);
      });

    });


  } 

}


function getFeatureCenter(feature) {
	let center = [];
	let latitude = 0;
	let longitude = 0;
	let height = 0;
	let coordinates = [];
	feature.geometry.coordinates.forEach(function (c) {
		let dupe = [];
		if (feature.geometry.type === "MultiPolygon")
			dupe.push(...c[0]); //deep clone to avoid modifying the original array
		else 
			dupe.push(...c); //deep clone to avoid modifying the original array
		dupe.splice(-1, 1); //features in mapbox repeat the first coordinates at the end. We remove it.
		coordinates = coordinates.concat(dupe);
	});
	if (feature.geometry.type === "Point") {
		center = coordinates[0];
	}
	else {
		coordinates.forEach(function (c) {
			latitude += c[0];
			longitude += c[1];
		});
		center = [latitude / coordinates.length, longitude / coordinates.length];
	}

	return center;
}

function getUniqueFeatures(array, comparatorProperty) {
  var existingFeatureKeys = {};
  // Because features come from tiled vector data, feature geometries may be split
  // or duplicated across tile boundaries and, as a result, features may appear
  // multiple times in query results.
  var uniqueFeatures = array.filter(function (el) {
    if (existingFeatureKeys[el.properties[comparatorProperty]]) {
      return false;
    } else {
      existingFeatureKeys[el.properties[comparatorProperty]] = true;
      return true;
    }
  });

  return uniqueFeatures;
}





var zoomThreshold = 4;

var bounds = [
[-180, -70], // Southwest coordinates
[180, 80] // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [18, 23], // starting position[35.890, -75.664]
    zoom: 1.78, // starting zoom
    hash: true,
    minZoom: 1,
    maxZoom: 18,
    opacity: 0.1,


    preserveDrawingBuffer: true
});




var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
document.getElementById('geocoder').addEventListener('click', function () {

  map.flyTo({
      center: [20,20],
      zoom:1.5
  });

});

var country_iso3_fi = "";
var country_id_fi = "";



map.on('load', function() {


  map.addSource('single-point', {
          "type": "geojson",
          "data": {
              "type": "FeatureCollection",
              "features": []
          }
      });
      map.addLayer({
             "id": "point",
             "source": "single-point",
             "type": "circle",
             "paint": {
                 "circle-radius": 0,
                 "circle-color": "#007cbf"
             }
         });









var miolayer = map.getLayer('point');


        geocoder.on('result', function(ev) {
          map.getSource('single-point').setData(ev.result.geometry);

          var latlon = ev.result.center;
          console.info(latlon)
          var lat = latlon[0]
          var lon = latlon[1]
          var pointsel = map.project(latlon)

          var ll = new mapboxgl.LngLat(lat, lon);
        

    map.fire('click', { lngLat: ll, point:pointsel })



        });

        map.loadImage(
          'https://lucageo.github.io/cep/img/mask3.png',
          (err, image) => {
          // Throw an error if something goes wrong.
          if (err) throw err;
           
          // Add the image to the map style.
          map.addImage('pattern', image);
        

        map.addLayer({
          "id": "mask_ben",
          "type": "fill",
          "source": {
              "type": "vector",
              "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=africa_platform:mask_ben&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
              },
          "source-layer": "mask_ben",

          'paint': {
          'fill-pattern': 'pattern',
          'fill-opacity': 0.1,
          }
    
        });
      }
      );

  
  


      map.addLayer({
        "id": "benin_bound",
        "type": "fill",
        "source": {
            "type": "vector",
            "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_analyst:benin_bound&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
            },
        "source-layer": "benin_bound",
  
        'paint': { 
          'fill-color': '#FFFFFF',
          'fill-outline-color': '#cbcbcb',
          
       
          'fill-opacity': 0.0,
  
  
                  },
                  
  
    }, 'waterway-label');


  map.addLayer({
      "id": "dopa_geoserver_wdpa_master_202101_o1",
      "type": "fill",
      "source": {
          "type": "vector",
          "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_explorer_3:dopa_geoserver_wdpa_master_202101_o1&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
          },
      "source-layer": "dopa_geoserver_wdpa_master_202101_o1",

      'paint': { 
        'fill-color': '#FFF',
       // 'fill-outline-color': 'black',
    
                      'fill-opacity': 0.1,


                },
                'filter': ["in", "iso3",'xxx'],

  }, 'waterway-label');



 map.addLayer({
        "id": "grid_points_3",
        "type": "circle",
        "source": {
            "type": "vector",
            "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_analyst:grid_benin_energy_latest_feb2&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
            },
        "source-layer": "grid_benin_energy_latest_feb2",
        'paint': {
          // make circles larger as the user zooms from z12 to z22
          'circle-radius': {
            'base': 1,
            'stops': [[8, 5], [12, 40]]
          }, 'circle-color': '#ffffff',


         'circle-opacity': 0.0
      },//"filter":["in", "id_gaul", ""]

      'filter': [
  'all',
  ["in", "adm0_code", ""]
],

    }, 'waterway-label');


    map.addLayer({
      "id": "pa_buf",
      "type": "circle",
      "source": {
          "type": "vector",
          "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_analyst:buf_in_pa_points&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
          },
      "source-layer": "buf_in_pa_points",
      'paint': {
        // make circles larger as the user zooms from z12 to z22
        'circle-radius': {
        'base': 2,
        'stops': [[1, 2], [7, 4]]
        }, 'circle-color': '#595958',

       'circle-opacity': 0.8
    },//"filter":["in", "id_gaul", ""]

    'filter': ["in", "adm0_code",0],

  }, 'waterway-label');


    map.addLayer({
        "id": "point_selecte_by_drow",
        "type": "circle",
        "source": {
            "type": "vector",
            "tiles": ["https://geospatial.jrc.ec.europa.eu/geoserver/gwc/service/wmts?layer=dopa_analyst:grid_benin_energy_latest_feb2&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"]
            },
        "source-layer": "grid_benin_energy_latest_feb2",
        'paint': {
          // make circles larger as the user zooms from z12 to z22
          'circle-radius': {
            'base': 1,
            'stops': [[8, 7], [12, 50]]
          },
        'circle-color': '#3bb2d0',

         'circle-opacity': 0.4
      },"filter":["in", "adm0_code", ""]

    }, 'grid_points_3');



    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var country_iso3 = urlParams.get('iso3')
    var pa_bb_url = "https://geospatial.jrc.ec.europa.eu/geoserver/wfs?request=getfeature&version=1.0.0&service=wfs&typename=dopa_explorer_3:global_dashboard&propertyname=iso3_digit&SORTBY=iso3_digit&CQL_FILTER=iso3_digit='"+country_iso3+"'&outputFormat=application%2Fjson";
    $.ajax({
        url: pa_bb_url,
        dataType: 'json',
        success: function(d) {
                var x1 = d.features[0].properties.bbox[0];
                var x2 = d.features[0].properties.bbox[1];
                var x3 = d.features[0].properties.bbox[2];
                var x4 = d.features[0].properties.bbox[3];
                map.fitBounds([[x3,x4],[x1,x2]])
          },
      });
    setTimeout(function(){

      var queryString = window.location.search;
      var urlParams = new URLSearchParams(queryString);
      var country_iso3 = urlParams.get('iso3')

      if (window.location.href.indexOf("iso3") === -1){
        lat = 0
        lon = 0
        center = {lng: lat, lat: lon}
        var pointsel = map.project(center)
        var ll = new mapboxgl.LngLat(lat, lon);
 
    }else{
        var center = map.getCenter().wrap()
        var lat = center.lat
        var lon = center.lng
        var pointsel = map.project(center)
        var ll = new mapboxgl.LngLat(lat, lon);
         map.fire('click', { lngLat: ll, point:pointsel });
    }

    }, 4000);
      
    map.on("moveend", function () {
    var features = map.queryRenderedFeatures({ layers: ["benin_bound"] });

    if (features) {
      var uniqueFeatures = getUniqueFeatures(features, "adm0_code");
      renderListings(uniqueFeatures);
      airports = uniqueFeatures;
    }
  });

  
  var tilesLoaded = map.areTilesLoaded();
  if (tilesLoaded == true){
    setTimeout(function(){
      $("#map").busyLoad("hide", {animation: "fade"});
      
    }, 300);

 }else{
    setTimeout(function(){
      $("#map").busyLoad("hide", {animation: "fade"});
      
    }, 1000);
     
  }


// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
closeButton: false,
closeOnClick: false
});
 
map.on('mouseenter', 'grid_points_3', function (e) {
$('#popup').show();
map.getCanvas().style.cursor = 'pointer';
 
var coordinates = e.features[0].geometry.coordinates.slice();

var  irrigation = e.features[0].properties.irrigation
var  groundw =e.features[0].properties.groundw
var  access =e.features[0].properties.access
var  access_inv =e.features[0].properties.access_inv
var  lives =e.features[0].properties.lives
var  tempano =e.features[0].properties.tempano
var  solar =e.features[0].properties.solar
var  slope =e.features[0].properties.slope
var  powerplant =e.features[0].properties.powerplant
var  popdens =e.features[0].properties.popdens
var  pca =e.features[0].properties.pca
var  natarea =e.features[0].properties.natarea
var  intactf =e.features[0].properties.intactf
var  industrial =e.features[0].properties.industrial
var  drought =e.features[0].properties.drought
var  health =e.features[0].properties.health
var  grid =e.features[0].properties.grid
var  elevation =e.features[0].properties.elevation
var  education =e.features[0].properties.education
var  edu_no_e =e.features[0].properties.edu_no_e
var  distance =e.features[0].properties.distance
var  distance_inv =e.features[0].properties.distance_inv
var  conflict =e.features[0].properties.conflict
var  wind =e.features[0].properties.wind
var  hydro =e.features[0].properties.hydro
var  connect =e.features[0].properties.connect


var  irrigation_w = (e.features[0].properties.irrigation)*100;
var  groundw_w  = (e.features[0].properties.groundw)*100;
var  access_w  = (e.features[0].properties.access)*100;
var  access_inv_w  = (e.features[0].properties.access_inv)*100;
var  lives_w  = (e.features[0].properties.lives)*100;
var  tempano_w  =(e.features[0].properties.tempano)*100;
var  solar_w  =(e.features[0].properties.solar)*100;
var  slope_w  =(e.features[0].properties.slope)*100;
var  powerplant_w  =(e.features[0].properties.powerplant)*100;
var  popdens_w  =(e.features[0].properties.popdens)*100;
var  pca_w  =(e.features[0].properties.pca)*100;
var  natarea_w  =(e.features[0].properties.natarea)*100;
var  intactf_w  =(e.features[0].properties.intactf)*100;
var  industrial_w  =(e.features[0].properties.industrial)*100;
var  drought_w  =(e.features[0].properties.drought)*100;
var  health_w  =(e.features[0].properties.health)*100;
var  grid_w  =(e.features[0].properties.grid)*100;
var  elevation_w  =(e.features[0].properties.elevation)*100;
var  education_w  =(e.features[0].properties.education)*100;
var  edu_no_e_w  =(e.features[0].properties.edu_no_e)*100;
var  distance_w  =(e.features[0].properties.distance)*100;
var  distance_inv_w  =(e.features[0].properties.distance_inv)*100;
var  conflict_w  =(e.features[0].properties.conflict)*100;
var  connect_w  =(e.features[0].properties.connect)*100;
var  wind_w  =(e.features[0].properties.wind)*100;
var  hydro_w  =(e.features[0].properties.hydro)*100;






while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}

$('#popup').html(
  
  " <ul><li><div id = 'country_scores_main_b'>Market supply </div>"+
        "<div><span class = 'coll_item_title' > Close to the existing grid</span>"+
          "<div id='progressbar'><div style='width:"+distance_w+"%'></div></div>"+
          "<div><span class = 'coll_item_title' > Far from the existing grid</span>"+
          "<div id='progressbar'><div style='width:"+distance_inv_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Power plants</span>"+
          "<div id='progressbar'><div style='width:"+powerplant_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Solar potential</span>"+
          "<div id='progressbar'><div style='width:"+solar_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Wind potential</span>"+
          "<div id='progressbar'><div style='width:"+wind_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Hydropower potential (not yet available)</span>"+
          "<div id='progressbar'><div style='width:"+hydro_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Most accessible areas</span>"+
          "<div id='progressbar'><div style='width:"+access_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Least accessible areas</span>"+
          "<div id='progressbar'><div style='width:"+access_inv_w+"%'></div></div>"+
          "<span class = 'coll_item_title' > Electricity Grid</span>"+
          "<div id='progressbar'><div style='width:"+grid_w+"%'></div></div>"+
          "</div></li></ul>"+
          " <ul><li><div id = 'country_scores_main_b'>Market demand </div>"+
          "<div><span class = 'coll_item_title' >Industrial Areas</span>"+
            "<div id='progressbar'><div style='width:"+industrial_w+"%'></div></div>"+
            "<span class = 'coll_item_title' > Population</span>"+
            "<div id='progressbar'><div style='width:"+popdens_w+"%'></div></div>"+
            "<span class = 'coll_item_title' > Health centers</span>"+
            "<div id='progressbar'><div style='width:"+health_w+"%'></div></div>"+
            "<span class = 'coll_item_title' > Educational facilities</span>"+
            "<div id='progressbar'><div style='width:"+education_w+"%'></div></div>"+
            "<span class = 'coll_item_title' > Educational facilities without electricity</span>"+
            "<div id='progressbar'><div style='width:"+edu_no_e_w+"%'></div></div>"+
            "<span class = 'coll_item_title' > Area equipped for irrigation</span>"+
            "<div id='progressbar'><div style='width:"+irrigation_w+"%'></div></div>"+
            "<span class = 'coll_item_title' > Groundwater Irrigation</span>"+
            "<div id='progressbar'><div style='width:"+groundw_w+"%'></div></div>"+
            "<span class = 'coll_item_title' > Livestock</span>"+
            "<div id='progressbar'><div style='width:"+lives_w+"%'></div></div>"+
            "</div></li></ul>"+
            " <ul><li><div id = 'country_scores_main_b'>Environmental and Climate factors​</div>"+
            "<div><span class = 'coll_item_title' >Elevation</span>"+
              "<div id='progressbar'><div style='width:"+elevation_w+"%'></div></div>"+
              "<span class = 'coll_item_title' > Slope</span>"+
              "<div id='progressbar'><div style='width:"+slope_w+"%'></div></div>"+
              "<span class = 'coll_item_title' > Natural Areas</span>"+
              "<div id='progressbar'><div style='width:"+natarea_w+"%'></div></div>"+
              "<span class = 'coll_item_title' > Intact Moist Forest</span>"+
              "<div id='progressbar'><div style='width:"+intactf_w+"%'></div></div>"+
              "<span class = 'coll_item_title' > Protected and Conserved Areas</span>"+
              "<div id='progressbar'><div style='width:"+pca_w+"%'></div></div>"+
              "<span class = 'coll_item_title' > Temperature Anomalies</span>"+
              "<div id='progressbar'><div style='width:"+tempano_w+"%'></div></div>"+
              "<span class = 'coll_item_title' > Drought Risk</span>"+
              "<div id='progressbar'><div style='width:"+drought_w+"%'></div></div>"+
              "<span class = 'coll_item_title' > Water presence (not yet available)</span>"+
              "<div id='progressbar'><div style='width:0%'></div></div>"+
              "</div></li></ul>"+
              " <ul><li><div id = 'country_scores_main_b'>Socio-political aspects​</div>"+
              "<div><span class = 'coll_item_title' >Food Security​ (not yet available)</span>"+
                "<div id='progressbar'><div style='width:0%'></div></div>"+
                "<span class = 'coll_item_title' > Armed conflict density</span>"+
                "<div id='progressbar'><div style='width:"+conflict_w+"%'></div></div>"+
                "<span class = 'coll_item_title' > Refugee camps (not yet available)</span>"+
                "<div id='progressbar'><div style='width:0%'></div></div>"+
                "<span class = 'coll_item_title' > Connectivity</span>"+
                "<div id='progressbar'><div style='width:"+connect_w+"%'></div></div>"+
                "</div></li></ul>"

)

});
 
map.on('mouseleave', 'grid_points_3', function () {
map.getCanvas().style.cursor = '';


});



var layer_country = document.getElementById('layer_country');
layer_country.addEventListener('change', function() {
  var layer_country_value = document.getElementById('layer_country').value;
  map.setPaintProperty('benin_bound', 'fill-color', ['interpolate',['linear'],['get', layer_country_value],0, '#ffffd4',10, '#ffefb5',50, '#ffde96',100, '#fec46c',150, '#fea73f',250, '#f68c23',350, '#e67217',500, '#d25a0c',750, '#b64708',1000, '#993404']);
});


$('#dddd').hide();



var max_irrigation = 0
var max_groundw = 0
var max_access = 0
var max_access_inv = 0
var max_lives = 0
var max_tempano = 0
var max_solar = 0
var max_slope = 0
var max_powerplant = 0
var max_popdens = 0
var max_pca = 0
var max_natarea = 0
var max_intactf = 0
var max_industrial = 0
var max_drought = 0
var max_health = 0
var max_grid = 0
var max_elevation = 0
var max_education = 0
var max_edu_no_e = 0
var max_distance = 0
var max_distance_inv = 0
var max_conflict = 0
var max_wind = 0
var max_hydro = 0
var max_connect = 0

var min_irrigation = 0
var min_groundw = 0
var min_access = 0
var min_access_inv = 0
var min_lives = 0
var min_tempano = 0
var min_solar = 0
var min_slope = 0
var min_powerplant = 0
var min_popdens = 0
var min_pca = 0
var min_natarea = 0
var min_intactf = 0
var min_industrial = 0
var min_drought = 0
var min_health = 0
var min_grid = 0
var min_elevation = 0
var min_education = 0
var min_edu_no_e = 0
var min_distance = 0
var min_distance_inv = 0
var min_conflict = 0
var min_wind = 0
var min_hydro = 0
var min_connect = 0

var mean_irrigation = 0
var mean_groundw = 0
var mean_access = 0
var mean_access_inv = 0
var mean_lives = 0
var mean_tempano = 0
var mean_solar = 0
var mean_slope = 0
var mean_powerplant = 0
var mean_popdens = 0
var mean_pca = 0
var mean_natarea = 0
var mean_intactf = 0
var mean_industrial = 0
var mean_drought = 0
var mean_health = 0
var mean_grid = 0
var mean_elevation = 0
var mean_education = 0
var mean_edu_no_e = 0
var mean_distance = 0
var mean_distance_inv = 0
var mean_conflict = 0
var mean_wind = 0
var mean_hydro = 0
var mean_connect = 0



function irrigation_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.irrigation);
  var max = Math.max.apply(null, vals);
  return max
};

function groundw_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.groundw);
  var max = Math.max.apply(null, vals);
  return max
};

function access_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.access);
  var max = Math.max.apply(null, vals);
  return max
};
function access_inv_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.access_inv);
  var max = Math.max.apply(null, vals);
  return max
};
function lives_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.lives);
  var max = Math.max.apply(null, vals);
  return max
};


function tempano_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.tempano);
  var max = Math.max.apply(null, vals);
  return max
};

function solar_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.solar);
  var max = Math.max.apply(null, vals);
  return max
};

function slope_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.slope);
  var max = Math.max.apply(null, vals);
  return max
};

function powerplant_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.powerplant);
  var max = Math.max.apply(null, vals);
  return max
};

function popdens_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.popdens);
  var max = Math.max.apply(null, vals);
  return max
};

function pca_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.pca);
  var max = Math.max.apply(null, vals);
  return max
};

function natarea_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.natarea);
  var max = Math.max.apply(null, vals);
  return max
};

function intactf_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.intactf);
  var max = Math.max.apply(null, vals);
  return max
};

function industrial_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.industrial);
  var max = Math.max.apply(null, vals);
  return max
};


function drought_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.drought);
  var max = Math.max.apply(null, vals);
  return max
};

function health_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.health);
  var max = Math.max.apply(null, vals);
  return max
};

function grid_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.grid);
  var max = Math.max.apply(null, vals);
  return max
};
function elevation_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.elevation);
  var max = Math.max.apply(null, vals);
  return max
};

function education_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.education);
  var max = Math.max.apply(null, vals);
  return max
};
function edu_no_e_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.edu_no_e);
  var max = Math.max.apply(null, vals);
  return max
};

function distance_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.distance);
  var max = Math.max.apply(null, vals);
  return max
};
function distance_inv_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.distance_inv);
  var max = Math.max.apply(null, vals);
  return max
};

function conflict_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.conflict);
  var max = Math.max.apply(null, vals);
  return max
};

function wind_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.wind);
  var max = Math.max.apply(null, vals);
  return max
};
function hydro_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.hydro);
  var max = Math.max.apply(null, vals);
  return max
};

function connect_max(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.connect);
  var max = Math.max.apply(null, vals);
  return max
};


function irrigation_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.irrigation);
  var min = Math.min.apply(null, vals);
  return min
};

function groundw_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.groundw);
  var min = Math.min.apply(null, vals);
  return min
};

function access_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.access);
  var min = Math.min.apply(null, vals);
  return min
};
function access_inv_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.access_inv);
  var min = Math.min.apply(null, vals);
  return min
};

function lives_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.lives);
  var min = Math.min.apply(null, vals);
  return min
};


function tempano_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.tempano);
  var min = Math.min.apply(null, vals);
  return min
};

function solar_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.solar);
  var min = Math.min.apply(null, vals);
  return min
};

function slope_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.slope);
  var min = Math.min.apply(null, vals);
  return min
};

function powerplant_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.powerplant);
  var min = Math.min.apply(null, vals);
  return min
};

function popdens_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.popdens);
  var min = Math.min.apply(null, vals);
  return min
};

function pca_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.pca);
  var min = Math.min.apply(null, vals);
  return min
};

function natarea_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.natarea);
  var min = Math.min.apply(null, vals);
  return min
};

function intactf_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.intactf);
  var min = Math.min.apply(null, vals);
  return min
};

function industrial_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.industrial);
  var min = Math.min.apply(null, vals);
  return min
};


function drought_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.drought);
  var min = Math.min.apply(null, vals);
  return min
};

function health_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.health);
  var min = Math.min.apply(null, vals);
  return min
};

function grid_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.grid);
  var min = Math.min.apply(null, vals);
  return min
};
function elevation_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.elevation);
  var min = Math.min.apply(null, vals);
  return min
};

function education_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.education);
  var min = Math.min.apply(null, vals);
  return min
};
function edu_no_e_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.edu_no_e);
  var min = Math.min.apply(null, vals);
  return min
};
function distance_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.distance);
  var min = Math.min.apply(null, vals);
  return min
};
function distance_inv_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.distance_inv);
  var min = Math.min.apply(null, vals);
  return min
};

function conflict_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.conflict);
  var min = Math.min.apply(null, vals);
  return min
};

function wind_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.wind);
  var min = Math.min.apply(null, vals);
  return min
};
function hydro_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.hydro);
  var min = Math.min.apply(null, vals);
  return min
};
function connect_min(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.connect);
  var min = Math.min.apply(null, vals);
  return min
};

function irrigation_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.irrigation);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function groundw_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.groundw);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function access_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.access);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function access_inv_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.access_inv);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function lives_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.lives);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function tempano_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.tempano);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};

function solar_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.solar);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};

function slope_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.slope);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};

function powerplant_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.powerplant);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function popdens_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.popdens);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function pca_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.pca);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};

function natarea_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.natarea);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function intactf_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.intactf);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function industrial_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.industrial);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};


function drought_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.drought);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function health_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.health);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function grid_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.grid);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function elevation_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.elevation);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function education_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.education);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function edu_no_e_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.edu_no_e);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function distance_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.distance);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function distance_inv_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.distance_inv);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function conflict_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.conflict);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function wind_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.wind);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};
function hydro_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.hydro);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};

function connect_mean(){
  var features = map.queryRenderedFeatures({ layers: ['grid_points_3'] });
  var vals = features.map(f => f.properties.connect);
  var total = 0;
    for(var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    var mean = total / vals.length;
  return mean
};


// mario

$("#country_name").click(function(){
 
  $(document).ready(function()
    {
      $("#distance_value").html(1);
      $('#distance_slider').val(1);
      $('.delvarico-distance').html("clear");
      $('.range-field-distance').css('opacity', '1');

      $("#distance_inv_value").html(1);
      $('#distance_inv_slider').val(1);
      $('.delvarico-distance_inv').html("clear");
      $('.range-field-distance_inv').css('opacity', '1');

      $("#powerplant_value").html(1);
      $('#powerplant_slider').val(1);
      $('.delvarico-powerplant').html("clear");
      $('.range-field-powerplant').css('opacity', '1');

      $("#solar_value").html(1);
      $('#solar_slider').val(1);
      $('.delvarico-solar').html("clear");
      $('.range-field-solar').css('opacity', '1');

      $("#wind_value").html(1);
      $('#wind_slider').val(1);
      $('.delvarico-wind').html("clear");
      $('.range-field-wind').css('opacity', '1');

      $("#hydro_value").html(1);
      $('#hydro_slider').val(1);
      $('.delvarico-hydro').html("clear");
      $('.range-field-hydro').css('opacity', '1');

      $("#connect_value").html(1);
      $('#connect_slider').val(1);
      $('.delvarico-connect').html("clear");
      $('.range-field-connect').css('opacity', '1');

      $("#access_value").html(1);
      $('#access_slider').val(1);
      $('.delvarico-access').html("clear");
      $('.range-field-access').css('opacity', '1');

      $("#access_inv_value").html(1);
      $('#access_inv_slider').val(1);
      $('.delvarico-access_inv').html("clear");
      $('.range-field-access_inv').css('opacity', '1');

      $("#grid_value").html(1);
      $('#grid_slider').val(1);
      $('.delvarico-grid').html("clear");
      $('.range-field-grid').css('opacity', '1');

      $("#industrial_value").html(1);
      $('#industrial_slider').val(1);
      $('.delvarico-industrial').html("clear");
      $('.range-field-industrial').css('opacity', '1');

      $("#popdens_value").html(1);
      $('#popdens_slider').val(1);
      $('.delvarico-popdens').html("clear");
      $('.range-field-popdens').css('opacity', '1');

      $("#health_value").html(1);
      $('#health_slider').val(1);
      $('.delvarico-health').html("clear");
      $('.range-field-health').css('opacity', '1');

      $("#education_value").html(1);
      $('#education_slider').val(1);
      $('.delvarico-education').html("clear");
      $('.range-field-education').css('opacity', '1');

      $("#edu_no_e_value").html(1);
      $('#edu_no_e_slider').val(1);
      $('.delvarico-edu_no_e').html("clear");
      $('.range-field-edu_no_e').css('opacity', '1');

      $("#irrigation_value").html(1);
      $('#irrigation_slider').val(1);
      $('.delvarico-irrigation').html("clear");
      $('.range-field-irrigation').css('opacity', '1');

      $("#groundw_value").html(1);
      $('#groundwn_slider').val(1);
      $('.delvarico-groundw').html("clear");
      $('.range-field-groundw').css('opacity', '1');

      $("#lives_value").html(1);
      $('#lives_slider').val(1);
      $('.delvarico-lives').html("clear");
      $('.range-field-lives').css('opacity', '1');

      $("#elevation_value").html(1);
      $('#elevation_slider').val(1);
      $('.delvarico-elevation').html("clear");
      $('.range-field-elevation').css('opacity', '1');

      $("#slope_value").html(1);
      $('#slope_slider').val(1);
      $('.delvarico-slope').html("clear");
      $('.range-field-slope').css('opacity', '1');

      $("#natarea_value").html(1);
      $('#natarea_slider').val(1);
      $('.delvarico-natarea').html("clear");
      $('.range-field-natarea').css('opacity', '1');

      $("#intactf_value").html(1);
      $('#intactf_slider').val(1);
      $('.delvarico-intactf').html("clear");
      $('.range-field-intactf').css('opacity', '1');

      $("#pca_value").html(1);
      $('#pca_slider').val(1);
      $('.delvarico-pca').html("clear");
      $('.range-field-pca').css('opacity', '1');

      $("#tempano_value").html(1);
      $('#tempano_slider').val(1);
      $('.delvarico-tempano').html("clear");
      $('.range-field-tempano').css('opacity', '1');

      $("#drought_value").html(1);
      $('#drought_slider').val(1);
      $('.delvarico-drought').html("clear");
      $('.range-field-drought').css('opacity', '1');


      $("#foodsec_value").html(1);
      $('#foodsec_th_slider').val(1);
      $('.delvarico-foodsec').html("clear");
      $('.range-field-foodsec').css('opacity', '1');

      $("#conflict_value").html(1);
      $('#conflict_slider').val(1);
      $('.delvarico-conflict').html("clear");
      $('.range-field-conflict').css('opacity', '1');

      $("#refugee_value").html(1);
      $('#refugee_slider').val(1);
      $('.delvarico-refugee').html("clear");
      $('.range-field-refugee').css('opacity', '1');
      
    

    });


  

setTimeout(function(){
    $('#submit').click();
    
        }, 1000);

});



  

  map.on('click', 'benin_bound', function(e) {

    window.history.replaceState(null, null, "?iso3="+e.features[0].properties.iso3);
    var pa_bb_url = "https://geospatial.jrc.ec.europa.eu/geoserver/wfs?request=getfeature&version=1.0.0&service=wfs&typename=dopa_explorer_3:global_dashboard&propertyname=iso3_digit&SORTBY=iso3_digit&CQL_FILTER=iso3_digit='"+e.features[0].properties.iso3+"'&outputFormat=application%2Fjson";
    $.ajax({
        url: pa_bb_url,
        dataType: 'json',
        success: function(d) {
                var x1 = d.features[0].properties.bbox[0];
                var x2 = d.features[0].properties.bbox[1];
                var x3 = d.features[0].properties.bbox[2];
                var x4 = d.features[0].properties.bbox[3];
                map.fitBounds([[x3,x4],[x1,x2]])
          },
      });

      map.setFilter('pa_buf', ["in", 'adm0_code', 0]);

      const busy_tabsx = 
        {
          'Computing spatial statistics': 'a',
          'Generating map tiles': 'a',
          'Extracting values': 'a',
          'Loading results': 'a',
          'Analysing data': 'a',
        };

      function getRandomProperty(busy_tabsx) {
        const keys = Object.keys (busy_tabsx);
        return keys[Math.floor(Math.random() * keys.length)];
      }
      
      var first = { fontawesome: 'fa fa-cog fa-spin fa-3x fa-fw', textPosition: "right",text: 'Computing spatial statistics...', fontSize: '1.5rem', color:'#d0d0d0',background:'#000407cf'}
      var second = { fontawesome: 'fa fa-cog fa-spin fa-3x fa-fw', textPosition: "right",text: 'Extracting values...', fontSize: '1.5rem', color:'#d0d0d0',background:'#000407cf'}
      var third = { fontawesome: 'fa fa-cog fa-spin fa-3x fa-fw', textPosition: "right",text: 'Generating map tiles...', fontSize: '1.5rem', color:'#d0d0d0',background:'#000407cf'}
      var forth = { fontawesome: 'fa fa-cog fa-spin fa-3x fa-fw', textPosition: "right",text: 'Loading results...', fontSize: '1.5rem', color:'#d0d0d0',background:'#000407cf'}

      var loading = true;
      if (loading) {
        setTimeout(() => {
          $("#map").busyLoad("show", first);
        }, 0);
        setTimeout(() => {
          $("#map").busyLoad("hide").busyLoad("show", second);
        }, 1200);
        setTimeout(() => {
          $("#map").busyLoad("hide").busyLoad("show", third);
        }, 2800);
        setTimeout(() => {
          $("#map").busyLoad("hide").busyLoad("show", forth);
        }, 3800);
      }

      
   
 
  

      map.setPaintProperty(
      'grid_points_3',
      'circle-opacity',0,
      'circle-color', '#ffffff');
  
    setTimeout(function(){
    $('#country_name').click();

        }, 2000);

    // map.setPaintProperty('grid_points_3', 'circle-color', '#ffffff');
    
    $(document).ready(function(){
    $('.collapsible').collapsible();
  });
   
    $( "#country_var_dropdown" ).hide();
    $( ".geocoder" ).hide();
    $( ".top_dropdown" ).show();
    $( "#polygon_out_main" ).empty();
    $( "#polygon_out_main_2" ).empty();
    $( ".calculation-box" ).hide();


    var filter_wdpa = ["in", 'iso3', 'xxx'];
      map.setFilter('dopa_geoserver_wdpa_master_202101_o1', filter_wdpa);



  // For Range input
  $("#distance_slider").on("input", function() {
    var distance = this.value;
    $("#distance_value").html(distance);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#distance_inv_slider").on("input", function() {
    var distance_inv = this.value;
    $("#distance_inv_value").html(distance_inv);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });

  $("#powerplant_slider").on("input", function() {
    var powerplant = this.value;
    $("#powerplant_value").html(powerplant);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });

  $("#solar_slider").on("input", function() {
    var solar = this.value;
    $("#solar_value").html(solar);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#wind_slider").on("input", function() {
    var wind = this.value;
    $("#wind_value").html(wind);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });

  $("#hydro_slider").on("input", function() {
    var hydro = this.value;
    $("#hydro_value").html(hydro);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#connect_slider").on("input", function() {
    var connect = this.value;
    $("#connect_value").html(connect);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#access_slider").on("input", function() {
    var access = this.value;
    $("#access_value").html(access);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#access_inv_slider").on("input", function() {
    var access_inv = this.value;
    $("#access_inv_value").html(access_inv);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#grid_slider").on("input", function() {
    var grid = this.value;
    $("#grid_value").html(grid);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });

  //------------------------------------------------------------------
  $("#industrial_slider").on("input", function() {
    var industrial = this.value;
    $("#industrial_value").html(industrial);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#popdens_slider").on("input", function() {
    var popdens = this.value;
    $("#popdens_value").html(popdens);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#health_slider").on("input", function() {
    var health = this.value;
    $("#health_value").html(health);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });

  $("#education_slider").on("input", function() {
    var education = this.value;
    $("#education_value").html(education);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#edu_no_e_slider").on("input", function() {
    var edu_no_e = this.value;
    $("#edu_no_e_value").html(edu_no_e);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#irrigation_slider").on("input", function() {
    var irrigation = this.value;
    $("#irrigation_value").html(irrigation);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });

  $("#lives_slider").on("input", function() {
    var lives = this.value;
    $("#lives_value").html(lives);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });

  $("#groundw_slider").on("input", function() {
    var groundw = this.value;
    $("#groundw_value").html(groundw);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });

  //---------------------------------------------------------------------
  $("#elevation_slider").on("input", function() {
    var elevation = this.value;
    $("#elevation_value").html(elevation);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#slope_slider").on("input", function() {
    var slope = this.value;
    $("#slope_value").html(slope);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });

  $("#natarea_slider").on("input", function() {
    var natarea = this.value;
    $("#natarea_value").html(natarea);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#pca_slider").on("input", function() {
    var pca = this.value;
    $("#pca_value").html(pca);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });

  $("#intactf_slider").on("input", function() {
    var intactf = this.value;
    $("#intactf_value").html(intactf);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });

  $("#tempano_slider").on("input", function() {
    var tempano = this.value;
    $("#tempano_value").html(tempano);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#drought_slider").on("input", function() {
    var drought = this.value;
    $("#drought_value").html(drought);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });


  ///-----------------------------------------------------
  $("#foodsec_th_slider").on("input", function() {
    var foodsec = this.value;
    $("#foodsec_value").html(foodsec);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#conflict_slider").on("input", function() {
    var conflict = this.value;
    $("#conflict_value").html(conflict);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });
  $("#refugee_slider").on("input", function() {
    var refugee = this.value;
    $("#refugee_value").html(refugee);
    $('#submit').css('background-color','#dea314').css('color','#ffffff')
  });

      if (e.features.length > 0) {

    // compute variable values for country 
          function cid () {
            var feature = e.features[0];
             country_id_fi = feature.properties.adm0_code;
              return country_id_fi;
          }
          function ciso3 () {
            var feature = e.features[0];
             country_iso3_fi = feature.properties.iso3;
              return country_iso3_fi;
          }
        
          

      var feature = e.features[0];
      var country_id = feature.properties.adm0_code;
      var country_name = feature.properties.adm0_name;


 



      



      $('#country_name').empty().append("<div id='country_name_'><p>"+feature.properties.adm0_name+"</p></div> "+
      
      " <ul class= 'collapsible country_scores_main '>"+
"</li></ul>");

      $('#custom_map_tools').empty().append("<div id = 'dddd'><div id ='btn_maps'>"+ 
        "<button type='button' class='btn btn-primary draw_rec_custom'><i class='far fa-square'></i></button>"+ 
        "<button type='button' class='btn btn-primary draw_custom'><i class='fas fa-draw-polygon'></i></button>"+ 
        "<button type='button' class='btn btn-secondary clean_custom'><i class='fas fa-trash-alt'></i></button>");
        
        $('#submit').text("Compute scores for "+country_name)


      if($('.sidebar').css('display') == 'none')
      {
      $('.sidebar').animate({height:'toggle'},350);

    }else{
      $('.sidebar').show();
 
    }

    function toggle(button)
{
  if(document.getElementById("1").value=="OFF"){
   document.getElementById("1").value="ON";}

  else if(document.getElementById("1").value=="ON"){
   document.getElementById("1").value="OFF";}
}

      //  var coordinates = feature.geometry.coordinates;
      var cfeatures = map.queryRenderedFeatures(e.point, { layers: ['benin_bound'] });
      var filter = cfeatures.reduce(function(memo, feature) {
             memo.push(feature.properties.adm0_code);
             return memo;
             var bounds = new mapboxgl.LngLatBounds();
             bounds.extend(feature.geometry.coordinates);
             map.fitBounds(bounds);
         }, ['!in', 'adm0_code']);
         map.setFilter("benin_bound", filter);


        var filter_points = ["in", 'adm0_code', country_id];
        map.setFilter('grid_points_3', filter_points);
    
      

    }




    $('.draw_custom').click(function(){
      $('.mapbox-gl-draw_trash').click();
        $('.mapbox-gl-draw_polygon').click();

    });
    $('.draw_rec_custom').click(function(){
      $('.mapbox-gl-draw_trash').click();
      $('.mapbox-gl-draw_polygon').click();
      setTimeout(function(){
        draw.changeMode('draw_rectangle');

        }, 300);
    });
    $('.clean_custom').click(function(){
        $('.mapbox-gl-draw_trash').click();
        map.setFilter('point_selecte_by_drow', ['==', 'fid', "" ]);
        $( ".calculation-box" ).hide();
    });

  



  cid ();
  ciso3 ();


  $('input.checkbox_check').prop('checked', false);
  }); // map onclick function


  $('input.checkbox_check').change(function(){
    
      if ($('input.checkbox_check').is(':checked')) {
      var filter_points_2 = ['all',["in", 'adm0_code', country_id_fi],["!in", "pca", 1]];
      var filter_buff = ["in", 'adm0_code', country_id_fi];
      var filter_wdpa = ["in", 'iso3', country_iso3_fi];
      map.setFilter('dopa_geoserver_wdpa_master_202101_o1', filter_wdpa);
      map.setFilter('pa_buf', filter_buff);
      map.setFilter('grid_points_3', filter_points_2);
      setTimeout(function(){
      $("#submit").click();
      $('.country_sel_legend_title').html('Score in Country <br><b>Outside Protected Areas');
    },1000);

    }else{
      var filter_wdpa = ["in", 'iso3', 'XXX'];
      map.setFilter('dopa_geoserver_wdpa_master_202101_o1', filter_wdpa);
      var filter_points = ["in", 'adm0_code', country_id_fi];
      map.setFilter('grid_points_3', filter_points);
      map.setFilter('pa_buf', ["in", 'adm0_code', 0]);
      setTimeout(function(){
      $("#submit").click();
      $('.country_sel_legend_title').html('Score in Country');
    },1000);

    }
});


$('.delvarico-distance').click(function() {
  var resetval = $("#distance_value").html();
  if(resetval== 0){
  $("#distance_value").html(1);
  $('#distance_slider').val(1);
  $('.delvarico-distance').html("clear");
  $('.range-field-distance').css('opacity', '1');
  }else{
  $("#distance_value").html(0);
  $('.delvarico-distance').html("add");
  $('.range-field-distance').css('opacity', '0');
  }});

    
        $('.delvarico-distance_inv').click(function() {
        var resetval = $("#distance_inv_value").html();
        if(resetval== 0){
        $("#distance_inv_value").html(1);
        $('#distance_inv_slider').val(1);
        $('.delvarico-distance_inv').html("clear");
        $('.range-field-distance_inv').css('opacity', '1');
        }else{
        $("#distance_inv_value").html(0);
        $('.delvarico-distance_inv').html("add");
        $('.range-field-distance_inv').css('opacity', '0');
        }});

        $('.delvarico-powerplant').click(function() {
        var resetval = $("#powerplant_value").html();
        if(resetval== 0){
        $("#powerplant_value").html(1);
        $('#powerplant_slider').val(1);
        $('.delvarico-powerplant').html("clear");
        $('.range-field-powerplant').css('opacity', '1');
        }else{
        $("#powerplant_value").html(0);
        $('.delvarico-powerplant').html("add");
        $('.range-field-powerplant').css('opacity', '0');
        }});

        $('.delvarico-solar').click(function() {
        var resetval = $("#solar_value").html();
        if(resetval== 0){
        $("#solar_value").html(1);
        $('#solar_slider').val(1);
        $('.delvarico-solar').html("clear");
        $('.range-field-solar').css('opacity', '1');
        }else{
        $("#solar_value").html(0);
        $('.delvarico-solar').html("add");
        $('.range-field-solar').css('opacity', '0');
        }});

        $('.delvarico-wind').click(function() {
        var resetval = $("#wind_value").html();
        if(resetval== 0){
        $("#wind_value").html(1);
        $('#wind_slider').val(1);
        $('.delvarico-wind').html("clear");
        $('.range-field-wind').css('opacity', '1');
        }else{
        $("#wind_value").html(0);
        $('.delvarico-wind').html("add");
        $('.range-field-wind').css('opacity', '0');
        }});
        $('.delvarico-hydro').click(function() {
        var resetval = $("#hydro_value").html();
        if(resetval== 0){
        $("#hydro_value").html(1);
        $('#hydro_slider').val(1);
        $('.delvarico-hydro').html("clear");
        $('.range-field-hydro').css('opacity', '1');
        }else{
        $("#hydro_value").html(0);
        $('.delvarico-hydro').html("add");
        $('.range-field-hydro').css('opacity', '0');
        }});
        $('.delvarico-connect').click(function() {
          var resetval = $("#connect_value").html();
          if(resetval== 0){
          $("#connect_value").html(1);
          $('#connect_slider').val(1);
          $('.delvarico-connect').html("clear");
          $('.range-field-connect').css('opacity', '1');
          }else{
          $("#connect_value").html(0);
          $('.delvarico-connect').html("add");
          $('.range-field-connect').css('opacity', '0');
          }});

        $('.delvarico-access').click(function() {
        var resetval = $("#access_value").html();
        if(resetval== 0){
        $("#access_value").html(1);
        $('#access_slider').val(1);
        $('.delvarico-access').html("clear");
        $('.range-field-access').css('opacity', '1');
        }else{
        $("#access_value").html(0);
        $('.delvarico-access').html("add");
        $('.range-field-access').css('opacity', '0');
        }});
        $('.delvarico-access_inv').click(function() {
          var resetval = $("#access_inv_value").html();
          if(resetval== 0){
          $("#access_inv_value").html(1);
          $('#access_inv_slider').val(1);
          $('.delvarico-access_inv').html("clear");
          $('.range-field-access_inv').css('opacity', '1');
          }else{
          $("#access_inv_value").html(0);
          $('.delvarico-access_inv').html("add");
          $('.range-field-access_inv').css('opacity', '0');
          }});

        $('.delvarico-grid').click(function() {
        var resetval = $("#grid_value").html();
        if(resetval== 0){
        $("#grid_value").html(1);
        $('#grid_slider').val(1);
        $('.delvarico-grid').html("clear");
        $('.range-field-grid').css('opacity', '1');
        }else{
        $("#grid_value").html(0);
        $('.delvarico-grid').html("add");
        $('.range-field-grid').css('opacity', '0');
        }});
        $('.delvarico-industrial').click(function() {
        var resetval = $("#industrial_value").html();
        if(resetval== 0){
        $("#industrial_value").html(1);
        $('#industrial_slider').val(1);
        $('.delvarico-industrial').html("clear");
        $('.range-field-industrial').css('opacity', '1');
        }else{
        $("#industrial_value").html(0);
        $('.delvarico-industrial').html("add");
        $('.range-field-industrial').css('opacity', '0');
        }});
        $('.delvarico-popdens').click(function() {
        var resetval = $("#popdens_value").html();
        if(resetval== 0){
        $("#popdens_value").html(1);
        $('#popdens_slider').val(1);
        $('.delvarico-popdens').html("clear");
        $('.range-field-popdens').css('opacity', '1');
        }else{
        $("#popdens_value").html(0);
        $('.delvarico-popdens').html("add");
        $('.range-field-popdens').css('opacity', '0');
        }});
        $('.delvarico-health').click(function() {
        var resetval = $("#health_value").html();
        if(resetval== 0){
        $("#health_value").html(1);
        $('#health_slider').val(1);
        $('.delvarico-health').html("clear");
        $('.range-field-health').css('opacity', '1');
        }else{
        $("#health_value").html(0);
        $('.delvarico-health').html("add");
        $('.range-field-health').css('opacity', '0');
        }});
        $('.delvarico-education').click(function() {
        var resetval = $("#education_value").html();
        if(resetval== 0){
        $("#education_value").html(1);
        $('#education_slider').val(1);
        $('.delvarico-education').html("clear");
        $('.range-field-education').css('opacity', '1');
        }else{
        $("#education_value").html(0);
        $('.delvarico-education').html("add");
        $('.range-field-education').css('opacity', '0');
        }});

        $('.delvarico-edu_no_e').click(function() {
          var resetval = $("#edu_no_e_value").html();
          if(resetval== 0){
          $("#edu_no_e_value").html(1);
          $('#edu_no_e_slider').val(1);
          $('.delvarico-edu_no_e').html("clear");
          $('.range-field-edu_no_e').css('opacity', '1');
          }else{
          $("#edu_no_e_value").html(0);
          $('.delvarico-edu_no_e').html("add");
          $('.range-field-edu_no_e').css('opacity', '0');
          }});

        $('.delvarico-irrigation').click(function() {
        var resetval = $("#irrigation_value").html();
        if(resetval== 0){
        $("#irrigation_value").html(1);
        $('#irrigation_slider').val(1);
        $('.delvarico-irrigation').html("clear");
        $('.range-field-irrigation').css('opacity', '1');
        }else{
        $("#irrigation_value").html(0);
        $('.delvarico-irrigation').html("add");
        $('.range-field-irrigation').css('opacity', '0');
        }});
        $('.delvarico-groundw').click(function() {
        var resetval = $("#groundw_value").html();
        if(resetval== 0){
        $("#groundw_value").html(1);
        $('#groundw_slider').val(1);
        $('.delvarico-groundw').html("clear");
        $('.range-field-groundw').css('opacity', '1');
        }else{
        $("#groundw_value").html(0);
        $('.delvarico-groundw').html("add");
        $('.range-field-groundw').css('opacity', '0');
        }});
        $('.delvarico-lives').click(function() {
        var resetval = $("#lives_value").html();
        if(resetval== 0){
        $("#lives_value").html(1);
        $('#lives_slider').val(1);
        $('.delvarico-lives').html("clear");
        $('.range-field-lives').css('opacity', '1');
        }else{
        $("#lives_value").html(0);
        $('.delvarico-lives').html("add");
        $('.range-field-lives').css('opacity', '0');
        }});
        $('.delvarico-elevation').click(function() {
        var resetval = $("#elevation_value").html();
        if(resetval== 0){
        $("#elevation_value").html(1);
        $('#elevation_slider').val(1);
        $('.delvarico-elevation').html("clear");
        $('.range-field-elevation').css('opacity', '1');
        }else{
        $("#elevation_value").html(0);
        $('.delvarico-elevation').html("add");
        $('.range-field-elevation').css('opacity', '0');
        }});
        $('.delvarico-slope').click(function() {
        var resetval = $("#slope_value").html();
        if(resetval== 0){
        $("#slope_value").html(1);
        $('#slope_slider').val(1);
        $('.delvarico-slope').html("clear");
        $('.range-field-slope').css('opacity', '1');
        }else{
        $("#slope_value").html(0);
        $('.delvarico-slope').html("add");
        $('.range-field-slope').css('opacity', '0');
        }});
        $('.delvarico-natarea').click(function() {
        var resetval = $("#natarea_value").html();
        if(resetval== 0){
        $("#natarea_value").html(1);
        $('#natarea_slider').val(1);
        $('.delvarico-natarea').html("clear");
        $('.range-field-natarea').css('opacity', '1');
        }else{
        $("#natarea_value").html(0);
        $('.delvarico-natarea').html("add");
        $('.range-field-natarea').css('opacity', '0');
        }});
        $('.delvarico-intactf').click(function() {
        var resetval = $("#intactf_value").html();
        if(resetval== 0){
        $("#intactf_value").html(1);
        $('#intactf_slider').val(1);
        $('.delvarico-intactf').html("clear");
        $('.range-field-intactf').css('opacity', '1');
        }else{
        $("#intactf_value").html(0);
        $('.delvarico-intactf').html("add");
        $('.range-field-intactf').css('opacity', '0');
        }});
        $('.delvarico-pca').click(function() {
        var resetval = $("#pca_value").html();
        if(resetval== 0){
        $("#pca_value").html(1);
        $('#pca_slider').val(1);
        $('.delvarico-pca').html("clear");
        $('.range-field-pca').css('opacity', '1');
        }else{
        $("#pca_value").html(0);
        $('.delvarico-pca').html("add");
        $('.range-field-pca').css('opacity', '0');
        }});
        $('.delvarico-tempano').click(function() {
        var resetval = $("#tempano_value").html();
        if(resetval== 0){
        $("#tempano_value").html(1);
        $('#tempano_slider').val(1);
        $('.delvarico-tempano').html("clear");
        $('.range-field-tempano').css('opacity', '1');
        }else{
        $("#tempano_value").html(0);
        $('.delvarico-tempano').html("add");
        $('.range-field-tempano').css('opacity', '0');
        }});
        $('.delvarico-drought').click(function() {
        var resetval = $("#drought_value").html();
        if(resetval== 0){
        $("#drought_value").html(1);
        $('#drought_slider').val(1);
        $('.delvarico-drought').html("clear");
        $('.range-field-drought').css('opacity', '1');
        }else{
        $("#drought_value").html(0);
        $('.delvarico-drought').html("add");
        $('.range-field-drought').css('opacity', '0');
        }});

        $('.delvarico-foodsec').click(function() {
        var resetval = $("#foodsec_value").html();
        if(resetval== 0){
        $("#foodsec_value").html(1);
        $('#foodsec_th_slider').val(1);
        $('.delvarico-foodsec').html("clear");
        $('.range-field-foodsec').css('opacity', '1');
        }else{
        $("#foodsec_value").html(0);
        $('.delvarico-foodsec').html("add");
        $('.range-field-foodsec').css('opacity', '0');
        }});
        $('.delvarico-conflict').click(function() {
        var resetval = $("#conflict_value").html();
        if(resetval== 0){
        $("#conflict_value").html(1);
        $('#conflict_slider').val(1);
        $('.delvarico-conflict').html("clear");
        $('.range-field-conflict').css('opacity', '1');
        }else{
        $("#conflict_value").html(0);
        $('.delvarico-conflict').html("add");
        $('.range-field-conflict').css('opacity', '0');
        }});
        $('.delvarico-refugee').click(function() {
        var resetval = $("#refugee_value").html();
        if(resetval== 0){
        $("#refugee_value").html(1);
        $('#refugee_slider').val(1);
        $('.delvarico-refugee').html("clear");
        $('.range-field-refugee').css('opacity', '1');
        }else{
        $("#refugee_value").html(0);
        $('.delvarico-refugee').html("add");
        $('.range-field-refugee').css('opacity', '0');
        }});

        $('.delvarico-all').click(function() {
          var resetval = $("#distance_value").html();
          if(resetval== 0){
          $("#distance_value").html(1);
          $('#distance_slider').val(1);
          $('.delvarico-distance').html("clear");
          $('.range-field-distance').css('opacity', '1');
          $("#distance_inv_value").html(1);
          $('#distance_inv_slider').val(1);
          $('.delvarico-distance_inv').html("clear");
          $('.range-field-distance_inv').css('opacity', '1');
          $("#powerplant_value").html(1);
          $('#powerplant_slider').val(1);
          $('.delvarico-powerplant').html("clear");
          $('.range-field-powerplant').css('opacity', '1');
          $("#solar_value").html(1);
          $('#solar_slider').val(1);
          $('.delvarico-solar').html("clear");
          $('.range-field-solar').css('opacity', '1');
          $("#wind_value").html(1);
          $('#wind_slider').val(1);
          $('.delvarico-wind').html("clear");
          $('.range-field-wind').css('opacity', '1');
          $("#hydro_value").html(1);
          $('#hydro_slider').val(1);
          $('.delvarico-hydro').html("clear");
          $('.range-field-hydro').css('opacity', '1');
          $("#connect_value").html(1);
          $('#connect_slider').val(1);
          $('.delvarico-connect').html("clear");
          $('.range-field-connect').css('opacity', '1');
          $("#access_value").html(1);
          $('#access_slider').val(1);
          $('.delvarico-access').html("clear");
          $('.range-field-access').css('opacity', '1');
          $("#access_inv_value").html(1);
          $('#access_inv_slider').val(1);
          $('.delvarico-access_inv').html("clear");
          $('.range-field-access_inv').css('opacity', '1');
          $("#grid_value").html(1);
          $('#grid_slider').val(1);
          $('.delvarico-grid').html("clear");
          $('.range-field-grid').css('opacity', '1');
          $("#industrial_value").html(1);
          $('#industrial_slider').val(1);
          $('.delvarico-industrial').html("clear");
          $('.range-field-industrial').css('opacity', '1');
          $("#popdens_value").html(1);
          $('#popdens_slider').val(1);
          $('.delvarico-popdens').html("clear");
          $('.range-field-popdens').css('opacity', '1');
          $("#health_value").html(1);
          $('#health_slider').val(1);
          $('.delvarico-health').html("clear");
          $('.range-field-health').css('opacity', '1');
          $("#education_value").html(1);
          $('#education_slider').val(1);
          $('.delvarico-education').html("clear");
          $('.range-field-education').css('opacity', '1');
          $("#edu_no_e_value").html(1);
          $('#edu_no_e_slider').val(1);
          $('.delvarico-edu_no_e').html("clear");
          $('.range-field-edu_no_e').css('opacity', '1');

          $("#irrigation_value").html(1);
          $('#irrigation_slider').val(1);
          $('.delvarico-irrigation').html("clear");
          $('.range-field-irrigation').css('opacity', '1');
          $("#groundw_value").html(1);
          $('#groundw_slider').val(1);
          $('.delvarico-groundw').html("clear");
          $('.range-field-groundw').css('opacity', '1');
          $("#lives_value").html(1);
          $('#lives_slider').val(1);
          $('.delvarico-lives').html("clear");
          $('.range-field-lives').css('opacity', '1');
          $("#elevation_value").html(1);
          $('#elevation_slider').val(1);
          $('.delvarico-elevation').html("clear");
          $('.range-field-elevation').css('opacity', '1');
          $("#slope_value").html(1);
          $('#slope_slider').val(1);
          $('.delvarico-slope').html("clear");
          $('.range-field-slope').css('opacity', '1');
          $("#natarea_value").html(1);
          $('#natarea_slider').val(1);
          $('.delvarico-natarea').html("clear");
          $('.range-field-natarea').css('opacity', '1');
          $("#intactf_value").html(1);
          $('#intactf_slider').val(1);
          $('.delvarico-intactf').html("clear");
          $('.range-field-intactf').css('opacity', '1');
          $("#pca_value").html(1);
          $('#pca_slider').val(1);
          $('.delvarico-pca').html("clear");
          $('.range-field-pca').css('opacity', '1');
          $("#tempano_value").html(1);
          $('#tempano_slider').val(1);
          $('.delvarico-tempano').html("clear");
          $('.range-field-tempano').css('opacity', '1');
          $("#drought_value").html(1);
          $('#drought_slider').val(1);
          $('.delvarico-drought').html("clear");
          $('.range-field-drought').css('opacity', '1');
  
          $("#foodsec_value").html(1);
          $('#foodsec_th_slider').val(1);
          $('.delvarico-foodsec').html("clear");
          $('.range-field-foodsec').css('opacity', '1');
          $("#conflict_value").html(1);
          $('#conflict_slider').val(1);
          $('.delvarico-conflict').html("clear");
          $('.range-field-conflict').css('opacity', '1');
          $("#refugee_value").html(1);
          $('#refugee_slider').val(1);
          $('.delvarico-refugee').html("clear");
          $('.range-field-refugee').css('opacity', '1');

          $("#all-var").html("Remove all variables"); 
          $('#submit').css('background-color','#dea314').css('color','#ffffff')
          $('.delvarico-all').html("clear");

          }else{
          $("#distance_value").html(0);
          $('.delvarico-distance').html("add");
          $('.range-field-distance').css('opacity', '0');
          $("#distance_inv_value").html(0);
          $('.delvarico-distance_inv').html("add");
          $('.range-field-distance_inv').css('opacity', '0');
          $("#hydro_value").html(0);
          $('.delvarico-hydro').html("add");
          $('.range-field-hydro').css('opacity', '0');
          $("#connect_value").html(0);
          $('.delvarico-connect').html("add");
          $('.range-field-connect').css('opacity', '0');
          $("#access_value").html(0);
          $('.delvarico-access').html("add");
          $('.range-field-access').css('opacity', '0');
          $("#access_inv_value").html(0);
          $('.delvarico-access_inv').html("add");
          $('.range-field-access_inv').css('opacity', '0');
          $("#powerplant_value").html(0);
          $('.delvarico-powerplant').html("add");
          $('.range-field-powerplant').css('opacity', '0');
          $("#solar_value").html(0);
          $('.delvarico-solar').html("add");
          $('.range-field-solar').css('opacity', '0');
          $("#wind_value").html(0);
          $('.delvarico-wind').html("add");
          $('.range-field-wind').css('opacity', '0');
          $("#grid_value").html(0);
          $('.delvarico-grid').html("add");
          $('.range-field-grid').css('opacity', '0');
          $("#industrial_value").html(0);
          $('.delvarico-industrial').html("add");
          $('.range-field-industrial').css('opacity', '0');
          $("#popdens_value").html(0);
          $('.delvarico-popdens').html("add");
          $('.range-field-popdens').css('opacity', '0');
          $("#health_value").html(0);
          $('.delvarico-health').html("add");
          $('.range-field-health').css('opacity', '0');
          $("#education_value").html(0);
          $('.delvarico-education').html("add");
          $('.range-field-education').css('opacity', '0');
          $("#edu_no_e_value").html(0);
          $('.delvarico-edu_no_e').html("add");
          $('.range-field-edu_no_e').css('opacity', '0');
          $("#irrigation_value").html(0);
          $('.delvarico-irrigation').html("add");
          $('.range-field-irrigation').css('opacity', '0');
          $("#groundw_value").html(0);
          $('.delvarico-groundw').html("add");
          $('.range-field-groundw').css('opacity', '0');
          $("#lives_value").html(0);
          $('.delvarico-lives').html("add");
          $('.range-field-lives').css('opacity', '0');
          $("#elevation_value").html(0);
          $('.delvarico-elevation').html("add");
          $('.range-field-elevation').css('opacity', '0');
          $("#slope_value").html(0);
          $('.delvarico-slope').html("add");
          $('.range-field-slope').css('opacity', '0');
          $("#natarea_value").html(0);
          $('.delvarico-natarea').html("add");
          $('.range-field-natarea').css('opacity', '0');
          $("#intactf_value").html(0);
          $('.delvarico-intactf').html("add");
          $('.range-field-intactf').css('opacity', '0');
          $("#pca_value").html(0);
          $('.delvarico-pca').html("add");
          $('.range-field-pca').css('opacity', '0');
          $("#drought_value").html(0);
          $('.delvarico-drought').html("add");
          $('.range-field-drought').css('opacity', '0');
          $("#tempano_value").html(0);
          $('.delvarico-tempano').html("add");
          $('.range-field-tempano').css('opacity', '0');

          $("#foodsec_value").html(0);
          $('.delvarico-foodsec').html("add");
          $('.range-field-foodsec').css('opacity', '0');
          $("#conflict_value").html(0);
          $('.delvarico-conflict').html("add");
          $('.range-field-conflict').css('opacity', '0');
          $("#refugee_value").html(0);
          $('.delvarico-refugee').html("add");
          $('.range-field-refugee').css('opacity', '0');

          $("#all-var").html("Add all variables"); 
      
          $('#submit').css('background-color','#dea314').css('color','#ffffff')
          $('.delvarico-all').html("add");
          }});

          

$("#submit").click(function () { 

  const busy_tabs = {
    'Computing spatial statistics': 'a',
    'Generating map tiles': 'a',
    'Extracting values': 'a',
    'Loading results': 'a',
    'Analysing data': 'a',
  };

  function getRandomProperty(busy_tabs) {
    const keys = Object.keys (busy_tabs);
  
    return keys[Math.floor(Math.random() * keys.length)];
  }
var gianni = { fontawesome: 'fa fa-cog fa-spin fa-3x fa-fw', text: getRandomProperty(busy_tabs), textPosition: "bottom", fontSize: '1rem', color:'#171d28',background:'#ffffffab'}


  $("#map").busyLoad("show", gianni);


  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var country_iso3 = urlParams.get('iso3')
  var pa_bb_url = "https://geospatial.jrc.ec.europa.eu/geoserver/wfs?request=getfeature&version=1.0.0&service=wfs&typename=dopa_explorer_3:global_dashboard&propertyname=iso3_digit&SORTBY=iso3_digit&CQL_FILTER=iso3_digit='"+country_iso3+"'&outputFormat=application%2Fjson";
  $.ajax({
      url: pa_bb_url,
      dataType: 'json',
      success: function(d) {
              var x1 = d.features[0].properties.bbox[0];
              var x2 = d.features[0].properties.bbox[1];
              var x3 = d.features[0].properties.bbox[2];
              var x4 = d.features[0].properties.bbox[3];
              map.fitBounds([[x3,x4],[x1,x2]])
        },
    });

  map.setPaintProperty(
    'grid_points_3',
    'circle-opacity',1
  );

  setTimeout(function(){
    
  $('#submit').css('background-color','#1f2735').css('color','#ffffff')
  $(".clean_custom").click();
  setTimeout(function(){
        $('#dddd').fadeIn('slow');
        $('#downloadLink').fadeIn('slow');
  },1000);

  var tilesLoaded = map.areTilesLoaded();



  max_irrigation= (irrigation_max());
  max_groundw= (groundw_max());
  max_access= (access_max());
  max_access_inv= (access_inv_max());
  max_lives= (lives_max());
  max_tempano= (tempano_max());
  max_solar= (solar_max());
  max_slope= (slope_max());
  max_powerplant= (powerplant_max());
  max_popdens= (popdens_max());
  max_pca= (pca_max());
  max_natarea= (natarea_max());
  max_intactf= (intactf_max());
  max_industrial= (industrial_max());
  max_drought= (drought_max());
  max_health= (health_max());
  max_grid= (grid_max());
  max_elevation= (elevation_max());
  max_education= (education_max());
  max_edu_no_e= (edu_no_e_max());
  max_distance= (distance_max());
  max_distance_inv= (distance_inv_max());
  max_conflict= (conflict_max());
  max_wind= (wind_max());
  max_hydro= (hydro_max());
  max_connect= (connect_max());

  min_irrigation= (irrigation_min());
  min_groundw= (groundw_min());
  min_access= (access_min());
  min_access_inv= (access_inv_min());
  min_lives= (lives_min());
  min_tempano= (tempano_min());
  min_solar= (solar_min());
  min_slope= (slope_min());
  min_powerplant= (powerplant_min());
  min_popdens= (popdens_min());
  min_pca= (pca_min());
  min_natarea= (natarea_min());
  min_intactf= (intactf_min());
  min_industrial= (industrial_min());
  min_drought= (drought_min());
  min_health= (health_min());
  min_grid= (grid_min());
  min_elevation= (elevation_min());
  min_education= (education_min());
  min_edu_no_e= (edu_no_e_min());
  min_distance= (distance_min());
  min_distance_inv= (distance_inv_min());
  min_conflict= (conflict_min());
  min_wind= (wind_min());
  min_hydro= (hydro_min());
  min_connect= (connect_min());

  mean_irrigation= (irrigation_mean());
  mean_groundw= (groundw_mean());
  mean_access= (access_mean());
  mean_access_inv= (access_inv_mean());
  mean_lives= (lives_mean());
  mean_tempano= (tempano_mean());
  mean_solar= (solar_mean());
  mean_slope= (slope_mean());
  mean_powerplant= (powerplant_mean());
  mean_popdens= (popdens_mean());
  mean_pca= (pca_mean());
  mean_natarea= (natarea_mean());
  mean_intactf= (intactf_mean());
  mean_industrial= (industrial_mean());
  mean_drought= (drought_mean());
  mean_health= (health_mean());
  mean_grid= (grid_mean());
  mean_elevation= (elevation_mean());
  mean_education= (education_mean());
  mean_edu_no_e= (edu_no_e_mean());
  mean_distance= (distance_mean());
  mean_distance_inv= (distance_inv_mean());
  mean_conflict= (conflict_mean());
  mean_wind= (wind_mean());
  mean_hydro= (hydro_mean());
  mean_connect= (connect_mean());

  var score_irrigation=$("#irrigation_value").val();
  var score_groundw=$("#groundw_value").val();
  var score_access=$("#access_value").val();
  var score_access_inv=$("#access_inv_value").val();
  var score_lives=$("#lives_value").val();
  var score_tempano=$("#tempano_value").val();
  var score_solar=$("#solar_value").val();
  var score_slope=$("#slope_value").val();
  var score_powerplant=$("#powerplant_value").val();
  var score_popdens=$("#popdens_value").val();
  var score_pca=$("#pca_value").val();
  var score_natarea=$("#natarea_value").val();
  var score_intactf=$("#intactf_value").val();
  var score_industrial=$("#industrial_value").val();
  var score_drought=$("#drought_value").val();
  var score_health=$("#health_value").val();
  var score_grid=$("#grid_value").val();
  var score_elevation=$("#elevation_value").val();
  var score_education=$("#education_value").val();
  var score_edu_no_e=$("#edu_no_e_value").val();
  var score_distance=$("#distance_value").val();
  var score_distance_inv=$("#distance_inv_value").val();
  var score_conflict=$("#conflict_value").val();
  var score_wind=$("#wind_value").val();
  var score_hydro=$("#hydro_value").val();
  var score_connect=$("#connect_value").val();

    var min_val = (min_irrigation*score_irrigation)+	(min_groundw*score_groundw)+	(min_access*score_access)+	(min_access_inv*score_access_inv)+(min_lives*score_lives)+	(min_tempano*score_tempano)+	(min_solar*score_solar)+	(min_slope*score_slope)+	(min_powerplant*score_powerplant)+	(min_popdens*score_popdens)+	(min_pca*score_pca)+	(min_natarea*score_natarea)+	(min_intactf*score_intactf)+	(min_industrial*score_industrial)+	(min_drought*score_drought)+	(min_health*score_health)+	(min_grid*score_grid)+	(min_elevation*score_elevation)+	(min_education*score_education)+	(min_edu_no_e*score_edu_no_e)+(min_distance*score_distance)+(min_distance_inv*score_distance_inv)+	(min_conflict*score_conflict)+	(min_wind*score_wind)+	(min_connect*score_connect)+	(min_hydro*score_hydro)
    var max_val = (max_irrigation*score_irrigation)+	(max_groundw*score_groundw)+	(max_access*score_access)+(max_access_inv*score_access_inv)+	(max_lives*score_lives)+	(max_tempano*score_tempano)+	(max_solar*score_solar)+	(max_slope*score_slope)+	(max_powerplant*score_powerplant)+	(max_popdens*score_popdens)+	(max_pca*score_pca)+	(max_natarea*score_natarea)+	(max_intactf*score_intactf)+	(max_industrial*score_industrial)+	(max_drought*score_drought)+	(max_health*score_health)+	(max_grid*score_grid)+	(max_elevation*score_elevation)+	(max_education*score_education)+	(max_edu_no_e*score_edu_no_e)+(max_distance*score_distance)+(max_distance_inv*score_distance_inv)+	(max_conflict*score_conflict)+	(max_wind*score_wind)	+	(max_connect*score_connect) +	(max_hydro*score_hydro) 																	
    var avg_val = (mean_irrigation*score_irrigation)+	(mean_groundw*score_groundw)+	(mean_access*score_access)+	(mean_access_inv*score_access_inv)+(mean_lives*score_lives)+	(mean_tempano*score_tempano)+	(mean_solar*score_solar)+	(mean_slope*score_slope)+	(mean_powerplant*score_powerplant)+	(mean_popdens*score_popdens)+	(mean_pca*score_pca)+	(mean_natarea*score_natarea)+	(mean_intactf*score_intactf)+	(mean_industrial*score_industrial)+	(mean_drought*score_drought)+	(mean_health*score_health)+	(mean_grid*score_grid)+	(mean_elevation*score_elevation)+	(mean_education*score_education)+	(mean_edu_no_e*score_edu_no_e)+(mean_distance*score_distance)+	(mean_distance_inv*score_distance_inv)+(mean_conflict*score_conflict)+	(mean_connect*score_connect)+	(mean_hydro*score_hydro)

    if ($('input.checkbox_check').is(':checked')) {
      setTimeout(function(){
        $('.country_sel_legend_title').html('Score in Country <br><b>excluding Protected Areas');
        $('.legend').append("<br><div id='country_prot_legend'> <p class='country_sel_legend_title'>Protected Areas</p>"+
        "<div><span class='square_pa'style='background-color: #595958'></span>Protected Areas Boundaries</div>"+
        "</div>").children(':last').hide().fadeIn(2000);
      },100);
    }else{setTimeout(function(){
      $('#country_prot_legend').empty();
      $('.country_sel_legend_title').html('Score in Country');
      },200);
    }
    if (!isFinite(max_val)){
      $( ".legend" ).hide();
      $("#map").busyLoad("hide", {animation: "fade"});
      
      setTimeout(function(){
        $("#country_name").click();
        $("#map").busyLoad("show", getRandomProperty(gianni));
    },10);
    }else{
      $("#map").busyLoad("hide", {animation: "fade"});
      $("#mainpopup").show();
      $( ".legend" ).show();
    }

      if (parseFloat(max_val) == 0){
        map.setPaintProperty('grid_points_3', 'circle-color', '#ffffff');
        $('.legend').empty().append("<div id='country_sel_legend'> <p class='country_sel_legend_title'>Score in Country</p>"+
          "<div><span style='background-color: #FFFFFF'></span>"+min_val.toFixed(2)+"</div>"+
          
          "<div><span style='background-color: #FFFFFF'></span>"+(max_val).toFixed(2)+"</div>"+
          "</div>");
      }
      else{
        map.setPaintProperty('grid_points_3', 'circle-color', 
      ['interpolate',['linear'], 
      ["+", 
      [ "*", ['get', 'irrigation'],  parseInt(score_irrigation)],
      [ "*", ['get', 'groundw'],  parseInt(score_groundw)],
      [ "*", ['get', 'access'],  parseInt(score_access)],
      [ "*", ['get', 'access_inv'],  parseInt(score_access_inv)],
      [ "*", ['get', 'lives'],  parseInt(score_lives)],
      [ "*", ['get', 'tempano'],  parseInt(score_tempano)],
      [ "*", ['get', 'solar'],  parseInt(score_solar)],
      [ "*", ['get', 'slope'],  parseInt(score_slope)],
      [ "*", ['get', 'powerplant'],  parseInt(score_powerplant)],
      [ "*", ['get', 'popdens'],  parseInt(score_popdens)],
      [ "*", ['get', 'pca'],  parseInt(score_pca)],
      [ "*", ['get', 'natarea'],  parseInt(score_natarea)],
      [ "*", ['get', 'intactf'],  parseInt(score_intactf)],
      [ "*", ['get', 'industrial'],  parseInt(score_industrial)],
      [ "*", ['get', 'drought'],  parseInt(score_drought)],
      [ "*", ['get', 'health'],  parseInt(score_health)],
      [ "*", ['get', 'grid'],  parseInt(score_grid)],
      [ "*", ['get', 'elevation'],  parseInt(score_elevation)],
      [ "*", ['get', 'education'],  parseInt(score_education)],
      [ "*", ['get', 'edu_no_e'],  parseInt(score_edu_no_e)],
      [ "*", ['get', 'distance'],  parseInt(score_distance)],
      [ "*", ['get', 'distance_inv'],  parseInt(score_distance_inv)],
      [ "*", ['get', 'conflict'],  parseInt(score_conflict)],
      [ "*", ['get', 'wind'],  parseInt(score_wind)],
      [ "*", ['get', 'hydro'],  parseInt(score_hydro)],
      [ "*", ['get', 'connect'],  parseInt(score_connect)]
      ],

      min_val,"#f2690a",avg_val, "#E2EB16", max_val,"#12EB5D"]);

      var avg_leg_pos_gr = ((100*avg_val)/max_val)-10

      $('.legend').empty().append("<div id='country_sel_legend'> <p class='country_sel_legend_title'>Score in Country</p>"+
        "<div style='color: #dadada; font-size: 12px; float: left!important;'>"+min_val.toFixed(2)+"</div>"+
        "<div style='color: #dadada; font-size: 12px; float: right!important;'>"+max_val.toFixed(2)+"</div>"+
        "<div class='LegendGradient' style='background-image: -webkit-linear-gradient(left,#ff0000 -25%,#E2EB16 50%,#12EB5D 75%)!important; clear: both;'></div>"+
        "</div>");

      }

      },1000);

  });

}); // map on load function





//-----------------------------------------------------------   DRAW -------------------------------------------
var modes = MapboxDraw.modes;
modes.draw_rectangle = DrawRectangle.default;
var draw = new MapboxDraw({
modes: modes,
displayControlsDefault: false,
controls: {
    polygon: true,
    trash: true
}
});
map.addControl(draw);
map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);

//-----------------------------------------------------------   CALCULATE AREA DROWN FEATURE -------------------------------------------

var DrewAreaArray = []
function updateArea(e) {
  DrewAreaArray=[]
    var data = draw.getAll();
    var last_element = data.features[data.features.length-1]
    if (data.features.length > 0) {
        var area = turf.area(last_element);
        var rounded_area = Math.round(area*100)/100;
        var km_area = rounded_area/1000000
        DrewAreaArray.push(km_area);
    } else {
        if (e.type !== 'draw.delete') alert("Use the draw tools to draw a polygon!");
    }
}

//-----------------------------------------------------------   DRAW -------------------------------------------
map.on('draw.create', function(e){

    var userPolygon = e.features[0];
    // generate bounding box from polygon the user drew
    var polygonBoundingBox = turf.bbox(userPolygon);
    var southWest = [polygonBoundingBox[0], polygonBoundingBox[1]];
    var northEast = [polygonBoundingBox[2], polygonBoundingBox[3]];
    var northEastPointPixel = map.project(northEast);
    var southWestPointPixel = map.project(southWest);
    var features = map.queryRenderedFeatures([southWestPointPixel, northEastPointPixel], { layers: ['grid_points_3'] });

    // filter for highlight feature ------------------------------------------------------------------------------------------
    var filter_selected = features.reduce(function(memo, feature) {
      var inside=turf.pointsWithinPolygon(feature, userPolygon)
        if (! (undefined === inside)) {
          if (inside.features.length>0)
          memo.push(feature.properties.fid);
        }
        return memo;
    }, ['in', 'fid']);

    map.setFilter("point_selecte_by_drow", filter_selected);
    $('.clean_custom').css('color', '#dd4e11');

   var irrigation = features.reduce(function(print_irrigation, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_irrigation.push(feature.properties.irrigation);
        }
      }
        return print_irrigation;
  }, []);
  var irrigationTotal = 0;
  for(var i = 0, len = irrigation.length; i < len; i++) {
    irrigationTotal += irrigation[i]/len;
  }
  var groundw = features.reduce(function(print_groundw, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_groundw.push(feature.properties.groundw);
        }
      }
        return print_groundw;
  }, []);
  var groundwTotal = 0;
  for(var i = 0, len = groundw.length; i < len; i++) {
    groundwTotal += groundw[i]/len;
  }

  var access = features.reduce(function(print_access, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_access.push(feature.properties.access);
        }
      }
        return print_access;
  }, []);
  var accessTotal = 0;
  for(var i = 0, len = access.length; i < len; i++) {
    accessTotal += access[i]/len;
  }
  var access_inv = features.reduce(function(print_access_inv, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_access_inv.push(feature.properties.access_inv);
        }
      }
        return print_access_inv;
  }, []);
  var access_invTotal = 0;
  for(var i = 0, len = access_inv.length; i < len; i++) {
    access_invTotal += access_inv[i]/len;
  }
  var lives = features.reduce(function(print_lives, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_lives.push(feature.properties.lives);
        }
      }
        return print_lives;
  }, []);
  var livesTotal = 0;
  for(var i = 0, len = lives.length; i < len; i++) {
    livesTotal += lives[i]/len;
  }

  var tempano = features.reduce(function(print_tempano, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_tempano.push(feature.properties.tempano);
        }
      }
        return print_tempano;
  }, []);
  var tempanoTotal = 0;
  for(var i = 0, len = tempano.length; i < len; i++) {
    tempanoTotal += tempano[i]/len;
  }

  var solar = features.reduce(function(print_solar, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_solar.push(feature.properties.solar);
        }
      }
        return print_solar;
  }, []);
  var solarTotal = 0;
  for(var i = 0, len = solar.length; i < len; i++) {
    solarTotal += solar[i]/len;
  }

  var slope = features.reduce(function(print_slope, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_slope.push(feature.properties.slope);
        }
      }
        return print_slope;
  }, []);
  var slopeTotal = 0;
  for(var i = 0, len = slope.length; i < len; i++) {
    slopeTotal += slope[i]/len;
  }

  var powerplant = features.reduce(function(print_powerplant, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_powerplant.push(feature.properties.powerplant);
        }
      }
        return print_powerplant;
  }, []);
  var powerplantTotal = 0;
  for(var i = 0, len = powerplant.length; i < len; i++) {
    powerplantTotal += powerplant[i]/len;
  }

  var popdens = features.reduce(function(print_popdens, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_popdens.push(feature.properties.popdens);
        }
      }
        return print_popdens;
  }, []);
  var popdensTotal = 0;
  for(var i = 0, len = popdens.length; i < len; i++) {
    popdensTotal += popdens[i]/len;
  }

  var pca = features.reduce(function(print_pca, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_pca.push(feature.properties.pca);
        }
      }
        return print_pca;
  }, []);
  var pcaTotal = 0;
  for(var i = 0, len = pca.length; i < len; i++) {
    pcaTotal += pca[i]/len;
  }

  var natarea = features.reduce(function(print_natarea, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_natarea.push(feature.properties.natarea);
        }
      }
        return print_natarea;
  }, []);
  var natareaTotal = 0;
  for(var i = 0, len = natarea.length; i < len; i++) {
    natareaTotal += natarea[i]/len;
  }
  var intactf = features.reduce(function(print_intactf, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_intactf.push(feature.properties.intactf);
        }
      }
        return print_intactf;
  }, []);
  var intactfTotal = 0;
  for(var i = 0, len = intactf.length; i < len; i++) {
    intactfTotal += intactf[i]/len;
  }

  var industrial = features.reduce(function(print_industrial, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_industrial.push(feature.properties.industrial);
        }
      }
        return print_industrial;
  }, []);
  var industrialTotal = 0;
  for(var i = 0, len = industrial.length; i < len; i++) {
    industrialTotal += industrial[i]/len;
  }

  var drought = features.reduce(function(print_drought, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_drought.push(feature.properties.drought);
        }
      }
        return print_drought;
  }, []);
  var droughtTotal = 0;
  for(var i = 0, len = drought.length; i < len; i++) {
    droughtTotal += drought[i]/len;
  }

  var health = features.reduce(function(print_health, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_health.push(feature.properties.health);
        }
      }
        return print_health;
  }, []);
  var healthTotal = 0;
  for(var i = 0, len = health.length; i < len; i++) {
    healthTotal += health[i]/len;
  }

  var grid = features.reduce(function(print_grid, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_grid.push(feature.properties.grid);
        }
      }
        return print_grid;
  }, []);
  var gridTotal = 0;
  for(var i = 0, len = grid.length; i < len; i++) {
    gridTotal += grid[i]/len;
  }

  var elevation = features.reduce(function(print_elevation, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_elevation.push(feature.properties.elevation);
        }
      }
        return print_elevation;
  }, []);
  var elevationTotal = 0;
  for(var i = 0, len = elevation.length; i < len; i++) {
    elevationTotal += elevation[i]/len;
  }
  var education = features.reduce(function(print_education, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_education.push(feature.properties.education);
        }
      }
        return print_education;
  }, []);
  var educationTotal = 0;
  for(var i = 0, len = education.length; i < len; i++) {
    educationTotal += education[i]/len;
  }

  var edu_no_e = features.reduce(function(print_edu_no_e, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_edu_no_e.push(feature.properties.edu_no_e);
        }
      }
        return print_edu_no_e;
  }, []);
  var edu_no_eTotal = 0;
  for(var i = 0, len = edu_no_e.length; i < len; i++) {
    edu_no_eTotal += edu_no_e[i]/len;
  }

  var distance = features.reduce(function(print_distance, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_distance.push(feature.properties.distance);
        }
      }
        return print_distance;
  }, []);
  var distanceTotal = 0;
  for(var i = 0, len = distance.length; i < len; i++) {
    distanceTotal += distance[i]/len;
  }


  var distance_inv = features.reduce(function(print_distance_inv, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_distance_inv.push(feature.properties.distance_inv);
        }
      }
        return print_distance_inv;
  }, []);
  var distance_invTotal = 0;
  for(var i = 0, len = distance_inv.length; i < len; i++) {
    distance_invTotal += distance_inv[i]/len;
  }


  var conflict = features.reduce(function(print_conflict, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_conflict.push(feature.properties.conflict);
        }
      }
        return print_conflict;
  }, []);
  var conflictTotal = 0;
  for(var i = 0, len = conflict.length; i < len; i++) {
    conflictTotal += conflict[i]/len;
  }
  var wind = features.reduce(function(print_wind, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_wind.push(feature.properties.wind);
        }
      }
        return print_wind;
  }, []);
  var windTotal = 0;
  for(var i = 0, len = wind.length; i < len; i++) {
    windTotal += wind[i]/len;
  }

  var hydro = features.reduce(function(print_hydro, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_hydro.push(feature.properties.hydro);
        }
      }
        return print_hydro;
  }, []);
  var hydroTotal = 0;
  for(var i = 0, len = hydro.length; i < len; i++) {
    hydroTotal += hydro[i]/len;
  }

  var connect = features.reduce(function(print_connect, feature) {
    var inside=turf.pointsWithinPolygon(feature, userPolygon)
      if (! (undefined === inside)) {
        if (inside.features.length>0){
          print_connect.push(feature.properties.connect);
        }
      }
        return print_connect;
  }, []);
  var connectTotal = 0;
  for(var i = 0, len = connect.length; i < len; i++) {
    connectTotal += connect[i]/len;
  }

  var score_irrigation = $("#irrigation_value").val();
  var score_groundw = $("#groundw_value").val();
  var score_access = $("#access_value").val();
  var score_access_inv = $("#access_inv_value").val();
  var score_lives = $("#lives_value").val();
  var score_tempano = $("#tempano_value").val();
  var score_solar = $("#solar_value").val();
  var score_slope = $("#slope_value").val();
  var score_powerplant = $("#powerplant_value").val();
  var score_popdens = $("#popdens_value").val();
  var score_pca = $("#pca_value").val();
  var score_natarea = $("#natarea_value").val();
  var score_intactf = $("#intactf_value").val();
  var score_industrial = $("#industrial_value").val();
  var score_drought = $("#drought_value").val();
  var score_health = $("#health_value").val();
  var score_grid = $("#grid_value").val();
  var score_elevation = $("#elevation_value").val();
  var score_education = $("#education_value").val();
  var score_edu_no_e = $("#edu_no_e_value").val();
  var score_distance = $("#distance_value").val();
  var score_distance_inv = $("#distance_inv_value").val();
  var score_conflict = $("#conflict_value").val();
  var score_wind = $("#wind_value").val();
  var score_hydro = $("#hydro_value").val();
  var score_connect = $("#connect_value").val();

$( ".calculation-box" ).show();



const ourData = [
  {Variable:'Area equipped for Irrigation',Weight:   score_irrigation,Score:irrigationTotal,Result:parseFloat(   score_irrigation)*irrigationTotal},
  {Variable:'Groundwater Irrigation',Weight:   score_groundw,Score:groundwTotal,Result:parseFloat(   score_groundw)*groundwTotal},
  {Variable:'Most accessible areas',Weight:   score_access,Score:accessTotal,Result:parseFloat(   score_access)*accessTotal},
  {Variable:'Least accessible areas',Weight:   score_access_inv,Score:access_invTotal,Result:parseFloat(   score_access_inv)*access_invTotal},
  {Variable:'Livestock',Weight:   score_lives,Score:livesTotal,Result:parseFloat(   score_lives)*livesTotal},
  {Variable:'Temperature Anomalies',Weight:   score_tempano,Score:tempanoTotal,Result:parseFloat(   score_tempano)*tempanoTotal},
  {Variable:'Solar potential',Weight:   score_solar,Score:solarTotal,Result:parseFloat(   score_solar)*solarTotal},
  {Variable:'Slope',Weight:   score_slope,Score:slopeTotal,Result:parseFloat(   score_slope)*slopeTotal},
  {Variable:'Power plants',Weight:   score_powerplant,Score:powerplantTotal,Result:parseFloat(   score_powerplant)*powerplantTotal},
  {Variable:'Population',Weight:   score_popdens,Score:popdensTotal,Result:parseFloat(   score_popdens)*popdensTotal},
  {Variable:'Protected and Conserved Areas',Weight:   score_pca,Score:pcaTotal,Result:parseFloat(   score_pca)*pcaTotal},
  {Variable:'Natural Areas',Weight:   score_natarea,Score:natareaTotal,Result:parseFloat(   score_natarea)*natareaTotal},
  {Variable:'Intact Forest',Weight:   score_intactf,Score:intactfTotal,Result:parseFloat(   score_intactf)*intactfTotal},
  {Variable:'Industrial Areas',Weight:   score_industrial,Score:industrialTotal,Result:parseFloat(   score_industrial)*industrialTotal},
  {Variable:'Drought Risk',Weight:   score_drought,Score:droughtTotal,Result:parseFloat(   score_drought)*droughtTotal},
  {Variable:'Health centers',Weight:   score_health,Score:healthTotal,Result:parseFloat(   score_health)*healthTotal},
  {Variable:'Electricity grid',Weight:   score_grid,Score:gridTotal,Result:parseFloat(   score_grid)*gridTotal},
  {Variable:'Elevation',Weight:   score_elevation,Score:elevationTotal,Result:parseFloat(   score_elevation)*elevationTotal},
  {Variable:'Educational facilities',Weight:   score_education,Score:educationTotal,Result:parseFloat(   score_education)*educationTotal},
  {Variable:'Educational facilities without electricity',Weight:   score_edu_no_e,Score:edu_no_eTotal,Result:parseFloat(   score_edu_no_e)*edu_no_eTotal},
  {Variable:'Closest to the grid',Weight:   score_distance,Score:distanceTotal,Result:parseFloat(   score_distance)*distanceTotal},
  {Variable:'Farthest from the grid',Weight:   score_distance_inv,Score:distance_invTotal,Result:parseFloat(   score_distance_inv)*distance_invTotal},
  {Variable:'Armed conflicts',Weight:   score_conflict,Score:conflictTotal,Result:parseFloat(   score_conflict)*conflictTotal},
  {Variable:'Wind potential', Weight:   score_wind,Score:windTotal,Result:parseFloat(   score_wind)*windTotal},
  {Variable:'Hydropower potential', Weight:   score_hydro,Score:hydroTotal,Result:parseFloat(   score_hydro)*hydroTotal},
  {Variable:'Connectivity', Weight:   score_connect,Score:connectTotal,Result:parseFloat(   score_connect)*connectTotal}
  
]


const titleKeys = Object.keys(ourData[0])

const refinedData = []

refinedData.push(titleKeys)

ourData.forEach(item => {
  refinedData.push(Object.values(item))  
})


let csvContent = ''

refinedData.forEach(row => {
  csvContent += row.join(',') + '\n'
})


const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
const objUrl = URL.createObjectURL(blob)
const link = document.createElement('a')
link.setAttribute('href', objUrl)
link.setAttribute('download', 'Stats.csv')
link.textContent = 'Download scenario for the selected area '
$('.download_stats').empty()
document.querySelector('.download_stats').append(link)

$('#download_map').click(function() {
  var img = map.getCanvas().toDataURL('image/png')
  this.href = img
})


  $('#polygon_out_main_area').empty().append('<p>'+(Math.round(DrewAreaArray[0]*100)/100).toLocaleString()+'</em> km<sup>2</sup></p>')
 
  setTimeout(function(){
    Highcharts.chart('polygon_out_main', {
    chart: {
        type: 'column',
        zoomType: 'xy',
        backgroundColor: 'transparent'
    },
    legend: {
      itemStyle: {
         fontSize:'12px',
         color: '#A0A0A0'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#444'
      }
   
},
    title:{
      text: null
      },
    xAxis: {
        categories: [
      'Area equipped for irrigation',
      'Groundwater Irrigation',
      'Most accessible Areas',
      'Least accessible Areas',
      'Livestock',
      'Temperature Anomalies',
      'Solar potential',
      'Slope',
      'Power plants',
      'Population',
      'Protected and Conserved Areas',
      'Natural Areas',
      'Intact Forest',
      'Industrial Areas',
      'Drought Risk',
      'Health centers',
      'electricity grid',
      'Elevation',
      'Educational facilities',
      'Educational facilities without electricity',
      'Close to the existing grid',
      'Far from the existing grid',
      'Armed conflicts',
      'Wind potential',
      'Hydropower potential',
      'Connectivity'
          
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Score'
        }
    },
    colors:['#009933'],
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {

    },
    series: [{
        name: 'Actual Score',
        color: '#78b022',
        data: [parseFloat((irrigationTotal)),	parseFloat((groundwTotal)),	parseFloat((accessTotal)),parseFloat((access_invTotal)),	parseFloat((livesTotal)),	parseFloat((tempanoTotal)),	parseFloat((solarTotal)),	parseFloat((slopeTotal)),	parseFloat((powerplantTotal)),	parseFloat((popdensTotal)),	parseFloat((pcaTotal)),	parseFloat((natareaTotal)),	parseFloat((intactfTotal)),	parseFloat((industrialTotal)),	parseFloat((droughtTotal)),	parseFloat((healthTotal)),	parseFloat((gridTotal)),	parseFloat((elevationTotal)),	parseFloat((educationTotal)),	parseFloat((edu_no_eTotal)), parseFloat((distanceTotal)), parseFloat((distance_invTotal)),	parseFloat((conflictTotal)),	parseFloat((windTotal)),	parseFloat((hydroTotal)),	parseFloat((connectTotal))]

    },
    {
        name: 'Weighted Score',
        color: '#aebaba',
        data: [parseFloat(score_irrigation)*irrigationTotal,	parseFloat(score_groundw)*groundwTotal,	parseFloat(score_access)*accessTotal,	parseFloat(score_access_inv)*access_invTotal, parseFloat(score_lives)*livesTotal,	parseFloat(score_tempano)*tempanoTotal,	parseFloat(score_solar)*solarTotal,	parseFloat(score_slope)*slopeTotal,	parseFloat(score_powerplant)*powerplantTotal,	parseFloat(score_popdens)*popdensTotal,	parseFloat(score_pca)*pcaTotal,	parseFloat(score_natarea)*natareaTotal,	parseFloat(score_intactf)*intactfTotal,	parseFloat(score_industrial)*industrialTotal,	parseFloat(score_drought)*droughtTotal,	parseFloat(score_health)*healthTotal,	parseFloat(score_grid)*gridTotal,	parseFloat(score_elevation)*elevationTotal,	parseFloat(score_education)*educationTotal,	parseFloat(score_edu_no_e)*edu_no_eTotal, parseFloat(score_distance)*distanceTotal,	parseFloat(score_distance_inv)*distance_invTotal,parseFloat(score_conflict)*conflictTotal,	parseFloat(score_wind)*windTotal ,	parseFloat(score_hydro)*hydroTotal,	parseFloat(score_connect)*connectTotal]

    }]


});

Highcharts.chart('polygon_out_main_2', {
  chart: {
        polar: true,
        type: 'column',
        zoomType: 'xy',
        backgroundColor: 'transparent',
        marginTop: 10
    },

    plotOptions: {
            series: {
                fillOpacity: 0.1
            }
        },

    title: {
        text: null
    },
    pane: {
        size: '80%',
        marginTop: 10
    },

    xAxis: {
        categories: [ 
          'Area equipped for irrigation',
          'Groundwater Irrigation',
          'Most accessible Areas',
          'Least accessible Areas',
          'Livestock',
          'Temperature Anomalies',
          'Solar potential',
          'Slope',
          'Power plants',
          'Population',
          'Protected and Conserved Areas',
          'Natural Areas',
          'Intact Forest',
          'Industrial Areas',
          'Drought Risk',
          'Health centers',
          'Electricity grid',
          'Elevation',
          'Educational facilities',
          'Educational facilities without electricity',
          'Close to the existing grid',
          'Far from the existing grid',
          'Armed conflicts',
          'Wind potential',
          'Hydropower potential',
          'Connectivity'
        ],
        tickmarkPlacement: 'on',
        lineWidth: 0

    },

    yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0,
          max: 1,
          tickInterval: 0.2,
    },

    tooltip: {
        shared: true,
        pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.2f}</b><br/>'
    },

    legend: {
        align: 'bottom',
        verticalAlign: 'bottom',
        layout: 'vertical',
        itemStyle: {

          color: '#ffffff'
       }
    },
    series: [{
      marker: {
      enabled: false,
    },
    name: 'Actual Score',
    color: '#144ede',
    type:'line',
    data: [parseFloat((irrigationTotal)),	parseFloat((groundwTotal)),	parseFloat((accessTotal)),parseFloat((access_invTotal)),	parseFloat((livesTotal)),	parseFloat((tempanoTotal)),	parseFloat((solarTotal)),	parseFloat((slopeTotal)),	parseFloat((powerplantTotal)),	parseFloat((popdensTotal)),	parseFloat((pcaTotal)),	parseFloat((natareaTotal)),	parseFloat((intactfTotal)),	parseFloat((industrialTotal)),	parseFloat((droughtTotal)),	parseFloat((healthTotal)),	parseFloat((gridTotal)),	parseFloat((elevationTotal)),	parseFloat((educationTotal)),	parseFloat((edu_no_eTotal)), parseFloat((distanceTotal)), parseFloat((distance_invTotal)),	parseFloat((conflictTotal)),	parseFloat((windTotal)),	parseFloat((hydroTotal)),	parseFloat((connectTotal))]

},
{
    name: 'Weighted Score',
    color: '#dea314',
    data: [parseFloat(score_irrigation)*irrigationTotal,	parseFloat(score_groundw)*groundwTotal,	parseFloat(score_access)*accessTotal,	parseFloat(score_access_inv)*access_invTotal, parseFloat(score_lives)*livesTotal,	parseFloat(score_tempano)*tempanoTotal,	parseFloat(score_solar)*solarTotal,	parseFloat(score_slope)*slopeTotal,	parseFloat(score_powerplant)*powerplantTotal,	parseFloat(score_popdens)*popdensTotal,	parseFloat(score_pca)*pcaTotal,	parseFloat(score_natarea)*natareaTotal,	parseFloat(score_intactf)*intactfTotal,	parseFloat(score_industrial)*industrialTotal,	parseFloat(score_drought)*droughtTotal,	parseFloat(score_health)*healthTotal,	parseFloat(score_grid)*gridTotal,	parseFloat(score_elevation)*elevationTotal,	parseFloat(score_education)*educationTotal,	parseFloat(score_edu_no_e)*edu_no_eTotal, parseFloat(score_distance)*distanceTotal,	parseFloat(score_distance_inv)*distance_invTotal,parseFloat(score_conflict)*conflictTotal,	parseFloat(score_wind)*windTotal, parseFloat(score_hydro)*hydroTotal, parseFloat(score_connect)*connectTotal],
    
}],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 400
            },
            chartOptions: {
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    layout: 'horizontal'
                },
                pane: {
                    size: '79%'
                }
            }
        }]
    }
});

},200);









$('.listings').animate({height:'show'},350);

});


$('.mapbox-gl-draw_polygon').click(function() {
$( "#polygon_out_main > div > p" ).empty();
 $("#listings").empty();
 $( "#polygon_out_main_2 > div > p" ).empty();
});
$('.mapbox-gl-draw_trash').click(function() {
$('#polygon_out_main > div').children("p").remove();
$('#polygon_out_main_ > div').children("p").remove();
 $("#listings").empty();


});


// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
});

map.addControl(new mapboxgl.NavigationControl());



var map;
var markers;
var latestMarker;
var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
var socket = io.connect();

socket.on('connect', function () {
  $('#status').text("online");
  $('#status').removeClass("dis");
});

socket.on('disconnect', function () {
  $('#status').text("offline");
  $('#status').addClass("dis");
});

socket.on('error', function (error) {
  $('#status').text("error");
  $('#status').addClass("dis");
});

socket.on('newpicture', function(picture) {
	$('#pictures').addClass('picturesLoaded');
  var position = new OpenLayers.LonLat(picture.location.longitude, picture.location.latitude).transform( fromProjection, toProjection);
  var elem = addImage(picture);
  addMarker(picture);
  if (latestMarker != undefined) {
    markers.removeMarker(latestMarker);
  }
  latestMarker = addMarker(picture, 'marker-blue.png');
  addEventBindings(elem, picture, position);
  map.setCenter(position);
  setTimeout(function() {
    elem.css('opacity', 1);
  }, 100);
});

function addImage(picture) {
  var elem = $('<img class="image" src="'+picture.images.thumbnail.url+'">');
  $('#pictures').prepend(elem);
  return elem;
}

function addEventBindings(elem, picture, position) {
  var pointerMarker;
  elem.click(function() {
    map.setCenter(position);
    showImageInBox(picture);
  })
  elem.mouseover(function() {
    pointerMarker = addMarker(picture, 'marker-gold.png');
  });
  elem.mouseout(function() {
     markers.removeMarker(pointerMarker);
  });
}

function addMarker(picture, icon) {
  var position = new OpenLayers.LonLat(picture.location.longitude, picture.location.latitude).transform( fromProjection, toProjection);
  var feature = new OpenLayers.Feature(markers, position);
  feature.closeBox = true;
  feature.popupClass = OpenLayers.Class(OpenLayers.Popup.AnchoredBubble, {minSize: new OpenLayers.Size(150, 150) } );
  feature.data.popupContentHTML = '<img src="'+picture.images.thumbnail.url+'">';
  feature.data.overflow = "hidden";

  if (icon === undefined) {
    icon = 'marker.png';
  }
  var i = new OpenLayers.Icon("/img/"+icon);
  var marker = new OpenLayers.Marker(position, i);
  marker.feature = feature;

  var markerClick = function(evt) {
      if (this.popup == null) {
          this.popup = this.createPopup(this.closeBox);
          map.addPopup(this.popup);
          this.popup.show();
      } else {
          this.popup.toggle();
      }
      OpenLayers.Event.stop(evt);
  };
  marker.events.register("mousedown", feature, markerClick);
  markers.addMarker(marker);
  return marker;
}

function showImageInBox(picture) {
  $('#boximage').attr('src', picture.images.standard_resolution.url);
  $('#box').css('display', 'block');
  setTimeout(function() {
    $('#box').css('opacity', 1);
  }, 100);
  $('#caption').html(getCaption(picture));
}

function getCaption(picture) {
  if (picture.caption != null) {
    caption = '<a target="_new" href="'+picture.link+'">'+picture.caption.text.substring(0, 80)+'</a>';
  } else {
    caption = '<a target="_new" href="'+picture.link+'">'+picture.link+'</a>';
  }
  return caption;
}

// doc ready
$(function () {
	initBox();
	initMap();
});

function initBox() {
  $('#box').click(function() {
    $('#box').css('opacity', 0);
    setTimeout(function() {
      $('#box').css('display', 'none');
    }, 1000);
  });
}

function initMap() {
  map = new OpenLayers.Map("map");
  var mapLayer = new OpenLayers.Layer.OSM(
  	'instagram images map', null, {
  		eventListeners: {
  			// make the map grayscale...
				tileloaded: function(evt) {
					var ctx = evt.tile.getCanvasContext();
					if (ctx) {
						var imgd = ctx.getImageData(0, 0, evt.tile.size.w, evt.tile.size.h);
						var pix = imgd.data;
						for (var i = 0, n = pix.length; i < n; i += 4) {
							pix[i] = pix[i + 1] = pix[i + 2] = (3 * pix[i] + 4 * pix[i + 1] + pix[i + 2]) / 8;
						}
						ctx.putImageData(imgd, 0, 0);
						evt.tile.imgDiv.removeAttribute("crossorigin");
						evt.tile.imgDiv.src = ctx.canvas.toDataURL();
					}
				}
			}
		}
	);
	map.addLayer(mapLayer);
	var position = new OpenLayers.LonLat(4.897842,52.37518).transform( fromProjection, toProjection);
	markers = new OpenLayers.Layer.Markers( "Markers" );
	map.addLayer(markers);
	map.setCenter(position, 12);
}
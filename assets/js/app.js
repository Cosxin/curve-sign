var config = {
  geojson: "./data/geoJSON_result.geojson",
  title: "Curve Sign Dashboard",
  layerNames: ["Signs"],
  hoverProperty: "designation",
  sortProperty: "curve_id",
  sortOrder: "desc"
};

var properties = [{
  value: "curve_id",
  label: "curve_id",
  table: {
    visible: true,
    sortable: true
  },
  filter: {
    type: "integer"
  },
  info: false
},
  {
    value: "sign_elevation",
    label: "sign elevation",
    table: {
      visible: false,
      sortable: true
    },
    filter: {
      type: "integer"
    },
    info: false
  },
  {
    value: "designation",
    label: "MUTCD code",
    table: {
      visible: true,
      sortable: true
    },
    filter: {
      type: "string",
      input: "checkbox",
      vertical: true,
      multiple: true,
      operators: ["in", "not_in", "equal", "not_equal"],
      values: []
    }
  },
  {
    value: "old_lat",
    label: "original latitude",
    table: {
      visible: true,
      sortable: true
    }
  },
  {
    value: "old_lon",
    label: "original longitude",
    table: {
      visible: true,
      sortable: true
    }
  },
  {
    value: "current_lat",
    label: "current latitude",
    table: {
      visible: true,
      sortable: true
    }
  },
  {
    value: "current_lng",
    label: "current longitude",
    table: {
      visible: true,
      sortable: true
    }
  },
  {
    value: "inclination",
    label: "original curve c-slope",
    table: {
      visible: true,
      sortable: true
    },
    filter: {
      type: "string",
      input: "checkbox",
      vertical: true,
      multiple: true,
      values: []
    }
  },
  {
    value: "mile_post",
    label: "MP",
    table: {
      visible: true,
      sortable: true
    },
    filter: {
      type: "double"
    },
    info: false
  },
  {
    value: "pcmp",
    label: "curve pcmp",
    table: {
      visible: true,
      sortable: true
    },
    filter: {
      type: "string",
      input: "checkbox",
      vertical: true,
      multiple: true,
      values: []
    }
  },
  {
    value: "ptmp",
    label: "curve ptmp",
    table: {
      visible: true,
      sortable: true
    },
    filter: {
      type: "string",
      input: "checkbox",
      vertical: true,
      multiple: true,
      values: []
    }
  },
  {
    value: "custom_label",
    label: "Label",
    table: {
      visible: true,
      sortable: true,
      editable: true,
    },
    filter: {
      type: "string",
      input: "checkbox",
      vertical: true,
      multiple: true,
      values: []
    }
  },
  {
    value: "moved",
    label: "Changed",
    table: {
      visible: true,
      sortable: true
    },
    filter: {
      type: "string",
      input: "checkbox",
      vertical: true,
      multiple: true,
      values: []
    }
  },
{
  value: "icon_url",
  label: "Icons",
  table: {
    visible: false,
    sortable: false,
    formatter: urlFormatter
  },
  filter: false
}
];

var signInfo = {
    signs : [
        {
          name : 'w1-1_L',
          descr: 'Left Turn',
        },
        {
          name : 'w1-1_R'
        },
        {
          name : 'w1-2_L'
        },
        {
          name : 'w1-2_R'
        },
        {
          name : 'w1-3_L'
        },
        {
          name : 'w1-3_R'
        },
        {
          name : 'w1-4_L'
        },
        {
          name : 'w1-4_R'
        },
        {
          name : 'w1-1_L',
          descr: 'Left Turn',
        },
        {
          name : 'w1-1_R'
        },
        {
          name : 'w1-2_L'
        },
        {
          name : 'w1-2_R'
        },
        {
          name : 'w1-3_L'
        },
        {
          name : 'w1-3_R'
        },
        {
          name : 'w1-4_L'
        },
        {
          name : 'w1-4_R'
        }]
}

var reset = false;

function drawCharts() {
  // Status
  $(function() {
    var result = alasql("SELECT status AS label, COUNT(*) AS total FROM ? GROUP BY status", [features]);
    var columns = $.map(result, function(status) {
      return [[status.label, status.total]];
    });
    var chart = c3.generate({
        bindto: "#status-chart",
        data: {
          type: "pie",
          columns: columns
        }
    });
  });

  // Zones
  $(function() {
    var result = alasql("SELECT congress_park_inventory_zone AS label, COUNT(*) AS total FROM ? GROUP BY congress_park_inventory_zone", [features]);
    var columns = $.map(result, function(zone) {
      return [[zone.label, zone.total]];
    });
    var chart = c3.generate({
        bindto: "#zone-chart",
        data: {
          type: "pie",
          columns: columns
        }
    });
  });

  // Size
  $(function() {
    var sizes = [];
    var regeneration = alasql("SELECT 'Regeneration (< 3\")' AS category, COUNT(*) AS total FROM ? WHERE CAST(dbh_2012_inches_diameter_at_breast_height_46 as INT) < 3", [features]);
    var sapling = alasql("SELECT 'Sapling/poles (1-9\")' AS category, COUNT(*) AS total FROM ? WHERE CAST(dbh_2012_inches_diameter_at_breast_height_46 as INT) BETWEEN 1 AND 9", [features]);
    var small = alasql("SELECT 'Small trees (10-14\")' AS category, COUNT(*) AS total FROM ? WHERE CAST(dbh_2012_inches_diameter_at_breast_height_46 as INT) BETWEEN 10 AND 14", [features]);
    var medium = alasql("SELECT 'Medium trees (15-19\")' AS category, COUNT(*) AS total FROM ? WHERE CAST(dbh_2012_inches_diameter_at_breast_height_46 as INT) BETWEEN 15 AND 19", [features]);
    var large = alasql("SELECT 'Large trees (20-29\")' AS category, COUNT(*) AS total FROM ? WHERE CAST(dbh_2012_inches_diameter_at_breast_height_46 as INT) BETWEEN 20 AND 29", [features]);
    var giant = alasql("SELECT 'Giant trees (> 29\")' AS category, COUNT(*) AS total FROM ? WHERE CAST(dbh_2012_inches_diameter_at_breast_height_46 as INT) > 29", [features]);
    sizes.push(regeneration, sapling, small, medium, large, giant);
    var columns = $.map(sizes, function(size) {
      return [[size[0].category, size[0].total]];
    });
    var chart = c3.generate({
        bindto: "#size-chart",
        data: {
          type: "pie",
          columns: columns
        }
    });
  });

  // Species
  $(function() {
    var result = alasql("SELECT species_sim AS label, COUNT(*) AS total FROM ? GROUP BY species_sim ORDER BY label ASC", [features]);
    var chart = c3.generate({
        bindto: "#species-chart",
        size: {
          height: 2000
        },
        data: {
          json: result,
          keys: {
            x: "label",
            value: ["total"]
          },
          type: "bar"
        },
        axis: {
          rotated: true,
          x: {
            type: "category"
          }
        },
        legend: {
          show: false
        }
    });
  });
}

$(function() {
  $(".title").html(config.title);
  config.layerNames.forEach(function (layerName, i) {
    $("#layer-name" + i).html(layerName);
  });
});

function buildConfig() {
  filters = [];
  table = [{
    field: "action",
    title: "<i class='fa fa-gear'></i>&nbsp;Action",
    align: "center",
    valign: "middle",
    width: "75px",
    cardVisible: false,
    switchable: false,
    formatter: function(value, row, index) {
      return [
        '<a class="zoom" href="javascript:void(0)" title="Zoom" style="margin-right: 10px;">',
          '<i class="fa fa-search-plus"></i>',
        '</a>',
        '<a class="identify" href="javascript:void(0)" title="Identify">',
          '<i class="fa fa-info-circle"></i>',
        '</a>'
      ].join("");
    },
    events: {
      "click .zoom": function (e, value, row, index) {
        map.fitBounds(featureLayer.getLayer(row.leaflet_stamp).getBounds());
        highlightLayer.clearLayers();
        highlightLayer.addData(featureLayer.getLayer(row.leaflet_stamp).toGeoJSON());
      },
      "click .identify": function (e, value, row, index) {
        identifyFeature(row.leaflet_stamp);
        highlightLayer.clearLayers();
        highlightLayer.addData(featureLayer.getLayer(row.leaflet_stamp).toGeoJSON());
      }
    }
  }];



  $.each(properties, function(index, value) {
    // Filter config
    if (value.filter) {
      var id;
      if (value.filter.type == "integer") {
        id = "cast(properties->"+ value.value +" as int)";
      }
      else if (value.filter.type == "double") {
        id = "cast(properties->"+ value.value +" as double)";
      }
      else {
        id = "properties->" + value.value;
      }
      filters.push({
        id: id,
        label: value.label
      });
      $.each(value.filter, function(key, val) {
        if (filters[index]) {
          // If values array is empty, fetch all distinct values
          if (key == "values" && val.length === 0) {
            alasql("SELECT DISTINCT(properties->"+value.value+") AS field FROM ? ORDER BY field ASC", [geojson.features], function(results){
              distinctValues = [];
              $.each(results, function(index, value) {
                distinctValues.push(value.field);
              });
            });
            filters[index].values = distinctValues;
          } else {
            filters[index][key] = val;
          }
        }
      });
    }
    // Table config
    if (value.table) {
      table.push({
        field: value.value,
        title: value.label
      });
      $.each(value.table, function(key, val) {
        if (table[index+1]) {
          table[index+1][key] = val;
        }
      });
    }
  });

  buildFilters();
  buildTable();
  buildSidebar();
}


// Basemap Layers

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
/*
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);
*/

var highlightLayer = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 5,
      color: "#FFF",
      weight: 2,
      opacity: 1,
      fillColor: "#00FFFF",
      fillOpacity: 1,
      clickable: false
    });
  },
  style: function (feature) {
    return {
      color: "#00FFFF",
      weight: 2,
      opacity: 1,
      fillColor: "#00FFFF",
      fillOpacity: 0.5,
      clickable: false
    };
  }
});

var featureLayer = L.geoJson(null, {
  filter: function(feature, layer) {
    latitude = feature.geometry.coordinates[0];
    longitude = feature.geometry.coordinates[1];
    return feature.geometry.coordinates[0] !== 0 && feature.geometry.coordinates[1] !== 0;
  },
  /*style: function (feature) {
    return {
      color: feature.properties.color
    };
  },*/
  pointToLayer: function (feature, latlng) {
    if (feature.properties && feature.properties["marker-color"]) {
      markerColor = feature.properties["marker-color"];
    } else {
      markerColor = "#FF0000";
    }
    var icon = L.icon({
      iconUrl: feature.properties["icon_url"],
      iconSize: [25, 30]
    });
    var marker = L.marker(latlng, {
      icon:icon,
      draggable: true,
      opacity: 1,
    });
    var shadow_marker = new L.marker([feature.properties.old_lat, feature.properties.old_lon], {
      icon:icon,
      opacity: 0.2,
    });
    marker.on('drag', function(e){
        shadow_marker.addTo(map);
    });
    marker.on('dragend', function (e) {
      marker.feature.properties.moved = true;
      shadow_marker.remove();
      syncTable();
    });
    return marker;
    /*
    return L.circleMarker(latlng, {
      radius: 4,
      weight: 2,
      fillColor: markerColor,
      color: markerColor,
      opacity: 1,
      fillOpacity: 1
    });
    */
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      layer.on({
        click: function (e) {
          identifyFeature(L.stamp(layer));
          highlightLayer.clearLayers();
          highlightLayer.addData(featureLayer.getLayer(L.stamp(layer)).toGeoJSON());
        },
        mouseover: function (e) {
          if (config.hoverProperty) {
            $(".info-control").html(feature.properties[config.hoverProperty]);
            $(".info-control").show();
          }
        },
        mouseout: function (e) {
          $(".info-control").hide();
        }
      });
    }
  }
});


// Fetch the GeoJSON file
$.getJSON(config.geojson, function (data) {
  geojson = data;
  features = $.map(geojson.features, function (feature) {
    return feature.properties;
  });
  featureLayer.addData(data);
  buildConfig();
  $("#loading-mask").hide();
});

var map = L.map("map", {
  layers: [OpenStreetMap_Mapnik, featureLayer, highlightLayer]
}).fitWorld();

// ESRI geocoder
var searchControl = L.esri.Geocoding.geosearch({
  useMapBounds: 17
}).addTo(map);


// Info control
var info = L.control({
  position: "bottomleft"
});

// Custom info hover control
info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info-control");
  this.update();
  return this._div;
};
info.update = function (props) {
  this._div.innerHTML = "";
};
info.addTo(map);
$(".info-control").hide();

// Larger screens get expanded layer control
if (document.body.clientWidth <= 767) {
  isCollapsed = true;
} else {
  isCollapsed = false;
}
var baseLayers = {
  "Street Map": OpenStreetMap_Mapnik,
  "Aerial Imagery": Esri_WorldImagery
};
var overlayLayers = {
  "<span id='layer-name0'>GeoJSON Layer</span>": featureLayer,
};
var layerControl = L.control.layers(baseLayers, overlayLayers, {
  collapsed: isCollapsed
}).addTo(map);


// Filter table to only show features in current map bounds
map.on("moveend", function (e) {
  syncTable();
});

map.on("click", function (e) {
  highlightLayer.clearLayers();
});

// Table formatter to make links clickable
function urlFormatter(value, row, index) {
  if (typeof value == "string" && (value.indexOf("http") === 0 || value.indexOf("https") === 0)) {
    return "<a href='" + value + "' target='_blank'>" + value + "</a>";
  }
}

function buildFilters() {
  $("#query-builder").queryBuilder({
    allow_empty: true,
    filters: filters
  });
}

function applyFilter() {
  var query = "SELECT * FROM ?";
  var sql = $("#query-builder").queryBuilder("getSQL", false, false).sql;
  if (sql.length > 0) {
    query += " WHERE " + sql;
  }
  alasql(query, [geojson.features], function (features) {
    featureLayer.clearLayers();
    featureLayer.addData(features);
    syncTable();
  });
}

function buildTable() {
  $("#table").bootstrapTable({
    cache: false,
    height: $("#table-container").height(),
    undefinedText: "",
    striped: false,
    pagination: false,
    minimumCountColumns: 1,
    sortName: config.sortProperty,
    sortOrder: config.sortOrder,
    toolbar: "#toolbar",
    search: true,
    trimOnSearch: false,
    showColumns: true,
    showToggle: true,
    columns: table,
    scrollX: true,
    onClickRow: function (row) {
      // do something!
    },
    onDblClickRow: function (row) {
      map.panTo(new L.LatLng(row.current_lat, row.current_lng));
      // do something!
    }
  });

  map.fitBounds(featureLayer.getBounds(),
      {
        animate: false,
      });

  $(window).resize(function () {
    $("#table").bootstrapTable("resetView", {
      height: $("#table-container").height()
    });
  });
}

function syncTable() {
  tableFeatures = [];
  featureLayer.eachLayer(function (layer) {
    layer.feature.properties.leaflet_stamp = L.stamp(layer);
    layer.feature.properties.current_lat = layer.getLatLng().lat;
    layer.feature.properties.current_lng = layer.getLatLng().lng;   
    if (map.hasLayer(featureLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        //TODO: Not working if mix feature types in single geojson file
        tableFeatures.push(layer.feature.properties);
      }
    }
  });

  $("#table").bootstrapTable("load", JSON.parse(JSON.stringify(tableFeatures)));
  var featureCount = $("#table").bootstrapTable("getData").length;
  if (featureCount == 1) {
    $("#feature-count").html($("#table").bootstrapTable("getData").length + " visible feature");
  } else {
    $("#feature-count").html($("#table").bootstrapTable("getData").length + " visible features");
  }
}
function resetMarker(id) {
  var layer = featureLayer.getLayer(id);
  layer.setLatLng([layer.feature.properties.old_lat, layer.feature.properties.old_lon]);
  syncTable();
}

function identifyFeature(id) {
  var featureProperties = featureLayer.getLayer(id).feature.properties;
  var content = "<table class='table table-striped table-bordered table-condensed'>";
  $("#resetMarker").off("click").on("click", function () { resetMarker(id); });
  $.each(featureProperties, function (key, value) {
    if (!value) {
      value = "";
    }
    if (typeof value == "string" && (value.indexOf("http") === 0 || value.indexOf("https") === 0)) {
      value = "<a href='" + value + "' target='_blank'>" + value + "</a>";
    }
    $.each(properties, function (index, property) {
      if (key == property.value) {
        if (property.info !== false) {
          content += "<tr><th>" + property.label + "</th><td>" + value + "</td></tr>";
        }
      }
    });
  });
  content += "<table>";
  $("#feature-info").html(content);
  $("#featureModal").modal("show");
}


function buildSidebar ()
{
  signInfo.signs.forEach(function (sign)
      {
        $("#sidebar-signs-container").append("<div class='card'> <img class='card-img-top'" +
        "src='./assets/images/" + sign.name + ".png' height='50px' alt='Card image'> <div class='card-body'>" +
        "<h5 class='card-title'>" + sign.name + "</h5></div></div>")
      }
      );
}
/*
  Register button callback functions
*/

$(function () {
  addClickEvents();
  addDropEvents();
})

function switchView(view) {
  if (view == "split") {
    $("#view").html("Split View");
    location.hash = "#split";
    $("#table-container").show();
    $("#table-container").css("height", "55%");
    $("#map-container").show();
    $("#map-container").css("height", "45%");
    $(window).resize();
    if (map) {
      map.invalidateSize();
    }
  } else if (view == "map") {
    $("#view").html("Map View");
    location.hash = "#map";
    $("#map-container").show();
    $("#map-container").css("height", "100%");
    $("#table-container").hide();
    if (map) {
      map.invalidateSize();
    }
  } else if (view == "table") {
    $("#view").html("Table View");
    location.hash = "#table";
    $("#table-container").show();
    $("#table-container").css("height", "100%");
    $("#map-container").hide();
    $(window).resize();
  }
}


function addClickEvents() {
  $("[name='view']").click(function () {
    $(".in,.open").removeClass("in open");
    if (this.id === "map-graph") {
      switchView("split");
      return false;
    } else if (this.id === "map-only") {
      switchView("map");
      return false;
    } else if (this.id === "graph-only") {
      switchView("table");
      return false;
    }
  });

  $("#about-btn").click(function () {
    $("#aboutModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });

  $("#filter-btn").click(function () {
    $("#filterModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });

  $("#chart-btn").click(function () {
    $("#chartModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });

  $("#view-sql-btn").click(function () {
    alert($("#query-builder").queryBuilder("getSQL", false, false).sql);
  });

  $("#apply-filter-btn").click(function () {
    applyFilter();
  });

  $("#reset-filter-btn").click(function () {
    $("#query-builder").queryBuilder("reset");
    applyFilter();
  });

  $("#extent-btn").click(function () {
    map.fitBounds(featureLayer.getBounds());
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });

  $("#download-csv-btn").click(function () {
    $("#table").tableExport({
      type: "csv",
      ignoreColumn: [0],
      fileName: "data"
    });
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });

  $("#download-excel-btn").click(function () {
    $("#table").tableExport({
      type: "excel",
      ignoreColumn: [0],
      fileName: "data"
    });
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });

  $("#download-pdf-btn").click(function () {
    $("#table").tableExport({
      type: "pdf",
      ignoreColumn: [0],
      fileName: "data",
      jspdf: {
        format: "bestfit",
        margins: {
          left: 20,
          right: 10,
          top: 20,
          bottom: 20
        },
        autotable: {
          extendWidth: false,
          overflow: "linebreak"
        }
      }
    });
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });

  $("#download-geojson-btn").click(function () {
    var file = new File([JSON.stringify(featureLayer.toGeoJSON())], "download.geojson", {type: "Content-type: application/json;"});
    saveAs(file);
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });

  $("#chartModal").on("shown.bs.modal", function (e) {
    drawCharts();
  });
}

/*
  Functions to support Drag-n-Drop GeoJSON
 */


function addDropEvents() {
  // set up the drag & drop events
  var mapContainer = document.getElementById('map-container');
  var dropContainer = document.getElementById('drop-container');

  // map-specific events
  mapContainer.addEventListener('dragenter', showPanel, false);

  // overlay specific events (since it only appears once drag starts)
  dropContainer.addEventListener('dragover', showPanel, false);
  dropContainer.addEventListener('drop', handleDrop, false);
  dropContainer.addEventListener('dragleave', hidePanel, false);
}

function showPanel(e) {
  e.stopPropagation();
  e.preventDefault();
  document.getElementById('drop-container').style.display = 'block';
  return false;
}

function hidePanel(e) {
  document.getElementById('drop-container').style.display = 'none';
}

function loadGeoJsonString(geoString) {
  var geojson = JSON.parse(geoString);
  featureLayer.clearLayers();
  features = $.map(geojson.features, function (feature) {
    return feature.properties;
  });
  featureLayer.addData(geojson);
  buildConfig();
  $("#loading-mask").hide();
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  hidePanel(e);

  var files = e.dataTransfer.files;

  if (files.length) {
    // process file(s) being dropped
    // grab the file data from each file
    for (var i = 0, file; file = files[i]; i++) {
      var reader = new FileReader();
      reader.onload = function(e) {
        loadGeoJsonString(e.target.result);
      };
      reader.onerror = function(e) {
        console.error('reading failed');
      };
      reader.readAsText(file);
    }
  } else {
    // process non-file (e.g. text or html) content being dropped
    // grab the plain text version of the data
    var plainText = e.dataTransfer.getData('text/plain');
    if (plainText) {
      loadGeoJsonString(plainText);
    }
  }

  // prevent drag event from bubbling further
  return false;
}


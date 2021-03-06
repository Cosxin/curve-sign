var config = {
  geojson: "./data/results.geojson",
  title: "Curve Sign Dashboard",
  layerNames: ["Signs"],
  hoverProperty: "designation",
  sortProperty: "curve_id",
  sortOrder: "desc",
  iconWidth: 15,
  iconHeight: 20,
};

var metaInfo =
    [
      {
        key: "County Name",
        value: "Dade County, GA"
      },
      {
        key: "Route Name",
        value: "SR301"
      },
      {
        key: "Starting Milepost",
        value: "4.1"
      },
      {
        key: "Ending Milepost",
        value: "6.9"
      },
      {
        key: "Generated By",
        value: "A Steele"
      },
      {
        key: "Lateral Friction Limit",
        value: "12.0"
      },
      {
        key: "Model Geometry",
        value: "Parabolic"
      },
      {
        key: "Global Offset",
        value: 0,

      }
    ]

var tableComponent = {

  tableFeatures: [],
  tableProperties: [{
    value: "curve_id",
    label: "curve_id",
    table: {
      visible: true,
      sortable: true,
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
    },/*
      {
        value: "designation",
        label: "MUTCD code",
        table: {
          visible: true,
          sortable: true,
        },
        filter: {
          type: "string",
          input: "checkbox",
          vertical: true,
          multiple: true,
          operators: ["in", "not_in", "equal", "not_equal"],
        }
      },*/
    {
      value: "old_lat",
      label: "original latitude",
      table: {
        visible: false,
        sortable: true
      }
    },
    {
      value: "old_lon",
      label: "original longitude",
      table: {
        visible: false,
        sortable: true
      }
    },
    {
      value: "current_lat",
      label: "current latitude",
      table: {
        visible: false,
        sortable: true
      }
    },
    {
      value: "current_lng",
      label: "current longitude",
      table: {
        visible: false,
        sortable: true
      }
    },
    {
      value: "inclination",
      label: "original curve c-slope",
      table: {
        visible: false,
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
        visible: false,
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
        visible: false,
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
        visible: false,
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
        formatter: function urlFormatter(value, row, index) {
          if (typeof value == "string" && (value.indexOf("http") === 0 || value.indexOf("https") === 0)) {
            return "<a href='" + value + "' target='_blank'>" + value + "</a>";
          }
        },
        filter: false
      }
    }
  ],

  init: function()
  {
    $("#table").bootstrapTable("load", JSON.parse(JSON.stringify(this.tableFeatures)));
    var featureCount = $("#table").bootstrapTable("getData").length;
    if (featureCount == 1) {
      $("#feature-count").html($("#table").bootstrapTable("getData").length + " visible feature");
    } else {
      $("#feature-count").html($("#table").bootstrapTable("getData").length + " visible features");
    }
  },

  createNew : function ()
  {
    return;
  },

  applyFilter : function () {
    var query = "SELECT * FROM ?";
    var sql = $("#query-builder").queryBuilder("getSQL", false, false).sql;
    if (sql.length > 0) {
      query += " WHERE " + sql;
    }
    alasql(query, [mapComponent.featureLayer.toGeoJSON().features], function (features) {
      mapComponent.clearLayers();
      mapComponent.addData(features);
      this.syncTable();
    });
  },

  syncTable : function ()
  {
    tableComponent.tableFeatures = [];
    mapComponent.featureLayer.eachLayer(function (layer) {
      layer.feature.properties.leaflet_stamp = L.stamp(layer);
      //layer.feature.properties.current_lat = layer.getLatLng().lat;
      //layer.feature.properties.current_lng = layer.getLatLng().lng;
      if (mapComponent.map.hasLayer(mapComponent.featureLayer)) {
        if (mapComponent.map.getBounds().contains(layer.getLatLng())) {
          tableComponent.tableFeatures.push(layer.feature.properties);
        }
      }
    });

    $("#table").bootstrapTable("load", JSON.parse(JSON.stringify(tableComponent.tableFeatures)));
    var featureCount = $("#table").bootstrapTable("getData").length;
    if (featureCount == 1) {
      $("#feature-count").html($("#table").bootstrapTable("getData").length + " visible feature");
    } else {
      $("#feature-count").html($("#table").bootstrapTable("getData").length + " visible features");
    }
  },

  buildTable : function()
  {
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
        mapComponent.map.panTo(new L.LatLng(row.current_lat, row.current_lng));
        // do something!
      },
      onEditableSave: function (field, row, rowIdx, el) {
        var newValue = row[field]
        var marker = mapComponent.featureLayer.getLayer(row.leaflet_stamp);
        marker.feature.properties[field] = newValue
      }
    });

    //Todo: Does this trigger a table update?
    mapComponent.map.fitBounds(mapComponent.featureLayer.getBounds(),
        {
          animate: false,
        });

    $(window).resize(function () {
      $("#table").bootstrapTable("resetView", {
        height: $("#table-container").height()
      });
    });
  },

  buildConfig : function ()
  {

    filters = [];

    table = [{
      field: "action",
      title: "<i class='fa fa-gear'></i>&nbsp;Action",
      align: "center",
      valign: "middle",
      width: "75px",
      cardVisible: false,
      switchable: false,
      formatter: function (value, row, index) {
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
          mapComponent.map.fitBounds(mapComponent.featureLayer.getLayer(row.leaflet_stamp).getBounds());
          mapComponent.highlightLayer.clearLayers();
          mapComponent.highlightLayer.addData(mapComponent.featureLayer.getLayer(row.leaflet_stamp).toGeoJSON());
        },
        "click .identify": function (e, value, row, index) {
          mapComponent.identifyFeature(row.leaflet_stamp);
          mapComponent.highlightLayer.clearLayers();
          mapComponent.highlightLayer.addData(mapComponent.featureLayer.getLayer(row.leaflet_stamp).toGeoJSON());
        }
      }
    }];

    $.each(this.tableProperties, function (index, value) {
      // Filter config
      if (value.filter) {
        var id;
        if (value.filter.type == "integer") {
          id = "cast(properties->" + value.value + " as int)";
        }
        else if (value.filter.type == "double") {
          id = "cast(properties->" + value.value + " as double)";
        }
        else {
          id = "properties->" + value.value;
        }
        filters.push({
          id: id,
          label: value.label
        });

        $.each(value.filter, function (key, val) {
          if (filters[index]) {
            // If values array is empty, fetch all distinct values
            if (key == "values" && val.length === 0) {
              alasql("SELECT DISTINCT(properties->" + value.value + ") AS field FROM ? ORDER BY field ASC",
                  [mapComponent.featureLayer.toGeoJSON().features],
                  function (results) {
                    distinctValues = [];
                    $.each(results, function (index, value) {
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
        $.each(value.table, function (key, val) {
          if (table[index + 1]) {
            table[index + 1][key] = val;
          }
        });
      }
    });

    $("#query-builder").queryBuilder({
      allow_empty: true,
      filters: filters
    });

    this.buildTable();

  }

};

var mapComponent = {

  map: null,
  highlightLayer : null,
  featureLayer: null,
  curveLayer: null,
  info: null,

  baseLayers: null,
  overlayLayers: null,

  searchControl: null,
  layerControl: null,
  scaleBarControl: null,
  polyMeasureControl: null,
  sliderControl: null,

  activeCurveID: -1,

  mapCollection :
      {
        "Esri_WorldStreetMap": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }),

        "Esri_WorldImagery" : L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }),
      },

  init : function ()
  {
    this.createLayers();

    this.map = L.map("map", {
      layers: [this.mapCollection["Esri_WorldStreetMap"], this.featureLayer, this.curveLayer],
      preferCanvas: true
    }).fitWorld();

    this.initControls()

    this.bindCallbacks()
  },

  createLayers : function ()
  {

    this.highlightLayer = L.geoJson(null, {
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

    this.featureLayer = L.geoJson(null, {
      filter: function (feature, layer) {
        return feature.properties.featureType == "sign" && feature.geometry.coordinates[0] !== 0 && feature.geometry.coordinates[1] !== 0;
      },
      pointToLayer: function (feature, feature_latlng) {
        var latlng = L.latlng
        if (feature.properties && feature.properties["marker-color"]) {
          markerColor = feature.properties["marker-color"];
        } else {
          markerColor = "#FF0000";
        }
        var icon = L.icon({
          iconUrl: feature.properties["icon_url"],
          iconSize: [config.iconWidth, config.iconHeight]
        });
        var marker = L.marker(feature_latlng, {
          icon: icon,
          draggable: true,
          opacity: 1,
        });
        var shadow_marker = new L.marker([feature.properties.old_lat, feature.properties.old_lon], {
          icon: icon,
          opacity: 0.2,
        });
        marker.on('drag', function (e) {
          shadow_marker.addTo(mapComponent.map);
        });
        marker.on('dragend', function (e) {
          marker.feature.properties.moved = true;
          shadow_marker.remove();
          tableComponent.syncTable();
        });
        return marker;
      },
        onEachFeature: function (feature, layer) {
          if (feature.properties) {
            layer.on({
              click: function (e) {
                mapComponent.identifyFeature(L.stamp(layer));
                mapComponent.highlightLayer.clearLayers();
                mapComponent.highlightLayer.addData(mapComponent.featureLayer.getLayer(L.stamp(layer)).toGeoJSON());
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

    this.curveLayer = L.geoJson(null, {
      filter: function (feature, layer) {
        return feature.properties.featureType == "curve" && feature.geometry.coordinates[0] !== 0 && feature.geometry.coordinates[1] !== 0;
      },
      pointToLayer: function (feature, feature_latlng) {

        var pointA = new L.LatLng(feature.properties.pc_lat, feature.properties.pc_lon);
        var pointB = new L.LatLng(feature.properties.pt_lat, feature.properties.pt_lon);
        var pointC = feature_latlng;
        var pointList = [pointA, pointC];
        var secondPointList = [pointB, pointC];

        var firstpolyline = new L.Polyline(pointList, {
          color: 'red',
          weight: 1,
          opacity: 0.5,
          smoothFactor: 1
        });
        var secondpolyline = new L.Polyline(secondPointList, {
          color: 'red',
          weight: 1,
          opacity: 0.5,
          smoothFactor: 1
        });

        var pcMarker = L.marker(pointA, {
          icon: L.divIcon({
            html: '<strong class="fa-stack-1x">PC</strong>',
            iconSize: [7, 7],
            class: "curveDivIcon"
          })
        });

        var ptMarker = L.marker(pointB, {
          icon: L.divIcon({
            html: '<strong class="fa-stack-1x">PT</strong>',
            iconSize: [7, 7],
            class: "curveDivIcon"
          })
        });

        var curve_id = feature.properties.curve_id
        var centerMarker = L.marker(pointC, {
          icon: L.divIcon({
            html: '<strong class="fa-stack-1x">'+curve_id+'</strong>',
            iconSize: [7, 7],
            class: "curveDivIcon"
          })
        });

        centerMarker.bindPopup('<input type="range" min="0" max="10" value="0" className="curve_slider" oninput="mapComponent.adjustLateralOffset('+curve_id+', this.value / 50)">');

        return L.featureGroup([firstpolyline, secondpolyline, centerMarker, pcMarker, ptMarker]);
      }

    });


    this.baseLayers = {
      "Street Map":  this.mapCollection["Esri_WorldStreetMap"],
      "Aerial Imagery": this.mapCollection["Esri_WorldImagery"]
    };

    this.overlayLayers = {
      "<span id='layer-name0'>Sign Layer</span>": this.featureLayer,
      "<span id='layer-name1'>Curve Layer</span>": this.curveLayer,
    };

  },

  addData : function (data)
  {
    //check if data is Geojson data
    this.featureLayer.addData(data);
    this.curveLayer.addData(data);
  },
  clearData: function ()
  {
    this.featureLayer.clearLayers();
    this.curveLayer.clearLayers();
  },

  initControls: function ()
  {
    this.searchControl = L.esri.Geocoding.geosearch({
      useMapBounds: 17
    }).addTo(this.map);

    this.info = L.control({
      position: "bottomleft"
    });

    this.layerControl = L.control.layers(this.baseLayers, this.overlayLayers, {
      collapsed: isCollapsed
    }).addTo(this.map);

    // Ruler
    this.scaleBarControl = L.control.scale().addTo(this.map);

    // Polyline Measure
    this.polyMeasureControl = L.control.polylineMeasure().addTo(this.map);

    // Global Slider
    this.sliderControl = L.control.slider().addTo(this.map);
  },

  bindCallbacks : function ()
  {
    // Filter table to only show features in current map bounds
    this.map.on("moveend", function (e) {
      tableComponent.syncTable();
    });

    this.map.on("click", function (e) {
      mapComponent.highlightLayer.clearLayers();
    });

    // Hover control
    this.info.onAdd = function (map) {
      this._div = L.DomUtil.create("div", "info-control");
      this.update();
      return this._div;
    };

    this.info.update = function (props) {
      this._div.innerHTML = "";
    };

    this.info.addTo(this.map);
    $(".info-control").hide();
  },

  identifyFeature : function (id) {
    var featureProperties = this.featureLayer.getLayer(id).feature.properties;
    var content = "<table class='table table-striped table-bordered table-condensed'>";
    $("#resetMarker").off("click").on("click", function () { this.resetMarker(id); });
    $("#deleteMarker").off("click").on("click", function () { this.deleteMarker(id); });
    $.each(featureProperties, function (key, value) {
      if (!value) {
        value = "";
      }
      if (typeof value == "string" && (value.indexOf("http") === 0 || value.indexOf("https") === 0)) {
        value = "<a href='" + value + "' target='_blank'>" + value + "</a>";
      }
      $.each(tableComponent.tableProperties, function (index, property) {
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
  },

  resetMarker : function (id) {
    var layer = this.featureLayer.getLayer(id);
    layer.setLatLng([layer.feature.properties.old_lat, layer.feature.properties.old_lon]);
    tableComponent.syncTable();
  },

  deleteMarker: function (id) {
    this.featureLayer.removeLayer(id);
    tableComponent.syncTable();
  },

  adjustLateralOffset: function(curve_id, newOffset){
    console.log("Hello");
    var selectedLayers;
    console.log(curve_id);
    //used for global slider if -1, otherwise select a sepcific curve
    if (curve_id == -1) {
      console.log("before" );
      selectedLayers = mapComponent.featureLayer.getLayers();
      console.log("after");

    } else {
      selectedLayers = mapComponent.featureLayer.getLayers().filter(d=>d.feature.properties.curve_id == curve_id);
    }
    console.log(selectedLayers);
    selectedLayers.forEach(function(layer)
    {
      var newLat = layer.feature.properties.old_lat + newOffset / 1000 * layer.feature.properties.outer_vector_lat;
      var newLon = layer.feature.properties.old_lon + newOffset / 1000 * layer.feature.properties.outer_vector_lon;
      layer.setLatLng([newLat, newLon]);
      console.log([newOffset, newLat, newLon])
    });
  }
}

//Run Once
$(function init() {

  isCollapsed = false;

  $(".title").html(config.title);
  config.layerNames.forEach(function (layerName, i) {
    $("#layer-name" + i).html(layerName);
  });


  // Add button callbacks
  addClickEvents();

  // Add drag n drop callbacks
  addDropEvents();

  // Map customization
  mapComponent.init();

  // Initalize Table
  tableComponent.init();

  // Larger screens get expanded layer control
  if (document.body.clientWidth <= 767) {
    isCollapsed = true;
  } else {
    isCollapsed = false;
  }

  ////////////////////////////////////////
  // Fetch the GeoJSON file
  ////////////////////////////////////////
  $.getJSON(config.geojson, function (data) {
    mapComponent.addData(data)
    tableComponent.buildConfig()
    $("#loading-mask").hide()
  });


});



////////////////////////////////////////
// Register Global Callback Functions
////////////////////////////////////////


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
  $("#filter-btn").click(function () {
    $("#filterModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });

  $("#total-btn").click(function () {
    $("#totalModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });

  $("#view-sql-btn").click(function () {
    alert($("#query-builder").queryBuilder("getSQL", false, false).sql);
  });

  $("#apply-filter-btn").click(function () {
    tableComponent.applyFilter();
  });

  $("#reset-filter-btn").click(function () {
    $("#query-builder").queryBuilder("reset");
    tableComponent.applyFilter();
  });

  $("#extent-btn").click(function () {
    mapComponent.map.fitBounds(mapComponent.featureLayer.getBounds());
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
    window.localStorage.metaInfo = JSON.stringify(metaInfo);
    window.localStorage.featureInfo = JSON.stringify(mapComponent.featureLayer.toGeoJSON());
    window.open('./report.html', '_blank');
    return false;
  });

  $("#download-geojson-btn").click(function () {
    var file = new File([JSON.stringify(mapComponent.featureLayer.toGeoJSON())], "download.geojson", { type: "Content-type: application/json;" });
    saveAs(file);
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });

  $("#totalModal").on("shown.bs.modal", function (e) {
    generateTotals();
  });

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
}

////////////////////////////////////////
// Functions to support Drag-n-Drop GeoJSON
////////////////////////////////////////

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
    mapComponent.clearData();
    // features = $.map(geojson.features, function (feature) {
    //   return feature.properties;
    // });
    mapComponent.addData(geojson);
    tableComponent.buildConfig();
    //generateTotals();
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
        reader.onload = function (e) {
          loadGeoJsonString(e.target.result);
        };
        reader.onerror = function (e) {
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
}

////////////////////////////////////////
// Generate Total After LoadGeoJSON is complete
////////////////////////////////////////

var generateTotals = function() {
  //metadata
  $("#metaTotalTable").bootstrapTable({
    columns: [{
      field: 'key',
      title: 'Key'
    }, {
      field: 'value',
      title: 'Value'
    }
    ],
    data: metaInfo,
    showColumns: true,
  })

  var tableEntries = $.map(mapComponent.featureLayer.toGeoJSON().features, function (feature) {
    return feature.properties;
  });

  //by curve
  $(function () {
    $("#curveTotalTable").bootstrapTable({
      columns: [{
        field: 'curve_id',
        title: 'Curve ID',
        width: 50,
        align: 'center'
      }, {
        field: 'route_direction',
        title: 'Curve Direction',
        align: 'center'
      }, {
        field: 'pcmp',
        title: 'PC Location',
        align: 'center'
      },{
        field: 'designation',
        title: 'Sign Type',
        align: 'center'
      },{
        field: 'road_side',
        title: 'Side of Curve',
        align: 'center'
      },{
        field: 'face',
        title: 'Facing',
        align: 'center'
      },
      {
        field: 'distance_from_pc',
        title: 'Distance to PC',
        align: 'center'
      },
      {
        field: 'mile_post',
        title: 'Milepost',
        align: 'center'
      },
      {
        field: 'required',
        title: 'Required',
        align: 'center'
      }
      ],
      data: tableEntries,
      groupBy: true,
      groupByField: 'curve_id',
      groupByFormatter: function(value, i, data){return "Curve: " + value + " | " + "Sign Counts: " + data.length;},
      showColumns: true,
    })
  });

  //by sign
  $(function () {
    var result = alasql("SELECT sign_code as Sign, COUNT(*) AS Quantity FROM ? GROUP BY sign_code", [tableEntries]);
    var data = $.map(result, function (sign) {
      return {
        Sign: sign.Sign,
        Image: "<img class='card-img-top'" + "src='./assets/images/" + sign.Sign + ".png' height= '50px' alt='Card image'>",
        Quantity: sign.Quantity,
      }
    });
    $("#signTotalTable").bootstrapTable({
      columns: [{
        field: 'Sign',
        title: "Sign",
      }, {
        field: 'Image',
        title: 'Image',
      }, {
        field: 'Quantity',
        title: 'Quantity',
      }],
      data: data,
      showColumns: true,
    })
  });
};
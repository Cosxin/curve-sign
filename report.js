var config = {
    geojson: "./data/geoJSON_result.geojson",
    layerNames: ["Signs"],
    sortProperty: "curve_id",
    sortOrder: "desc",
}

//groups the points by their curve_id into an object
var numCurves = 0;
function groupCurves(data) {
    var curves = new Object()
    prevCurveID = null;
    for (var index in data.features) {
        point = data.features[index];
        currID = point.properties.curve_id;
        if (prevCurveID == null || currID != prevCurveID) {
            curves[currID] = [point];
            prevCurveID = currID;
            numCurves++;
        } else {
            curves[currID].push(point);
        }
    }
    return curves;
}
//creates the featureLayer for each map
function createLayer() {
    var featureLayer = L.geoJson(null, {
        filter: function (feature, layer) {
            return feature.geometry.coordinates[0] !== 0 && feature.geometry.coordinates[1] !== 0;
        },
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
            icon: icon,
            draggable: true,
            opacity: 1,
            });
            return marker;
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
    return featureLayer;
}

//generates tables given the curves object
//can potentially generate the maps here, using only the points in that curve so that only the markers for that curve show
function generateTables(data) {
    for (var index in data) {
        curve = data[index];
        //establish header
        currID = curve[0].properties.curve_id;
        tableID = "table" + index;
        var content = "<table id=" + tableID + " class='table'><thead><tr> <th scope='col'> Curve " + index + "</th><th scope='col'>Curve Direction</th><th scope='col'>Sign Type</th><th scope='col'>Side of Curve</th><th scope='col'>Distance to PC</th><th scope='col'>Mile Post</th><th scope='col'>Required</th></tr></thead><tbody>";
        var currLayer = createLayer();
        for (var pointIndex in curve) {
            currLayer.addData(curve[pointIndex]);
            content+= "<tr> <th scope = 'row'>" + pointIndex + "</th>";
            content+= "<td>" + curve[pointIndex].properties.route_direction + "</td>";
            content+= "<td>" + curve[pointIndex].properties.sign_code + "</td>";
            content+= "<td>" + curve[pointIndex].properties.road_side + "</td>";
            content+= "<td>" + curve[pointIndex].properties.distance_from_pc + "</td>";
            content+= "<td>" + curve[pointIndex].properties.mile_post + "</td>";
            content+= "<td>" + curve[pointIndex].properties.required + "</td>";

        }
        content+= "</tr></tbody></table>";
        mapID = "map" + index;
        content+="<div id = " + mapID + " class='map-container'></div><P style='page-break-before: always'>";
        $('#testTables').append(content);
        var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          });
        L.map(mapID, {
            layers: [Esri_WorldImagery, currLayer]
        }).fitBounds(currLayer.getBounds());

    }
}

//generates metaTable and bySign Table

function generateTotals(geojson, metaInfo) {
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

    var curves = geojson.features.map(x=>x.properties);
    //by sign
    $(function () {
        var result = alasql("SELECT sign_code as Sign, COUNT(*) AS Quantity FROM ? GROUP BY sign_code", [curves]);
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


////////////////////////////////////////
// Initialize, the map sign features should be stored in the localStorage.
////////////////////////////////////////
var curves;

$(function(){
    geojson = JSON.parse(window.localStorage.featureInfo);
    metaInfo = JSON.parse(window.localStorage.metaInfo);
    curves = groupCurves(geojson);
    generateTotals(geojson, metaInfo);
    generateTables(curves);
});

$(document).ready(function(){
    $("#download-pdf-btn").click(async function() {
        var doc = new jspdf.jsPDF();

        doc.setFontSize(22);
        doc.text("Curve Sign Analysis Report", doc.internal.pageSize.getWidth()/2, 15, {align:'center'} );

        doc.setFontSize(18);
        doc.text("Georgia Institute of Technology", doc.internal.pageSize.getWidth()/2, 25, {align:'center'} );

        doc.text('Metadata', 14, 40);
        var metaTotalTable = document.getElementById("metaTotalTable");
        doc.autoTable({
            startY: 45,
            html: metaTotalTable,
        });

        var signTotalTable = document.getElementById("signTotalTable");
        doc.text('Total Sign Inventory', 14, doc.lastAutoTable.finalY + 15);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15 + 5,
            html: signTotalTable,
            didDrawCell: function (data) {
                if (data.column.index == 1 && data.cell.section == 'body') {
                    var td = data.cell.raw;
                    var img = td.getElementsByTagName('img')[0];
                    var dim = data.cell.height;
                    doc.addImage(img.src, 'PNG', data.cell.x, data.cell.y, dim, dim);
                }
            }
        });

        var width = doc.internal.pageSize.getWidth();
        for (var i of Object.keys(curves)) {
            var table = document.getElementById("table" + i);
            var map = document.getElementById("map" + i);
            console.log("MADE IT");
            doc.autoTable({
                startY: doc.lastAutoTable.finalY + 300,
                html: table,
            });
            await domtoimage.toPng(map)
                .then(function (dataURL) {
                    var img = new Image();
                    img.src = dataURL;
                    doc.addImage(img, 'PNG', 14, doc.lastAutoTable.finalY + 15, width - 14, 100)
                })
                .catch(function (error) {
                    console.error("error creating " + map, error);
                });
        }
        doc.save('report.pdf');
    });
})



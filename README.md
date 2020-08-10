# Curve-sign-dashboard

Single page, serverless curve sign visualization and editing tool.

## Todo

Details will be discussed in individual meetings.

* Core Features
    * Code Restructure (1 wk)
        * Use Consistent CDN
        * Remove Redundant files and imports
        * Remove unused codes
    * Add "History" feature (3 wks)
        * In GeoJSON, add one more list to store the past locations
        * Every time a sign location has been changed and saved, push the new location to the list
        * Add a history table that allows user to choose/delete past locations (In sign info pop-ups)
    * Implement a global offset feature to adjust the appearance of all sign icons (2 wks)
        * Move all sign icons along the lateral direction
        * Adjust the size of all sign icons
    * Implement Side Toolbox/Adding sign feature (2 wks)
        * Add all sign icons to the toolbox
        * Make them draggable icons/buttons, and when drag and drop to map to add a sign at the cursor location
        * Add CSS to improve the UI, e.g box-shadow, on hover etc.
        * Add a field in the table/geojson to indicate that this sign has been manually added
    * Implement Removing Sign Feature (2 wks)
        * Do not actually remove the sign from the data source
        * Add a field in the table/geojson to indicate that this sign has marked for removal
        * Don't render signs that's been marked for removal, you can use css or change the logic in js to do this.
    * Move the entire backend curve-sign-placement logic to the frontend (10 wks)
        * Review backend code to understand how sign locations are determined
        * Associate each sign with curve by curveID (partially completed)
        * Store curves as polyline with pc,pt,advSpeed,Radius attributes in GeoJSON
        * Allow users to draw an arc on the map, and edit related curve information (ADV-speed/speed diff)
        * Compute and render the signs location from the frontend directly
        * Make the attributes every curve in the map editable as well
    * Add the existing static report as one of the exporting options (2 wks), or implement it efficiently yourself (4 wks)
        * Add batch export function to export every curve as an individual file
        * See static report
    * Bug fix to the current dashboard
        * After editing the table, the new values should be saved in the memory/json object (1 wk)
    * Documentation (Mandatory, cnt as 1 wk)
    * Meeting and two Demos (Mandatory, cnt as 1 wk)


## Features

* Flexible template built on active open source components
* Entirely client-side, can be hosted for free on [GitHub Pages](https://pages.github.com/)
* Built on the incredibly popular [Bootstrap](http://getbootstrap.com/) UI framework
* Maps via [Leaflet](http://leafletjs.com/), the leading open source JavaScript mapping library
* Interactive data table with sorting, searching, column toggling, and data export via the [Bootstrap Table](http://bootstrap-table.wenzhixin.net.cn/) plugin
* Advanced, interactive GeoJSON data querying that integrates [jQuery QueryBuilder](http://mistic100.github.io/jQuery-QueryBuilder/index.html) with [AlaSQL](http://alasql.org/)
* Advanced charting via [C3.js](http://c3js.org/), the D3-based reusable chart library

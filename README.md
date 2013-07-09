GeoJSON-Validation
==================

**A GeoJSON Validation Library**  
Check JSON objects to see whether or not they are valid GeoJSON. Validation is based off of the [GeoJSON Format Specification revision 1.0](http://geojson.org/geojson-spec.html#geojson-objects)

## Functions
All Function return a boolean and take a JSON object that will be evalatued to see if it is a GeoJSON object.  

**Arguments**  
* geoJSON - a JSON object that is tested to see if it is a valid GeoJSON object
* callback(boolean, errors) - `errors` is an array of validation errors for an invalid JSON object 

### valid(geoJON, callback)  
**Alias:** isGeoJSONObject  
Checks if an object is a [GeoJSON Object](http://geojson.org/geojson-spec.html#geojson-objects).

### isGeoJSONObject(geoJSON, callback)
Checks if an object is a [GeoJSON Object](http://geojson.org/geojson-spec.html#geojson-objects).

### isPosition(array, callback)
Checks if an array is a [Position](http://geojson.org/geojson-spec.html#positions)

### isGeometryObject(geoJSON, callback)
Checks if an object is a [Geometry Object](http://geojson.org/geojson-spec.html#geometry-objects)

### isPoint(geoJSON, callback)
Checks if an object is a [Point](http://geojson.org/geojson-spec.html#point)

### isMultiPoint(geoJSON, callback)
Checks if an object is a [MultiPoint](http://geojson.org/geojson-spec.html#multipoint)

### isLineString(geoJSON, callback)
Checks if an object is a [Line String](http://geojson.org/geojson-spec.html#linestring)

### isMultiLineString(geoJSON, callback)
Checks if an object is a [MultiLine String](http://geojson.org/geojson-spec.html#multilinestring)

### isPolygon(geoJSON, callback)
Checks if an object is a [Polygon](http://geojson.org/geojson-spec.html#polygon)

### isMultiPolygon(geoJSON, callback)
Checks if an object is a [MultiPolygon](http://geojson.org/geojson-spec.html#multipolygon)

### isGeometryCollection(geoJSON, callback)
Checks if an object is a [Geometry Collection](http://geojson.org/geojson-spec.html#geometry-collection)

### isFeature(geoJSON, callback)
Checks if an object is a [Feature Object](http://geojson.org/geojson-spec.html#feature-objects)

### isFeatureCollection(geoJSON, callback)
Checks if an object is a [Feature Collection Object](http://geojson.org/geojson-spec.html#feature-collection-objects)

### isBbox(geoJSON, callback)
Checks if an object is a [Bounding Box](http://geojson.org/geojson-spec.html#bounding-boxes)

## Testing
To run tests `npm test`   
Test use mocha

## Cavets
* Does not check ordering ob Bouding Box coordinates
* Does not check Coordinate Reference System Objects
* Does not check order of rings for polygons with multiple rings

(function(exports){

    //private helper functions
    function _isFunction(object) {
        return typeof(object) == 'function';
    }

    function done(bool, cb, message, errMsg){
        if( _isFunction(cb)){
            if(Array.isArray(errMsg)){
                if(message){
                    errMsg.push(message);
                }
            }else{
                errMsg = [message];
            }
            cb(bool, errMsg);
        }
        return bool;
    }

    function _isGeoJSONType(type, object, cb){
        if(type === "Feature"){
            return exports.isFeature(object, cb);
        }else if(type === "FeatureCollection"){
            return exports.isFeatureCollection(object, cb);
        }else{

            return _isGeometryObjectType(type, object, function(err, message){
                if(err){
                    done(err, cb, 'type must be one of: "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection", "Feature", or "FeatureCollection"');
                }else{
                    done(err, cb);
                }
            });
        }
    }

    function _isGeometryObjectType(type, object, cb){
        if(type === "Point"){
            return exports.isPoint(object, cb);
        }else if(type === "MultiPoint"){
            return exports.isMultiPoint(object, cb);
        }else if(type ===  "LineString" ){
            return exports.isLineString(object, cb);
        }else if(type ===  "MultiLineString" ){
            return exports.isMultiLineString(object, cb);
        }else if(type === "Polygon"){
            return exports.isPolygon(object, cb);
        }else if(type === "MultiPolygon"){
            return exports.isMultiPolygon(object, cb);
        }else if(type === "GeometryCollection" ){
            return exports.isGeometryCollection(object, cb);
        }else{
            return done(false, cb, 'type must be one of: "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon" or "GeometryCollection"');
        }
    }

    //A position is the fundamental geometry construct.
    exports.isPosition = function(position, cb){
        //It must be an array
        if(Array.isArray(position)){
            //and the array must have more than one element
            if(position.length > 1){
                return done(true, cb);
            }else{
                return done(false, cb, "Postition must be at least two elements");
            }
        }else{
            return done(false, cb, "Postition must be an array");
        }
    };

    exports.isGeoJSONObject = function(geoJSONObject, cb){
        if('type' in geoJSONObject){
           return _isGeoJSONType(geoJSONObject.type, geoJSONObject, cb);
        }else{
            return done(false, cb, "must have a member with the name 'type'");
        }
    };

    exports.isGeometryObject = function(geometryObject, cb){
        if('type' in geometryObject){
           return _isGeometryObjectType(geometryObject.type, geometryObject, cb);
        }else{
            return done(false, cb, "must have a member with the name 'type'");
        }
    };

    //check if there is a point
    exports.isPoint = function(point, cb) {
        var errors = [];

        if('bbox' in point){
            exports.isBbox(point.bbox, function(bool, err){
                if(!bool){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in point){
            if(point.type !== "Point"){
                errors.push("type must be 'Point'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('coordinates' in point){
            exports.isPosition(point.coordinates, function(bool, err){
                if(!bool){
                    errors.push('Coordinates must be a single position');
                } 
            });
        }else{
            errors.push("must have a member with the name 'coordinates'")
        }

        if(errors.length === 0){
            return done(true, cb);
        }else{
            return done(false, cb, "Invalid Point", errors);
        }
    };


    exports.isMultiPoint = function(multiPoint, cb) {
        var errors = [];

        if('bbox' in multiPoint){
            exports.isBbox(multiPoint.bbox, function(bool, err){
                if(!bool){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in multiPoint){
            if(multiPoint.type !== "MultiPoint"){
                errors.push("type must be 'MultiPoint'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('coordinates' in multiPoint){
            if(Array.isArray(multiPoint.coordinates)){
                multiPoint.coordinates.forEach(function(val, index){
                    exports.isPosition(val, function(bool, err){
                        if(!bool){
                            //modify the err msg from "isPosition" to note the element number
                            err[0] = "at "+ index+ ": ".concat(err[0]);
                            //build a list of invalide positions
                            errors = errors.concat(err);
                        }
                    });
                });
            }else{
                errors.push("coordinates must be an array");
            }
        }else{
            errors.push("must have a member with the name 'coordinates'")
        }

        if(errors.length === 0){
            return done(true, cb);
        }else{
            return done(false, cb, "Invalid MultiPoint", errors);
        }
    };

    //check if the coordinate for a linestring are valid
    function _lineStringCoor(coordinates, cb) {
        if(Array.isArray(coordinates)){
            if(coordinates.length > 1){
                var errors = [];
                coordinates.forEach(function(val, index){
                    exports.isPosition(val, function(bool, err){
                        if(!bool){
                            //modify the err msg from "isPosition" to note the element number
                            err[0] = "at "+ index+ ": ".concat(err[0]);
                            //build a list of invalide positions
                            errors = errors.concat(err);
                        }
                    });
                });

                if(errors.length === 0){
                    return done(true, cb);
                }else{
                    return done(false, cb, "Invalid Positions", errors);
                }
            }else{
                return done(false, cb, "coordinates must have at least two elements");
            }
        }else{
            return done(false, cb, "coordinates must be an array");
        }
    }

    exports.isLineString = function(lineString, cb){

        var errors = [];

        if('bbox' in lineString){
            exports.isBbox(lineString.bbox, function(bool, err){
                if(!bool){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in lineString){
            if(lineString.type !== "LineString"){
                errors.push("type must be 'LineString'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('coordinates' in lineString){
            _lineStringCoor(lineString.coordinates,  function(bool, err){
                if(!bool){
                    errors =  errors.concat(err);
                }
            });
        }else{
            errors.push("must have a member with the name 'coordinates'");
        }

        if(errors.length === 0){
            return done(true, cb);
        }else{
            return done(false, cb, "Invalid LineString", errors);
        }
    };

    exports.isMultiLineString = function(multilineString, cb){

        var errors = [];

        if('bbox' in multilineString){
            exports.isBbox(multilineString.bbox, function(bool, err){
                if(!bool){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in multilineString){
            if(multilineString.type !== "MultiLineString"){
                errors.push("type must be 'MultiLineString'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('coordinates' in multilineString){
            if(Array.isArray(multilineString.coordinates)){
                multilineString.coordinates.forEach(function(val, index){
                    _lineStringCoor(val, function(bool, err){
                        if(!bool){
                            //modify the err msg from "isPosition" to note the element number
                            err[0] = "at "+ index+ ": ".concat(err[0]);
                            //build a list of invalide positions
                            errors = errors.concat(err);
                        }
                    });
                });
            }else{
                errors.push("coordinates must be an array");
            }
        }else{
            errors.push("must have a member with the name 'coordinates'");
        }

        if(errors.length === 0){
            return done(true, cb);
        }else{
            return done(false, cb, "Invalid LineString", errors);
        }
    };

    function _linearRingCoor(coordinates, cb) {
        if(Array.isArray(coordinates)){
            //4 or more positions
            if(coordinates.length > 3){
                var errors = [];
                coordinates.forEach(function(val, index){
                    exports.isPosition(val, function(bool, err){
                        if(!bool){
                            //modify the err msg from "isPosition" to note the element number
                            err[0] = "at "+ index+ ": ".concat(err[0]);
                            //build a list of invalide positions
                            errors = errors.concat(err);
                        }
                    });
                });

                if(errors.length === 0){
                    // check the first and last positions to see if they are equivalent
                    // TODO: maybe better checking?
                    if(coordinates[0].toString() === coordinates[coordinates.length -1 ].toString()){
                        return done(true, cb);
                    }else{
                        return done(false, cb, "The first and last positions must be equivalent");
                    }
                }else{
                    return done(false, cb, "Invalid Positions", errors);
                }
            }else{
                return done(false, cb, "coordinates must have at least four positions");
            }
        }else{
            return done(false, cb, "coordinates must be an array");
        }
    }

    //check to whether the given coordinates comform to the Polygon definition
    function _polygonCoor(coordinates, cb){
        if(Array.isArray(coordinates)){
            var errors = [];
            coordinates.forEach(function(val, index){
                _linearRingCoor(val, function(bool, err){
                    if(!bool){
                        //modify the err msg from "isPosition" to note the element number
                        err[0] = "at "+ index+ ": ".concat(err[0]);
                        //build a list of invalid positions
                        errors = errors.concat(err);
                    }
                });
            });
            if(errors.length === 0){
                return done(true, cb);
            }else{
                return done(false, cb, "Invalid Positions", errors);
            }
        }else{
            return done(false, cb, "coordinates must be an array");
        }
    }

    exports.isPolygon = function(polygon, cb){

        var errors = [];

        if('bbox' in polygon){
            exports.isBbox(polygon.bbox, function(bool, err){
                if(!bool){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in polygon){
            if(polygon.type !== "Polygon"){
                errors.push("type must be 'Polygon'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('coordinates' in polygon){
             _polygonCoor(polygon.coordinates, function(bool, err) {
                if(!bool){
                    errors = errors.concat(err);
                }
             });
        }else{
            errors.push("must have a member with the name 'coordinates'");
        }

        if(errors.length === 0){
            return done(true, cb);
        }else{
            return done(false, cb, "Invalid Polygon", errors);
        }
    };

    exports.isMultiPolygon = function(multiPolygon, cb){

        var errors = [];

        if('bbox' in multiPolygon){
            exports.isBbox(multiPolygon.bbox, function(bool, err){
                if(!bool){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in multiPolygon){
            if(multiPolygon.type !== "MultiPolygon"){
                errors.push("type must be 'MultiPolygon'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('coordinates' in multiPolygon){
            if(Array.isArray(multiPolygon.coordinates)){
                multiPolygon.coordinates.forEach(function(val, index){
                    _polygonCoor(val, function(bool, err){
                        if(!bool){
                            //modify the err msg from "isPosition" to note the element number
                            err[0] = "at "+ index+ ": ".concat(err[0]);
                            //build a list of invalide positions
                            errors = errors.concat(err);
                        }
                    });
                });
            }else{
                errors.push("coordinates must be an array");
            }
        }else{
            errors.push("must have a member with the name 'coordinates'");
        }

        if(errors.length === 0){
            return done(true, cb);
        }else{
            return done(false, cb, "Invalid Polygon", errors);
        }
    };

    exports.isGeometryCollection = function(geometryCollection, cb){
        var errors = [];

        if('bbox' in geometryCollection){
            exports.isBbox(geometryCollection.bbox, function(bool, err){
                if(!bool){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in geometryCollection){
            if(geometryCollection.type !== "GeometryCollection"){
                errors.push("type must be 'GeometryCollection'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if('geometries' in geometryCollection){
            if(Array.isArray(geometryCollection.geometries)){
                geometryCollection.geometries.forEach(function(val, index){
                    exports.isGeometryObject(val, function(bool, err){
                        if(!bool){
                            //modify the err msg from "isPosition" to note the element number
                            err[0] = "at "+ index+ ": ".concat(err[0]);
                            //build a list of invalide positions
                            errors = errors.concat(err);
                        }
                    });
                });
            }else{
                errors.push("'geometries' must be an array");
            }
        }else{
            errors.push("must have a member with the name 'geometries'");
        }

        if(errors.length === 0){
            return done(true, cb);
        }else{
            return done(false, cb, "Invalid Geometry Collection", errors);
        }
    };

    exports.isFeature = function(feature, cb){

        var errors = [];

        if('bbox' in feature){
            exports.isBbox(feature.bbox, function(bool, err){
                if(!bool){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in feature){
            if(feature.type !== "Feature"){
                errors.push("type must be 'feature'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }

        if(!('properties' in feature)){
            errors.push("must have a member with the name 'properties'");
        }

        if('geometry' in feature){
            if(feature.geometry !== null){
                exports.isGeometryObject(feature.geometry, function(bool, err){
                    if(!bool){
                        errors = errors.concat(err);
                    }
                });
            }
        }else{
            errors.push("must have a member with the name 'geometry'");
        }

        if(errors.length === 0){
            return done(true, cb);
        }else{
            return done(false, cb, "Invalid Feature Object", errors);
        }
    };

    exports.isFeatureCollection = function(featureCollection, cb){

        var errors = [];

        if('bbox' in featureCollection){
            exports.isBbox(featureCollection.bbox, function(bool, err){
                if(!bool){
                    errors = errors.concat(err);
                }
            });
        }

        if('type' in featureCollection){
            if(featureCollection.type !== "FeatureCollection"){
                errors.push("type must be 'FeatureCollection'");
            }
        }else{
            errors.push("must have a member with the name 'type'");
        }


        if('features' in featureCollection){
            if(Array.isArray(featureCollection.features)){
                featureCollection.features.forEach(function(val, index){
                    exports.isFeature(val, function(bool, err){
                        if(!bool){
                            //modify the err msg from "isPosition" to note the element number
                            err[0] = "at "+ index+ ": ".concat(err[0]);
                            //build a list of invalide positions
                            errors = errors.concat(err);
                        }
                    });
                });
            }else{
                errors.push("'features' must be an array");
            }
        }else{
            errors.push("must have a member with the name 'features'");
        }

        if(errors.length === 0){
            return done(true, cb);
        }else{
            return done(false, cb, "Invalid Feature Collection", errors);
        }
    };

    exports.isBbox = function(bbox, cb){
        if(Array.isArray(bbox)){
            if(bbox.length % 2 == 0){
                return done(true, cb);
            }else{
                return done(false, cb ,"bbox, must be a 2*n array");
            }
        }else{
            return done(false, cb, "bbox must be an array");
        } 
    };
    
    exports.valid = function(object, cb){
       return exports.isGeoJSONObject(object, cb); 
    };

})(typeof exports === 'undefined'? this['geoJSON-validation']={}: exports);

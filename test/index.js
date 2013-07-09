var assert = require("assert"),
gjLint = require("../index.js"),
gs;

describe('Positions', function() {

    it('must be a valid position object', function() {
        assert(gjLint.isPosition([2,3]));
    });

    it('must be an array', function() {
        assert.equal(false, gjLint.isPosition("adf"));
    });

    it('must be at least two elements', function() {
        assert.equal(false, gjLint.isPosition([2]));
    });
});

describe("GeoJSON Objects", function(){
    
    it('must have a member with the name "type"', function() {
        gj = {"test": "1"};
        assert.equal(false, gjLint.isGeoJSONObject(gj));
    });

    describe("type member", function(){
        it('must be one of: "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection", "Feature", or "FeatureCollection"', function() {
            
            gj = {type: "point"};
            assert.equal(false, gjLint.isGeoJSONObject(gj));
        });
    });
    
    describe("Geometry Objects", function(){

        describe("type member", function(){
            it('must be one of "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", or "GeometryCollection"', function() {
                
                gj = {type: "Feature"};
                assert.equal(false, gjLint.isGeometryObject(gj));
            });
        });


        describe("Point", function(){
            it('must be a valid Point Object', function() {
               gj = {type: "Point", coordinates: [2,3]};
               assert(gjLint.isPoint(gj));
            });

            it('member type must be "Point"', function() {
               gj = {type: "Polygon", coordinates: [2,3]};
               assert.equal(false, gjLint.isPoint(gj));
            });

            it('must have a member with the name "coordinates"', function(){
               gj = {type: "Point", coordinate: [2,3]};
               assert.equal(false, gjLint.isPoint(gj));
            });

            describe("type coordinates", function(){
                it('must be a single position', function() {
                   gj = {type: "Point", coordinates: [2]};
                   assert.equal(false, gjLint.isPoint(gj));
                });
            });
        });

        describe("MultiPoint", function(){
            it('must be a valid MultiPoint Object', function() {
               gj = {type: "MultiPoint", coordinates: [[2,3],[5,6]]};
               assert(gjLint.isMultiPoint(gj));
            });

            it('member type must be "MultiPoint"', function() {
               gj = {type: "Point", coordinates: [[2,3],[5,6]]};
               assert.equal(false, gjLint.isMultiPoint(gj));
            });

            it('must have a member with the name "coordinates"', function(){
               gj = {type: "MultiPoint", coordinate: [2,3]};
               assert.equal(false, gjLint.isPoint(gj));
            });

            describe("type coordinates", function(){
                it('must be an array of positions', function() {
                   gj = {type: "MultiPoint", coordinates: [[2,3],[5]]};
                   assert.equal(false, gjLint.isMultiPoint(gj));
                });
            });
        });

        describe("Linestring", function(){

            it('must be a valid LineString Object', function() {
                var ValidLineString = {
                    "type": "LineString",
                    "coordinates": [
                        [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                        ]
                };
               assert(gjLint.isLineString(ValidLineString));
            });

            it('member type must be "LineString"', function() {
               gj = {type: "lineString", coordinates: [[2,3],[5,6]]};
               assert.equal(false, gjLint.isLineString(gj));
            });

            it('must have a member with the name "coordinates"', function(){
               gj = {type: "LineString", coordinate: [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]};
               assert.equal(false, gjLint.isLineString(gj));
            });

            describe("type coordinates", function(){
                it('must be an array of positions', function() {
                   gj = {type: "LineString", coordinate: [[2,3],[5]]};
                   assert.equal(false, gjLint.isLineString(gj));
                });

                it('must be at least two elements', function() {
                   gj = {type: "LineString", coordinates: [[2,3]]};
                   assert.equal(false, gjLint.isLineString(gj));
                });
            });
        });

        describe("MutliLineString", function(){

            it('must be a valid MutiLineString Object', function() {
                var validMutlineString = { 
                    "type": "MultiLineString",
                    "coordinates": [
                      [ [100.0, 0.0], [101.0, 1.0] ],
                      [ [102.0, 2.0], [103.0, 3.0] ]
                    ]
                };
               assert(gjLint.isMultiLineString(validMutlineString));
            });

            it('member type must be "MutliLineString"', function() {

                var invalidMutlineString = { 
                    "type": "multiLineString",
                    "coordinates": [
                      [ [100.0, 0.0], [101.0, 1.0] ],
                      [ [102.0, 2.0], [103.0, 3.0] ]
                    ]
                };
               assert.equal(false, gjLint.isMultiLineString(invalidMutlineString));
            });

            it('must have a member with the name "coordinates"', function(){

                var invalidMutlineString = { 
                    "type": "MultiLineString",
                    "coordinate": [
                      [ [100.0, 0.0], [101.0, 1.0] ],
                      [ [102.0, 2.0], [103.0, 3.0] ]
                    ]
                };

               assert.equal(false, gjLint.isMultiLineString(invalidMutlineString));
            });

            describe("type coordinates", function(){
                it('must be an array of LineString coordinate arrays', function() {
                    
                    var invalidMutlineString = { 
                        "type": "MultiLineString",
                        "coordinate": [
                          [ [100.0, 0.0], [101.0] ],
                          [ [102.0, 2.0], [103.0, 3.0] ]
                        ]
                    };

                   assert.equal(false, gjLint.isMultiLineString(invalidMutlineString));
                });
            });
        });

        describe('Polygon', function() {
            it('must be a valid Polygon Object', function() {
                var validPolygon = {
                    "type": "Polygon",
                    "coordinates": [
                        [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
                    ]
                };
                assert(gjLint.isPolygon(validPolygon));
            });

            it('member type must be "Polygon"', function() {

                var invalidPolygon = {
                    "type": "polygon",
                    "coordinates": [
                        [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
                    ]
                };
                assert.equal(false, gjLint.isPolygon(invalidPolygon));
            });

            it('must have a member with the name "coordinates"', function(){
                var invalidPolygon = {
                    "type": "Polygon",
                    "coordinate": [
                        [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
                    ]
                };
                assert.equal(false, gjLint.isPolygon(invalidPolygon));
            });

            describe("type coordinates", function(){
                it('must be an array of LinearRing coordinate arrays', function() {
                    var invalidPolygon = {
                        "type": "Polygon",
                        "coordinates": "test" 
                    };
                    assert.equal(false, gjLint.isPolygon(invalidPolygon));
                });

                describe('LinearRing', function() {
                    it('must be a LineString with 4 or more positions', function() {
                        var invalidPolygon = {
                            "type": "Polygon",
                            "coordinates": [
                                [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
                                [ [100.0, 0.0],  [100.0, 1.0], [100.0, 0.0] ]
                            ]
                        };
                        assert.equal(false, gjLint.isPolygon(invalidPolygon));
                    });

                    it('The first and last positions must be equivalent (represent equivalent points)', function() {
                        var invalidPolygon = {
                              "type": "Polygon",
                              "coordinates": [
                            [ [100.0, 1.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
                            ]
                        };
                        assert.equal(false, gjLint.isPolygon(invalidPolygon));

                    });
                });
            });
        });

        describe('MultiPolygon', function() {

            it('must be a valid MultiPolygon object', function() {
                var validMultiPolygon = {
                    "type": "MultiPolygon",
                    "coordinates": [
                    [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
                    [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
                     [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
                    ]
                };
                assert(gjLint.isMultiPolygon(validMultiPolygon));
            });

            it('member type must be "MultiPolygon"', function() {

                var invalidMultiPolygon = {
                    "type": "multiPolygon",
                    "coordinates": [
                    [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
                    [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
                     [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
                    ]
                };

                assert.equal(false, gjLint.isMultiPolygon(invalidMultiPolygon));
            });

            it('must have a member with the name "coordinates"', function(){

                var invalidMultiPolygon = {
                    "type": "MultiPolygon",
                    "coordinate": [
                    [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
                    [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
                     [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
                    ]
                };

                assert.equal(false, gjLint.isMultiPolygon(invalidMultiPolygon));
            });

            describe("type coordinates", function(){
                it('must be an array of Polygon coordinate arrays', function() {

                    var invalidMultiPolygon = {
                        "type": "MultiPolygon",
                        "coordinates": [
                        [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
                        [[[100.0, 0.0], [101.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
                         [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
                        ]
                    };

                    assert.equal(false, gjLint.isMultiPolygon(invalidMultiPolygon));
                });
            });
        });

        describe('Geometry Collection', function() {

            it('must be a valid Geometry Collection Object', function() {
                var validGeoCollection = {
                    "type": "GeometryCollection",
                    "geometries": [
                        {
                            "type": "Point",
                            "coordinates": [100.0, 0.0]
                        },
                        {
                            "type": "LineString",
                            "coordinates": [ [101.0, 0.0], [102.0, 1.0] ]
                        }
                     ]
                };
                assert(gjLint.isGeometryCollection(validGeoCollection));
            });

            it('member type must be "GeometryCollection"', function() {
                var invalidGeoCollection = {
                    "type": "geometryCollection",
                    "geometries": [
                        {
                            "type": "Point",
                            "coordinates": [100.0, 0.0]
                        },
                        {
                            "type": "LineString",
                            "coordinates": [ [101.0, 0.0], [102.0, 1.0] ]
                        }
                     ]
                };
                assert.equal(false, gjLint.isGeometryCollection(invalidGeoCollection));
            });

            it('must have a member with the name "geometries"', function() {
                var invalidGeoCollection = {
                    "type": "GeometryCollection",
                    "geometrie": [
                        {
                            "type": "Point",
                            "coordinates": [100.0, 0.0]
                        },
                        {
                            "type": "LineString",
                            "coordinates": [ [101.0, 0.0], [102.0, 1.0] ]
                        }
                     ]
                };
                assert.equal(false, gjLint.isGeometryCollection(invalidGeoCollection));
            });

            describe('geometries', function() {
                it('must be an array of GeoJSON geometry object', function() {
                    
                    var invalidGeoCollection = {
                        "type": "GeometryCollection",
                        "geometries": [
                            {
                                "type": "Point",
                                "coordinates": [100.0, 0.0]
                            },
                            {
                                "type": "LineString",
                                "coordinates": [ [101.0], [102.0, 1.0] ]
                            }
                         ]
                    };

                    assert.equal(false, gjLint.isGeometryCollection(invalidGeoCollection));
                });
            });
        });
    });
    
    describe('Feature Objects', function() {


        it('must be a valid Feature Object', function() {
            var validFeature =  {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                    ]
                },
                "properties": {
                    "prop0": "value0",
                    "prop1": 0.0
                }
            };

            assert(gjLint.isFeature(validFeature));
        });

        it('member type must be "Feature"', function() {

            var invalidFeature =  {
                "type": "feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                    ]
                },
                "properties": {
                    "prop0": "value0",
                    "prop1": 0.0
                }
            };
            assert.equal(false, gjLint.isFeature(invalidFeature));
        });

        it('must have a member with the name "geometry"', function() {
            var invalidFeature =  {
                "type": "Feature",
                "geometr": {
                    "type": "LineString",
                    "coordinates": [
                        [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                    ]
                },
                "properties": {
                    "prop0": "value0",
                    "prop1": 0.0
                }
            };
            assert.equal(false, gjLint.isFeature(invalidFeature));
        });

        describe('geometry member', function() {
            it('must be a geometry object or a JSON null value', function() {
                var invalidFeature =  {
                    "type": "Feature",
                    "geometr": {
                        "type": "LineString",
                        "coordinates": [
                            [102.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                        ]
                    },
                    "properties": {
                        "prop0": "value0",
                        "prop1": 0.0
                    }
                };
                assert.equal(false, gjLint.isFeature(invalidFeature))
            });
        });

        it('must have a member "properties"', function() {
            var invalidFeature =  {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                    ]
                },
                "propertie": {
                    "prop0": "value0",
                    "prop1": 0.0
                }
            };
            assert.equal(false, gjLint.isFeature(invalidFeature));
        });
    });

    describe('Feature Collection Objects', function() {
    
        it('must be a valid Feature Collection Object', function() {
            var validFeatureCollection = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
                        "properties": {"prop0": "value0"}
                    },
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                            ]
                        },
                        "properties": {
                            "prop0": "value0",
                            "prop1": 0.0
                        }
                    },
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                                [100.0, 1.0], [100.0, 0.0] ]
                            ]
                        },
                        "properties": {
                            "prop0": "value0",
                            "prop1": {"this": "that"}
                        }
                    }
                ]
            };
            assert(gjLint.isFeatureCollection(validFeatureCollection));
        });

        it('member type must be "FeatureCollection"', function() {
           
            var invalidFeatureCollection = {
                "type": "featureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
                        "properties": {"prop0": "value0"}
                    },
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                            ]
                        },
                        "properties": {
                            "prop0": "value0",
                            "prop1": 0.0
                        }
                    },
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                                [100.0, 1.0], [100.0, 0.0] ]
                            ]
                        },
                        "properties": {
                            "prop0": "value0",
                            "prop1": {"this": "that"}
                        }
                    }
                ]
            };
            assert.equal(false, gjLint.isFeatureCollection(invalidFeatureCollection));
        });

        it('must have a member with the name "features"', function() {
            var invalidFeatureCollection = {
                "type": "FeatureCollection",
                "feature": [
                    {
                        "type": "Feature",
                        "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
                        "properties": {"prop0": "value0"}
                    },
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                            ]
                        },
                        "properties": {
                            "prop0": "value0",
                            "prop1": 0.0
                        }
                    },
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                                [100.0, 1.0], [100.0, 0.0] ]
                            ]
                        },
                        "properties": {
                            "prop0": "value0",
                            "prop1": {"this": "that"}
                        }
                    }
                ]
            };
            assert.equal(false, gjLint.isFeatureCollection(invalidFeatureCollection));
        });

        describe('member features', function() {
            it('must have an array of feature objects', function() {
                var invalidFeatureCollection = {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
                            "properties": {"prop0": "value0"}
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "LineString",
                                "coordinates": [
                                    [102.0, 0.0], [103.0, 1.0], [ 0.0], [105.0, 1.0]
                                ]
                            },
                            "properties": {
                                "prop0": "value0",
                                "prop1": 0.0
                            }
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [
                                    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                                    [100.0, 1.0], [100.0, 0.0] ]
                                ]
                            },
                            "properties": {
                                "prop0": "value0",
                                "prop1": {"this": "that"}
                            }
                        }
                    ]
                };
                assert.equal(false, gjLint.isFeatureCollection(invalidFeatureCollection));
            }); 
        });
   });
});

/*
describe('Coordinate Reference System Objects', function() {
    it('must be a member named "crs"', function() {
        
    });

    describe('Named CRS', function() {
        
        it('member type must be "name"', function() {
            
        });

        it('member properties must be an object containing a "name" member', function() {
            
        });

        describe('member properties', function() {
            
            it('memeber "name" must be a string', function() {
                
            });
        });
    });

    describe('Linked CRS', function() {

        it('member type must be "link"', function() {
            
        });

        it('member properties must be a Link objec', function() {
            
        });

        describe('Link Objects', function() {
            
            it('member "href" must be a dereferenceable URI.', function() {
                
            });
            
            describe('member type', function() {

                it('must be a string', function() {
                    
                });
            });

        });
    });
});
*/

describe('Bounding Boxes', function() {
    
    it('it must be a member named "bbox"', function() {
    
    });

    it('bbox member must be a 2*n array', function() {
        
    });
});

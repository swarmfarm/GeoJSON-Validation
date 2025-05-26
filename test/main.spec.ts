import { describe, it } from "bun:test";
import assert from "node:assert";
import {
  isFeature,
  isFeatureCollection,
  isGeoJSONObject,
  isGeometryCollection,
  isGeometryObject,
  isLineString,
  isMultiLineString,
  isMultiPoint,
  isMultiPolygon,
  isPoint,
  isPolygon,
  isPosition,
} from "..";

describe("Positions", () => {
  it("must be a valid position object", () => {
    assert(isPosition([2, 3]));
  });

  it("must be a valid position object", () => {
    assert.equal(false, isPosition([null, null]));
  });

  it("must be an array", () => {
    assert.equal(false, isPosition("adf"));
  });

  it("must be at least two elements", () => {
    assert.equal(false, isPosition([2]));
  });
});

describe("GeoJSON Objects", () => {
  it('must have a member with the name "type"', () => {
    const gj = {
      test: "1",
    };
    assert.equal(false, isGeoJSONObject(gj));
  });

  describe("type member", () => {
    it('must be one of: "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection", "Feature", or "FeatureCollection"', () => {
      const gj = {
        type: "point",
      };
      assert.equal(false, isGeoJSONObject(gj));
    });
  });

  describe("Geometry Objects", () => {
    describe("type member", () => {
      it('must be one of "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", or "GeometryCollection"', () => {
        const gj = {
          type: "Feature",
        };
        assert.equal(false, isGeometryObject(gj));
      });
    });

    describe("Point", () => {
      it("must be a valid Point Object", () => {
        const gj = {
          type: "Point",
          coordinates: [2, 3],
        };
        assert(isPoint(gj));
      });

      it('member type must be "Point"', () => {
        const gj = {
          type: "Polygon",
          coordinates: [2, 3],
        };
        assert.equal(false, isPoint(gj));
      });

      it('must have a member with the name "coordinates"', () => {
        const gj = {
          type: "Point",
          coordinate: [2, 3],
        };
        assert.equal(false, isPoint(gj));
      });

      describe("type coordinates", () => {
        it("must be a single position", () => {
          const gj = {
            type: "Point",
            coordinates: [2],
          };
          assert.equal(false, isPoint(gj));
        });
      });
    });

    describe("MultiPoint", () => {
      it("must be a valid MultiPoint Object", () => {
        const gj = {
          type: "MultiPoint",
          coordinates: [
            [2, 3],
            [5, 6],
          ],
        };
        assert(isMultiPoint(gj));
      });

      it('member type must be "MultiPoint"', () => {
        const gj = {
          type: "Point",
          coordinates: [
            [2, 3],
            [5, 6],
          ],
        };
        assert.equal(false, isMultiPoint(gj));
      });

      it('must have a member with the name "coordinates"', () => {
        const gj = {
          type: "MultiPoint",
          coordinate: [2, 3],
        };
        console.log(
          "Testing MultiPoint with 'coordinate' instead of 'coordinates'",
        );
        console.log("Using isMultiPoint() instead of isPoint()");
        assert.equal(false, isMultiPoint(gj));
      });

      describe("type coordinates", () => {
        it("must be an array of positions", () => {
          const gj = {
            type: "MultiPoint",
            coordinates: [[2, 3], [5]],
          };
          assert.equal(false, isMultiPoint(gj));
        });
      });
    });

    describe("Linestring", () => {
      it("must be a valid LineString Object", () => {
        const ValidLineString = {
          type: "LineString",
          coordinates: [
            [102.0, 0.0],
            [103.0, 1.0],
            [104.0, 0.0],
            [105.0, 1.0],
          ],
        };
        assert(isLineString(ValidLineString));
      });

      it('member type must be "LineString"', () => {
        const gj = {
          type: "lineString",
          coordinates: [
            [2, 3],
            [5, 6],
          ],
        };
        assert.equal(false, isLineString(gj));
      });

      it('must have a member with the name "coordinates"', () => {
        const gj = {
          type: "LineString",
          coordinate: [
            [102.0, 0.0],
            [103.0, 1.0],
            [104.0, 0.0],
            [105.0, 1.0],
          ],
        };
        assert.equal(false, isLineString(gj));
      });

      describe("type coordinates", () => {
        it("must be an array of positions", () => {
          const gj = {
            type: "LineString",
            coordinate: [[2, 3], [5]],
          };
          assert.equal(false, isLineString(gj));
        });

        it("must be at least two elements", () => {
          const gj = {
            type: "LineString",
            coordinates: [[2, 3]],
          };
          assert.equal(false, isLineString(gj));
        });
      });
    });

    describe("MultiLineString", () => {
      it("must be a valid MutiLineString Object", () => {
        const validMutlineString = {
          type: "MultiLineString",
          coordinates: [
            [
              [100.0, 0.0],
              [101.0, 1.0],
            ],
            [
              [102.0, 2.0],
              [103.0, 3.0],
            ],
          ],
        };
        assert(isMultiLineString(validMutlineString));
      });

      it('member type must be "MultiLineString"', () => {
        const invalidMutlineString = {
          type: "multiLineString",
          coordinates: [
            [
              [100.0, 0.0],
              [101.0, 1.0],
            ],
            [
              [102.0, 2.0],
              [103.0, 3.0],
            ],
          ],
        };
        assert.equal(false, isMultiLineString(invalidMutlineString));
      });

      it('must have a member with the name "coordinates"', () => {
        const invalidMutlineString = {
          type: "MultiLineString",
          coordinate: [
            [
              [100.0, 0.0],
              [101.0, 1.0],
            ],
            [
              [102.0, 2.0],
              [103.0, 3.0],
            ],
          ],
        };
        assert.equal(false, isMultiLineString(invalidMutlineString));
      });

      describe("type coordinates", () => {
        it("must be an array of LineString coordinate arrays", () => {
          const invalidMutlineString = {
            type: "MultiLineString",
            coordinate: [
              [[100.0, 0.0], [101.0]],
              [
                [102.0, 2.0],
                [103.0, 3.0],
              ],
            ],
          };
          assert.equal(false, isMultiLineString(invalidMutlineString));
        });
      });
    });

    describe("Polygon", () => {
      it("must be a valid Polygon Object", () => {
        const validPolygon = {
          type: "Polygon",
          coordinates: [
            [
              [100.0, 0.0],
              [101.0, 0.0],
              [101.0, 1.0],
              [100.0, 1.0],
              [100.0, 0.0],
            ],
          ],
        };
        assert(isPolygon(validPolygon));
      });

      it('member type must be "Polygon"', () => {
        const invalidPolygon = {
          type: "polygon",
          coordinates: [
            [
              [100.0, 0.0],
              [101.0, 0.0],
              [101.0, 1.0],
              [100.0, 1.0],
              [100.0, 0.0],
            ],
          ],
        };
        assert.equal(false, isPolygon(invalidPolygon));
      });

      it('must have a member with the name "coordinates"', () => {
        const invalidPolygon = {
          type: "Polygon",
          coordinate: [
            [
              [100.0, 0.0],
              [101.0, 0.0],
              [101.0, 1.0],
              [100.0, 1.0],
              [100.0, 0.0],
            ],
          ],
        };
        assert.equal(false, isPolygon(invalidPolygon));
      });

      describe("type coordinates", () => {
        it("must be an array of LinearRing coordinate arrays", () => {
          const invalidPolygon = {
            type: "Polygon",
            coordinates: "test",
          };
          assert.equal(false, isPolygon(invalidPolygon));
        });

        describe("LinearRing", () => {
          it("must be a LineString with 4 or more positions", () => {
            const invalidPolygon = {
              type: "Polygon",
              coordinates: [
                [
                  [100.0, 0.0],
                  [101.0, 0.0],
                  [101.0, 1.0],
                  [100.0, 1.0],
                  [100.0, 0.0],
                ],
                [
                  [100.0, 0.0],
                  [100.0, 1.0],
                  [100.0, 0.0],
                ],
              ],
            };
            assert.equal(false, isPolygon(invalidPolygon));
          });

          // it("The first and last positions must be equivalent (represent equivalent points)", () => {
          //   const invalidPolygon = {
          //     type: "Polygon",
          //     coordinates: [
          //       [
          //         [100.0, 1.0],
          //         [101.0, 0.0],
          //         [101.0, 1.0],
          //         [100.0, 1.0],
          //         [100.0, 0.0],
          //       ],
          //     ],
          //   };
          //   assert.equal(false, isPolygon(invalidPolygon));
          // });
        });
      });
    });

    describe("MultiPolygon", () => {
      it("must be a valid MultiPolygon object", () => {
        const validMultiPolygon = {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [102.0, 2.0],
                [103.0, 2.0],
                [103.0, 3.0],
                [102.0, 3.0],
                [102.0, 2.0],
              ],
            ],
            [
              [
                [100.0, 0.0],
                [101.0, 0.0],
                [101.0, 1.0],
                [100.0, 1.0],
                [100.0, 0.0],
              ],
              [
                [100.2, 0.2],
                [100.8, 0.2],
                [100.8, 0.8],
                [100.2, 0.8],
                [100.2, 0.2],
              ],
            ],
          ],
        };
        assert(isMultiPolygon(validMultiPolygon));
      });

      it('member type must be "MultiPolygon"', () => {
        const invalidMultiPolygon = {
          type: "multiPolygon",
          coordinates: [
            [
              [
                [102.0, 2.0],
                [103.0, 2.0],
                [103.0, 3.0],
                [102.0, 3.0],
                [102.0, 2.0],
              ],
            ],
            [
              [
                [100.0, 0.0],
                [101.0, 0.0],
                [101.0, 1.0],
                [100.0, 1.0],
                [100.0, 0.0],
              ],
              [
                [100.2, 0.2],
                [100.8, 0.2],
                [100.8, 0.8],
                [100.2, 0.8],
                [100.2, 0.2],
              ],
            ],
          ],
        };
        assert.equal(false, isMultiPolygon(invalidMultiPolygon));
      });

      it('must have a member with the name "coordinates"', () => {
        const invalidMultiPolygon = {
          type: "MultiPolygon",
          coordinate: [
            [
              [
                [102.0, 2.0],
                [103.0, 2.0],
                [103.0, 3.0],
                [102.0, 3.0],
                [102.0, 2.0],
              ],
            ],
            [
              [
                [100.0, 0.0],
                [101.0, 0.0],
                [101.0, 1.0],
                [100.0, 1.0],
                [100.0, 0.0],
              ],
              [
                [100.2, 0.2],
                [100.8, 0.2],
                [100.8, 0.8],
                [100.2, 0.8],
                [100.2, 0.2],
              ],
            ],
          ],
        };

        assert.equal(false, isMultiPolygon(invalidMultiPolygon));
      });

      describe("type coordinates", () => {
        it("must be an array of Polygon coordinate arrays", () => {
          const invalidMultiPolygon = {
            type: "MultiPolygon",
            coordinates: [
              [
                [
                  [102.0, 2.0],
                  [103.0, 2.0],
                  [103.0, 3.0],
                  [102.0, 3.0],
                  [102.0, 2.0],
                ],
              ],
              [
                [
                  [100.0, 0.0],
                  [101.0],
                  [101.0, 1.0],
                  [100.0, 1.0],
                  [100.0, 0.0],
                ],
                [
                  [100.2, 0.2],
                  [100.8, 0.2],
                  [100.8, 0.8],
                  [100.2, 0.8],
                  [100.2, 0.2],
                ],
              ],
            ],
          };

          assert.equal(false, isMultiPolygon(invalidMultiPolygon));
        });
      });
    });

    describe("Geometry Collection", () => {
      it("must be a valid Geometry Collection Object", () => {
        const validGeoCollection = {
          type: "GeometryCollection",
          geometries: [
            {
              type: "Point",
              coordinates: [100.0, 0.0],
            },
            {
              type: "LineString",
              coordinates: [
                [101.0, 0.0],
                [102.0, 1.0],
              ],
            },
          ],
        };
        assert(isGeometryCollection(validGeoCollection));
      });

      it('member type must be "GeometryCollection"', () => {
        const invalidGeoCollection = {
          type: "geometryCollection",
          geometries: [
            {
              type: "Point",
              coordinates: [100.0, 0.0],
            },
            {
              type: "LineString",
              coordinates: [
                [101.0, 0.0],
                [102.0, 1.0],
              ],
            },
          ],
        };
        assert.equal(false, isGeometryCollection(invalidGeoCollection));
      });

      it('must have a member with the name "geometries"', () => {
        const invalidGeoCollection = {
          type: "GeometryCollection",
          geometrie: [
            {
              type: "Point",
              coordinates: [100.0, 0.0],
            },
            {
              type: "LineString",
              coordinates: [
                [101.0, 0.0],
                [102.0, 1.0],
              ],
            },
          ],
        };
        assert.equal(false, isGeometryCollection(invalidGeoCollection));
      });

      describe("geometries", () => {
        it("must be an array of GeoJSON geometry object", () => {
          const invalidGeoCollection = {
            type: "GeometryCollection",
            geometries: [
              {
                type: "Point",
                coordinates: [100.0, 0.0],
              },
              {
                type: "LineString",
                coordinates: [[101.0], [102.0, 1.0]],
              },
            ],
          };

          assert.equal(false, isGeometryCollection(invalidGeoCollection));
        });
      });
    });
  });

  describe("Feature Objects", () => {
    it("must be a valid Feature Object", () => {
      const validFeature = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [102.0, 0.0],
            [103.0, 1.0],
            [104.0, 0.0],
            [105.0, 1.0],
          ],
        },
        properties: {
          prop0: "value0",
          prop1: 0.0,
        },
      };
      assert(isFeature(validFeature));
    });

    it('member type must be "Feature"', () => {
      const invalidFeature = {
        type: "feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [102.0, 0.0],
            [103.0, 1.0],
            [104.0, 0.0],
            [105.0, 1.0],
          ],
        },
        properties: {
          prop0: "value0",
          prop1: 0.0,
        },
      };
      assert.equal(false, isFeature(invalidFeature));
    });

    it('must have a member with the name "geometry"', () => {
      const invalidFeature = {
        type: "Feature",
        geometr: {
          type: "LineString",
          coordinates: [
            [102.0, 0.0],
            [103.0, 1.0],
            [104.0, 0.0],
            [105.0, 1.0],
          ],
        },
        properties: {
          prop0: "value0",
          prop1: 0.0,
        },
      };
      assert.equal(false, isFeature(invalidFeature));
    });

    describe("geometry member", () => {
      it("must be a geometry object or a JSON null value", () => {
        const invalidFeature = {
          type: "Feature",
          geometr: {
            type: "LineString",
            coordinates: [[102.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]],
          },
          properties: {
            prop0: "value0",
            prop1: 0.0,
          },
        };
        assert.equal(false, isFeature(invalidFeature));
      });
    });

    it('must have a member "properties"', () => {
      const invalidFeature = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [102.0, 0.0],
            [103.0, 1.0],
            [104.0, 0.0],
            [105.0, 1.0],
          ],
        },
        propertie: {
          prop0: "value0",
          prop1: 0.0,
        },
      };
      assert.equal(false, isFeature(invalidFeature));
    });

    describe("isFeature function with makePropertiesRequired parameter", () => {
      it("should validate a Feature without properties when makePropertiesRequired is false", () => {
        const feature = {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          // No properties member
        };
        assert.ok(isFeature(feature, false, false)); // makePropertiesRequired = false
      });

      it("should not validate a Feature without properties when makePropertiesRequired is true", () => {
        const feature = {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          // No properties member
        };
        assert.equal(false, isFeature(feature, false, true)); // makePropertiesRequired = true
      });

      it("should validate a Feature with null properties when makePropertiesRequired is false", () => {
        const feature = {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: null,
        };
        assert.ok(isFeature(feature, false, false)); // makePropertiesRequired = false
      });

      it("should validate a Feature with empty properties when makePropertiesRequired is false", () => {
        const feature = {
          type: "Feature",
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: {},
        };
        assert.ok(isFeature(feature, false, false)); // makePropertiesRequired = false
      });
    });
  });

  describe("Feature Collection Objects", () => {
    it("must be a valid Feature Collection Object", () => {
      const validFeatureCollection = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [102.0, 0.5],
            },
            properties: {
              prop0: "value0",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [102.0, 0.0],
                [103.0, 1.0],
                [104.0, 0.0],
                [105.0, 1.0],
              ],
            },
            properties: {
              prop0: "value0",
              prop1: 0.0,
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [100.0, 0.0],
                  [101.0, 0.0],
                  [101.0, 1.0],
                  [100.0, 1.0],
                  [100.0, 0.0],
                ],
              ],
            },
            properties: {
              prop0: "value0",
              prop1: {
                this: "that",
              },
            },
          },
        ],
      };
      assert(isFeatureCollection(validFeatureCollection));
    });

    it('member type must be "FeatureCollection"', () => {
      const invalidFeatureCollection = {
        type: "featureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [102.0, 0.5],
            },
            properties: {
              prop0: "value0",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [102.0, 0.0],
                [103.0, 1.0],
                [104.0, 0.0],
                [105.0, 1.0],
              ],
            },
            properties: {
              prop0: "value0",
              prop1: 0.0,
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [100.0, 0.0],
                  [101.0, 0.0],
                  [101.0, 1.0],
                  [100.0, 1.0],
                  [100.0, 0.0],
                ],
              ],
            },
            properties: {
              prop0: "value0",
              prop1: {
                this: "that",
              },
            },
          },
        ],
      };
      assert.equal(false, isFeatureCollection(invalidFeatureCollection));
    });

    it('must have a member with the name "features"', () => {
      const invalidFeatureCollection = {
        type: "FeatureCollection",
        feature: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [102.0, 0.5],
            },
            properties: {
              prop0: "value0",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [102.0, 0.0],
                [103.0, 1.0],
                [104.0, 0.0],
                [105.0, 1.0],
              ],
            },
            properties: {
              prop0: "value0",
              prop1: 0.0,
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [100.0, 0.0],
                  [101.0, 0.0],
                  [101.0, 1.0],
                  [100.0, 1.0],
                  [100.0, 0.0],
                ],
              ],
            },
            properties: {
              prop0: "value0",
              prop1: {
                this: "that",
              },
            },
          },
        ],
      };
      assert.equal(false, isFeatureCollection(invalidFeatureCollection));
    });

    describe("member features", () => {
      it("must have an array of feature objects", () => {
        const invalidFeatureCollection = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [102.0, 0.5],
              },
              properties: {
                prop0: "value0",
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [[102.0, 0.0], [103.0, 1.0], [0.0], [105.0, 1.0]],
              },
              properties: {
                prop0: "value0",
                prop1: 0.0,
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [100.0, 0.0],
                    [101.0, 0.0],
                    [101.0, 1.0],
                    [100.0, 1.0],
                    [100.0, 0.0],
                  ],
                ],
              },
              properties: {
                prop0: "value0",
                prop1: {
                  this: "that",
                },
              },
            },
          ],
        };
        assert.equal(false, isFeatureCollection(invalidFeatureCollection));
      });
    });
  });
});

describe("Bounding Boxes", () => {
  it('must be a member named "bbox"', () => {});

  it("bbox member must be a 2*n array", () => {});
});

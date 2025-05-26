/**
 * GeoJSON validation according to the GeoJSON specification Version 1
 * Functional TypeScript implementation with comprehensive type safety
 * @module geoJSONValidation
 */

// ============================================================================
// Type Definitions
// ============================================================================

/** Represents a geographic position [longitude, latitude, altitude?] */
export type Position = [number, number, ...number[]];

/** Bounding box [west, south, east, north] or [west, south, min_alt, east, north, max_alt] */
export type BBox =
  | [number, number, number, number]
  | [number, number, number, number, number, number];

/** Validation result - either boolean or array of error messages */
export type ValidationResult = boolean | string[];

/** Custom validation function type */
export type CustomValidator<T = any> = (object: T) => string | string[] | void;

/** Registry of custom validators */
export type ValidatorRegistry = Partial<
  Record<GeoJSONObjectType, CustomValidator>
>;

/** All possible GeoJSON object types */
export type GeoJSONObjectType =
  | "Feature"
  | "FeatureCollection"
  | "Point"
  | "MultiPoint"
  | "LineString"
  | "MultiLineString"
  | "Polygon"
  | "MultiPolygon"
  | "GeometryCollection"
  | "Bbox"
  | "Position"
  | "GeoJSON"
  | "GeometryObject";

/** Base interface for all GeoJSON objects */
interface GeoJSONBase {
  type: string;
  bbox?: BBox;
}

/** Point geometry interface */
export interface Point extends GeoJSONBase {
  type: "Point";
  coordinates: Position;
}

/** MultiPoint geometry interface */
export interface MultiPoint extends GeoJSONBase {
  type: "MultiPoint";
  coordinates: Position[];
}

/** LineString geometry interface */
export interface LineString extends GeoJSONBase {
  type: "LineString";
  coordinates: Position[];
}

/** MultiLineString geometry interface */
export interface MultiLineString extends GeoJSONBase {
  type: "MultiLineString";
  coordinates: Position[][];
}

/** Polygon geometry interface */
export interface Polygon extends GeoJSONBase {
  type: "Polygon";
  coordinates: Position[][];
}

/** MultiPolygon geometry interface */
export interface MultiPolygon extends GeoJSONBase {
  type: "MultiPolygon";
  coordinates: Position[][][];
}

/** GeometryCollection interface */
export interface GeometryCollection extends GeoJSONBase {
  type: "GeometryCollection";
  geometries: Geometry[];
}

/** Union type for all geometry objects */
export type Geometry =
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon
  | MultiPolygon
  | GeometryCollection;

/** Feature interface */
export interface Feature extends GeoJSONBase {
  type: "Feature";
  geometry: Geometry | null;
  properties: Record<string, any> | null;
}

/** FeatureCollection interface */
export interface FeatureCollection extends GeoJSONBase {
  type: "FeatureCollection";
  features: Feature[];
}

/** Union type for all GeoJSON objects */
export type GeoJSONObject = Geometry | Feature | FeatureCollection;

// ============================================================================
// State Management (Immutable)
// ============================================================================

/**
 * Immutable registry for custom validation functions
 * Refactored from mutable global object to functional state management
 */
const validatorRegistry: ValidatorRegistry = {};

/**
 * Creates a new validator registry with an added validator
 * Pure function approach - returns new state instead of mutating
 */
const addValidator = (
  registry: ValidatorRegistry,
  type: GeoJSONObjectType,
  validator: CustomValidator,
): ValidatorRegistry => ({
  ...registry,
  [type]: validator,
});

// ============================================================================
// Utility Functions (Pure)
// ============================================================================

/**
 * Type guard for function checking
 * Refactored to use TypeScript type guards for better type safety
 */
const isFunction = (value: unknown): value is (...args: any[]) => unknown =>
  typeof value === "function";

/**
 * Type guard for object checking
 * Enhanced with proper null checking and type safety
 */
const isObject = (value: unknown): value is Record<string, any> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/**
 * Type guard for number checking
 */
const isNumber = (value: unknown): value is number =>
  typeof value === "number" && !Number.isNaN(value);

// ============================================================================
// Error Handling (Functional)
// ============================================================================

/**
 * Formats validation results in a functional, immutable way
 * Refactored from imperative style to pure functional approach
 */
const formatValidationResult = (
  trace: boolean,
  errors: string[],
): ValidationResult => {
  if (trace) {
    return [...errors]; // Return immutable copy
  }
  return errors.length === 0;
};

/**
 * Safely executes custom validators with error handling
 * Pure function that doesn't mutate external state
 */
const executeCustomValidator = (
  validator: CustomValidator,
  type: string,
  object: unknown,
): string[] => {
  try {
    const result = validator(object);
    if (typeof result === "string") {
      return [result];
    }
    if (Array.isArray(result)) {
      return [...result]; // Immutable copy
    }
    return [];
  } catch (error) {
    return [`Problem with custom definition for ${type}: ${error}`];
  }
};

/**
 * Applies custom validations in a functional composition style
 * Refactored to use function composition and immutability
 */
const applyCustomValidations = (
  type: GeoJSONObjectType,
  object: unknown,
  existingErrors: string[] = [],
): string[] => {
  const validator = validatorRegistry[type];
  if (!isFunction(validator)) {
    return [...existingErrors];
  }

  const customErrors = executeCustomValidator(validator, type, object);
  return [...existingErrors, ...customErrors];
};

// ============================================================================
// Validation Functions (Pure and Composable)
// ============================================================================

/**
 * Validates position coordinates
 * Refactored to pure function with comprehensive type checking
 */
export const isPosition = (
  position: unknown,
  trace = false,
): ValidationResult => {
  const errors: string[] = [];

  if (!Array.isArray(position)) {
    errors.push("Position must be an array");
  } else if (position.length < 2) {
    errors.push("Position must be at least two elements");
  } else {
    // Use functional approach with immutable error collection
    const invalidElements = position
      .map((pos, index) => ({ pos, index }))
      .filter(({ pos }) => !isNumber(pos))
      .map(
        ({ pos, index }) =>
          `Position must only contain numbers. Item ${pos} at index ${index} is invalid.`,
      );

    errors.push(...invalidElements);
  }

  const finalErrors = applyCustomValidations("Position", position, errors);
  return formatValidationResult(trace, finalErrors);
};

/**
 * Validates bounding box
 * Enhanced with proper type checking and immutable operations
 */
export const isBbox = (bbox: unknown, trace = false): ValidationResult => {
  const errors: string[] = [];

  if (!Array.isArray(bbox)) {
    errors.push("bbox must be an array");
  } else if (bbox.length % 2 !== 0) {
    errors.push("bbox, must be a 2*n array");
  }

  const finalErrors = applyCustomValidations("Bbox", bbox, errors);
  return formatValidationResult(trace, finalErrors);
};

/**
 * Higher-order function for validating coordinate arrays
 * Demonstrates functional composition and reusability
 */
const validateCoordinateArray = (
  coordinates: unknown,
  elementValidator: (element: unknown, trace: boolean) => ValidationResult,
  elementName: string,
  trace = false,
): ValidationResult => {
  const errors: string[] = [];

  if (!Array.isArray(coordinates)) {
    errors.push("coordinates must be an array");
  } else {
    // Functional approach to validation with immutable error collection
    const validationErrors = coordinates.flatMap((element, index) => {
      const result = elementValidator(element, true);
      if (Array.isArray(result) && result.length > 0) {
        return result.map((error) => `at ${index}: ${error}`);
      }
      return [];
    });

    errors.push(...validationErrors);
  }

  return formatValidationResult(trace, errors);
};

/**
 * Validates MultiPoint coordinates using functional composition
 */
export const isMultiPointCoor = (
  coordinates: unknown,
  trace = false,
): ValidationResult =>
  validateCoordinateArray(coordinates, isPosition, "position", trace);

/**
 * Validates LineString coordinates with minimum length requirement
 */
export const isLineStringCoor = (
  coordinates: unknown,
  trace = false,
): ValidationResult => {
  if (Array.isArray(coordinates) && coordinates.length <= 1) {
    const errors = ["coordinates must have at least two elements"];
    return formatValidationResult(trace, errors);
  }

  return validateCoordinateArray(coordinates, isPosition, "position", trace);
};

/**
 * Validates MultiLineString coordinates using function composition
 */
export const isMultiLineStringCoor = (
  coordinates: unknown,
  trace = false,
): ValidationResult =>
  validateCoordinateArray(coordinates, isLineStringCoor, "linestring", trace);

/**
 * Validates linear ring coordinates (for Polygon validation)
 * Private function using closure to maintain encapsulation
 */
const isLinearRingCoor = (
  coordinates: unknown,
  trace = false,
): ValidationResult => {
  const errors: string[] = [];

  if (!Array.isArray(coordinates)) {
    errors.push("coordinates must be an array");
  } else {
    if (coordinates.length < 4) {
      errors.push("coordinates must have at least four positions");
    }

    // Validate each position using functional approach
    const positionErrors = coordinates.flatMap((pos, index) => {
      const result = isPosition(pos, true);
      if (Array.isArray(result) && result.length > 0) {
        return result.map((error) => `at ${index}: ${error}`);
      }
      return [];
    });

    errors.push(...positionErrors);
  }

  return formatValidationResult(trace, errors);
};

/**
 * Validates Polygon coordinates using functional composition
 */
export const isPolygonCoor = (
  coordinates: unknown,
  trace = false,
): ValidationResult =>
  validateCoordinateArray(coordinates, isLinearRingCoor, "linear ring", trace);

/**
 * Validates MultiPolygon coordinates using function composition
 */
export const isMultiPolygonCoor = (
  coordinates: unknown,
  trace = false,
): ValidationResult =>
  validateCoordinateArray(coordinates, isPolygonCoor, "polygon", trace);

/**
 * Higher-order function for validating GeoJSON objects
 * Demonstrates functional composition and DRY principles
 */
const validateGeoJSONObject = (
  obj: unknown,
  expectedType: string,
  coordinateValidator?: (coords: unknown, trace: boolean) => ValidationResult,
  customType: GeoJSONObjectType = expectedType as GeoJSONObjectType,
  trace = false,
): ValidationResult => {
  if (!isObject(obj)) {
    return formatValidationResult(trace, ["must be a JSON Object"]);
  }

  const errors: string[] = [];

  // Validate bbox if present
  if ("bbox" in obj) {
    const bboxResult = isBbox(obj.bbox, true);
    if (Array.isArray(bboxResult) && bboxResult.length > 0) {
      errors.push(...bboxResult);
    }
  }

  // Validate type
  if ("type" in obj) {
    if (obj.type !== expectedType) {
      errors.push(`type must be "${expectedType}"`);
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  // Validate coordinates if validator provided
  if (coordinateValidator && "coordinates" in obj) {
    const coordResult = coordinateValidator(obj.coordinates, true);
    if (Array.isArray(coordResult) && coordResult.length > 0) {
      errors.push(...coordResult);
    }
  } else if (coordinateValidator) {
    errors.push('must have a member with the name "coordinates"');
  }

  const finalErrors = applyCustomValidations(customType, obj, errors);
  return formatValidationResult(trace, finalErrors);
};

// ============================================================================
// Geometry Validation Functions
// ============================================================================

export const isPoint = (point: unknown, trace = false): ValidationResult =>
  validateGeoJSONObject(point, "Point", isPosition, "Point", trace);

export const isMultiPoint = (
  multiPoint: unknown,
  trace = false,
): ValidationResult =>
  validateGeoJSONObject(
    multiPoint,
    "MultiPoint",
    isMultiPointCoor,
    "MultiPoint",
    trace,
  );

export const isLineString = (
  lineString: unknown,
  trace = false,
): ValidationResult =>
  validateGeoJSONObject(
    lineString,
    "LineString",
    isLineStringCoor,
    "LineString",
    trace,
  );

export const isMultiLineString = (
  multiLineString: unknown,
  trace = false,
): ValidationResult =>
  validateGeoJSONObject(
    multiLineString,
    "MultiLineString",
    isMultiLineStringCoor,
    "MultiLineString",
    trace,
  );

export const isPolygon = (polygon: unknown, trace = false): ValidationResult =>
  validateGeoJSONObject(polygon, "Polygon", isPolygonCoor, "Polygon", trace);

export const isMultiPolygon = (
  multiPolygon: unknown,
  trace = false,
): ValidationResult =>
  validateGeoJSONObject(
    multiPolygon,
    "MultiPolygon",
    isMultiPolygonCoor,
    "MultiPolygon",
    trace,
  );

/**
 * Validates GeometryCollection with special handling for geometries array
 */
export const isGeometryCollection = (
  geometryCollection: unknown,
  trace = false,
): ValidationResult => {
  if (!isObject(geometryCollection)) {
    return formatValidationResult(trace, ["must be a JSON Object"]);
  }

  const errors: string[] = [];

  // Validate bbox if present
  if ("bbox" in geometryCollection) {
    const bboxResult = isBbox(geometryCollection.bbox, true);
    if (Array.isArray(bboxResult) && bboxResult.length > 0) {
      errors.push(...bboxResult);
    }
  }

  // Validate type
  if ("type" in geometryCollection) {
    if (geometryCollection.type !== "GeometryCollection") {
      errors.push('type must be "GeometryCollection"');
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  // Validate geometries array
  if ("geometries" in geometryCollection) {
    if (Array.isArray(geometryCollection.geometries)) {
      const geometryErrors = geometryCollection.geometries.flatMap(
        (geometry, index) => {
          const result = isGeometryObject(geometry, true);
          if (Array.isArray(result) && result.length > 0) {
            return result.map((error) => `at ${index}: ${error}`);
          }
          return [];
        },
      );

      errors.push(...geometryErrors);
    } else {
      errors.push('"geometries" must be an array');
    }
  } else {
    errors.push('must have a member with the name "geometries"');
  }

  const finalErrors = applyCustomValidations(
    "GeometryCollection",
    geometryCollection,
    errors,
  );
  return formatValidationResult(trace, finalErrors);
};

// ============================================================================
// Feature Validation Functions
// ============================================================================

/**
 * Validates Feature objects with optional properties requirement
 */
export const isFeature = (
  feature: unknown,
  trace = false,
  makePropertiesRequired = true,
): ValidationResult => {
  if (!isObject(feature)) {
    return formatValidationResult(trace, ["must be a JSON Object"]);
  }

  const errors: string[] = [];

  // Validate bbox if present
  if ("bbox" in feature) {
    const bboxResult = isBbox(feature.bbox, true);
    if (Array.isArray(bboxResult) && bboxResult.length > 0) {
      errors.push(...bboxResult);
    }
  }

  // Validate type
  if ("type" in feature) {
    if (feature.type !== "Feature") {
      errors.push('type must be "Feature"');
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  // Validate properties (optional based on parameter)
  if (makePropertiesRequired && !("properties" in feature)) {
    errors.push('must have a member with the name "properties"');
  }

  // Validate geometry
  if ("geometry" in feature) {
    if (feature.geometry !== null) {
      const geometryResult = isGeometryObject(feature.geometry, true);
      if (Array.isArray(geometryResult) && geometryResult.length > 0) {
        errors.push(...geometryResult);
      }
    }
  } else {
    errors.push('must have a member with the name "geometry"');
  }

  const finalErrors = applyCustomValidations("Feature", feature, errors);
  return formatValidationResult(trace, finalErrors);
};

/**
 * Validates FeatureCollection objects
 */
export const isFeatureCollection = (
  featureCollection: unknown,
  trace = false,
): ValidationResult => {
  if (!isObject(featureCollection)) {
    return formatValidationResult(trace, ["must be a JSON Object"]);
  }

  const errors: string[] = [];

  // Validate bbox if present
  if ("bbox" in featureCollection) {
    const bboxResult = isBbox(featureCollection.bbox, true);
    if (Array.isArray(bboxResult) && bboxResult.length > 0) {
      errors.push(...bboxResult);
    }
  }

  // Validate type
  if ("type" in featureCollection) {
    if (featureCollection.type !== "FeatureCollection") {
      errors.push('type must be "FeatureCollection"');
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  // Validate features array
  if ("features" in featureCollection) {
    if (Array.isArray(featureCollection.features)) {
      const featureErrors = featureCollection.features.flatMap(
        (feature, index) => {
          const result = isFeature(feature, true);
          if (Array.isArray(result) && result.length > 0) {
            return result.map((error) => `at ${index}: ${error}`);
          }
          return [];
        },
      );

      errors.push(...featureErrors);
    } else {
      errors.push('"features" must be an array');
    }
  } else {
    errors.push('must have a member with the name "features"');
  }

  const finalErrors = applyCustomValidations(
    "FeatureCollection",
    featureCollection,
    errors,
  );
  return formatValidationResult(trace, finalErrors);
};

// ============================================================================
// Main Validation Functions
// ============================================================================

/**
 * Immutable lookup tables for validation functions
 * Refactored from mutable objects to immutable functional approach
 */
const geometryValidators = Object.freeze({
  Point: isPoint,
  MultiPoint: isMultiPoint,
  LineString: isLineString,
  MultiLineString: isMultiLineString,
  Polygon: isPolygon,
  MultiPolygon: isMultiPolygon,
  GeometryCollection: isGeometryCollection,
} as const);

const nonGeometryValidators = Object.freeze({
  Feature: isFeature,
  FeatureCollection: isFeatureCollection,
} as const);

/**
 * Validates any geometry object using functional dispatch
 */
export const isGeometryObject = (
  geometryObject: unknown,
  trace = false,
): ValidationResult => {
  if (!isObject(geometryObject)) {
    return formatValidationResult(trace, ["must be a JSON Object"]);
  }

  if (!("type" in geometryObject)) {
    const errors = ['must have a member with the name "type"'];
    const finalErrors = applyCustomValidations(
      "GeometryObject",
      geometryObject,
      errors,
    );
    return formatValidationResult(trace, finalErrors);
  }

  const validator =
    geometryValidators[geometryObject.type as keyof typeof geometryValidators];
  if (validator) {
    return validator(geometryObject, trace);
  }

  const errors = [
    'type must be one of: "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon" or "GeometryCollection"',
  ];
  const finalErrors = applyCustomValidations(
    "GeometryObject",
    geometryObject,
    errors,
  );
  return formatValidationResult(trace, finalErrors);
};

/**
 * Validates any GeoJSON object using functional dispatch
 * Main entry point with comprehensive type checking
 */
export const isGeoJSONObject = (
  geoJSONObject: unknown,
  trace = false,
): ValidationResult => {
  if (!isObject(geoJSONObject)) {
    return formatValidationResult(trace, ["must be a JSON Object"]);
  }

  if (!("type" in geoJSONObject)) {
    const errors = ['must have a member with the name "type"'];
    const finalErrors = applyCustomValidations(
      "GeoJSON",
      geoJSONObject,
      errors,
    );
    return formatValidationResult(trace, finalErrors);
  }

  // Try non-geometry validators first
  const nonGeoValidator =
    nonGeometryValidators[
      geoJSONObject.type as keyof typeof nonGeometryValidators
    ];
  if (nonGeoValidator) {
    return nonGeoValidator(geoJSONObject, trace);
  }

  // Try geometry validators
  const geoValidator =
    geometryValidators[geoJSONObject.type as keyof typeof geometryValidators];
  if (geoValidator) {
    return geoValidator(geoJSONObject, trace);
  }

  const errors = [
    'type must be one of: "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection", "Feature", or "FeatureCollection"',
  ];
  const finalErrors = applyCustomValidations("GeoJSON", geoJSONObject, errors);
  return formatValidationResult(trace, finalErrors);
};

// Alias for backwards compatibility
export const valid = isGeoJSONObject;

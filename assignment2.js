var canvas;
var gl;

var modelViewMatrixLoc = mat4();
var projectionMatrixLoc = mat4();
var projectionMatrix = mat4();

var left = -2.0;
var right = 5.0;
var itop = 3.0;
var bottom = -3.0;
var near = -20;
var far = 30;

var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var program;
var sphereIndex = 0;
var tetraIndex = 0;
var normalsArray = [];
var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

// Cube
var cubeTexture; //variable to store texture of cube
var numVertices = 36;

// Sphere
var numTimesToSubdivide = 4; //number of time of subdivision
var sphereScale = 3; // decide image bitmap scale
var sphereTexture; //variable to store texture of sphere
var rotationSpeed = 3; //Rotation speed for sphere

// Tetrahedron
var tetraTexture;

var texCoord = [vec2(0, 0), vec2(0, 1), vec2(1, 1), vec2(1, 0)];

//Lighting and shading
var lightPosition = vec4(0.1, 1.0, 1.0, 0.0);
var lightAmbient = vec4(0.1, 1.0, 0.4, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 10.0;

// Function for texture mapping for cube
function configureCubeTexture(image) {
  cubeTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Upload image into texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.uniform1i(gl.getUniformLocation(program, "cubeTexture"), 0);
}

// Function for texture mapping for tetrahedron
function configureTetraTexture(image) {
  tetraTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 2);
  gl.bindTexture(gl.TEXTURE_2D, tetraTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.uniform1i(gl.getUniformLocation(program, "tetraTexture"), 2);
}

function quad(a, b, c, d) {
  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[a]);

  var normal = cross(t2, t1);
  normal = vec4(normal);
  normal = normalize(normal);

  normalsArray.push(normal);
  normalsArray.push(normal);
  normalsArray.push(normal);
  normalsArray.push(normal);
  normalsArray.push(normal);
  normalsArray.push(normal);

  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[b]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[1]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[a]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[0]);

  pointsArray.push(vertices[c]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[2]);

  pointsArray.push(vertices[d]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[3]);
}

function colorCube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

// Function to create triangle
function triangle(a, b, c) {
  var t1 = subtract(b, a);
  var t2 = subtract(c, a);
  var normal = vec4(normalize(cross(t2, t1)));

  normalsArray.push(normal);
  normalsArray.push(normal);
  normalsArray.push(normal);

  pointsArray.push(a);
  colorsArray.push(vertexColors[4]);
  texCoordsArray.push([
    (sphereScale * Math.acos(a[0])) / Math.PI,
    (sphereScale * Math.asin(a[1] / Math.sqrt(1.0 - a[0] * a[0]))) / Math.PI,
  ]);

  pointsArray.push(b);
  colorsArray.push(vertexColors[4]);
  texCoordsArray.push([
    (sphereScale * Math.acos(b[0])) / Math.PI,
    (sphereScale * Math.asin(b[1] / Math.sqrt(1.0 - b[0] * b[0]))) / Math.PI,
  ]);

  pointsArray.push(c);
  colorsArray.push(vertexColors[4]);
  texCoordsArray.push([
    (sphereScale * Math.acos(c[0])) / Math.PI,
    (sphereScale * Math.asin(c[1] / Math.sqrt(1.0 - c[0] * c[0]))) / Math.PI,
  ]);
}

// Function for triangle division
function divideTriangle(a, b, c, count) {
  if (count > 0) {
    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);

    ab = normalize(ab, true);
    ac = normalize(ac, true);
    bc = normalize(bc, true);

    divideTriangle(a, ab, ac, count - 1);
    divideTriangle(ab, b, bc, count - 1);
    divideTriangle(bc, c, ac, count - 1);
    divideTriangle(ab, bc, ac, count - 1);
  } else {
    triangle(a, b, c);
    sphereIndex += 3;
  }
}

function tetrahedron(a, b, c, d, n) {
  divideTriangle(a, b, c, n);
  divideTriangle(d, c, b, n);
  divideTriangle(a, d, b, n);
  divideTriangle(a, c, d, n);
}

function tetra(a, b, c, d) {
  // tetrahedron with each side using
  // a different color

  triangle(a, c, b);
  triangle(a, c, d);
  triangle(a, b, d);
  triangle(b, c, d);
  tetraIndex += 12;
}

function divideTetra(a, b, c, d, count) {
  // check for end of recursion

  if (count === 0) {
    tetra(a, b, c, d);
  }

  // find midpoints of sides
  // divide four smaller tetrahedra
  else {
    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var ad = mix(a, d, 0.5);
    var bc = mix(b, c, 0.5);
    var bd = mix(b, d, 0.5);
    var cd = mix(c, d, 0.5);

    --count;

    divideTetra(a, ab, ac, ad, count);
    divideTetra(ab, b, bc, bd, count);
    divideTetra(ac, bc, c, cd, count);
    divideTetra(ad, bd, cd, d, count);
  }
}

// Texture mapping for sphere
function configureSphereTexture(image) {
  sphereTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 1);
  gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.uniform1i(gl.getUniformLocation(program, "sphereTexture"), 1);
}

var vertices = [
  // Cube
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),

  // Sphere
  vec4(0.0, 0.0, -1.0, 1),
  vec4(0.0, 0.942809, 0.333333, 1),
  vec4(-0.816497, -0.471405, 0.333333, 1),
  vec4(0.816497, -0.471405, 0.333333, 1),
];

var vertexColors = [
  vec4(0.0, 0.0, 0.0, 1.0), // black
  vec4(1.0, 0.0, 0.0, 1.0), // red
  vec4(1.0, 1.0, 0.0, 1.0), // yellow
  vec4(0.0, 1.0, 0.0, 1.0), // green
  vec4(0.0, 0.0, 1.0, 1.0), // blue
  vec4(1.0, 0.0, 1.0, 1.0), // magenta
  vec4(0.0, 1.0, 1.0, 1.0), // white
  vec4(0.0, 1.0, 1.0, 1.0), // cyan
];

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  // Generate cube vertices
  colorCube();

  // Generate sphere vertices
  tetrahedron(
    vertices[8],
    vertices[9],
    vertices[10],
    vertices[11],
    numTimesToSubdivide
  );

  // Generate tetrahedron vertices
  divideTetra(vertices[8], vertices[9], vertices[10], vertices[11], 0);

  // Load shaders and initialize attribute buffers
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

  var nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

  var vNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

  var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoord);

  let ambientProduct = mult(lightAmbient, materialAmbient);
  let diffuseProduct = mult(lightDiffuse, materialDiffuse);
  let specularProduct = mult(lightSpecular, materialSpecular);

  let lightingVariables = [
    // Cube
    "shininess1",
    "lightPosition1",
    "ambientProduct1",
    "diffuseProduct1",
    "specularProduct1",
    // Sphere
    "shininess2",
    "lightPosition2",
    "ambientProduct2",
    "diffuseProduct2",
    "specularProduct2",
    // Tetrahedron
    "shininess3",
    "lightPosition3",
    "ambientProduct3",
    "diffuseProduct3",
    "specularProduct3",
  ];

  for (let lightingVariable of lightingVariables) {
    let data;

    switch (lightingVariable.substring(0, 2)) {
      case "sh":
        data = materialShininess;
        gl.uniform1f(gl.getUniformLocation(program, lightingVariable), data);
        break;
      case "li":
        data = flatten(lightPosition);
        gl.uniform4fv(gl.getUniformLocation(program, lightingVariable), data);
        break;
      case "am":
        data = flatten(ambientProduct);
        gl.uniform4fv(gl.getUniformLocation(program, lightingVariable), data);
        break;
      case "di":
        data = flatten(diffuseProduct);
        gl.uniform4fv(gl.getUniformLocation(program, lightingVariable), data);
        break;
      case "sp":
        data = flatten(specularProduct);
        gl.uniform4fv(gl.getUniformLocation(program, lightingVariable), data);
        break;
    }
  }

  // Load procedures dependent on the user interface controls
  let script = document.createElement("script");
  script.src = "app.js";
  document.head.appendChild(script);

  render();
};

let paramsTemplate = {
  rotation: -3,
  rotationAngle: 0,
  rotationAxes: [1, 1, 1],
  translationMagnitude: {
    x: 0,
    y: 0,
    z: 0,
  },
  scalingFactor: {
    x: 1,
    y: 1,
    z: 1,
  },
};

let cubeParams = JSON.parse(JSON.stringify(paramsTemplate));
cubeParams.rotationAxes = [1, 1, 1];
cubeParams.translationMagnitude.x = 1.625;

let sphereParams = JSON.parse(JSON.stringify(paramsTemplate));
sphereParams.translationMagnitude.x = -0.75;
sphereParams.rotationAxes = [0, 1, 1];

let tetraParams = JSON.parse(JSON.stringify(paramsTemplate));
tetraParams.rotationAxes = [1, 1, 1];
tetraParams.translationMagnitude.x = 3.75;

var render = function () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  projectionMatrix = ortho(left, right, bottom, itop, near, far);
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

  // Draw cube, 36 points
  cubeParams.rotationAngle += cubeParams.rotation;

  let modelViewMatrix = mat4();
  modelViewMatrix = mult(
    rotate(cubeParams.rotationAngle, ...cubeParams.rotationAxes),
    modelViewMatrix
  );
  modelViewMatrix = mult(
    translate(
      cubeParams.translationMagnitude.x,
      cubeParams.translationMagnitude.y,
      cubeParams.translationMagnitude.z
    ),
    modelViewMatrix
  );
  modelViewMatrix = mult(
    scalem(...Object.values(cubeParams.scalingFactor)),
    modelViewMatrix
  );

  gl.uniform1i(gl.getUniformLocation(program, "texMode"), 0);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays(gl.TRIANGLES, 0, 36);

  // Draw sphere, depends on the number of iterations
  sphereParams.rotationAngle += sphereParams.rotation;

  let modelViewMatrix2 = mat4();
  modelViewMatrix2 = mult(
    rotate(sphereParams.rotationAngle, ...sphereParams.rotationAxes),
    modelViewMatrix2
  );
  modelViewMatrix2 = mult(
    translate(
      sphereParams.translationMagnitude.x,
      sphereParams.translationMagnitude.y,
      sphereParams.translationMagnitude.z
    ),
    modelViewMatrix2
  );
  modelViewMatrix2 = mult(
    scalem(...Object.values(sphereParams.scalingFactor)),
    modelViewMatrix2
  );

  gl.uniform1i(gl.getUniformLocation(program, "texMode"), 1);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix2));
  for (let i = numVertices; i < sphereIndex + numVertices; i += 3) {
    gl.drawArrays(gl.TRIANGLES, i, 3);
  }

  // Draw tetrahedron
  tetraParams.rotationAngle += tetraParams.rotation;

  let modelViewMatrix3 = mat4();
  modelViewMatrix3 = mult(
    rotate(tetraParams.rotationAngle, ...tetraParams.rotationAxes),
    modelViewMatrix3
  );
  modelViewMatrix3 = mult(
    translate(
      tetraParams.translationMagnitude.x,
      tetraParams.translationMagnitude.y,
      tetraParams.translationMagnitude.z
    ),
    modelViewMatrix3
  );
  modelViewMatrix3 = mult(
    scalem(...Object.values(tetraParams.scalingFactor)),
    modelViewMatrix3
  );

  gl.uniform1i(gl.getUniformLocation(program, "texMode"), 2);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix3));
  for (
    let i = numVertices + sphereIndex;
    i < numVertices + sphereIndex + tetraIndex;
    i += 3
  ) {
    gl.drawArrays(gl.TRIANGLES, i, 3);
  }

  window.requestAnimFrame(render);
};

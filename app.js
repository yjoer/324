let selectedObject = "sphere";

// Initialize the image for texture mapping
var cubeImage = document.getElementById("cubeImage1");
configureCubeTexture(cubeImage);

var sphereImage = document.getElementById("sphereImage1");
configureSphereTexture(sphereImage);

configureTetraTexture(sphereImage);

// Image for texture mapping
// document.getElementById("Image1").onclick = function () {
//   cubeImage = document.getElementById("cubeImage1");
//   configureCubeTexture(cubeImage);

//   sphereImage = document.getElementById("sphereImage1");
//   configureSphereTexture(sphereImage);
// };

// document.getElementById("Image2").onclick = function () {
//   cubeImage = document.getElementById("cubeImage2");
//   configureCubeTexture(cubeImage);

//   sphereImage = document.getElementById("sphereImage2");
//   configureSphereTexture(sphereImage);
// };

// document.getElementById("Image3").onclick = function () {
//   cubeImage = document.getElementById("cubeImage3");
//   configureCubeTexture(cubeImage);

//   sphereImage = document.getElementById("sphereImage3");
//   configureSphereTexture(sphereImage);
// };

// document.getElementById("Image4").onclick = function () {
//   cubeImage = document.getElementById("cubeImage4");
//   configureCubeTexture(cubeImage);

//   sphereImage = document.getElementById("sphereImage4");
//   configureSphereTexture(sphereImage);
// };

// document.getElementById("Image5").onclick = function () {
//   cubeImage = document.getElementById("cubeImage5");
//   configureCubeTexture(cubeImage);

//   sphereImage = document.getElementById("sphereImage5");
//   configureSphereTexture(sphereImage);
// };

// document.getElementById("Image6").onclick = function () {
//   cubeImage = document.getElementById("cubeImage6");
//   configureCubeTexture(cubeImage);

//   sphereImage = document.getElementById("sphereImage6");
//   configureSphereTexture(sphereImage);
// };

let params = {
  sphere: sphereParams,
  cube: cubeParams,
  tetrahedron: tetraParams,
};

let lightingParams = {
  shininess: {
    sphere: "shininess2",
    cube: "shininess1",
    tetrahedron: "shininess3",
  },
  lightPosition: {
    sphere: "lightPosition2",
    cube: "lightPosition1",
    tetrahedron: "lightPosition3",
  },
  ambientLight: {
    sphere: "ambientLight2",
    cube: "ambientLight1",
    tetrahedron: "ambientLight3",
  },
  diffuseLight: {
    sphere: "diffuseLight2",
    cube: "diffuseLight1",
    tetrahedron: "diffuseLight3",
  },
  specularLight: {
    sphere: "specularLight2",
    cube: "specularLight1",
    tetrahedron: "specularLight3",
  },
};

// Function to get the material shininess
function handleShininess() {
  let shininessElement = document.getElementById("shininess");
  let shininessValue = document.getElementById("shininess-value");

  const uniformVariable = lightingParams["shininess"][selectedObject];
  const savedValue = params[selectedObject]["shininess"];

  shininessElement.value = savedValue;
  shininessValue.innerHTML = savedValue;
  gl.uniform1f(gl.getUniformLocation(program, uniformVariable), savedValue);

  shininessElement.addEventListener("input", () => {
    const value = Number.parseFloat(shininessElement.value);

    params[selectedObject]["shininess"] = value;
    shininessValue.innerHTML = value;

    gl.uniform1f(gl.getUniformLocation(program, uniformVariable), value);
  });
}

// Function to get the light position
document.getElementById("light-position").onchange = function () {
  let x = document.getElementById("light-position").value;
  let lightPosition = vec4(x, 1.0, 1.0, 0.0);

  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition)
  );
};

// Function to get the ambient light
document.getElementById("ambient-light").onchange = function () {
  let x = document.getElementById("ambient-light").value;
  let lightAmbient = vec4(x, x, 0.1, 1.0);
  let ambientProduct = mult(lightAmbient, materialAmbient);

  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
};

// Function to get the diffuse light
document.getElementById("diffuse-light").onchange = function () {
  let x = document.getElementById("diffuse-light").value;
  let lightDiffuse = vec4(x, x, 0.1, 1.0);
  let diffuseProduct = mult(lightDiffuse, materialDiffuse);

  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
};

// Function to get the specular light
document.getElementById("specular-light").onchange = function () {
  let x = document.getElementById("specular-light").value;
  let lightSpecular = vec4(x, x, 0.1, 1.0);
  let specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct)
  );
};

// Get rotation axes
function handleRotation() {
  let rotationAxesElements = document.getElementsByName("rotation-axes");

  let rotationElement = document.getElementById("rotation");
  let rotationValue = document.getElementById("rotation-value");

  function updateRotation() {
    rotationElement.value = params[selectedObject]["rotation"];
    rotationValue.innerHTML = params[selectedObject]["rotation"];
  }

  function setRotation() {
    const value = Number.parseFloat(rotationElement.value);

    params[selectedObject]["rotationAngle"] = 0;
    params[selectedObject]["rotation"] = value;
    rotationValue.innerHTML = value;
  }

  for (let rotationAxesElement of rotationAxesElements) {
    switch (rotationAxesElement.value) {
      case "x":
        if (params[selectedObject]["rotationAxes"][0] == 1) {
          rotationAxesElement.checked = true;
        } else {
          rotationAxesElement.checked = false;
        }
        break;
      case "y":
        if (params[selectedObject]["rotationAxes"][1] == 1) {
          rotationAxesElement.checked = true;
        } else {
          rotationAxesElement.checked = false;
        }
        break;
      case "z":
        if (params[selectedObject]["rotationAxes"][2] == 1) {
          rotationAxesElement.checked = true;
        } else {
          rotationAxesElement.checked = false;
        }
        break;
    }

    updateRotation();

    rotationAxesElement.addEventListener("input", () => {
      switch (rotationAxesElement.value) {
        case "x":
          if (rotationAxesElement.checked) {
            params[selectedObject]["rotationAxes"][0] = 1;
          } else {
            params[selectedObject]["rotationAxes"][0] = 0;
          }
          break;
        case "y":
          if (rotationAxesElement.checked) {
            params[selectedObject]["rotationAxes"][1] = 1;
          } else {
            params[selectedObject]["rotationAxes"][1] = 0;
          }
          break;
        case "z":
          if (rotationAxesElement.checked) {
            params[selectedObject]["rotationAxes"][2] = 1;
          } else {
            params[selectedObject]["rotationAxes"][2] = 0;
          }
          break;
      }
    });

    rotationElement.addEventListener("input", () => {
      setRotation();
    });
  }
}

// Get translation magnitude
function handleTranslation() {
  let selectedTranslationAxis = "x";

  let translationAxisElements = document.getElementsByName("translation-axis");

  let translationElement = document.getElementById("translation");
  let translationValue = document.getElementById("translation-value");

  function updateTranslation() {
    translationElement.value =
      params[selectedObject]["translationMagnitude"][selectedTranslationAxis];
    translationValue.innerHTML =
      params[selectedObject]["translationMagnitude"][selectedTranslationAxis];
  }

  function setTranslation() {
    const value = Number.parseFloat(translationElement.value);

    params[selectedObject]["translationMagnitude"][
      selectedTranslationAxis
    ] = value;
    translationValue.innerHTML = value;
  }

  for (let translationAxisElement of translationAxisElements) {
    if (translationAxisElement.value == selectedTranslationAxis) {
      translationAxisElement.checked = true;
    }

    translationAxisElement.addEventListener("input", () => {
      if (translationAxisElement.checked) {
        selectedTranslationAxis = translationAxisElement.value;
        updateTranslation();
      }
    });
  }

  updateTranslation();

  translationElement.addEventListener("input", () => {
    setTranslation();
  });
}

function handleScaling() {
  let selectedScalingAxis = "x";

  let scalingAxisElements = document.getElementsByName("scaling-axis");

  let scalingElement = document.getElementById("scaling");
  let scalingValue = document.getElementById("scaling-value");

  function updateScaling() {
    scalingElement.value =
      params[selectedObject]["scalingFactor"][selectedScalingAxis];
    scalingValue.innerHTML =
      params[selectedObject]["scalingFactor"][selectedScalingAxis];
  }

  function setScaling() {
    const value = Number.parseFloat(scalingElement.value);

    params[selectedObject]["scalingFactor"][selectedScalingAxis] = value;
    scalingValue.innerHTML = value;
  }

  for (let scalingAxisElement of scalingAxisElements) {
    if (scalingAxisElement.value == selectedScalingAxis) {
      scalingAxisElement.checked = true;
    }

    scalingAxisElement.addEventListener("input", () => {
      if (scalingAxisElement.checked) {
        selectedScalingAxis = scalingAxisElement.value;
        updateScaling();
      }
    });
  }

  updateScaling();

  scalingElement.addEventListener("input", () => {
    setScaling();
  });
}

function resetNodeById(id) {
  let oldElement = document.getElementById(id);
  let newElement = oldElement.cloneNode(true);
  oldElement.parentNode.replaceChild(newElement, oldElement);
}

function resetNodesByName(name) {
  let oldElements = document.getElementsByName(name);

  for (let oldElement of oldElements) {
    let newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
  }
}

function initializeHandlers() {
  resetNodeById("shininess");
  handleShininess();

  resetNodesByName("rotation-axes");
  resetNodeById("rotation");
  handleRotation();

  resetNodesByName("translation-axis");
  resetNodeById("translation");
  handleTranslation();

  resetNodesByName("scaling-axis");
  resetNodeById("scaling");
  handleScaling();
}

initializeHandlers();

// Get selected object (sphere, cube, tetrahedron)
let objectElements = document.getElementsByName("object");

for (let objectElement of objectElements) {
  if (objectElement.value == selectedObject) {
    objectElement.checked = true;
  }

  objectElement.addEventListener("input", () => {
    if (objectElement.checked) {
      selectedObject = objectElement.value;
      initializeHandlers();
    }
  });
}

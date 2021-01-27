let selectedObject = "sphere";

let textureParams = {
  sphere: {
    textureUrl: "images/image7.jpg",
    minificationFilter: "nml",
    magnificationFilter: "nearest",
  },
  cube: {
    textureUrl: "images/image8.jpg",
    minificationFilter: "nml",
    magnificationFilter: "nearest",
  },
  tetrahedron: {
    textureUrl: "images/image9.jpg",
    minificationFilter: "nml",
    magnificationFilter: "nearest",
  },
};

function loadImage(url, targetObject) {
  if (!targetObject) {
    targetObject = selectedObject;
  }

  let image = document.createElement("img");
  image.src = url;

  function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }

  image.onload = () => {
    if (!isPowerOf2(image.width) || !isPowerOf2(image.height)) {
      alert("The dimension of the texture is not power of 2.");
      return;
    }

    const { minificationFilter, magnificationFilter } = textureParams[
      targetObject
    ];

    switch (targetObject) {
      case "sphere":
        configureSphereTexture(image, minificationFilter, magnificationFilter);
        break;
      case "cube":
        configureCubeTexture(image, minificationFilter, magnificationFilter);
        break;
      case "tetrahedron":
        configureTetraTexture(image, minificationFilter, magnificationFilter);
        break;
    }
  };
}

// Initialize the image for texture mapping
loadImage(textureParams.sphere.textureUrl, "sphere");
loadImage(textureParams.cube.textureUrl, "cube");
loadImage(textureParams.tetrahedron.textureUrl, "tetrahedron");

// Image for texture mapping
function handleTexture() {
  const images = {
    1: "images/image1.jpg",
    2: "images/image2.jpg",
    3: "images/image3.jpg",
    4: "images/image4.jpg",
    5: "images/image5.jpg",
    6: "images/image6.jpg",
    7: "images/image7.jpg",
    8: "images/image8.jpg",
    9: "images/image9.jpg",
  };

  let buttonsElement = document.getElementsByName("texture");

  for (let buttonElement of buttonsElement) {
    buttonElement.addEventListener("click", () => {
      if (buttonElement.value == "custom") {
        let file = document.createElement("input");
        file.type = "file";
        file.click();

        const reader = new FileReader();

        file.addEventListener("change", () => {
          console.log(file.files[0]);
          reader.readAsDataURL(file.files[0]);
        });

        reader.addEventListener("load", () => {
          textureParams[selectedObject]["textureUrl"] = reader.result;
          loadImage(reader.result);
        });

        return;
      }

      textureParams[selectedObject]["textureUrl"] = images[buttonElement.value];
      loadImage(images[buttonElement.value]);
    });
  }
}

function handleMinificationFilter() {
  let minificationElement = document.getElementById("texture-minification");

  minificationElement.value =
    textureParams[selectedObject]["minificationFilter"];

  minificationElement.addEventListener("input", () => {
    textureParams[selectedObject]["minificationFilter"] =
      minificationElement.value;
    loadImage(textureParams[selectedObject]["textureUrl"]);
  });
}

function handleMagnificationFilter() {
  let magnificationElement = document.getElementById("texture-magnification");

  magnificationElement.value =
    textureParams[selectedObject]["magnificationFilter"];

  magnificationElement.addEventListener("input", () => {
    textureParams[selectedObject]["magnificationFilter"] =
      magnificationElement.value;
    loadImage(textureParams[selectedObject]["textureUrl"]);
  });
}

let params = {
  sphere: sphereParams,
  cube: cubeParams,
  tetrahedron: tetraParams,
};

let lightingParams = {
  model: "blinn-phong",
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
  ambientProduct: {
    sphere: "ambientProduct2",
    cube: "ambientProduct1",
    tetrahedron: "ambientProduct3",
  },
  diffuseProduct: {
    sphere: "diffuseProduct2",
    cube: "diffuseProduct1",
    tetrahedron: "diffuseProduct3",
  },
  specularProduct: {
    sphere: "specularProduct2",
    cube: "specularProduct1",
    tetrahedron: "specularProduct3",
  },
};

function handleLightingModel() {
  let lightingModelElement = document.getElementById("lighting-model");

  function updateLightingModel(value) {
    if (value == "phong") {
      gl.uniform1i(gl.getUniformLocation(program, "lightingModel"), 0);
    } else if (value == "blinn-phong") {
      gl.uniform1i(gl.getUniformLocation(program, "lightingModel"), 1);
    }
  }

  lightingModelElement.value = lightingParams.model;
  updateLightingModel(lightingParams.model);

  lightingModelElement.addEventListener("input", () => {
    const value = lightingModelElement.value;

    lightingParams.model = value;
    updateLightingModel(value);
  });
}

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
function handleLightPosition() {
  let lightPositionElement = document.getElementById("light-position");
  let lightPositionValue = document.getElementById("light-position-value");

  const uniformVariable = lightingParams["lightPosition"][selectedObject];
  const savedValue = params[selectedObject]["lightPosition"];
  const savedLightPosition = vec4(savedValue, 1.0, 1.0, 0.0);

  lightPositionElement.value = savedValue;
  lightPositionValue.innerHTML = savedValue;
  gl.uniform4fv(
    gl.getUniformLocation(program, uniformVariable),
    flatten(savedLightPosition)
  );

  lightPositionElement.addEventListener("input", () => {
    const value = Number.parseFloat(lightPositionElement.value);
    const lightPosition = vec4(value, 1.0, 1.0, 0.0);

    params[selectedObject]["lightPosition"] = value;
    lightPositionValue.innerHTML = value;

    gl.uniform4fv(
      gl.getUniformLocation(program, uniformVariable),
      flatten(lightPosition)
    );
  });
}

// Function to get the ambient light
function handleAmbientLight() {
  let ambientLightElement = document.getElementById("ambient-light");
  let ambientLightValue = document.getElementById("ambient-light-value");

  const uniformVariable = lightingParams["ambientProduct"][selectedObject];
  const savedValue = params[selectedObject]["ambientLight"];
  const savedAmbientLight = vec4(savedValue, savedValue, 0.1, 1.0);
  const savedAmbientProduct = mult(savedAmbientLight, materialAmbient);

  ambientLightElement.value = savedValue;
  ambientLightValue.innerHTML = savedValue;
  gl.uniform4fv(
    gl.getUniformLocation(program, uniformVariable),
    flatten(savedAmbientProduct)
  );

  ambientLightElement.addEventListener("input", () => {
    const value = Number.parseFloat(ambientLightElement.value);
    const ambientLight = vec4(value, value, 0.1, 1.0);
    const ambientProduct = mult(ambientLight, materialAmbient);

    params[selectedObject]["ambientLight"] = value;
    ambientLightValue.innerHTML = value;

    gl.uniform4fv(
      gl.getUniformLocation(program, uniformVariable),
      flatten(ambientProduct)
    );
  });
}

// Function to get the diffuse light
function handleDiffuseLight() {
  let diffuseLightElement = document.getElementById("diffuse-light");
  let diffuseLightValue = document.getElementById("diffuse-light-value");

  const uniformVariable = lightingParams["diffuseProduct"][selectedObject];
  const savedValue = params[selectedObject]["diffuseLight"];
  const savedDiffuseLight = vec4(savedValue, savedValue, 0.1, 1.0);
  const savedDiffuseProduct = mult(savedDiffuseLight, materialDiffuse);

  diffuseLightElement.value = savedValue;
  diffuseLightValue.innerHTML = savedValue;
  gl.uniform4fv(
    gl.getUniformLocation(program, uniformVariable),
    flatten(savedDiffuseProduct)
  );

  diffuseLightElement.addEventListener("input", () => {
    const value = Number.parseFloat(diffuseLightElement.value);
    const diffuseLight = vec4(value, value, 0.1, 1.0);
    const diffuseProduct = mult(diffuseLight, materialDiffuse);

    params[selectedObject]["diffuseLight"] = value;
    diffuseLightValue.innerHTML = value;

    gl.uniform4fv(
      gl.getUniformLocation(program, uniformVariable),
      flatten(diffuseProduct)
    );
  });
}

// Function to get the specular light
function handleSpecularLight() {
  let specularLightElement = document.getElementById("specular-light");
  let specularLightValue = document.getElementById("specular-light-value");

  const uniformVariable = lightingParams["specularProduct"][selectedObject];
  const savedValue = params[selectedObject]["specularLight"];
  const savedSpecularLight = vec4(savedValue, savedValue, 0.1, 1.0);
  const savedSpecularProduct = mult(savedSpecularLight, materialSpecular);

  specularLightElement.value = savedValue;
  specularLightValue.innerHTML = savedValue;
  gl.uniform4fv(
    gl.getUniformLocation(program, uniformVariable),
    flatten(savedSpecularProduct)
  );

  specularLightElement.addEventListener("input", () => {
    const value = Number.parseFloat(specularLightElement.value);
    const specularLight = vec4(value, value, 0.1, 1.0);
    const specularProduct = mult(specularLight, materialSpecular);

    params[selectedObject]["specularLight"] = value;
    specularLightValue.innerHTML = value;

    gl.uniform4fv(
      gl.getUniformLocation(program, uniformVariable),
      flatten(specularProduct)
    );
  });
}

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
  resetNodesByName("texture");
  handleTexture();

  resetNodeById("texture-minification");
  handleMinificationFilter();

  resetNodeById("texture-magnification");
  handleMagnificationFilter();

  handleLightingModel();

  resetNodeById("shininess");
  handleShininess();

  resetNodeById("light-position");
  handleLightPosition();

  resetNodeById("ambient-light");
  handleAmbientLight();

  resetNodeById("diffuse-light");
  handleDiffuseLight();

  resetNodeById("specular-light");
  handleSpecularLight();

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

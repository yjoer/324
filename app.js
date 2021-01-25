// Initialize the image for texture mapping
var cubeImage = document.getElementById("cubeImage1");
configureCubeTexture(cubeImage);

var sphereImage = document.getElementById("sphereImage1");
configureSphereTexture(sphereImage);

// Image for texture mapping
document.getElementById("Image1").onclick = function () {
  cubeImage = document.getElementById("cubeImage1");
  configureCubeTexture(cubeImage);

  sphereImage = document.getElementById("sphereImage1");
  configureSphereTexture(sphereImage);
};

document.getElementById("Image2").onclick = function () {
  cubeImage = document.getElementById("cubeImage2");
  configureCubeTexture(cubeImage);

  sphereImage = document.getElementById("sphereImage2");
  configureSphereTexture(sphereImage);
};

document.getElementById("Image3").onclick = function () {
  cubeImage = document.getElementById("cubeImage3");
  configureCubeTexture(cubeImage);

  sphereImage = document.getElementById("sphereImage3");
  configureSphereTexture(sphereImage);
};

document.getElementById("Image4").onclick = function () {
  cubeImage = document.getElementById("cubeImage4");
  configureCubeTexture(cubeImage);

  sphereImage = document.getElementById("sphereImage4");
  configureSphereTexture(sphereImage);
};

document.getElementById("Image5").onclick = function () {
  cubeImage = document.getElementById("cubeImage5");
  configureCubeTexture(cubeImage);

  sphereImage = document.getElementById("sphereImage5");
  configureSphereTexture(sphereImage);
};

document.getElementById("Image6").onclick = function () {
  cubeImage = document.getElementById("cubeImage6");
  configureCubeTexture(cubeImage);

  sphereImage = document.getElementById("sphereImage6");
  configureSphereTexture(sphereImage);
};

// Function to get the material shininess
document.getElementById("materialshininess").onchange = function () {
  let materialShininess = document.getElementById("materialshininess").value;

  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
};

// Function to get the light position
document.getElementById("lightpositions").onchange = function () {
  let x = document.getElementById("lightpositions").value;
  let lightPosition = vec4(x, 1.0, 1.0, 0.0);

  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition)
  );
};

// Function to get the ambient light
document.getElementById("ambientLight").onchange = function () {
  let x = document.getElementById("ambientLight").value;
  let lightAmbient = vec4(x, x, 0.1, 1.0);
  let ambientProduct = mult(lightAmbient, materialAmbient);

  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
};

// Function to get the diffuse light
document.getElementById("diffuseLight").onchange = function () {
  let x = document.getElementById("diffuseLight").value;
  let lightDiffuse = vec4(x, x, 0.1, 1.0);
  let diffuseProduct = mult(lightDiffuse, materialDiffuse);

  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
};

// Function to get the specular light
document.getElementById("specularLight").onchange = function () {
  let x = document.getElementById("specularLight").value;
  let lightSpecular = vec4(x, x, 0.1, 1.0);
  let specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct)
  );
};

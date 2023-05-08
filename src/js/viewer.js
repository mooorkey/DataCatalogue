import cadex from "@cadexchanger/web-toolkit";

// Create model
let aModel = new cadex.ModelData_Model();

// Create scene and viewport
const aScene = new cadex.ModelPrs_Scene();
const aViewPort = new cadex.ModelPrs_ViewPort(
  {},
  document.getElementById("model-viewer")
);

// Attach viewport to scene
aViewPort.attachToScene(aScene);
async function dataLoader(theFileId, theObjectId) {
  const aCDXFBFileUrl = `data/cdxfb/${theFileId}.cdxfb/${theObjectId}`;
  const aRes = await fetch(aCDXFBFileUrl);
  if (aRes.status === 200) {
    return aRes.arrayBuffer();
  }
  throw new Error(aRes.statusText);
}
async function loadAndDisplayModel(theModelName) {
  try {
    // Load model
    const aLoadResult = await aModel.loadFile(
      theModelName,
      dataLoader,
      false /*append roots*/
    );
    console.log(`${theModelName} is loaded\n`, aLoadResult);
  } catch (theErr) {
    console.log("Unable to load and display model: ", theErr);
    // eslint-disable-next-line no-alert
    alert(`Unable to load model "${theModelName}" [${theErr.message}]`);
  }
}
const aLoadResult = await aModel.loadFile(theModelName, dataLoader, false /*append roots*/);
    console.log(`${theModelName} is loaded\n`, aLoadResult);
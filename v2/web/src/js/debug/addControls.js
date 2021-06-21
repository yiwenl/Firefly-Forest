// addControls.js

import Settings from "../Settings";
import Config from "../Config";
import { saveJson } from "../utils";
import { GL } from "alfrid";

const addControls = (scene) => {
  const oControl = {
    save: () => {
      saveJson(Config, "Settings");
    },
    webgl2: GL.webgl2.toString(),
  };

  setTimeout(() => {
    gui
      .add(Config, "numParticles", [16, 32, 64, 128])
      .onFinishChange(Settings.reload);
    gui
      .add(Config, "numTrees", 1, 40)
      .step(1)
      .onFinishChange(Settings.reload);
    gui.add(oControl, "webgl2").listen();
    // gui.add(Config, "stopAfterSaved").onFinishChange(Settings.reload);
    // gui.add(Config, "autoSave").onFinishChange(Settings.reload);
    gui.add(Config, "cameraMovement").onFinishChange(Settings.refresh);
    gui.add(Config, "debug").onFinishChange(Settings.refresh);
    gui.add(oControl, "save").name("Save Settings");
    gui.add(Settings, "reset").name("Reset Default");
  }, 200);
};

export default addControls;

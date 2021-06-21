import "../scss/global.scss";

import "./utils/Capture";
import { GL } from "alfrid";

const o = require("alfrid");
console.log(o);

import Settings from "./Settings";
import SceneApp from "./SceneApp";
import preload from "./utils/preload";
import addControls from "./debug/addControls";

let scene;

if (document.body) {
  _init();
} else {
  window.addEventListener("DOMContentLoaded", _init);
}

function _init() {
  preload().then(_init3D, (e) => {
    console.error(e);
  });
}

function _init3D(o) {
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const container = document.querySelector(".container");

  container.appendChild(canvas);
  canvas.className = "Main-Canvas";
  const preserveDrawingBuffer = process.env.NODE_ENV === "development";
  const webgl1 = false;
  GL.init(canvas, { webgl1, preserveDrawingBuffer });

  if (process.env.NODE_ENV === "development") {
    Settings.init();
  }

  scene = new SceneApp();

  if (process.env.NODE_ENV === "development" && window.gui) {
    addControls(scene);
  }
}

import {
  GL,
  Scene,
  Draw,
  Geom,
  Object3D,
  DrawAxis,
  DrawDotsPlane,
  DrawCopy,
  FboPingPong,
} from "alfrid";
import Config from "./Config";
import { resize, iOS } from "./utils";
import Scheduler from "scheduling";

// draw calls
import DrawFloor from "./DrawFloor";
import DrawSave from "./DrawSave";
import DrawRender from "./DrawRender";

// shaders
import vsPass from "shaders/pass.vert";
import fsSim from "shaders/sim.frag";

let hasSaved = false;

class SceneApp extends Scene {
  constructor() {
    super();

    // camera
    this.orbitalControl.rx.setTo(0.8);
    this.orbitalControl.ry.setTo(0.3);
    this.orbitalControl.radius.setTo(20);

    // state
    this._containerWorld = new Object3D();
    this._containerWorld.y = -1;
    this._seed = Math.random() * 0xffff;

    // set size
    this.resize();
  }

  _initTextures() {
    const { numParticles: num } = Config;
    const type = iOS ? GL.HALF_FLOAT : GL.FLOAT;
    const oSettings = {
      type,
      minFilter: GL.NEAREST,
      magFilter: GL.NEAREST,
    };
    this._fbo = new FboPingPong(num, num, oSettings, 4);
  }

  _initViews() {
    this._dAxis = new DrawAxis();
    this._dDots = new DrawDotsPlane();
    this._dCopy = new DrawCopy();

    this._drawFloor = new DrawFloor();
    this._drawRender = new DrawRender();
    new DrawSave()
      .setClearColor(0, 0, 0, 1)
      .bindFrameBuffer(this._fbo.read)
      .draw();

    this._drawSim = new Draw()
      .setMesh(Geom.bigTriangle())
      .useProgram(vsPass, fsSim)
      .setClearColor(0, 0, 0, 1)
      .uniform("uNum", "int", parseInt(Config.numParticles))
      .uniform("uMaxRadius", "float", Config.envSize);

    this._generateTrees();
  }

  _generateTrees() {}

  update() {
    if (Config.cameraMovement) {
      this.orbitalControl.ry.value += 0.001;
      this.orbitalControl.rx.value =
        0.5 + Math.sin(Scheduler.getElapsedTime() * 0.1) * 0.2;
    }

    this._drawSim
      .bindFrameBuffer(this._fbo.write)
      .bindTexture("uPosMap", this._fbo.read.getTexture(0), 0)
      .bindTexture("uVelMap", this._fbo.read.getTexture(1), 1)
      .bindTexture("uExtraMap", this._fbo.read.getTexture(2), 2)
      .bindTexture("uDataMap", this._fbo.read.getTexture(3), 3)
      .uniform("uTime", Scheduler.getElapsedTime() + this._seed)
      .draw();

    this._fbo.swap();
  }

  render() {
    let s;
    if (Config.stopAfterSaved && hasSaved) {
      return;
    }

    const bg = [16.0, 19.0, 46.0].map((v) => (v / 255) * 0.25);
    GL.clear(bg[0], bg[1], bg[2], 1);

    GL.setModelMatrix(this._containerWorld.matrix);
    // this._dAxis.draw();
    // this._dDots.draw();

    this._drawFloor.draw();

    // console.log("this._fbo.read.getTexture(0)", this._fbo.read);
    this._drawRender
      .bindTexture("uPosMap", this._fbo.read.getTexture(0), 0)
      .bindTexture("uDataMap", this._fbo.read.getTexture(3), 3)
      .uniform("uViewport", [GL.width, GL.height])
      .draw();

    // debug
    if (!Config.debug) return;
    s = 128;

    GL.viewport(0, 0, s, s);
    this._dCopy.draw(this._fbo.read.getTexture(0));

    GL.viewport(s, 0, s, s);
    this._dCopy.draw(this._fbo.read.getTexture(2));

    GL.viewport(s * 2, 0, s, s);
    this._dCopy.draw(this._fbo.read.getTexture(3));
  }

  resize() {
    const { innerWidth, innerHeight } = window;
    const pixelRatio = 1;
    resize(innerWidth * pixelRatio, innerHeight * pixelRatio);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;

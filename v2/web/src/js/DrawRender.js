import { GL, Mesh, Draw } from "alfrid";

import Config from "./Config";

import vs from "shaders/render.vert";
import fs from "shaders/render.frag";

class DrawRender extends Draw {
  constructor() {
    super();

    const { numParticles: num } = Config;

    const positions = [];
    const indices = [];
    let count = 0;

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        positions.push([i / num, j / num, Math.random()]);
        indices.push(count);
        count++;
      }
    }

    const mesh = new Mesh(GL.POINTS)
      .bufferVertex(positions)
      .bufferIndex(indices);

    this.setMesh(mesh).useProgram(vs, fs);
  }
}

export default DrawRender;

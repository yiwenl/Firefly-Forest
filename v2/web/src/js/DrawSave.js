import { Draw, Mesh, GL } from "alfrid";

import Config from "./Config";
import { random, randomGaussian } from "randomutils";

import vs from "shaders/save.vert";
import fs from "shaders/save.frag";

class DrawSave extends Draw {
  constructor() {
    super();

    const { numParticles: num, envSize } = Config;

    const positions = [];
    const uvs = [];
    const normals = [];
    const data = [];
    const indices = [];
    let count = 0;

    const getPos = () => {
      const x = (randomGaussian() - 0.5) * envSize;
      const z = (randomGaussian() - 0.5) * envSize;
      const y = 0.1 + randomGaussian() * 2.0;
      return [x, y, z];
    };

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        positions.push(getPos());
        uvs.push([(i / num) * 2 - 1, (j / num) * 2 - 1]);
        normals.push([randomGaussian(), randomGaussian(), randomGaussian()]);
        data.push([random(Math.PI * 2), randomGaussian(), randomGaussian()]);
        indices.push(count);

        count++;
      }
    }

    const mesh = new Mesh(GL.POINTS)
      .bufferVertex(positions)
      .bufferTexCoord(uvs)
      .bufferNormal(normals)
      .bufferData(data, "aData", 3)
      .bufferIndex(indices);

    this.setMesh(mesh).useProgram(vs, fs);
  }
}

export default DrawSave;

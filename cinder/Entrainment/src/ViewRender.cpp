//
//  ViewRender.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/28.
//
//

#include "ViewRender.h"
#include "GlobalSettings.h"
#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewRender::ViewRender() : View("shaders/render.vert", "shaders/render.frag") {
    _init();
}

ViewRender::ViewRender(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewRender::_init() {
    gl::VboMesh::Layout     _layout;
    _layout.setStaticIndices();
    _layout.setStaticPositions();
    _layout.setStaticTexCoords2d();
    
    
    vector<Vec3f> positions;
    vector<Vec2f> coords;
    vector<uint> indices;
    int count = 0;
    
    float num = (float)GlobalSettings::getInstance().numParticles;
    float gap = 1.0 / num;
    
    for (int j=0; j<num; j++) {
        for (int i =0; i<num; i++) {
            Vec3f pos;
            positions.push_back(pos);
            Vec2f uv(i*gap, j*gap);
            coords.push_back(uv);
            indices.push_back(count);
            count ++;
        }
    }
    
    mesh = gl::VboMesh(positions.size(), indices.size(), _layout, GL_POINTS);
    mesh.bufferPositions(positions);
    mesh.bufferTexCoords2d(0, coords);
    mesh.bufferIndices(indices);
}

void ViewRender::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("flashingRange", GlobalSettings::getInstance().flashingRange);
    texture.bind(0);
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}
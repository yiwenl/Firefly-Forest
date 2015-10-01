//
//  ViewSky.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/25.
//
//

#include "ViewSky.h"

#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewSky::ViewSky() : View("shaders/copy.vert", "shaders/copy.frag") {
    _init();
}

ViewSky::ViewSky(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewSky::_init() {
    gl::VboMesh::Layout     _layout;
    _layout.setStaticIndices();
    _layout.setStaticPositions();
    _layout.setStaticTexCoords2d();
    
    
    vector<Vec3f> positions;
    vector<Vec2f> coords;
    vector<uint> indices;
    int count = 0;
    float numSeg = 8.0f;
    float uvGap = 1.0f/numSeg;
    
    for(int j=0; j<numSeg; j++) {
        for(int i=0; i<numSeg; i++) {
            
            positions.push_back(_getPosition(i, j, numSeg));
            positions.push_back(_getPosition(i+1, j, numSeg));
            positions.push_back(_getPosition(i+1, j+1, numSeg));
            positions.push_back(_getPosition(i, j+1, numSeg));
            
            coords.push_back(Vec2f(i/numSeg, j/numSeg));
            coords.push_back(Vec2f(i/numSeg+uvGap, j/numSeg));
            coords.push_back(Vec2f(i/numSeg+uvGap, j/numSeg+uvGap));
            coords.push_back(Vec2f(i/numSeg, j/numSeg+uvGap));

            indices.push_back(count*4+3);
            indices.push_back(count*4+2);
            indices.push_back(count*4+0);
            indices.push_back(count*4+2);
            indices.push_back(count*4+1);
            indices.push_back(count*4+0);
            
            count++;
        }
    }
    
    mesh = gl::VboMesh(positions.size(), indices.size(), _layout, GL_TRIANGLES);
    mesh.bufferPositions(positions);
    mesh.bufferTexCoords2d(0, coords);
    mesh.bufferIndices(indices);
}

Vec3f ViewSky::_getPosition(int i, int j, float numSeg) {
    float radius = 3000.0f;
    float rx, ry, tr;
    Vec3f pos;
    
    ry = i/numSeg * M_PI * 2.0;
    rx = M_PI * .5 - (j/numSeg) * M_PI;
    pos.y = sin(rx) * radius;
    tr = cos(rx) * radius;
    pos.x = cos(ry) * tr;
    pos.z = sin(ry) * tr;
    
    return pos;
}

void ViewSky::render(gl::TextureRef texture) {
    render(*texture);
}

void ViewSky::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    texture.bind();
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}
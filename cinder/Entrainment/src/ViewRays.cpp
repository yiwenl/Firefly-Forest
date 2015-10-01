//
//  ViewRays.cpp
//  Entrainment04
//
//  Created by Yi-Wen Lin on 2015/9/3.
//
//

#include "ViewRays.h"


#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewRays::ViewRays() : View("shaders/copy.vert", "shaders/ray.frag") {
    _init();
}

ViewRays::ViewRays(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


Vec3f ViewRays::_getPosition(float i, float j, float numRadius, float numHeight) {
    Vec3f pos;
    float radius = 200.0f;
    float height = 1400.0f;
    float pHeight = j/numHeight;
    float r = radius + (1.0-pHeight) * 130.0;
    
    float theta = i/numRadius * M_PI * 2.0;
    pos.x = cos(theta) * r + pHeight * 100.0;
    pos.z = sin(theta) * r;
    pos.y = pHeight * height-200.0;
    
    return pos;
}


void ViewRays::_init() {
    
    float numRadius = 24.0;
    float numHeight = 20.0;
    float uvRadius = 1.0 / numRadius;
    float uvHeight = 1.0 / numHeight;
    
    gl::VboMesh::Layout     _layout;
    _layout.setStaticIndices();
    _layout.setStaticPositions();
    _layout.setStaticTexCoords2d();
    
    vector<Vec3f> positions;
    vector<Vec2f> coords;
    vector<uint> indices;
    int count = 0;
    
    for(float j=0; j<numHeight; j++) {
        for(float i=0; i<numRadius; i++) {
            positions.push_back(_getPosition(i, j+1, numRadius, numHeight));
            positions.push_back(_getPosition(i+1, j+1, numRadius, numHeight));
            positions.push_back(_getPosition(i+1, j, numRadius, numHeight));
            positions.push_back(_getPosition(i, j, numRadius, numHeight));
            
            coords.push_back(Vec2f(i/numRadius, j/numHeight+uvHeight));
            coords.push_back(Vec2f(i/numRadius+uvRadius, j/numHeight+uvHeight));
            coords.push_back(Vec2f(i/numRadius+uvRadius, j/numHeight));
            coords.push_back(Vec2f(i/numRadius, j/numHeight));
            
            indices.push_back(count * 4 + 0);
            indices.push_back(count * 4 + 1);
            indices.push_back(count * 4 + 2);
            indices.push_back(count * 4 + 0);
            indices.push_back(count * 4 + 2);
            indices.push_back(count * 4 + 3);
            
            count ++;
        }
    }
    
    mesh = gl::VboMesh(positions.size(), indices.size(), _layout, GL_TRIANGLES);
    mesh.bufferPositions(positions);
    mesh.bufferTexCoords2d(0, coords);
    mesh.bufferIndices(indices);
}

void ViewRays::render() {
    shader->bind();
    gl::draw(mesh);
    shader->unbind();
}
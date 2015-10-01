//
//  ViewAxis.cpp
//  cinder
//
//  Created by Li Yi-Wen on 03/06/2015.
//
//

#include "ViewAxis.h"

ViewAxis::ViewAxis() : View("shaders/axis.vert", "shaders/axis.frag") {
    _init();
}

void ViewAxis::_init() {
    gl::VboMesh::Layout layout;
    layout.setStaticIndices();
    layout.setStaticColorsRGB();
    layout.setStaticPositions();
    
    vector<uint> indices;
    vector<Vec3f> positions;
    vector<Color> colors;
    
    float r = 9999.0f;
    positions.push_back(Vec3f(-r, 0, 0));
    positions.push_back(Vec3f( r, 0, 0));
    positions.push_back(Vec3f(0, -r, 0));
    positions.push_back(Vec3f(0,  r, 0));
    positions.push_back(Vec3f(0, 0, -r));
    positions.push_back(Vec3f(0, 0,  r));

    
    colors.push_back(Color(1.0, 0.0, 0.0));
    colors.push_back(Color(1.0, 0.0, 0.0));
    colors.push_back(Color(0.0, 1.0, 0.0));
    colors.push_back(Color(0.0, 1.0, 0.0));
    colors.push_back(Color(0.0, 0.0, 1.0));
    colors.push_back(Color(0.0, 0.0, 1.0));
    
    
    indices.push_back(0);
    indices.push_back(1);
    indices.push_back(2);
    indices.push_back(3);
    indices.push_back(4);
    indices.push_back(5);
    
    mesh = gl::VboMesh(positions.size(), indices.size(), layout, GL_LINES);
    mesh.bufferPositions(positions);
    mesh.bufferIndices(indices);
    mesh.bufferColorsRGB(colors);

}


void ViewAxis::render() {
    shader->bind();
    gl::draw(mesh);

    shader->unbind();
}
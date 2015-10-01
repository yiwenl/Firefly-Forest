//
//  ViewCopy.cpp
//  entrainment01
//
//  Created by Yi-Wen Lin on 2015/1/5.
//
//

#include "ViewCopy.h"
#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewCopy::ViewCopy() : View("shaders/copy.vert", "shaders/copy.frag") {
    _init();
}

ViewCopy::ViewCopy(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewCopy::_init() {
    mesh = bongiovi::MeshUtils::createPlane(2, 1);
}

void ViewCopy::render(gl::TextureRef texture) {
    render(*texture);
}

void ViewCopy::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    texture.bind();
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}

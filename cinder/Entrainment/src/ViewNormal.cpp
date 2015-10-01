//
//  ViewNormal.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/24.
//
//

#include "ViewNormal.h"
#include "GlobalSettings.h"
#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewNormal::ViewNormal() : View("shaders/copy.vert", "shaders/normal.frag") {
    _init();
}

ViewNormal::ViewNormal(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewNormal::_init() {
    mesh = bongiovi::MeshUtils::createPlane(2, 1);
}

void ViewNormal::render(gl::TextureRef texture) {
    render(*texture);
}

void ViewNormal::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("scale", _scale);
    texture.bind();
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}
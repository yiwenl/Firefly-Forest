//
//  ViewPost.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/8/17.
//
//

#include "ViewPost.h"
#include "GlobalSettings.h"
#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewPost::ViewPost() : View("shaders/copy.vert", "shaders/post.frag") {
    _init();
}

ViewPost::ViewPost(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewPost::_init() {
    mesh = bongiovi::MeshUtils::createPlane(2, 1);
}

void ViewPost::render(gl::Texture texture, gl::Texture textureGradient) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("textureGradient", 1);
    shader->uniform("exposure", GlobalSettings::getInstance().exposure);
    texture.bind(0);
    textureGradient.bind(1);
    gl::draw(mesh);
    texture.unbind();
    textureGradient.unbind();
    shader->unbind();
}
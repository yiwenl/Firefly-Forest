//
//  ViewGradientMap.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/27.
//
//

#include "ViewGradientMap.h"
#include "Utils.h"
#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;
using namespace bongiovi::utils;

ViewGradientMap::ViewGradientMap() : ViewCopy("shaders/copy.vert", "shaders/gradientMap.frag") {
    _textureGradient = Utils::createTexture("common/gradientMap.png");
//    _init();
}

ViewGradientMap::ViewGradientMap(string vsPath, string fsPath) : ViewCopy(vsPath, fsPath) {
//    _init();
}

void ViewGradientMap::render(gl::TextureRef texture) {
    render(*texture);
}

void ViewGradientMap::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("textureMap", 1);
    texture.bind(0);
    _textureGradient->bind(1);
    gl::draw(mesh);
    texture.unbind();
    _textureGradient->unbind();
    shader->unbind();
}
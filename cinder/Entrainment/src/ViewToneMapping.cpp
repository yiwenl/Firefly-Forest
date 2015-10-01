//
//  ViewToneMapping.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/28.
//
//

#include "ViewToneMapping.h"
#include "GlobalSettings.h"
#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewTonMapping::ViewTonMapping() : ViewCopy("shaders/copy.vert", "shaders/toneMapping.frag") {
}

ViewTonMapping::ViewTonMapping(string vsPath, string fsPath) : ViewCopy(vsPath, fsPath) {
}

void ViewTonMapping::render(gl::TextureRef texture) {
    render(*texture);
}

void ViewTonMapping::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("exposure", GlobalSettings::getInstance().exposure);
    texture.bind();
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}
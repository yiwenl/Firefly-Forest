//
//  ViewNoise.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/24.
//
//

#include "ViewNoise.h"
#include "GlobalSettings.h"
#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewNoise::ViewNoise() : View("shaders/copy.vert", "shaders/noise.frag") {
    _init();
}

ViewNoise::ViewNoise(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewNoise::_init() {
    mesh = bongiovi::MeshUtils::createPlane(2, 1);
}

void ViewNoise::render() {
}

void ViewNoise::render(gl::TextureRef textureDetail) {
    shader->bind();
    shader->uniform("time", _count);
    shader->uniform("noiseOffset", GlobalSettings::getInstance().noise);
    shader->uniform("noiseScale", GlobalSettings::getInstance().noiseScale);
    shader->uniform("detailMapScale", GlobalSettings::getInstance().detailMapScale);
    shader->uniform("detailMapHeight", GlobalSettings::getInstance().detailMapHeight);
    shader->uniform("texture", 0);
    textureDetail->bind(0);
    gl::draw(mesh);
    textureDetail->unbind();
    shader->unbind();
    
    _count += .0025f;
}
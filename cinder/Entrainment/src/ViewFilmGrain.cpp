
//
//  ViewFilmGrain.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/28.
//
//

#include "ViewFilmGrain.h"

#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewFilmGrain::ViewFilmGrain() : ViewCopy("shaders/copy.vert", "shaders/filmGrain.frag") {
}

ViewFilmGrain::ViewFilmGrain(string vsPath, string fsPath) : ViewCopy(vsPath, fsPath) {
}


void ViewFilmGrain::render(gl::TextureRef texture) {
    render(*texture);
}

void ViewFilmGrain::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("time", _count);
    shader->uniform("width", float(getWindowWidth()));
    shader->uniform("height", float(getWindowHeight()));
    texture.bind();
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
    
    _count += .01;
}
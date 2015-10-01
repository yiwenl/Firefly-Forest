//
//  ViewBlur.cpp
//  NikeCityAttack
//
//  Created by Yiwen on 06/08/2014.
//
//

#include "ViewBlur.h"

ViewBlur::ViewBlur() : ViewCopy() {
}

ViewBlur::ViewBlur(string vsPath, string fsPath) : ViewCopy(vsPath, fsPath) {
}


void ViewBlur::render(gl::TextureRef texture) {
    render(*texture);
}

void ViewBlur::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("blurOffset", blurOffset);
    texture.bind(0);
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}
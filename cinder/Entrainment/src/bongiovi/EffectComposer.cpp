//
//  EffectComposer.cpp
//  NikeCityAttack
//
//  Created by Yiwen on 05/08/2014.
//
//

#include "EffectComposer.h"

using namespace bongiovi::post;

Pass::Pass() {
}


Pass::Pass(string fragPath, int width, int height) : fboWidth(width), fboHeight(height) {
    _format.setMinFilter(GL_NEAREST);
    _format.setMagFilter(GL_NEAREST);
    _format.setSamples( 4 );
    _format.enableMipmapping();
    
    _view = new ViewCopy("shaders/copy.vert", fragPath);
    _init();
}


Pass::Pass(ViewCopy* view, int width, int height) : _view(view), fboWidth(width), fboHeight(height) {
    _format.setMinFilter(GL_NEAREST);
    _format.setMagFilter(GL_NEAREST);
    _format.setSamples( 4 );
    _format.enableMipmapping();
    
    _init();
}


Pass::Pass(string fragPath, int width, int height, Fbo::Format format) : fboWidth(width), fboHeight(height), _format(format) {
    _format.setMinFilter(GL_NEAREST);
    _format.setMagFilter(GL_NEAREST);
    _format.setSamples( 4 );
    _format.enableMipmapping();
    
    _view = new ViewCopy("shaders/copy.vert", fragPath);
    _init();
}


Pass::Pass(ViewCopy* view, int width, int height, Fbo::Format format) : _view(view), fboWidth(width), fboHeight(height), _format(format) {
    _format.setMinFilter(GL_NEAREST);
    _format.setMagFilter(GL_NEAREST);
    _format.setSamples( 4 );
    _format.enableMipmapping();
    
    _init();
}



void Pass::_init() {
    _fboPass        = new gl::Fbo(fboWidth, fboHeight, _format);
    _fboPass->bindFramebuffer();
    gl::clear(ColorAf(0.0, 0.0, 0.0, 0.0));
    _fboPass->unbindFramebuffer();
}


gl::Texture Pass::render(gl::Texture texture) {
    Area viewport = gl::getViewport();
    _fboPass->bindFramebuffer();
    gl::setViewport(_fboPass->getBounds());
    gl::clear(ColorAf(0.0, 0.0, 0.0, 0.0));
    _view->render(texture);
    _fboPass->unbindFramebuffer();
    gl::setViewport(viewport);
    return _fboPass->getTexture();
}


gl::Texture Pass::getTexture() {
    return _fboPass->getTexture();
}

Area Pass::getBounds() {
    return _fboPass->getBounds();
}





EffectComposer::EffectComposer() {
    _init();
}

void EffectComposer::_init() {
    _passes.empty();
    _passes.clear();
}

void EffectComposer::addPass(Pass* pass) {
    _passes.push_back(pass);
}


gl::Texture EffectComposer::render(gl::Texture texture) {
    gl::Texture tex(texture);
    
    for(int i=0; i<_passes.size(); i++) {
        tex = _passes[i]->render(tex);
    }
    
    _texture = tex;
    return tex;
}


gl::Texture EffectComposer::process(gl::Texture texture) {
    gl::Texture tex(texture);
    
    for(int i=0; i<_passes.size(); i++) {
        tex = _passes[i]->render(tex);
    }
    
    _texture = tex;
    return tex;
}

gl::Texture EffectComposer::getTexture() {
    return _texture;
}

Area EffectComposer::getBounds() {
    return _passes[0]->getBounds();
}


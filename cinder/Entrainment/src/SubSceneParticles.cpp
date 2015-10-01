    //
//  SubSceneParticles.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/28.
//
//

#include "SubSceneParticles.h"
#include "GlobalSettings.h"
#include "Utils.h"

using namespace bongiovi::utils;


SubSceneParticles::SubSceneParticles() {
    
}


SubSceneParticles::SubSceneParticles(CameraPersp* camera, CameraOrtho* cameraOtho, SceneQuat* sceneQuat, vector<Vec3f> treePos) : _camera(camera), _cameraOtho(cameraOtho), _sceneQuat(sceneQuat), _treePos(treePos) {
    
    _init();
}


void SubSceneParticles::_init() {
    
    Fbo::Format format;
    format.setColorInternalFormat(GL_RGBA32F_ARB);
    format.setMinFilter(GL_NEAREST);
    format.setMagFilter(GL_NEAREST);
    int size = GlobalSettings::getInstance().numParticles;
    _fboCurrent = new Fbo(size*2, size*2, format);
    _fboTarget = new Fbo(size*2, size*2, format);
    
    _fboCurrent->bindFramebuffer();
    gl::clear();
    _fboCurrent->unbindFramebuffer();
    
    _fboTarget->bindFramebuffer();
    gl::clear();
    _fboTarget->unbindFramebuffer();
    
    
    //  INIT VIEWS
    _vSave      = new ViewSave();
    _vCopy      = new ViewCopy();
    _vRender    = new ViewRender();
    _vSim       = new ViewSimulation(_treePos);
    
    Area viewport = gl::getViewport();
    gl::setMatrices(*_cameraOtho);
    gl::setViewport(_fboCurrent->getBounds());
    _fboCurrent->bindFramebuffer();
    _vSave->render();
    _fboCurrent->unbindFramebuffer();
    gl::setViewport(viewport);
    gl::setMatrices(*_camera);
    gl::rotate(_sceneQuat->quat);
    
}

void SubSceneParticles::update(){
    gl::disable(GL_DEPTH_TEST);
    gl::setMatrices(*_cameraOtho);
    Area viewport = gl::getViewport();
    gl::setViewport(_fboCurrent->getBounds());
    _fboTarget->bindFramebuffer();
    _vSim->render(_fboCurrent->getTexture());
    _fboTarget->unbindFramebuffer();
    gl::setViewport(viewport);
    gl::setMatrices(*_camera);
    gl::rotate(_sceneQuat->quat);
    gl::enable(GL_DEPTH_TEST);
    
//    writeImage("Fbo.png", _fboTarget->getTexture());
    
    swap(_fboTarget, _fboCurrent);
    _frameCount = 0;
}


void SubSceneParticles::render() {
    if(GlobalSettings::getInstance().showFbo) {
        gl::disable(GL_DEPTH_TEST);
        Area viewport = gl::getViewport();
        gl::setMatrices(*_cameraOtho);
        gl::setViewport(_fboCurrent->getBounds() + _fboCurrent->getBounds() + _fboCurrent->getBounds());
        _vCopy->render(_fboCurrent->getTexture());
        
        gl::enable(GL_DEPTH_TEST);
        gl::setViewport(viewport);
        gl::setMatrices(*_camera);
        gl::rotate(_sceneQuat->quat);
    }
    
    gl::enableAdditiveBlending();
    _vRender->render(_fboTarget->getTexture());
    gl::enableAlphaBlending();
}
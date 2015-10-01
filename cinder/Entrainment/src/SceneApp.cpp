//
//  SceneApp.cpp
//  cinder
//
//  Created by Li Yi-Wen on 03/06/2015.
//
//

#include "SceneApp.h"
#include "GlobalSettings.h"
#include "Utils.h"

using namespace bongiovi::utils;

SceneApp::SceneApp(app::WindowRef window) : Scene(window) {
    initTextures();
    initViews();
    initSubScenes();
    
    sceneQuat->lock(true);
    _camera->setPerspective( 95.0f, ci::app::getWindowAspectRatio(), 5.0f, 5000.0f);
    cameraControl->lockRotation(false);
    cameraControl->radius->setValue(1300);
    cameraControl->radius->limit(500, 1500);
//    cameraControl->radius->easing = .0002;
    cameraControl->rx->easing = .005;
    cameraControl->ry->easing = .005;
    cameraControl->rx->setValue(-.13);
//    cameraControl->ry->setValue(0.41);
//    cameraControl->rx->limit(-.13, .2);
    cameraControl->center.y = 220.0f;
    _lightPos = new Vec3f(100, 800, 0);
}


void SceneApp::initTextures() {
    _textureGradient = Utils::createTexture("common/gradientMap.png");
//    _textureGradient = Utils::createTexture("common/gradientMapGrey.png");
    
    gl::Fbo::Format format;
    
    /*/
    format.setMinFilter(GL_NEAREST_MIPMAP_LINEAR);
    format.setMagFilter(GL_NEAREST_MIPMAP_LINEAR);
    format.setSamples(4);
    format.enableMipmapping();
    _fboRender = new Fbo(4096, 4096, format);
    /*/
    
    float W = getWindowWidth();
    float H = getWindowHeight();

    format.setMinFilter(GL_NEAREST);
    format.setMagFilter(GL_NEAREST);
    format.setSamples(4);
    format.enableMipmapping();
    format.enableDepthBuffer();
    _fboRender = new Fbo(W, H, format);
    //*/
    
/*
    gl::Fbo::Format formatPass;
    formatPass.setMinFilter(GL_NEAREST_MIPMAP_LINEAR);
    formatPass.setMagFilter(GL_NEAREST_MIPMAP_LINEAR);
    formatPass.setSamples(4);
    
    ViewGradientMap* vGradient = new ViewGradientMap();
    ViewTonMapping* vToneMapping = new ViewTonMapping();
    ViewFilmGrain* vFilmGrain = new ViewFilmGrain();
    
    _composer = new EffectComposer();
    Pass* pGradientMap = new Pass(vGradient, W, H, formatPass);
    Pass* pToneMapping = new Pass(vToneMapping, W, H, formatPass);
    Pass* pFilmGrain = new Pass(vFilmGrain, W, H, formatPass);
    _composer->addPass(pGradientMap);
    _composer->addPass(pToneMapping);
    _composer->addPass(pFilmGrain);
 */
}

void SceneApp::initViews() {
    cout << "Init Views" << endl;
    
    _vAxis = new ViewAxis();
    _vCopy = new ViewCopy();
    _vPost = new ViewPost();
}


void SceneApp::initSubScenes() {
    _subSceneTerrain    = new SubSceneTerrain(_camera, _cameraOrtho, sceneQuat);
    _subSceneTrees      = new SubSceneTrees(_camera, _cameraOrtho, sceneQuat);
    _subSceneParticles  = new SubSceneParticles(_camera, _cameraOrtho, sceneQuat, _subSceneTrees->getTrees());
}


void SceneApp::updateGradientTexture(fs::path path) {
    _textureGradient = gl::Texture::create(loadImage(path));
}

void SceneApp::updateNoise() {
    _subSceneTerrain->updateNoise();
}


void SceneApp::render() {
//    cameraControl->ry->setValue(cameraControl->ry->getTargetValue() + .0005);
    if(GlobalSettings::getInstance().needUpdateNoise)   _subSceneTerrain->updateNoise();
    if(GlobalSettings::getInstance().renderParticles)   _subSceneParticles->update();
    
    Area viewport = gl::getViewport();
    gl::setViewport(_fboRender->getBounds());
    
    _fboRender->bindFramebuffer();
    float grey = .01;
    gl::clear(ColorAf(grey, grey, grey*.95, 1.0));
    
    if(GlobalSettings::getInstance().renderTerrain)
        _subSceneTerrain->render(_lightPos, cameraControl->eye);
    
    if(GlobalSettings::getInstance().renderTrees)
        _subSceneTrees->render(_lightPos, cameraControl->eye, _subSceneParticles->getFbo()->getTexture());
    
    if(GlobalSettings::getInstance().renderParticles)
        _subSceneParticles->render();
    
    _fboRender->unbindFramebuffer();
    
    gl::setViewport(viewport);
    gl::setMatrices(*_cameraOrtho);

    if(GlobalSettings::getInstance().postProcessing) {
//        _composer->render(_fboRender->getTexture());
//        _vCopy->render(_composer->getTexture());
        _vPost->render(_fboRender->getTexture(), *_textureGradient);
    } else {
        _vCopy->render(_fboRender->getTexture());
    }
    
}


void SceneApp::resize() {
    _camera->setAspectRatio(ci::app::getWindowAspectRatio());
}
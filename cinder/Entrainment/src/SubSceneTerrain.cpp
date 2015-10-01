
//
//  SubSceneTerrain.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/24.
//
//

#include "SubSceneTerrain.h"
#include "GlobalSettings.h"
#include "Utils.h"

using namespace bongiovi::utils;

SubSceneTerrain::SubSceneTerrain() {
    _init();
}


SubSceneTerrain::SubSceneTerrain(CameraPersp* camera, CameraOrtho* cameraOtho, SceneQuat* sceneQuat) :_camera(camera), _cameraOtho(cameraOtho), _sceneQuat(sceneQuat) {
    _init();
}


void SubSceneTerrain::_init() {
    //  TEXTURES
    _textureStarsMap            = Utils::createTexture("common/starsmap.png");
    _textureDetailHeight        = Utils::createTexture("common/detailHeight.png");
    
    gl::Texture::Format fmt;
    fmt.setWrap(GL_REPEAT, GL_REPEAT);
//    fmt.setMinFilter(GL_LINEAR_MIPMAP_NEAREST);
//    fmt.setMagFilter(GL_LINEAR_MIPMAP_NEAREST);
    _textureNoise               = Utils::createTexture("common/noise.png", fmt);
    
    int noiseSize = 512;
    gl::Fbo::Format format;
    format.setColorInternalFormat( GL_RGBA32F_ARB );
    format.setMinFilter(GL_LINEAR_MIPMAP_NEAREST);
    format.setMagFilter(GL_LINEAR_MIPMAP_NEAREST);
    format.enableMipmapping();
    _fboNoise = new gl::Fbo(noiseSize, noiseSize, format);
    _fboNormal = new gl::Fbo(noiseSize, noiseSize, format);
    
    
    //  VIEWS
    _vCopy      = new ViewCopy();
    _vNoise     = new ViewNoise();
    _vNormal    = new ViewNormal();
    _vSky       = new ViewSky();
    _vTerrain   = new ViewTerrain(20, 1000.0f, 300.0f);
    
    updateNoise();
    
    float numTiles = 4.0f;
    float uvGap = 1.0 / numTiles;
    float size = 1000.0f;
    for( int j=0; j<numTiles; j++) {
        for( int i=0; i<numTiles; i++) {
            float x = (i-numTiles/2) * size + size * .5;
            float z = (j-numTiles/2) * size + size * .5;
            _vPositions.push_back(Vec3f(x, 0, z));
            _vUvs.push_back(Vec2f(i*uvGap, j*uvGap));
        }
    
    }
}

void SubSceneTerrain::updateNoise() {
    Area viewport = gl::getViewport();
    gl::setMatrices(*_cameraOtho);
    
    gl::setViewport(_fboNoise->getBounds());
    _fboNoise->bindFramebuffer();
    gl::clear(ColorAf(0, 0, 0, 0));
    _vNoise->render(_textureDetailHeight);
    _fboNoise->unbindFramebuffer();
    
    _fboNormal->bindFramebuffer();
    gl::clear(ColorAf(0, 0, 0, 0));
    _vNormal->render(_fboNoise->getTexture());
    _fboNormal->unbindFramebuffer();
    
    gl::setViewport(viewport);
    gl::setMatrices(*_camera);
}


void SubSceneTerrain::render(Vec3f* lightPos, Vec3f eyePos) {
    
    if(GlobalSettings::getInstance().showStarSky) _vSky->render(_textureStarsMap);
    
    for (int i=0; i<_vPositions.size(); i++) {
        Vec3f pos = _vPositions[i];
        Vec2f uv = _vUvs[i];
        _vTerrain->render(_fboNoise->getTexture(), _fboNormal->getTexture(), *_textureNoise, pos, uv, 4.0f, *lightPos, eyePos);
    }
    
}
//
//  SubSceneTrees.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/26.
//
//

#include "SubSceneTrees.h"
#include "Utils.h"

using namespace bongiovi::utils;


SubSceneTrees::SubSceneTrees() {
    
}


SubSceneTrees::SubSceneTrees(CameraPersp* camera, CameraOrtho* cameraOtho, SceneQuat* sceneQuat) : _camera(camera), _cameraOtho(cameraOtho), _sceneQuat(sceneQuat) {
    _init();
}


void SubSceneTrees::_init() {
    _textureTreeNormal = Utils::createTexture("common/treeNormal.jpg");
    _vTrees = new ViewTrees();
}

void SubSceneTrees::render(Vec3f* lightPos, Vec3f eyePos, gl::Texture textureParticle) {
    _vTrees->render(*_textureTreeNormal, *lightPos, eyePos, textureParticle);
}
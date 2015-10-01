//
//  SubSceneTrees.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/26.
//
//

#ifndef __Entrainment03__SubSceneTrees__
#define __Entrainment03__SubSceneTrees__

#include <stdio.h>
#include "cinder/Camera.h"
#include "cinder/gl/Texture.h"
#include "SceneQuat.h"
#include "ViewTrees.h"

using namespace bongiovi;

class SubSceneTrees {
private:
    void _init();
    CameraOrtho*    _cameraOtho;
    CameraPersp*    _camera;
    SceneQuat*      _sceneQuat;
    gl::TextureRef  _textureTreeNormal;
    ViewTrees*      _vTrees;
    
public:
    SubSceneTrees();
    SubSceneTrees(CameraPersp*, CameraOrtho*, SceneQuat*);
    
    void render(Vec3f*, Vec3f, gl::Texture);
    vector<Vec3f>   getTrees() {
        return _vTrees->getTrees();
    }
};

#endif /* defined(__Entrainment03__SubSceneTrees__) */

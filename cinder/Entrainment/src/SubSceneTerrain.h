//
//  SubSceneTerrain.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/24.
//
//

#ifndef __Entrainment03__SubSceneTerrain__
#define __Entrainment03__SubSceneTerrain__

#include <stdio.h>
#include "cinder/Camera.h"
#include "cinder/gl/Fbo.h"
#include "cinder/gl/Texture.h"
#include "SceneQuat.h"
#include "ViewNoise.h"
#include "ViewCopy.h"
#include "ViewNormal.h"
#include "ViewSky.h"
#include "ViewTerrain.h"

using namespace bongiovi;


class SubSceneTerrain {
private :
    void _init();
    CameraOrtho*    _cameraOtho;
    CameraPersp*    _camera;
    SceneQuat*      _sceneQuat;
    
    ViewNoise*      _vNoise;
    ViewCopy*       _vCopy;
    ViewNormal*     _vNormal;
    ViewSky*        _vSky;
    ViewTerrain*    _vTerrain;
    
    gl::TextureRef  _textureStarsMap;
    gl::TextureRef  _textureNoise;
    gl::TextureRef  _textureDetailHeight;
    
    gl::Fbo*        _fboNoise;
    gl::Fbo*        _fboNormal;
    
    
    vector<Vec3f>   _vPositions;
    vector<Vec2f>   _vUvs;
    
    
public :
    SubSceneTerrain();
    SubSceneTerrain(CameraPersp*, CameraOrtho*, SceneQuat*);
    
    void updateNoise();
    void render(Vec3f*, Vec3f);
};

#endif /* defined(__Entrainment03__SubSceneTerrain__) */

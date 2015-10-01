//
//  SubSceneParticles.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/28.
//
//

#ifndef __Entrainment03__SubSceneParticles__
#define __Entrainment03__SubSceneParticles__

#include <stdio.h>

#include "cinder/Camera.h"
#include "cinder/gl/Texture.h"
#include "cinder/gl/Fbo.h"
#include "SceneQuat.h"
#include "ViewCopy.h"
#include "ViewSave.h"
#include "ViewRender.h"
#include "ViewSimulation.h"

using namespace bongiovi;
using namespace gl;

class SubSceneParticles {
private:
    void _init();
    CameraOrtho*    _cameraOtho;
    CameraPersp*    _camera;
    SceneQuat*      _sceneQuat;
    
    ViewCopy*       _vCopy;
    ViewSave*       _vSave;
    ViewRender*     _vRender;
    ViewSimulation* _vSim;
    
    Fbo*            _fboCurrent;
    Fbo*            _fboTarget;
    vector<Vec3f>   _treePos;
    int             _frameCount = 0;
    
public:
    SubSceneParticles();
    SubSceneParticles(CameraPersp*, CameraOrtho*, SceneQuat*, vector<Vec3f> treePos);
    
    void update();
    void render();
    
    Fbo* getFbo() {
        return _fboTarget;
    }
};

#endif /* defined(__Entrainment03__SubSceneParticles__) */

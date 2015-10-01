//
//  SceneApp.h
//  cinder
//
//  Created by Li Yi-Wen on 03/06/2015.
//
//

#ifndef __cinder__SceneApp__
#define __cinder__SceneApp__

#include <stdio.h>


#include "cinder/gl/Texture.h"
#include "cinder/gl/Fbo.h"
#include "Scene.h"
#include "ViewCopy.h"
#include "ViewAxis.h"
#include "ViewGradientMap.h"
#include "ViewToneMapping.h"
#include "ViewFilmGrain.h"
#include "ViewPost.h"
#include "SubSceneTerrain.h"
#include "SubSceneTrees.h"
#include "SubSceneParticles.h"
#include "EffectComposer.h"

using namespace bongiovi;
using namespace bongiovi::post;
using namespace ci;
using namespace gl;


class SceneApp : public Scene {
public:
    SceneApp(app::WindowRef);
    void                    render();
    void                    resize();
    void                    initTextures();
    void                    initViews();
    void                    initSubScenes();
    void                    updateGradientTexture(fs::path);
    void                    updateNoise();
    
    
private:
    SubSceneTerrain*        _subSceneTerrain;
    SubSceneTrees*          _subSceneTrees;
    SubSceneParticles*      _subSceneParticles;
    ViewCopy*               _vCopy;
    ViewPost*               _vPost;
    ViewAxis*               _vAxis;
    Vec3f*                  _lightPos;
    gl::TextureRef          _textureGradient;
    
    
    Fbo*                    _fboRender;
    EffectComposer*         _composer;
};


#endif /* defined(__cinder__SceneApp__) */

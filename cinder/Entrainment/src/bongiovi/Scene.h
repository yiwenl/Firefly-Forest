//
//  Scene.h
//  KuaFuCinder
//
//  Created by Yiwen on 08/01/2014.
//
//

#ifndef __KuaFuCinder__Scene__
#define __KuaFuCinder__Scene__

#include <iostream>
#include "cinder/Camera.h"
#include "SceneQuat.h"
#include "cinder/App/App.h"
#include "CameraControl.h"

using namespace ci;
using namespace ci::app;
using namespace std;

namespace bongiovi {
    class Scene {
        public :
        Scene(app::WindowRef window);
        void render();
        void update();
        float				cameraDistance;
        SceneQuat*          sceneQuat;
        CameraControl*      cameraControl;
        
        void	mouseDown( ci::app::MouseEvent &event );
        void	mouseUp( ci::app::MouseEvent &event );
        void	mouseMove( ci::app::MouseEvent &event );
        void	mouseDrag( ci::app::MouseEvent &event );
        void	mouseWheel( ci::app::MouseEvent &event );
        void	windowDraw();
        Vec3f				eye, center, up;
        
        protected :
        app::WindowRef           _window;
        CameraPersp*		_camera;
        CameraOrtho*        _cameraOrtho;
        ci::signals::scoped_connection	mCbMouseDown, mCbMouseDrag, mCbMouseUp, mCbMouseMove, mCbMouseWheel, mCbUpdate;
        
    };
}

#endif /* defined(__KuaFuCinder__Scene__) */

//
//  SceneQuat.h
//  Camera101
//
//  Created by Yiwen on 03/01/2014.
//
//

#include <iostream>
#include "cinder/Vector.h"
#include "cinder/app/AppBasic.h"

using namespace ci;
#ifndef SCENEQUAT_H
#define SCENEQUAT_H

namespace bongiovi {
    class SceneQuat {
        public :
        SceneQuat();
        void mouseDown(Vec2i);
        void mouseUp(Vec2i);
        void mouseDrag(Vec2i);
        void mouseMove(Vec2i);
        void update();
        Quatf quat;
        void lock(bool mValue) {
            _isLocked = mValue;
        }
        
        private :
        void _updateRotation();
        bool _isMouseDown;
        bool _isLocked;
        Quatf _tempRotation;
        Vec2f _currDiff;
        Vec2f _diff;
        Vec2i _preMouse;
        Vec2i _mouse;
        float _z;
        float _preZ;
        float _easing;
        float _offset;
        
    };
}

#endif 
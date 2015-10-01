//
//  SceneQuat.cpp
//  Camera101
//
//  Created by Yiwen on 03/01/2014.
//
//

#include "SceneQuat.h"
#include <iostream>
#include "Math.h"
#include "cinder/Vector.h"
#include "cinder/app/AppBasic.h"


using namespace ci;
using namespace std;
using namespace bongiovi;

SceneQuat::SceneQuat()
{
    _isMouseDown = false;
    _easing = .1f;
    _offset = .004;
    _currDiff.x = _currDiff.y = _diff.x = _diff.y = 0.1f;
    
    quat.set(0, 1, 0, 0);
}


void SceneQuat::mouseDown(Vec2i mousePos) {
    if(_isLocked) return;
    _isMouseDown = true;
    
    _z = _preZ;
    _mouse = mousePos;
    _preMouse = mousePos;
    _tempRotation = Quatf(quat);
    _currDiff.x = _currDiff.y = _diff.x = _diff.y = 0.0f;
}


void SceneQuat::mouseUp(Vec2i mousePos) {
    if(_isLocked) return;
    _isMouseDown = false;
    _mouse = mousePos;
}


void SceneQuat::mouseMove(Vec2i mousePos) {
    if(_isLocked) return;
    _mouse = mousePos;
}


void SceneQuat::mouseDrag(Vec2i mousePos) {
   if(_isLocked) return;
    _mouse = mousePos;
}



void SceneQuat::update() {

    if(_isMouseDown) {
        _diff = -(_mouse - _preMouse);
    }
    
    _currDiff += ( _diff - _currDiff) * _easing;
    if(_currDiff.x == 0 && _currDiff.y == 0) _currDiff.x = _currDiff.y = .1;

    
    Vec3f v = Vec3f(_currDiff.x, -_currDiff.y, 0.0f);
    Vec3f zAxis = Vec3f::zAxis();
    Vec3f axis = Vec3f();
    axis = v.cross(zAxis);
    if(isnan(axis.x)) {
        quat = Quatf(_tempRotation);
        return;
    }
    axis.normalize();
    float angle = v.length() * _offset;
    
    Quatf rot = Quatf();
    rot.set(axis, angle);
    quat = _tempRotation * rot;
    
    _z += (_preZ - _z) * _easing;
}


void _updateRotation() {
}



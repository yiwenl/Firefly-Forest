//
//  CameraControl.cpp
//  cinder
//
//  Created by Li Yi-Wen on 23/07/2015.
//
//

#include "CameraControl.h"

CameraControl::CameraControl(CameraPersp* camera) : _camera(camera) {
    _init();
}

void CameraControl::_init() {
    radius          = new EaseNumber(300.0, .1f);
    rx              = new EaseNumber(0);
    ry              = new EaseNumber(M_PI*.5);
    rx->limit(-M_PI/2, M_PI/2);
    _preRx          = 0;
    _preRy          = 0;

    eye             = Vec3f( 0.0f, 0.0f, radius->getValue() );
    eyeOffset       = Vec3f( 0.0f, 0.0f, 0.0f);
    center			= Vec3f::zero();
    up				= Vec3f::yAxis();

    
    _window = ci::app::getWindow();
    mCbMouseDown    = _window->getSignalMouseDown().connect( std::bind( &CameraControl::mouseDown, this, std::placeholders::_1 ) );
    mCbMouseDrag    = _window->getSignalMouseDrag().connect( std::bind( &CameraControl::mouseDrag, this, std::placeholders::_1 ) );
    mCbMouseUp      = _window->getSignalMouseUp().connect( std::bind( &CameraControl::mouseUp, this, std::placeholders::_1 ) );
    mCbMouseMove    = _window->getSignalMouseMove().connect( std::bind( &CameraControl::mouseMove, this, std::placeholders::_1 ) );
    mCbMouseWheel   = _window->getSignalMouseWheel().connect( std::bind( &CameraControl::mouseWheel, this, std::placeholders::_1 ) );
    mCbUpdate       = _window->getSignalDraw().connect( std::bind(&CameraControl::update, this ) );
}



void CameraControl::mouseDown( MouseEvent &event ) {
    if(_lockRotation) return;
    _preMouse = event.getPos();
    _preRy = rx->getTargetValue();
    _preRy = ry->getTargetValue();
}

void CameraControl::mouseUp( MouseEvent &event ) {
    if(_lockRotation) return;
}

void CameraControl::mouseMove( MouseEvent &event ) {
    if(_lockRotation) return;
}

void CameraControl::mouseDrag( MouseEvent &event ) {
    if(_lockRotation) return;
    _mouse = event.getPos();
    
    float diffX = -(_mouse.x - _preMouse.x);
    float diffY = -(_mouse.y - _preMouse.y);
    
    ry->setValue(_preRy - diffX * .01f);
    rx->setValue(_preRx - diffY * .01f);
    
}

void CameraControl::mouseWheel( MouseEvent &event ) {
    if(_lookZoom) return;
    radius->add(event.getWheelIncrement());
}

void CameraControl::update() {
    eye.y = sin(rx->getValue()) * radius->getValue();
    float tr = cos(rx->getValue()) * radius->getValue();
    eye.x = cos(ry->getValue()) * tr;
    eye.z = sin(ry->getValue()) * tr;

    _camera->lookAt(eye+eyeOffset, center, up);
}
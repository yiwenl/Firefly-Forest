//
//  Scene.cpp
//  KuaFuCinder
//
//  Created by Yiwen on 08/01/2014.
//
//

#include "Scene.h"
#include "cinder/Camera.h"

using namespace ci;
using namespace ci::app;
using namespace std;
using namespace bongiovi;


Scene::Scene(app::WindowRef window) : _window(window){
    _camera         = new CameraPersp();
    _cameraOrtho    = new CameraOrtho();
    sceneQuat       = new SceneQuat();
    
    cameraDistance  = 500.0f;
	eye			= Vec3f( 0.0f, 0.0f, cameraDistance );
	center			= Vec3f::zero();
	up				= Vec3f::yAxis();
	_camera->setPerspective( 45.0f, ci::app::getWindowAspectRatio(), 5.0f, 5000.0f );
    _cameraOrtho->setOrtho( -1, 1, 1, -1, -1, 1 );

    mCbMouseDown    = _window->getSignalMouseDown().connect( std::bind( &Scene::mouseDown, this, std::placeholders::_1 ) );
	mCbMouseDrag    = _window->getSignalMouseDrag().connect( std::bind( &Scene::mouseDrag, this, std::placeholders::_1 ) );
    mCbMouseUp      = _window->getSignalMouseUp().connect( std::bind( &Scene::mouseUp, this, std::placeholders::_1 ) );
    mCbMouseMove    = _window->getSignalMouseMove().connect( std::bind( &Scene::mouseMove, this, std::placeholders::_1 ) );
    mCbMouseWheel   = _window->getSignalMouseWheel().connect( std::bind( &Scene::mouseWheel, this, std::placeholders::_1 ) );
    mCbUpdate       = _window->getSignalDraw().connect( std::bind(&Scene::windowDraw, this));
    
    cameraControl = new CameraControl(_camera);
    cameraControl->lockRotation(true);
};


void Scene::mouseDown( MouseEvent &event ) {
	sceneQuat->mouseDown(event.getPos());
}

void Scene::mouseUp( MouseEvent &event ) {
	sceneQuat->mouseUp(event.getPos());
}

void Scene::mouseMove( MouseEvent &event ) {
	sceneQuat->mouseMove(event.getPos());
}

void Scene::mouseDrag( MouseEvent &event ) {
	sceneQuat->mouseDrag(event.getPos());
}

void Scene::mouseWheel( MouseEvent &event ) {
//	sceneQuat->mouseDrag(event.getPos());
    cameraDistance += event.getWheelIncrement();
}

void Scene::windowDraw() {
//    cout << "Window draw" << endl;
    update();
}


void Scene::update() {
    sceneQuat->update();
//    eye = Vec3f( 0.0f, 0.0f, cameraDistance );
//	_camera->lookAt( eye, center, up );
//    cameraControl->update();
	gl::setMatrices( *_camera );
    gl::rotate(sceneQuat->quat);
}


void Scene::render() {
    cout << "Shouldn't show this render" << endl;
}
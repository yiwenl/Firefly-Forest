//
//  View.cpp
//  KuaFuCinder
//
//  Created by Yiwen on 06/01/2014.
//
//

#include "View.h"
#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;
using namespace bongiovi;

View::View() {}

View::View(string vertexShaderPath, string fragmentShaderPath) {
    try {
        shader = new ci::gl::GlslProg( loadResource(vertexShaderPath), loadResource(fragmentShaderPath) );
    }
    catch( gl::GlslProgCompileExc &exc ) {
        console() << "Cannot compile shader: " << exc.what() << std::endl;
        exit(1);
    }
    catch( Exception &exc ){
        console() << "Cannot load shader: " << exc.what() << std::endl;
        exit(1);
    }
    cout << "Creating shader program : " << vertexShaderPath << ", " << fragmentShaderPath << endl;
}


void View::render() {
    shader->bind();
    gl::draw(mesh);
    shader->unbind();
}

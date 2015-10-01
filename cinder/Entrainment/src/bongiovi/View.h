//
//  View.h
//  KuaFuCinder
//
//  Created by Yiwen on 06/01/2014.
//
//

#ifndef __KuaFuCinder__View__
#define __KuaFuCinder__View__

#include <iostream>
#include "cinder/gl/GlslProg.h"
#include "cinder/gl/Texture.h"
#include "cinder/gl/Vbo.h"

using namespace ci;
using namespace std;

namespace bongiovi {
    class View {
        public :
        View();
        View(string, string);
        gl::GlslProg*        shader;
        gl::VboMesh         mesh;
        void render();
    };

}


#endif /* defined(__KuaFuCinder__View__) */
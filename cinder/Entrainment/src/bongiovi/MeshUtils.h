//
//  MeshUtils.h
//  InteractiveParticleV10
//
//  Created by Yiwen on 03/03/2014.
//
//

#ifndef __InteractiveParticleV10__MeshUtils__
#define __InteractiveParticleV10__MeshUtils__

#include <iostream>
#include "cinder/gl/Vbo.h"

using namespace ci;

namespace bongiovi {
    class MeshUtils {
        public :
        static gl::VboMesh      createPlane(float size, int segments);
    };
}

#endif /* defined(__InteractiveParticleV10__MeshUtils__) */

//
//  Utils.h
//  ParticleTest1
//
//  Created by Yiwen on 11/02/2014.
//
//

#ifndef __ParticleTest1__Utils__
#define __ParticleTest1__Utils__

#include <iostream>
#include "cinder/gl/Texture.h"

using namespace std;
using namespace cinder;

namespace bongiovi {
    namespace utils {
        class Utils {
            public :
            static gl::TextureRef createTexture(string);
            static gl::TextureRef createTexture(string, gl::Texture::Format);
            static gl::Texture* fromTexture(string);
            static Vec3f getRandomVec();
            static Vec3f getRandomVec(float);
            static Vec3f getRandomVecInRadius(float);
            static string convertIntToString(int);
        };
    }
}


#endif /* defined(__ParticleTest1__Utils__) */

//
//  Utils.cpp
//  ParticleTest1
//
//  Created by Yiwen on 11/02/2014.
//
//

#include "Utils.h"
#include "MathUtils.h"

using namespace bongiovi::utils;
using namespace std;

gl::TextureRef Utils::createTexture(string path) {
    gl::Texture::Format fmt;
    fmt.setWrap( GL_REPEAT, GL_REPEAT );

    return gl::Texture::create( loadImage(app::loadResource(path)), fmt);
}


gl::TextureRef Utils::createTexture(string path, gl::Texture::Format fmt) {
    return gl::Texture::create( loadImage(app::loadResource(path)), fmt);
}


gl::Texture* Utils::fromTexture(string path) {
    gl::Texture::Format fmt;
    fmt.setWrap( GL_REPEAT, GL_REPEAT );
    return new gl::Texture( loadImage(app::loadResource(path)), fmt);
}

Vec3f Utils::getRandomVec() {
    return getRandomVec(1.0);
}

Vec3f Utils::getRandomVec(float size) {
    Vec3f v = Vec3f(MathUtils::random(-1.0f, 1.0f), MathUtils::random(-1.0f, 1.0f), MathUtils::random(-1.0f, 1.0f));
    v.normalize();
    v *= size;
    return v;
}


Vec3f Utils::getRandomVecInRadius(float size) {
    Vec3f v = Vec3f(MathUtils::random(-1.0f, 1.0f), MathUtils::random(-1.0f, 1.0f), MathUtils::random(-1.0f, 1.0f));
    v.normalize();
    v *= MathUtils::random(size);
    v.rotateX(MathUtils::random(M_PI*2));
    v.rotateY(MathUtils::random(M_PI*2));
    v.rotateZ(MathUtils::random(M_PI*2));
    return v;
}

string Utils::convertIntToString(int num) {
    return std::to_string(num);
}
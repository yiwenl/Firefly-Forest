
//
//  ViewTerrain.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/26.
//
//

#include "ViewTerrain.h"
#include "GlobalSettings.h"
#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewTerrain::ViewTerrain() : View("shaders/terrain.vert", "shaders/terrain.frag") {
}

ViewTerrain::ViewTerrain(float mNumSeg, float mSize, float mHeight) : View("shaders/terrain.vert", "shaders/terrain.frag"), _numSeg(mNumSeg), _size(mSize), _height(mHeight) {
    _init();
}


Vec3f ViewTerrain::_getPosition(int i, int j, float numSeg) {
    float sx = -_size * .5;
    Vec3f pos;
    pos.x = sx + i/_numSeg * _size;
    pos.z = sx + j/_numSeg * _size;
    
    return pos;
}


void ViewTerrain::_init() {
    gl::VboMesh::Layout     _layout;
    _layout.setStaticIndices();
    _layout.setStaticPositions();
    _layout.setStaticTexCoords2d();
    
    vector<Vec3f> positions;
    vector<Vec2f> coords;
    vector<uint> indices;
    int count = 0;
    float uvGap = 1.0 / _numSeg;
    
    for(int j=0; j<_numSeg; j++) {
        for(int i=0; i<_numSeg; i++) {
            positions.push_back(_getPosition(i, j+1, _numSeg));
            positions.push_back(_getPosition(i+1, j+1, _numSeg));
            positions.push_back(_getPosition(i+1, j, _numSeg));
            positions.push_back(_getPosition(i, j, _numSeg));
            
            coords.push_back(Vec2f(i/_numSeg, j/_numSeg+uvGap));
            coords.push_back(Vec2f(i/_numSeg+uvGap, j/_numSeg+uvGap));
            coords.push_back(Vec2f(i/_numSeg+uvGap, j/_numSeg));
            coords.push_back(Vec2f(i/_numSeg, j/_numSeg));
            
            indices.push_back(count * 4 + 0);
            indices.push_back(count * 4 + 1);
            indices.push_back(count * 4 + 2);
            indices.push_back(count * 4 + 0);
            indices.push_back(count * 4 + 2);
            indices.push_back(count * 4 + 3);
            
            count ++;
        }
    }
    
    
    mesh = gl::VboMesh(positions.size(), indices.size(), _layout, GL_TRIANGLES);
    mesh.bufferPositions(positions);
    mesh.bufferTexCoords2d(0, coords);
    mesh.bufferIndices(indices);
}

void ViewTerrain::render(gl::Texture texture, gl::Texture textureNormal, gl::Texture textureBump, Vec3f pos, Vec2f uvOffset, float numTiles, Vec3f lightPos, Vec3f eyePos) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("textureNormal", 1);
    shader->uniform("textureBump", 2);
    shader->uniform("position", pos);
    shader->uniform("uvOffset", uvOffset);
    shader->uniform("numTiles", numTiles);
    shader->uniform("height", _height);
    shader->uniform("lightPos", lightPos);
    shader->uniform("eyePos", eyePos);
    shader->uniform("bumpOffset", GlobalSettings::getInstance().bump);
    shader->uniform("noiseSandUVScale", GlobalSettings::getInstance().noiseSandUVScale);
    shader->uniform("specularLightStrength", GlobalSettings::getInstance().specularLightStrength);
    shader->uniform("diffuseLightStrength", GlobalSettings::getInstance().diffuseLightStrength);
    shader->uniform("diffuseColor", GlobalSettings::getInstance().colorDiffuse);
    shader->uniform("spotLightShiness", GlobalSettings::getInstance().spotLightShiness);
    shader->uniform("spotlightRadius", GlobalSettings::getInstance().spotLightRadius);
    shader->uniform("spotLightStrength", GlobalSettings::getInstance().spotLightStrength);
    shader->uniform("spakleStrength", GlobalSettings::getInstance().sparkleStrength);
    texture.bind(0);
    textureNormal.bind(1);
    textureBump.bind(2);
    gl::draw(mesh);
    texture.unbind();
    textureNormal.unbind();
    textureBump.unbind();
    shader->unbind();
}
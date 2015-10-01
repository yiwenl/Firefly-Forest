//
//  ViewTrees.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/26.
//
//

#include "ViewTrees.h"
#include "cinder/Rand.h"
#include "MeshUtils.h"
#include "GlobalSettings.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewTrees::ViewTrees() : View("shaders/tree.vert", "shaders/tree.frag") {
//ViewTrees::ViewTrees() : View("shaders/treeRender.vert", "shaders/treeRender.frag") {
    _init();
}

ViewTrees::ViewTrees(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewTrees::_init() {
    gl::VboMesh::Layout     _layout;
    _layout.setStaticIndices();
    _layout.setStaticPositions();
    _layout.setStaticTexCoords2d();
    _layout.mCustomStatic.push_back(make_pair(gl::VboMesh::Layout::CUSTOM_ATTR_FLOAT3, 0 ));
    
    int numTrees = 20;
    float range = 1200.f;
    
    for (int i=0; i<numTrees; i++) {
        Vec3f pos;
        float radius = randFloat(30.0f, 70.0f);
        do {
            pos.x = randFloat(-range, range);
            pos.y = -300.0f;
            pos.z = randFloat(-range, range);
        } while (!_checkTreePos(pos, radius));
        
        treePos.push_back(pos);
        _createTree(pos, radius, 3000.0f, i);
    }
    
    mesh = gl::VboMesh(positions.size(), indices.size(), _layout, GL_TRIANGLES);
    mesh.bufferPositions(positions);
    mesh.bufferTexCoords2d(0, coords);
    mesh.bufferIndices(indices);
    
    mesh.getStaticVbo().bind();
    size_t offset = sizeof(Vec3f) * positions.size() + sizeof(Vec2f) * coords.size();
    mesh.getStaticVbo().bufferSubData(offset, sizeof(Vec3f)*posOffset.size(), &posOffset[0] );
    mesh.getStaticVbo().unbind();
    
    shader->bind();
    GLuint loc = shader->getAttribLocation("posOffset");
    mesh.setCustomStaticLocation(0, loc);
    shader->unbind();
}

void ViewTrees::_createTree(Vec3f pos, float radius, float height, int treeIndex) {
    for (int i=0; i<numHeight; i++) {
        for (int j=0; j<numCircle; j++) {
            positions.push_back(_getPosition(i, j, radius, height, treeIndex));
            positions.push_back(_getPosition(i, j+1, radius, height, treeIndex));
            positions.push_back(_getPosition(i-1, j+1, radius, height, treeIndex));
            positions.push_back(_getPosition(i-1, j, radius, height, treeIndex));
            
            posOffset.push_back(pos);
            posOffset.push_back(pos);
            posOffset.push_back(pos);
            posOffset.push_back(pos);
            
            coords.push_back(Vec2f(j/numCircle, (i+1)/numHeight));
            coords.push_back(Vec2f((j+1)/numCircle, (i+1)/numHeight));
            coords.push_back(Vec2f((j+1)/numCircle, i/numHeight));
            coords.push_back(Vec2f(j/numCircle, i/numHeight));
            
            indices.push_back(count*4+3);
            indices.push_back(count*4+2);
            indices.push_back(count*4+0);
            indices.push_back(count*4+2);
            indices.push_back(count*4+1);
            indices.push_back(count*4+0);
            
            count++;
        }
    }
}

Vec3f ViewTrees::_getPosition(int i, int j, float radius, float height, int treeIndex) {
    Vec3f pos;
    pos.y = i/numHeight * height;
    float theta = j/numCircle * M_PI * 2.0;
    float rOffset = 1.0 - sin(i/numHeight * M_PI * .5);
    rOffset = pow(rOffset, 12.0);
    float rPerlin = perlin.noise(i*.15, treeIndex);
    float r = radius + rOffset * 40 + rPerlin * 20;
    pos.x = sin(theta) * r;
    pos.z = cos(theta) * r;
    return pos;
}

bool ViewTrees::_checkTreePos(Vec3f position, float radius) {
    float minDist = 500;
    Vec3f tree;
    for(int i=0; i<treePos.size(); i++) {
        tree = treePos[i];
        if(position.distance(tree) < minDist) return false;
    }
    return true;
}

void ViewTrees::render(gl::Texture texture, Vec3f lightPos, Vec3f eyePos, gl::Texture textureParticles) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("textureParticles", 1);
    shader->uniform("lightPos", lightPos);
    shader->uniform("eyePos", eyePos);
    shader->uniform("treeDiffuseLightStrength", GlobalSettings::getInstance().treeDiffuseLightStrength);
    shader->uniform("specularLightStrength", GlobalSettings::getInstance().specularLightStrength);
    shader->uniform("diffuseColor", GlobalSettings::getInstance().colorDiffuse);
    shader->uniform("particleLightStrength", GlobalSettings::getInstance().particleLightStrength);
    texture.bind(0);
    textureParticles.bind(1);
    gl::draw(mesh);
    texture.unbind();
    textureParticles.unbind();
    shader->unbind();
}
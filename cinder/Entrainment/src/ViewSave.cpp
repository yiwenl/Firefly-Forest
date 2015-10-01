//
//  ViewSave.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/28.
//
//

#include "ViewSave.h"
#include "GlobalSettings.h"
#include "MeshUtils.h"
#include "cinder/Rand.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewSave::ViewSave() : View("shaders/save.vert", "shaders/save.frag") {
    _init();
}

ViewSave::ViewSave(string vsPath, string fsPath) : View(vsPath, fsPath) {
    _init();
}


void ViewSave::_init() {
    gl::VboMesh::Layout     _layout;
    _layout.setStaticIndices();
    _layout.setStaticPositions();
    _layout.setStaticTexCoords2d();
    
    
    vector<Vec3f> positions;
    vector<Vec2f> coords;
    vector<uint> indices;
    int count = 0;
    
    float num = (float)GlobalSettings::getInstance().numParticles;
    float gap = 1.0 / num;
    float range = GlobalSettings::getInstance().maxRadius * .5;
    
    cout << "Total Particles : " << (num*num) << endl;
    
    for (int j=0; j<num; j++) {
        for (int i =0; i<num; i++) {
            //  positions
            Vec3f pos;
            pos.x = randFloat(-range, range);
            pos.y = randFloat(GlobalSettings::getInstance().floor, GlobalSettings::getInstance().ceiling);
            pos.z = randFloat(-range, range);
            positions.push_back(pos);
            Vec2f uv(-1.0f+gap*i, -1.0f + gap*j);
            coords.push_back(uv);
            indices.push_back(count);
            count ++;
            
            //  velocity
            Vec3f vel = randVec3f() * randFloat(1);
            positions.push_back(vel);
            coords.push_back(uv + Vec2f(1.0, 0.0));
            indices.push_back(count);
            count ++;
            
            //  flashing
            float speedLimit = .4;
            float min = randFloat(0.5, 1.0) * speedLimit;
            float max = randFloat(1.5, 2.5) * speedLimit;
            Vec3f theta = Vec3f(randFloat(M_PI * 2.0), min, max);
            positions.push_back(theta);
            coords.push_back(uv+Vec2f(.0, 1.0));
            indices.push_back(count);
            count ++;
            
            //  offsets
            float radiusOffset = randFloat(.75, 1.0);
            float flashingOffset = randFloat(.95, 1.0);
            Vec3f extra = Vec3f(radiusOffset, flashingOffset, .0);
            positions.push_back(extra);
            coords.push_back(uv+Vec2f(1.01, 1.0));
            indices.push_back(count);
            count ++;
        }
    }
    
    
    mesh = gl::VboMesh(positions.size(), indices.size(), _layout, GL_POINTS);
    mesh.bufferPositions(positions);
    mesh.bufferTexCoords2d(0, coords);
    mesh.bufferIndices(indices);

}

void ViewSave::render() {
    shader->bind();
    gl::draw(mesh);
    shader->unbind();
}
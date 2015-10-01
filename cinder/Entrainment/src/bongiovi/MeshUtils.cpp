//
//  MeshUtils.cpp
//  InteractiveParticleV10
//
//  Created by Yiwen on 03/03/2014.
//
//

#include "MeshUtils.h"

using namespace std;
using namespace bongiovi;

gl::VboMesh MeshUtils::createPlane(float size, int segments) {
    gl::VboMesh::Layout layout;
    layout.setStaticIndices();
    layout.setStaticTexCoords2d();
    layout.setStaticPositions();
    
    vector<uint> indices;
    vector<Vec3f> positions;
    vector<Vec2f> coords;
    
    int i, j, count = 0;
    float numSeg = segments;
    float segSize = size/(float)numSeg;
    float uvBase = 1.0/numSeg;
    float startPos = size / 2.0f;
    
    for(j=0; j<numSeg; j++) {
        for(i=0; i<numSeg; i++) {
            positions.push_back(Vec3f(-startPos + i*segSize,       startPos - j*segSize,   0));
            positions.push_back(Vec3f(-startPos + (i+1)*segSize,   startPos - j*segSize,   0));
            positions.push_back(Vec3f(-startPos + (i+1)*segSize,   startPos - (j+1)*segSize,   0));
            positions.push_back(Vec3f(-startPos + i*segSize,       startPos - (j+1)*segSize,   0));
            
            coords.push_back(Vec2f(uvBase*i, uvBase*j));
            coords.push_back(Vec2f(uvBase*(i+1), uvBase*j));
            coords.push_back(Vec2f(uvBase*(i+1), uvBase*(j+1)));
            coords.push_back(Vec2f(uvBase*i, uvBase*(j+1)));
            
            
            indices.push_back(count*4+0);
            indices.push_back(count*4+1);
            indices.push_back(count*4+2);
            indices.push_back(count*4+0);
            indices.push_back(count*4+2);
            indices.push_back(count*4+3);
            
            count++;
        }
    }

    gl::VboMesh mesh(positions.size(), indices.size(), layout, GL_TRIANGLES);
    mesh.bufferPositions(positions);
    mesh.bufferIndices(indices);
    mesh.bufferTexCoords2d(0, coords);
    
    return mesh;
}
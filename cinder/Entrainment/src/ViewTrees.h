//
//  ViewTrees.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/26.
//
//

#ifndef __Entrainment03__ViewTrees__
#define __Entrainment03__ViewTrees__

#include <stdio.h>
#include "cinder/Perlin.h"
#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewTrees : public View {
public:
    ViewTrees();
    ViewTrees(string vsPath, string fsPath);
    virtual void            render(gl::Texture, Vec3f lightPos, Vec3f eyePos, gl::Texture);
    vector<Vec3f>           getTrees() {    return treePos; }
    
private:
    void                    _init();
    void                    _createTree(Vec3f, float, float, int);
    Vec3f                   _getPosition(int, int, float, float, int);
    bool                    _checkTreePos(Vec3f, float);
    float                   numCircle = 12.0f;
    float                   numHeight = 50.0f;
    Perlin                  perlin;
    
    vector<Vec3f> treePos;
    vector<Vec3f> positions;
    vector<Vec3f> posOffset;
    vector<Vec2f> coords;
    vector<float> treeRadius;
    vector<uint> indices;
    int count = 0;

};


#endif /* defined(__Entrainment03__ViewTrees__) */

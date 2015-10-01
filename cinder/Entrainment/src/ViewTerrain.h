//
//  ViewTerrain.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/26.
//
//

#ifndef __Entrainment03__ViewTerrain__
#define __Entrainment03__ViewTerrain__

#include <stdio.h>

#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewTerrain : public View {
public:
    ViewTerrain();
    ViewTerrain(float, float, float);
    virtual void            render(gl::Texture, gl::Texture, gl::Texture, Vec3f, Vec2f, float, Vec3f, Vec3f);
    
private:
    void                    _init();
    Vec3f                   _getPosition(int, int, float);
    float                   _numSeg;
    float                   _size;
    float                   _height;
};


#endif /* defined(__Entrainment03__ViewTerrain__) */

//
//  ViewSimulation.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/28.
//
//

#ifndef __Entrainment03__ViewSimulation__
#define __Entrainment03__ViewSimulation__

#include <stdio.h>

#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewSimulation : public View {
public:
    ViewSimulation(vector<Vec3f>);
    virtual void            render(gl::Texture);
    Vec3f                   _trees[20];
    
private:
    void                    _init();
};


#endif /* defined(__Entrainment03__ViewSimulation__) */

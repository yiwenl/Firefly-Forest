//
//  ViewNoise.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/24.
//
//

#ifndef __Entrainment03__ViewNoise__
#define __Entrainment03__ViewNoise__

#include <stdio.h>

#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewNoise : public View {
public:
    ViewNoise();
    ViewNoise(string vsPath, string fsPath);
    virtual void            render();
    virtual void            render(gl::TextureRef);
    
private:
    float                   _count = 0.0f;
    void                    _init();
};


#endif /* defined(__Entrainment03__ViewNoise__) */

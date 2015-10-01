//
//  ViewSky.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/25.
//
//

#ifndef __Entrainment03__ViewSky__
#define __Entrainment03__ViewSky__

#include <stdio.h>

#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewSky : public View {
public:
    ViewSky();
    ViewSky(string vsPath, string fsPath);
    virtual void            render(gl::Texture);
    virtual void            render(gl::TextureRef);
    
private:
    void                    _init();
    Vec3f                   _getPosition(int i, int j, float numSeg);
};

#endif /* defined(__Entrainment03__ViewSky__) */

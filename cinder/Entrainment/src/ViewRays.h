//
//  ViewRays.h
//  Entrainment04
//
//  Created by Yi-Wen Lin on 2015/9/3.
//
//

#ifndef __Entrainment04__ViewRays__
#define __Entrainment04__ViewRays__

#include <stdio.h>

#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewRays : public View {
public:
    ViewRays();
    ViewRays(string vsPath, string fsPath);
    virtual void            render();
    
private:
    void                    _init();
    Vec3f                   _getPosition(float, float, float, float);
};


#endif /* defined(__Entrainment04__ViewRays__) */

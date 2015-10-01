//
//  ViewRender.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/28.
//
//

#ifndef __Entrainment03__ViewRender__
#define __Entrainment03__ViewRender__

#include <stdio.h>

#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewRender : public View {
public:
    ViewRender();
    ViewRender(string vsPath, string fsPath);
    virtual void            render(gl::Texture);
    
private:
    void                    _init();
};


#endif /* defined(__Entrainment03__ViewRender__) */

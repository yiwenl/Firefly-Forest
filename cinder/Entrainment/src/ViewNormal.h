//
//  ViewNormal.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/24.
//
//

#ifndef __Entrainment03__ViewNormal__
#define __Entrainment03__ViewNormal__

#include <stdio.h>

#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewNormal : public View {
public:
    ViewNormal();
    ViewNormal(string vsPath, string fsPath);
    virtual void            render(gl::Texture);
    virtual void            render(gl::TextureRef);
    
private:
    float                   _scale = 300.0/1000.0/4.0;
    void                    _init();
};


#endif /* defined(__Entrainment03__ViewNormal__) */

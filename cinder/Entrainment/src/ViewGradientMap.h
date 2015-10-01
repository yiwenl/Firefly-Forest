//
//  ViewGradientMap.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/27.
//
//

#ifndef __Entrainment03__ViewGradientMap__
#define __Entrainment03__ViewGradientMap__

#include <stdio.h>

#include "cinder/gl/Texture.h"
#include "ViewCopy.h"

using namespace bongiovi;

class ViewGradientMap : public ViewCopy {
public:
    ViewGradientMap();
    ViewGradientMap(string vsPath, string fsPath);
    virtual void            render(gl::Texture);
    virtual void            render(gl::TextureRef);
    
private:
    gl::TextureRef          _textureGradient;
    void                    _init();
};


#endif /* defined(__Entrainment03__ViewGradientMap__) */

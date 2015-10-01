//
//  ViewToneMapping.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/28.
//
//

#ifndef __Entrainment03__ViewToneMapping__
#define __Entrainment03__ViewToneMapping__

#include <stdio.h>

#include "cinder/gl/Texture.h"
#include "ViewCopy.h"

using namespace bongiovi;

class ViewTonMapping : public ViewCopy {
public:
    ViewTonMapping();
    ViewTonMapping(string vsPath, string fsPath);
    virtual void            render(gl::Texture);
    virtual void            render(gl::TextureRef);
    
private:
    void                    _init();
};


#endif /* defined(__Entrainment03__ViewToneMapping__) */

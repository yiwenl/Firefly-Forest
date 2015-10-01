//
//  ViewFilmGrain.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/28.
//
//

#ifndef __Entrainment03__ViewFilmGrain__
#define __Entrainment03__ViewFilmGrain__

#include <stdio.h>

#include "cinder/gl/Texture.h"
#include "ViewCopy.h"

using namespace bongiovi;

class ViewFilmGrain : public ViewCopy {
public:
    ViewFilmGrain();
    ViewFilmGrain(string vsPath, string fsPath);
    virtual void            render(gl::Texture);
    virtual void            render(gl::TextureRef);
    
private:
    void                    _init();
    float                   _count = .0f;
};


#endif /* defined(__Entrainment03__ViewFilmGrain__) */

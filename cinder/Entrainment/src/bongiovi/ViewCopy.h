//
//  ViewCopy.h
//  entrainment01
//
//  Created by Yi-Wen Lin on 2015/1/5.
//
//

#ifndef __entrainment01__ViewCopy__
#define __entrainment01__ViewCopy__

#include <stdio.h>
#include <iostream>
#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewCopy : public View {
public:
    ViewCopy();
    ViewCopy(string vsPath, string fsPath);
    virtual void            render(gl::Texture);
    virtual void            render(gl::TextureRef);
    
private:
    void                    _init();
};

#endif /* defined(__entrainment01__ViewCopy__) */

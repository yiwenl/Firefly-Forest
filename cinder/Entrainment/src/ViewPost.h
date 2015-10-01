//
//  ViewPost.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/8/17.
//
//

#ifndef __Entrainment03__ViewPost__
#define __Entrainment03__ViewPost__

#include <stdio.h>

#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewPost : public View {
public:
    ViewPost();
    ViewPost(string vsPath, string fsPath);
    virtual void            render(gl::Texture, gl::Texture);
    
private:
    void                    _init();
};


#endif /* defined(__Entrainment03__ViewPost__) */

//
//  ViewAxis.h
//  cinder
//
//  Created by Li Yi-Wen on 03/06/2015.
//
//

#ifndef __cinder__ViewAxis__
#define __cinder__ViewAxis__

#include <stdio.h>

#include "View.h"
#include "cinder/gl/Texture.h"

using namespace ci;
using namespace bongiovi;

class ViewAxis : public View {
    public :
    ViewAxis();
    void                render();
    
    private :
    void                _init();
};

#endif /* defined(__cinder__ViewAxis__) */

//
//  ViewSave.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/28.
//
//

#ifndef __Entrainment03__ViewSave__
#define __Entrainment03__ViewSave__

#include <stdio.h>

#include "cinder/gl/Texture.h"
#include "View.h"

using namespace bongiovi;

class ViewSave : public View {
public:
    ViewSave();
    ViewSave(string vsPath, string fsPath);
    virtual void            render();
    
private:
    
    void                    _init();
};


#endif /* defined(__Entrainment03__ViewSave__) */

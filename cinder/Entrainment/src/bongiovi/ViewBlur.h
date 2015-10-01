//
//  ViewBlur.h
//  NikeCityAttack
//
//  Created by Yiwen on 06/08/2014.
//
//

#ifndef __NikeCityAttack__ViewBlur__
#define __NikeCityAttack__ViewBlur__

#include <iostream>

#include "View.h"
#include "ViewCopy.h"

using namespace bongiovi;

class ViewBlur : public ViewCopy {
public:
    ViewBlur();
    ViewBlur(string vsPath, string fsPath);
    void                    render(gl::Texture);
    void                    render(gl::TextureRef);
    float                   blurOffset = .5;
    
private:
//    void                    _init();
};

#endif /* defined(__NikeCityAttack__ViewBlur__) */

//
//  NoiseNumber.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/8/18.
//
//

#ifndef __Entrainment03__NoiseNumber__
#define __Entrainment03__NoiseNumber__

#include <stdio.h>
#include "cinder/Perlin.h"
#include "cinder/Rand.h"

using namespace ci;
using namespace ci::app;

class NoiseNumber {
    
    private :
    float       _seed = randFloat(9999);
    float       _min;
    float       _max;
    float       _diff;
    float       _value;
    float       _count = 0;
    Perlin*     _perlin;
    
    ci::app::WindowRef _window;
    ci::signals::scoped_connection mCbUpdate;
    
    void _init() {
        _window = ci::app::getWindow();
        mCbUpdate = _window->getSignalDraw().connect( std::bind(&NoiseNumber::_loop, this));
        
        _perlin = new Perlin();
    }
    
    void _loop() {
        _count += noise;
        float p = (_perlin->noise(_count, _seed) + 1.0) * .5;
        _value = _min + p * _diff;
    }
    
    

    public :
    
    NoiseNumber(float min, float max, float mNoise) : _min(min), _max(max) {
        _diff = _max - _min;
        noise = mNoise;
        _init();
    }
    
    NoiseNumber(float min, float max) : _min(min), _max(max) {
        _diff = _max - _min;
        noise = .1f;
        _init();
    }

    
    float noise;
    
    float getValue() {  return _value;  }
    
    void setRange(float min, float max) {
        _min = min;
        _max = max;
        _diff = max - min;
    }
};

#endif /* defined(__Entrainment03__NoiseNumber__) */

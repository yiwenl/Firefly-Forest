//
//  EaseNumber.h
//  EaseNumber
//
//  Created by Li Yi-Wen on 23/07/2015.
//
//

#ifndef __EaseNumber__EaseNumber__
#define __EaseNumber__EaseNumber__

#include <stdio.h>
using namespace ci;
using namespace ci::app;


class EaseNumber {
    private :
        float _value;
        float _targetValue;
        float _min = -99999999.9f;
        float _max =  99999999.9f;
    
        ci::app::WindowRef _window;
        ci::signals::scoped_connection mCbUpdate;

    
    public:
        float easing;
    
        EaseNumber() : _value(0.0f), easing(0.1f), _targetValue(0.0f){
            _init();
        }
        
        EaseNumber(float mValue) : easing(0.1f) {
            _value = mValue;
            _targetValue = mValue;
            
            _init();
        }
        
        EaseNumber(float mValue, float mEasing) {
            _value = mValue;
            _targetValue = mValue;
            easing = mEasing;
            
            _init();
        }

    
        void _init() {
            _window = ci::app::getWindow();
            mCbUpdate = _window->getSignalDraw().connect( std::bind(&EaseNumber::_loop, this));
        }
        
        
        void _loop() {
            _value += (_targetValue - _value) * easing;
        }
    
        void setTo(float mValue) {
            _targetValue = _value = mValue;
        }
    
    
        void add(float mValue) {
            _targetValue += mValue;
        }
    
    
        //  getter / setter for value;
        float getValue() {
            return _value;
        }
    
        void setValue(float mValue) {
            _targetValue = mValue;
            _checkLimit();
        }
    
        float getTargetValue() {
            return _targetValue;
        }
    
        void limit(float min, float max) {
            _min = min;
            _max = max;
            _checkLimit();
        }
    
        void _checkLimit() {
            if(_targetValue < _min) _targetValue = _min;
            if(_targetValue > _max) _targetValue = _max;
        }
};

#endif /* defined(__EaseNumber__EaseNumber__) */

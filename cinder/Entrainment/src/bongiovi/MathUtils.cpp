//
//  MathUtils.cpp
//  KuaFuCinder
//
//  Created by Yiwen on 08/01/2014.
//
//

#include "MathUtils.h"

using namespace bongiovi::utils;


float MathUtils::random() {
    return random(0.0f, 1.0f);
}


float MathUtils::random(float max) {
    return random(0.0f, max);
}

float MathUtils::random(float min, float max) {
    float percent = (rand()%100000000)/100000000.0f;
    return min + (max-min) * percent;
}

float MathUtils::map(float value, float sx, float sy, float tx, float ty) {
    float p = (value - sx) / (sy - sx);
    p = clamp(p, 0.0f, 1.0f);
    return p * (ty-tx) + tx;
}


float MathUtils::clamp(float value, float min, float max) {
    if(value > max) return max;
    else if(value < min) return min;
    else return value;
}


unsigned long MathUtils::level(int l) {
    if(l == 0 || l == 1) return 1;
    else return l * MathUtils::level(l-1);
}

int MathUtils::binCoefficient(int n, int i ) {
//    cout << n << ", " << i << " : " << level(i) << " / " << level(n-i) << endl;
    unsigned long leveln = level(n);
    return leveln / ( level(i) * level(n-i) );
}

vector<Vec3f> MathUtils::getBezierPoints(vector<Vec3f> points, int numSeg) {
    vector<Vec3f> pos;
    
    int numPoints = points.size();
    float t, tx, ty, tz, pow1, pow2;
    int bc, i, j;
    
    for(i=0; i<numSeg; i++) {
        t = i/(float)numSeg;
        tx = ty = tz = 0.0f;
        
        for(j=0; j<points.size(); j++) {
            bc = MathUtils::binCoefficient(numPoints-1, j);
            pow1 = pow( (1-t), numPoints-j-1);
            pow2 = pow( t, j);
            
            tx += bc * pow1 * pow2 * points[j].x;
            ty += bc * pow1 * pow2 * points[j].y;
            tz += bc * pow1 * pow2 * points[j].z;
        }
        
        Vec3f p = Vec3f(tx, ty, tz);
        pos.push_back(p);
    }
    
    
    return pos;
}
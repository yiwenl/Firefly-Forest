//
//  MathUtils.h
//  SUCinder
//
//  Created by Yiwen on 08/01/2014.
//
//

#ifndef __SU__MathUtils__
#define __SU__MathUtils__

#include <iostream>

using namespace cinder;
using namespace std;

namespace bongiovi {
    namespace utils {
        class MathUtils {
            public :
            static float random();
            static float random(float);
            static float random(float, float);
            static unsigned long level(int);
            static int binCoefficient(int, int);
            static vector<Vec3f> getBezierPoints(vector<Vec3f>, int);
            static float map(float, float, float, float, float);
            static float clamp(float, float, float);
        };
    }
}


#endif /* defined(__SU__MathUtils__) */

//
//  BitmapUtils.h
//  ParisMap
//
//  Created by Yi-Wen Lin on 2015/2/21.
//
//

#ifndef __ParisMap__BitmapUtils__
#define __ParisMap__BitmapUtils__

#include <stdio.h>
#include "cinder/Surface.h"

using namespace ci;
using namespace std;


namespace bongiovi {
    class BitmapUtils {
        public :
        static void clear(Surface);
        static void fillColor(Surface, ColorAf, Area);
        static void floodFill(Surface, Vec2i, ColorAf);
        static void floodFill(Surface*, Vec2i, ColorAf, ColorAf, Area area);
        
        protected :
        static bool _checkPixel(Surface*, Vec2i, ColorAf, Area);
    };
}

#endif /* defined(__ParisMap__BitmapUtils__) */

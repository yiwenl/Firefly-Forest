//
//  BitmapUtils.cpp
//  ParisMap
//
//  Created by Yi-Wen Lin on 2015/2/21.
//
//

#include "BitmapUtils.h"

using namespace bongiovi;

void BitmapUtils::clear(Surface surface) {
    fillColor(surface, ColorAf(0, 0, 0, 0), surface.getBounds() );
}


void BitmapUtils::fillColor(Surface surface, ColorAf color, Area area) {

    Surface::Iter iter(surface.getIter(area));
    
    while (iter.line()) {
        while(iter.pixel()) {
            iter.r() = color.r;
            iter.g() = color.g;
            iter.b() = color.b;
            iter.a() = color.a;
        }
    }
                       
}

void BitmapUtils::floodFill(Surface surface, Vec2i pos, ColorAf color) {
    ColorAf pixelColor = surface.getPixel(pos);
    Area area = surface.getBounds();
    floodFill(&surface, pos, color, pixelColor, area);
}


void BitmapUtils::floodFill(Surface* surface, Vec2i pos, ColorAf colorToFill, ColorAf colorToReplace, Area area) {
    if (!area.contains(pos)) return;
    ColorAf colorPixel = surface->getPixel(pos);
    if (colorPixel != colorToReplace) return;
    if(colorPixel == colorToFill) return;
    
    
    vector<Vec2i> Q;
    
    Q.push_back(pos);
    
    while (Q.size() > 0) {
        Vec2i p = Q.back();
        Q.pop_back();
        
        surface->setPixel(p, colorToFill);
        Vec2i right = p + Vec2i(1, 0);
        if(_checkPixel(surface, right, colorToReplace, area)) Q.push_back(right);
        
        Vec2i left = p + Vec2i(-1, 0);
        if(_checkPixel(surface, left, colorToReplace, area)) Q.push_back(left);

        Vec2i up = p + Vec2i(0, -1);
        if(_checkPixel(surface, up, colorToReplace, area)) Q.push_back(up);
        
        Vec2i down = p + Vec2i(0, 1);
        if(_checkPixel(surface, down, colorToReplace, area)) Q.push_back(down);
    }
    
}


bool BitmapUtils::_checkPixel(Surface* surface, Vec2i pos, ColorAf colorToReplace, Area area) {
    if(!area.contains(pos)) return false;
    
    ColorAf colorPixel = surface->getPixel(pos);
    if(colorPixel == colorToReplace) return true;
    return false;
}
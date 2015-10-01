//
//  GlobalSettings.h
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/24.
//
//

#ifndef __Entrainment03__GlobalSettings__
#define __Entrainment03__GlobalSettings__

#include <stdio.h>
#include "NoiseNumber.h"

using namespace ci;
using namespace std;

class GlobalSettings {
    public :
    static GlobalSettings& getInstance() {
        static GlobalSettings settings;
        return settings;
    };
    
    float   fps                         = 0.0f;
    float   noise                       = .3f;
    float   noiseScale                  = .25f;
    float   detailMapScale              = 3.4f;
    float   detailMapHeight             = 0.1f;
    float   bump                        = 0.0f;
    float   noiseSandUVScale            = 12.0;
    float   specularLightStrength       = .5;
    float   diffuseLightStrength        = 1.0;
    float   treeDiffuseLightStrength    = 1.0;
    float   exposure                    = 3.0;
    float   spotLightShiness            = 18.0;
    float   spotLightRadius             = .62;
    float   spotLightStrength           = 0.0;
    float   sparkleStrength             = .0f;
    float   particleLightStrength       = .0f;

//    Colorf  colorDiffuse               = Colorf(46.0/255.0, 46.0/255.0, 56.0/255.0);
    Colorf  colorDiffuse               = Colorf(1.0, 1.0, .95);
    
    
    //  particles
    int     numParticles                = 64;
    float   maxRadius                   = 1200.0;
    float   gravity                     = .003;
    float   floor                       = -120.0;
    float   ceiling                     = 500.0;
    
    float   maxSpeed                    = 1.0;
    float   minSpeed                    = .1;
    
    float   zoneRadius                  = 130.0;
    NoiseNumber*   noiseZoneRadius      = new NoiseNumber(140, 200, .0115648615);
    
    float   lowThreshold                = .44;
    float   highThreshold               = .7;
    NoiseNumber*    noiseLowThreshold   = new NoiseNumber(.4, .5, .003456864);
    NoiseNumber*    noiseHighThreshold  = new NoiseNumber(.55, .75, .0078797135);
    
    
    float   repelStrength               = .020;
    float   attractStrength             = .005;
    float   orientStrength              = .010;
    NoiseNumber*    noiseRepelStrength      = new NoiseNumber(.015, .035, .028971);
    NoiseNumber*    noiseAttractStrength    = new NoiseNumber(.002, .008, .0123459);
    NoiseNumber*    noiseOrientStrength     = new NoiseNumber(.005, .015, .01841878);
    
    
    float   yVelDecrease                = .995;
    
    
    float   flashingRadius              = 50.0;
    NoiseNumber*    noiseFlashingRadius = new NoiseNumber(75, 125, .021314324);
    float   flashingRange               = 1.15;
    float   catchingSpeed               = 0.003;
    float   flashingSpeed               = 0.05;
    float   maxThetaDiff                = .6;
    
    int     FRAME_GAP                   = 1;
    float   speedMutiplier              = 1.0;
    
    bool    showConfig                  = false;
    bool    postProcessing              = false;
    bool    renderTerrain               = true;
    bool    renderTrees                 = false;
    bool    renderParticles             = false;
    bool    showFbo                     = false;
    bool    showStarSky                 = false;
    bool    needUpdateNoise             = true;
    
    
    
    private :
    GlobalSettings() {};
};


#endif /* defined(__Entrainment03__GlobalSettings__) */

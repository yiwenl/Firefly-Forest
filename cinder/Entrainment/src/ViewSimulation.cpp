//
//  ViewSimulation.cpp
//  Entrainment03
//
//  Created by Yi-Wen Lin on 2015/7/28.
//
//

#include "ViewSimulation.h"
#include "GlobalSettings.h"
#include "MeshUtils.h"

using namespace ci;
using namespace ci::app;
using namespace std;

ViewSimulation::ViewSimulation(vector<Vec3f> tree) : View("shaders/copy.vert", "shaders/sim.frag") {
    for(int i =0; i<tree.size(); i++) {
        _trees[i] = tree[i];
    }
    _init();
}


void ViewSimulation::_init() {
    mesh = bongiovi::MeshUtils::createPlane(2, 1);
    
    shader->bind();
    shader->uniform("trees", _trees, 20);    
    shader->unbind();
}

void ViewSimulation::render(gl::Texture texture) {
    shader->bind();
    shader->uniform("texture", 0);
    shader->uniform("maxRaidus", GlobalSettings::getInstance().maxRadius);
    shader->uniform("gravity", GlobalSettings::getInstance().gravity);
    shader->uniform("yFloor", GlobalSettings::getInstance().floor);
    shader->uniform("yCeiling", GlobalSettings::getInstance().ceiling);
    
//    shader->uniform("zoneRadius", GlobalSettings::getInstance().zoneRadius);
    shader->uniform("zoneRadius", GlobalSettings::getInstance().noiseZoneRadius->getValue());
    
//    shader->uniform("lowThreshold", GlobalSettings::getInstance().lowThreshold);
//    shader->uniform("highThreshold", GlobalSettings::getInstance().highThreshold);

    shader->uniform("lowThreshold", GlobalSettings::getInstance().noiseLowThreshold->getValue());
    shader->uniform("highThreshold", GlobalSettings::getInstance().noiseHighThreshold->getValue());

//    shader->uniform("repelStrength", GlobalSettings::getInstance().repelStrength);
//    shader->uniform("attractStrength", GlobalSettings::getInstance().attractStrength);
//    shader->uniform("orientStrength", GlobalSettings::getInstance().orientStrength);
    
    shader->uniform("repelStrength", GlobalSettings::getInstance().noiseRepelStrength->getValue());
    shader->uniform("attractStrength", GlobalSettings::getInstance().noiseAttractStrength->getValue());
    shader->uniform("orientStrength", GlobalSettings::getInstance().noiseOrientStrength->getValue());
    
    shader->uniform("yVelDecrease", GlobalSettings::getInstance().yVelDecrease);
//    shader->uniform("flashingRadius", GlobalSettings::getInstance().flashingRadius);
    shader->uniform("flashingRadius", GlobalSettings::getInstance().noiseFlashingRadius->getValue());
    shader->uniform("catchingSpeed", GlobalSettings::getInstance().catchingSpeed);
    shader->uniform("flashingSpeed", GlobalSettings::getInstance().flashingSpeed);
    shader->uniform("maxThetaDiff", GlobalSettings::getInstance().maxThetaDiff);
    shader->uniform("speedMutiplier", GlobalSettings::getInstance().speedMutiplier);

    texture.bind();
    gl::draw(mesh);
    texture.unbind();
    shader->unbind();
}
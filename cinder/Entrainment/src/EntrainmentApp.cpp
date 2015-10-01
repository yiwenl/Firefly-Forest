#include "cinder/app/AppNative.h"
#include "cinder/gl/gl.h"
#include "SceneApp.h"
#include "cinder/params/Params.h"
#include "GlobalSettings.h"
#include "cinder/Utilities.h"

#include <sstream>
#include <list>

using namespace ci;
using namespace ci::app;
using namespace std;

class EntrainmentApp : public AppNative {
public:
    void setup();
    void mouseDown( MouseEvent event );
    void keyDown( KeyEvent event);
    void update();
    void draw();
    void resize();
    void updateGradientTexture();
    
private:
    SceneApp*                       _scene;
    params::InterfaceGlRef          _params;
    int                             _state = 0;
    int                             _currentFrame = 0;
    int                             _renderCount = 0;
    bool                            _saving = false;
    
    void saveFrame();
    void setFull();
    void setState();
};

void EntrainmentApp::setup()
{
//    setWindowSize(2560, 1440);  //  IMAC
    setWindowSize(1920, 1080);
    setWindowPos(0, 0);
    setFrameRate(60);
    srand (time(NULL));
    gl::disableVerticalSync();
    gl::enableAlphaBlending();
    gl::enable(GL_CULL_FACE);
    gl::enable(GL_DEPTH_TEST);
    gl::enable(GL_VERTEX_PROGRAM_POINT_SIZE);
    gl::enable(GL_POINT_SMOOTH);
    
    _scene          = new SceneApp(app::getWindow());
    _params         = params::InterfaceGl::create( "Entrainment", Vec2i( 300, getWindowHeight()-200 ) );
    _params->addSeparator();
    _params->addText("Debug ");
    _params->addParam( "FPS", &GlobalSettings::getInstance().fps);
    
    _params->addSeparator();
    _params->addText("Particles");
    _params->addParam( "Max Radius", &GlobalSettings::getInstance().maxRadius, "min=100 max=5000" );
    _params->addParam( "Gravity", &GlobalSettings::getInstance().gravity, "min=0 max=.1 step=.001" );
    _params->addParam( "Floor", &GlobalSettings::getInstance().floor, "min=-200 max=200" );
    _params->addParam( "Ceiling", &GlobalSettings::getInstance().ceiling, "min=0 max=2000" );
    _params->addParam( "Max Speed", &GlobalSettings::getInstance().maxSpeed, "min=0 max=3 step=.01" );
    _params->addParam( "Min Speed", &GlobalSettings::getInstance().minSpeed, "min=0 max=1 step=.01" );
    _params->addParam( "Zone Radius", &GlobalSettings::getInstance().zoneRadius, "min=10 max=500" );
    _params->addParam( "Low Threshold", &GlobalSettings::getInstance().lowThreshold, "min=0 max=1 step=.01" );
    _params->addParam( "High Threshold", &GlobalSettings::getInstance().highThreshold, "min=0 max=1 step=.01" );
    _params->addParam( "Repel Strength", &GlobalSettings::getInstance().repelStrength, "min=0 max=1 step=.001" );
    _params->addParam( "Attract Strength", &GlobalSettings::getInstance().attractStrength, "min=0 max=1 step=.001" );
    _params->addParam( "Orient Strength", &GlobalSettings::getInstance().orientStrength, "min=0 max=1 step=.001" );
    _params->addParam( "Vel Decrease Y", &GlobalSettings::getInstance().yVelDecrease, "min=.9 max=1 step=.001" );
    
    _params->addSeparator();
    _params->addText("Lightings");
    _params->addParam( "Diffuse light Strength", &GlobalSettings::getInstance().diffuseLightStrength, "min=.0 max=5 step=.1" );
    _params->addParam( "Diffuse light Color", &GlobalSettings::getInstance().colorDiffuse);
    _params->addParam( "Specular light Strength", &GlobalSettings::getInstance().specularLightStrength, "min=.0 max=1 step=.01" );
    _params->addParam( "Noise Bump Strength", &GlobalSettings::getInstance().bump, "min=.0 max=.5 step=.01" );
    _params->addParam( "SpotLight Shiness", &GlobalSettings::getInstance().spotLightShiness, "min=.0 max=20.0 step=.01" );
    _params->addParam( "SpotLight Radius", &GlobalSettings::getInstance().spotLightRadius, "min=.0 max=1.0 step=.01" );
    _params->addParam( "SpotLight Strength", &GlobalSettings::getInstance().spotLightStrength, "min=.0 max=1.0 step=.01" );
    
    _params->addSeparator();
    _params->addText("Flashing synchronisation");
    _params->addParam( "Flashing Radius", &GlobalSettings::getInstance().flashingRadius, "min=10 max=500" );
    _params->addParam( "Flashing Range", &GlobalSettings::getInstance().flashingRange, "min=0.1 max=2 step=.01" );
    _params->addParam( "Catching Speed", &GlobalSettings::getInstance().catchingSpeed, "min=0.0 max=.05 step=.001" );
    _params->addParam( "Flashing Speed", &GlobalSettings::getInstance().flashingSpeed, "min=0.0 max=.1 step=.001" );
    _params->addParam( "Max Theta Dist", &GlobalSettings::getInstance().maxThetaDiff, "min=0.0 max=2.0 step=.01" );
    
    _params->addSeparator();
    _params->addText("Rendering");
    _params->addParam( "Render Terrain", &GlobalSettings::getInstance().renderTerrain);
    _params->addParam( "Render Trees", &GlobalSettings::getInstance().renderTrees);
    _params->addParam( "Render Particles", &GlobalSettings::getInstance().renderParticles);
    _params->addParam( "Use postprocessing", &GlobalSettings::getInstance().postProcessing);
    _params->addParam( "Show FBO", &GlobalSettings::getInstance().showFbo);
    _params->addParam( "Frame Gap", &GlobalSettings::getInstance().FRAME_GAP, "min=0.0 max=30.0" );
    _params->addParam( "Speed Multiplier", &GlobalSettings::getInstance().speedMutiplier, "min=1.0 max=10.0 step=.01" );
    
    _params->addSeparator();
    _params->addText("Post Effect");
    _params->addParam( "Exposure", &GlobalSettings::getInstance().exposure, "min=1.0 max=10.0 step=.01" );
    _params->addButton( "Load Gradient Map", std::bind(&EntrainmentApp::updateGradientTexture, this));
    
    setFullScreen(true);
//    setState();
    setFull();
}

void EntrainmentApp::mouseDown( MouseEvent event )
{
//    writeImage( "screenshot.png", copyWindowSurface() );
//    _currentFrame++;
}


void EntrainmentApp::keyDown( KeyEvent event ) {
    if(event.getChar() == 'f') {
        setFullScreen(!isFullScreen());
    } else if(event.getChar() == 'h') {
        GlobalSettings::getInstance().showConfig = !GlobalSettings::getInstance().showConfig;
        if(GlobalSettings::getInstance().showConfig) showCursor();
        else hideCursor();
    } else if(event.getChar() == 's') {
//        _currentFrame = 0;
//        _saving = true;
        writeImage( "screenshot.png", copyWindowSurface() );
    }
    
    
    if(event.getCode() == KeyEvent::KEY_RIGHT) {
        _state++;
        setState();
    } else if(event.getCode() == KeyEvent::KEY_LEFT) {
        if(_state > 0) {
            _state--;
        }
        setState();
    }
    
}


void EntrainmentApp::setFull() {
    GlobalSettings::getInstance().detailMapHeight           = 0.1;
    GlobalSettings::getInstance().bump                      = 0.1f;
    GlobalSettings::getInstance().needUpdateNoise           = false;
    GlobalSettings::getInstance().colorDiffuse              = Colorf(46.0/255.0, 46.0/255.0, 56.0/255.0);
    GlobalSettings::getInstance().spotLightStrength         = 1.0f;
    GlobalSettings::getInstance().sparkleStrength           = 1.0f;
    GlobalSettings::getInstance().showStarSky               = true;
    GlobalSettings::getInstance().renderParticles           = true;
    GlobalSettings::getInstance().renderTrees               = true;
    GlobalSettings::getInstance().postProcessing            = false;
    GlobalSettings::getInstance().particleLightStrength     = 1.0;
    
    setFullScreen(true);
    hideCursor();
}


void EntrainmentApp::setState() {
    cout << "Setting State : " << _state << endl;
    switch (_state) {
        case 0: //  initial state
            GlobalSettings::getInstance().detailMapHeight = 0.0;
            break;
        case 1: //  add detail
            GlobalSettings::getInstance().detailMapHeight = .1;
            GlobalSettings::getInstance().bump = 0.0f;
            GlobalSettings::getInstance().needUpdateNoise = true;
            break;
        case 2: //  add bump noise
            GlobalSettings::getInstance().bump = 0.1f;
            GlobalSettings::getInstance().needUpdateNoise = false;
            GlobalSettings::getInstance().colorDiffuse = Colorf(1.0, 1.0, .95);
            break;
        case 3: //  add light
            GlobalSettings::getInstance().colorDiffuse = Colorf(46.0/255.0, 46.0/255.0, 56.0/255.0);
            GlobalSettings::getInstance().spotLightStrength = 0.0f;
            break;
        case 4: //  add spot light
            GlobalSettings::getInstance().spotLightStrength = 1.0f;
            GlobalSettings::getInstance().sparkleStrength = 0.0f;
            break;
        case 5: //  add sparkles
            GlobalSettings::getInstance().sparkleStrength = 1.0f;
            GlobalSettings::getInstance().showStarSky = false;
            break;
        case 6: //  add night sky
            GlobalSettings::getInstance().showStarSky = true;
            GlobalSettings::getInstance().renderTrees = false;
            break;
        case 7: //  add trees
            GlobalSettings::getInstance().renderTrees = true;
            GlobalSettings::getInstance().renderParticles = false;
            break;
        case 8: //  add particles
            GlobalSettings::getInstance().renderParticles = true;
            GlobalSettings::getInstance().postProcessing = false;
            break;
        case 9: //  add particles light on trees
            GlobalSettings::getInstance().postProcessing = true;
            GlobalSettings::getInstance().particleLightStrength = 0.0;
            break;
        case 10: //  add particles light on trees
            GlobalSettings::getInstance().particleLightStrength = 1.0;
            break;
            
        default:
            break;
    }
}

void EntrainmentApp::updateGradientTexture() {
    cout << " Load new gradient map" << endl;
    try {
        fs::path path = getOpenFilePath("", ImageIo::getLoadExtensions() );
        if(! path.empty()) {
            _scene->updateGradientTexture(path);
        }
    } catch( ... ) {
        cout << " Error Loading Gradient Map" << endl;
    }
}


void EntrainmentApp::update()
{
    GlobalSettings::getInstance().fps = getAverageFps();
}

void EntrainmentApp::draw()
{
//    if(_renderCount % 10 == 0) {
        gl::clear( Color( 0, 0, 0 ) );
        _scene->render();
        if(GlobalSettings::getInstance().showConfig)    _params->draw();
        if(_saving) {
            saveFrame();
        }
//    }
    _renderCount ++;
	// clear out the window with black
}

void EntrainmentApp::saveFrame() {
    writeImage( getHomeDirectory() / "darkForest" / "particles08" / ( toString( _currentFrame ) + ".png" ), copyWindowSurface() );
    _currentFrame++;
    if(_currentFrame > 5400) {
        _saving = false;
    }else {
        cout << "Saving frame : " << _currentFrame << endl;
    }
}

void EntrainmentApp::resize() {
    _scene->resize();
}

CINDER_APP_NATIVE( EntrainmentApp, RendererGl )

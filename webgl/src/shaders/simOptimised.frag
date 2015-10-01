#define SHADER_NAME SIMULATION_FRAGMENT_OPTIMISED

precision highp float;
uniform sampler2D texture;
uniform float time;
uniform float numParticles;
varying vec2 vTextureCoord;
uniform float maxThreshold;
uniform float minThreshold;
uniform float maxSpeed;
uniform float minSpeed;
uniform float zoneRadius;
uniform float repelStrength;
uniform float orientStrength;
uniform float attractStrength;
uniform float flockingStrength;
uniform float noiseStrength;
uniform float posOffset;
uniform float maxThetaDiff;
uniform float catchingSpeed;
uniform float flashingSpeed;
uniform float syncRadius;

void main(void) {
  vec2 resolution_1;
  vec2 tmpvar_2;
  float tmpvar_3;
  tmpvar_3 = (numParticles * 2.0);
  tmpvar_2.x = tmpvar_3;
  tmpvar_2.y = tmpvar_3;
  resolution_1 = tmpvar_2;
  highp vec2 tmpvar_4;
  tmpvar_4 = (gl_FragCoord.xy / vec2(tmpvar_3));
  if ((vTextureCoord.y < 0.5)) {
    if ((vTextureCoord.x < 0.5)) {
      highp vec2 tmpvar_5;
      tmpvar_5.x = (tmpvar_4.x + 0.5);
      tmpvar_5.y = tmpvar_4.y;
      lowp vec4 tmpvar_6;
      tmpvar_6.w = 1.0;
      tmpvar_6.xyz = (texture2D (texture, tmpvar_4).xyz + texture2D (texture, tmpvar_5).xyz);
      gl_FragColor = tmpvar_6;
    } else {
      lowp vec3 newPos_7;
      lowp float f_9;
      lowp float percent_10;
      float zoneRadiusSqrd_11;
      lowp float distSqrd_12;
      lowp vec3 pos_13;
      lowp vec3 vel_14;
      vel_14 = texture2D (texture, tmpvar_4).xyz;
      highp vec2 tmpvar_15;
      tmpvar_15.x = (tmpvar_4.x - 0.5);
      tmpvar_15.y = tmpvar_4.y;
      lowp vec4 tmpvar_16;
      tmpvar_16 = texture2D (texture, tmpvar_15);
      pos_13 = tmpvar_16.xyz;
      distSqrd_12 = 0.0;
      zoneRadiusSqrd_11 = (zoneRadius * zoneRadius);
      for (float y_8 = 0.0; y_8 < 64.0; y_8 += 1.0) {
        for (float x_17 = 0.0; x_17 < 64.0; x_17 += 1.0) {
          vec2 tmpvar_18;
          tmpvar_18.x = (x_17 / resolution_1.x);
          tmpvar_18.y = (y_8 / resolution_1.y);
          lowp vec4 tmpvar_19;
          tmpvar_19 = texture2D (texture, tmpvar_18);
          lowp float tmpvar_20;
          lowp vec3 tmpvar_21;
          tmpvar_21 = (pos_13 - tmpvar_19.xyz);
          tmpvar_20 = sqrt(dot (tmpvar_21, tmpvar_21));
          distSqrd_12 = (tmpvar_20 * tmpvar_20);
          if ((distSqrd_12 < zoneRadiusSqrd_11)) {
            lowp vec3 dir_22;
            percent_10 = (distSqrd_12 / zoneRadiusSqrd_11);
            lowp vec3 tmpvar_23;
            tmpvar_23 = (tmpvar_19.xyz - pos_13);
            dir_22 = tmpvar_23;
            lowp float tmpvar_24;
            tmpvar_24 = sqrt(dot (tmpvar_23, tmpvar_23));
            if ((tmpvar_24 <= 0.0)) {
              dir_22 = vec3(0.0, 0.0, 0.0);
            } else {
              dir_22 = normalize(dir_22);
            };
            if ((percent_10 < minThreshold)) {
              f_9 = (((minThreshold / 
                max (percent_10, 0.01)
              ) - 1.0) * repelStrength);
              vel_14 = (vel_14 - ((dir_22 * f_9) * flockingStrength));
            } else {
              if ((percent_10 < maxThreshold)) {
                vec2 tmpvar_25;
                tmpvar_25.x = (tmpvar_18.x + 0.5);
                tmpvar_25.y = tmpvar_18.y;
                lowp float tmpvar_26;
                tmpvar_26 = ((percent_10 - minThreshold) / (maxThreshold - minThreshold));
                lowp vec3 tmpvar_27;
                tmpvar_27 = ((vel_14 + texture2D (texture, tmpvar_25).xyz) * 0.5);
                lowp float tmpvar_28;
                tmpvar_28 = sqrt(dot (tmpvar_27, tmpvar_27));
                if ((tmpvar_28 > 0.0)) {
                  vel_14 = (vel_14 + ((
                    normalize(tmpvar_27)
                   * 
                    (((0.5 - (
                      cos((tmpvar_26 * 6.283185))
                     * 0.5)) + 0.5) * orientStrength)
                  ) * flockingStrength));
                };
              } else {
                f_9 = (((0.5 - 
                  (cos(((
                    (percent_10 - maxThreshold)
                   / 
                    (1.0 - maxThreshold)
                  ) * 6.283185)) * -0.5)
                ) + 0.5) * attractStrength);
                vel_14 = (vel_14 + ((dir_22 * f_9) * flockingStrength));
              };
            };
          };
        };
      };
      lowp vec3 tmpvar_29;
      float tmpvar_30;
      tmpvar_30 = (time * 0.1);
      tmpvar_29 = ((tmpvar_16.xyz * vec3(posOffset)) + vec3(tmpvar_30));
      lowp vec4 m_31;
      lowp vec3 tmpvar_32;
      tmpvar_32 = floor((tmpvar_29 + dot (tmpvar_29, vec3(0.3333333, 0.3333333, 0.3333333))));
      lowp vec3 tmpvar_33;
      tmpvar_33 = ((tmpvar_29 - tmpvar_32) + dot (tmpvar_32, vec3(0.1666667, 0.1666667, 0.1666667)));
      lowp vec3 tmpvar_34;
      tmpvar_34.x = float((tmpvar_33.x >= tmpvar_33.y));
      tmpvar_34.y = float((tmpvar_33.y >= tmpvar_33.z));
      tmpvar_34.z = float((tmpvar_33.z >= tmpvar_33.x));
      lowp vec3 tmpvar_35;
      tmpvar_35 = (1.0 - tmpvar_34);
      lowp vec3 tmpvar_36;
      tmpvar_36 = min (tmpvar_34, tmpvar_35.zxy);
      lowp vec3 tmpvar_37;
      tmpvar_37 = max (tmpvar_34, tmpvar_35.zxy);
      lowp vec3 tmpvar_38;
      tmpvar_38 = ((tmpvar_33 - tmpvar_36) + vec3(0.1666667, 0.1666667, 0.1666667));
      lowp vec3 tmpvar_39;
      tmpvar_39 = ((tmpvar_33 - tmpvar_37) + vec3(0.3333333, 0.3333333, 0.3333333));
      lowp vec3 tmpvar_40;
      tmpvar_40 = ((tmpvar_33 - 1.0) + vec3(0.5, 0.5, 0.5));
      lowp vec3 tmpvar_41;
      tmpvar_41 = (vec3(mod (tmpvar_32, 289.0)));
      lowp vec4 tmpvar_42;
      tmpvar_42.xw = vec2(0.0, 1.0);
      tmpvar_42.y = tmpvar_36.z;
      tmpvar_42.z = tmpvar_37.z;
      lowp vec4 x_43;
      x_43 = (tmpvar_41.z + tmpvar_42);
      lowp vec4 tmpvar_44;
      tmpvar_44.xw = vec2(0.0, 1.0);
      tmpvar_44.y = tmpvar_36.y;
      tmpvar_44.z = tmpvar_37.y;
      lowp vec4 x_45;
      x_45 = (((vec4(mod (
        (((x_43 * 34.0) + 1.0) * x_43)
      , 289.0))) + tmpvar_41.y) + tmpvar_44);
      lowp vec4 tmpvar_46;
      tmpvar_46.xw = vec2(0.0, 1.0);
      tmpvar_46.y = tmpvar_36.x;
      tmpvar_46.z = tmpvar_37.x;
      lowp vec4 x_47;
      x_47 = (((vec4(mod (
        (((x_45 * 34.0) + 1.0) * x_45)
      , 289.0))) + tmpvar_41.x) + tmpvar_46);
      lowp vec4 tmpvar_48;
      tmpvar_48 = (vec4(mod (((
        (x_47 * 34.0)
       + 1.0) * x_47), 289.0)));
      lowp vec4 tmpvar_49;
      tmpvar_49 = (tmpvar_48 - (49.0 * floor(
        (0.02040816 * tmpvar_48)
      )));
      lowp vec4 tmpvar_50;
      tmpvar_50 = floor((tmpvar_49 * 0.1428571));
      lowp vec4 tmpvar_51;
      tmpvar_51 = ((tmpvar_50 * 0.2857143) + vec4(-0.9285714, -0.9285714, -0.9285714, -0.9285714));
      lowp vec4 tmpvar_52;
      tmpvar_52 = ((floor(
        (tmpvar_49 - (7.0 * tmpvar_50))
      ) * 0.2857143) + vec4(-0.9285714, -0.9285714, -0.9285714, -0.9285714));
      lowp vec4 tmpvar_53;
      tmpvar_53 = ((1.0 - abs(tmpvar_51)) - abs(tmpvar_52));
      lowp vec4 tmpvar_54;
      tmpvar_54.xy = tmpvar_51.xy;
      tmpvar_54.zw = tmpvar_52.xy;
      lowp vec4 tmpvar_55;
      tmpvar_55.xy = tmpvar_51.zw;
      tmpvar_55.zw = tmpvar_52.zw;
      lowp vec4 tmpvar_56;
      tmpvar_56 = -(vec4(greaterThanEqual (vec4(0.0, 0.0, 0.0, 0.0), tmpvar_53)));
      lowp vec4 tmpvar_57;
      tmpvar_57 = (tmpvar_54.xzyw + ((
        (floor(tmpvar_54) * 2.0)
       + 1.0).xzyw * tmpvar_56.xxyy));
      lowp vec4 tmpvar_58;
      tmpvar_58 = (tmpvar_55.xzyw + ((
        (floor(tmpvar_55) * 2.0)
       + 1.0).xzyw * tmpvar_56.zzww));
      lowp vec3 tmpvar_59;
      tmpvar_59.xy = tmpvar_57.xy;
      tmpvar_59.z = tmpvar_53.x;
      lowp vec3 tmpvar_60;
      tmpvar_60.xy = tmpvar_57.zw;
      tmpvar_60.z = tmpvar_53.y;
      lowp vec3 tmpvar_61;
      tmpvar_61.xy = tmpvar_58.xy;
      tmpvar_61.z = tmpvar_53.z;
      lowp vec3 tmpvar_62;
      tmpvar_62.xy = tmpvar_58.zw;
      tmpvar_62.z = tmpvar_53.w;
      lowp vec4 tmpvar_63;
      tmpvar_63.x = dot (tmpvar_59, tmpvar_59);
      tmpvar_63.y = dot (tmpvar_60, tmpvar_60);
      tmpvar_63.z = dot (tmpvar_61, tmpvar_61);
      tmpvar_63.w = dot (tmpvar_62, tmpvar_62);
      lowp vec4 tmpvar_64;
      tmpvar_64 = (1.792843 - (0.8537347 * tmpvar_63));
      lowp vec4 tmpvar_65;
      tmpvar_65.x = dot (tmpvar_33, tmpvar_33);
      tmpvar_65.y = dot (tmpvar_38, tmpvar_38);
      tmpvar_65.z = dot (tmpvar_39, tmpvar_39);
      tmpvar_65.w = dot (tmpvar_40, tmpvar_40);
      lowp vec4 tmpvar_66;
      tmpvar_66 = max ((0.6 - tmpvar_65), 0.0);
      m_31 = (tmpvar_66 * tmpvar_66);
      lowp vec4 tmpvar_67;
      tmpvar_67.x = dot ((tmpvar_59 * tmpvar_64.x), tmpvar_33);
      tmpvar_67.y = dot ((tmpvar_60 * tmpvar_64.y), tmpvar_38);
      tmpvar_67.z = dot ((tmpvar_61 * tmpvar_64.z), tmpvar_39);
      tmpvar_67.w = dot ((tmpvar_62 * tmpvar_64.w), tmpvar_40);
      lowp vec3 tmpvar_68;
      tmpvar_68.x = ((tmpvar_16.y * posOffset) + tmpvar_30);
      tmpvar_68.y = ((tmpvar_16.z * posOffset) + tmpvar_30);
      tmpvar_68.z = ((tmpvar_16.x * posOffset) + tmpvar_30);
      lowp vec4 m_69;
      lowp vec3 tmpvar_70;
      tmpvar_70 = floor((tmpvar_68 + dot (tmpvar_68, vec3(0.3333333, 0.3333333, 0.3333333))));
      lowp vec3 tmpvar_71;
      tmpvar_71 = ((tmpvar_68 - tmpvar_70) + dot (tmpvar_70, vec3(0.1666667, 0.1666667, 0.1666667)));
      lowp vec3 tmpvar_72;
      tmpvar_72.x = float((tmpvar_71.x >= tmpvar_71.y));
      tmpvar_72.y = float((tmpvar_71.y >= tmpvar_71.z));
      tmpvar_72.z = float((tmpvar_71.z >= tmpvar_71.x));
      lowp vec3 tmpvar_73;
      tmpvar_73 = (1.0 - tmpvar_72);
      lowp vec3 tmpvar_74;
      tmpvar_74 = min (tmpvar_72, tmpvar_73.zxy);
      lowp vec3 tmpvar_75;
      tmpvar_75 = max (tmpvar_72, tmpvar_73.zxy);
      lowp vec3 tmpvar_76;
      tmpvar_76 = ((tmpvar_71 - tmpvar_74) + vec3(0.1666667, 0.1666667, 0.1666667));
      lowp vec3 tmpvar_77;
      tmpvar_77 = ((tmpvar_71 - tmpvar_75) + vec3(0.3333333, 0.3333333, 0.3333333));
      lowp vec3 tmpvar_78;
      tmpvar_78 = ((tmpvar_71 - 1.0) + vec3(0.5, 0.5, 0.5));
      lowp vec3 tmpvar_79;
      tmpvar_79 = (vec3(mod (tmpvar_70, 289.0)));
      lowp vec4 tmpvar_80;
      tmpvar_80.xw = vec2(0.0, 1.0);
      tmpvar_80.y = tmpvar_74.z;
      tmpvar_80.z = tmpvar_75.z;
      lowp vec4 x_81;
      x_81 = (tmpvar_79.z + tmpvar_80);
      lowp vec4 tmpvar_82;
      tmpvar_82.xw = vec2(0.0, 1.0);
      tmpvar_82.y = tmpvar_74.y;
      tmpvar_82.z = tmpvar_75.y;
      lowp vec4 x_83;
      x_83 = (((vec4(mod (
        (((x_81 * 34.0) + 1.0) * x_81)
      , 289.0))) + tmpvar_79.y) + tmpvar_82);
      lowp vec4 tmpvar_84;
      tmpvar_84.xw = vec2(0.0, 1.0);
      tmpvar_84.y = tmpvar_74.x;
      tmpvar_84.z = tmpvar_75.x;
      lowp vec4 x_85;
      x_85 = (((vec4(mod (
        (((x_83 * 34.0) + 1.0) * x_83)
      , 289.0))) + tmpvar_79.x) + tmpvar_84);
      lowp vec4 tmpvar_86;
      tmpvar_86 = (vec4(mod (((
        (x_85 * 34.0)
       + 1.0) * x_85), 289.0)));
      lowp vec4 tmpvar_87;
      tmpvar_87 = (tmpvar_86 - (49.0 * floor(
        (0.02040816 * tmpvar_86)
      )));
      lowp vec4 tmpvar_88;
      tmpvar_88 = floor((tmpvar_87 * 0.1428571));
      lowp vec4 tmpvar_89;
      tmpvar_89 = ((tmpvar_88 * 0.2857143) + vec4(-0.9285714, -0.9285714, -0.9285714, -0.9285714));
      lowp vec4 tmpvar_90;
      tmpvar_90 = ((floor(
        (tmpvar_87 - (7.0 * tmpvar_88))
      ) * 0.2857143) + vec4(-0.9285714, -0.9285714, -0.9285714, -0.9285714));
      lowp vec4 tmpvar_91;
      tmpvar_91 = ((1.0 - abs(tmpvar_89)) - abs(tmpvar_90));
      lowp vec4 tmpvar_92;
      tmpvar_92.xy = tmpvar_89.xy;
      tmpvar_92.zw = tmpvar_90.xy;
      lowp vec4 tmpvar_93;
      tmpvar_93.xy = tmpvar_89.zw;
      tmpvar_93.zw = tmpvar_90.zw;
      lowp vec4 tmpvar_94;
      tmpvar_94 = -(vec4(greaterThanEqual (vec4(0.0, 0.0, 0.0, 0.0), tmpvar_91)));
      lowp vec4 tmpvar_95;
      tmpvar_95 = (tmpvar_92.xzyw + ((
        (floor(tmpvar_92) * 2.0)
       + 1.0).xzyw * tmpvar_94.xxyy));
      lowp vec4 tmpvar_96;
      tmpvar_96 = (tmpvar_93.xzyw + ((
        (floor(tmpvar_93) * 2.0)
       + 1.0).xzyw * tmpvar_94.zzww));
      lowp vec3 tmpvar_97;
      tmpvar_97.xy = tmpvar_95.xy;
      tmpvar_97.z = tmpvar_91.x;
      lowp vec3 tmpvar_98;
      tmpvar_98.xy = tmpvar_95.zw;
      tmpvar_98.z = tmpvar_91.y;
      lowp vec3 tmpvar_99;
      tmpvar_99.xy = tmpvar_96.xy;
      tmpvar_99.z = tmpvar_91.z;
      lowp vec3 tmpvar_100;
      tmpvar_100.xy = tmpvar_96.zw;
      tmpvar_100.z = tmpvar_91.w;
      lowp vec4 tmpvar_101;
      tmpvar_101.x = dot (tmpvar_97, tmpvar_97);
      tmpvar_101.y = dot (tmpvar_98, tmpvar_98);
      tmpvar_101.z = dot (tmpvar_99, tmpvar_99);
      tmpvar_101.w = dot (tmpvar_100, tmpvar_100);
      lowp vec4 tmpvar_102;
      tmpvar_102 = (1.792843 - (0.8537347 * tmpvar_101));
      lowp vec4 tmpvar_103;
      tmpvar_103.x = dot (tmpvar_71, tmpvar_71);
      tmpvar_103.y = dot (tmpvar_76, tmpvar_76);
      tmpvar_103.z = dot (tmpvar_77, tmpvar_77);
      tmpvar_103.w = dot (tmpvar_78, tmpvar_78);
      lowp vec4 tmpvar_104;
      tmpvar_104 = max ((0.6 - tmpvar_103), 0.0);
      m_69 = (tmpvar_104 * tmpvar_104);
      lowp vec4 tmpvar_105;
      tmpvar_105.x = dot ((tmpvar_97 * tmpvar_102.x), tmpvar_71);
      tmpvar_105.y = dot ((tmpvar_98 * tmpvar_102.y), tmpvar_76);
      tmpvar_105.z = dot ((tmpvar_99 * tmpvar_102.z), tmpvar_77);
      tmpvar_105.w = dot ((tmpvar_100 * tmpvar_102.w), tmpvar_78);
      lowp vec3 tmpvar_106;
      tmpvar_106.x = ((tmpvar_16.z * posOffset) + tmpvar_30);
      tmpvar_106.y = ((tmpvar_16.x * posOffset) + tmpvar_30);
      tmpvar_106.z = ((tmpvar_16.y * posOffset) + tmpvar_30);
      lowp vec4 m_107;
      lowp vec3 tmpvar_108;
      tmpvar_108 = floor((tmpvar_106 + dot (tmpvar_106, vec3(0.3333333, 0.3333333, 0.3333333))));
      lowp vec3 tmpvar_109;
      tmpvar_109 = ((tmpvar_106 - tmpvar_108) + dot (tmpvar_108, vec3(0.1666667, 0.1666667, 0.1666667)));
      lowp vec3 tmpvar_110;
      tmpvar_110.x = float((tmpvar_109.x >= tmpvar_109.y));
      tmpvar_110.y = float((tmpvar_109.y >= tmpvar_109.z));
      tmpvar_110.z = float((tmpvar_109.z >= tmpvar_109.x));
      lowp vec3 tmpvar_111;
      tmpvar_111 = (1.0 - tmpvar_110);
      lowp vec3 tmpvar_112;
      tmpvar_112 = min (tmpvar_110, tmpvar_111.zxy);
      lowp vec3 tmpvar_113;
      tmpvar_113 = max (tmpvar_110, tmpvar_111.zxy);
      lowp vec3 tmpvar_114;
      tmpvar_114 = ((tmpvar_109 - tmpvar_112) + vec3(0.1666667, 0.1666667, 0.1666667));
      lowp vec3 tmpvar_115;
      tmpvar_115 = ((tmpvar_109 - tmpvar_113) + vec3(0.3333333, 0.3333333, 0.3333333));
      lowp vec3 tmpvar_116;
      tmpvar_116 = ((tmpvar_109 - 1.0) + vec3(0.5, 0.5, 0.5));
      lowp vec3 tmpvar_117;
      tmpvar_117 = (vec3(mod (tmpvar_108, 289.0)));
      lowp vec4 tmpvar_118;
      tmpvar_118.xw = vec2(0.0, 1.0);
      tmpvar_118.y = tmpvar_112.z;
      tmpvar_118.z = tmpvar_113.z;
      lowp vec4 x_119;
      x_119 = (tmpvar_117.z + tmpvar_118);
      lowp vec4 tmpvar_120;
      tmpvar_120.xw = vec2(0.0, 1.0);
      tmpvar_120.y = tmpvar_112.y;
      tmpvar_120.z = tmpvar_113.y;
      lowp vec4 x_121;
      x_121 = (((vec4(mod (
        (((x_119 * 34.0) + 1.0) * x_119)
      , 289.0))) + tmpvar_117.y) + tmpvar_120);
      lowp vec4 tmpvar_122;
      tmpvar_122.xw = vec2(0.0, 1.0);
      tmpvar_122.y = tmpvar_112.x;
      tmpvar_122.z = tmpvar_113.x;
      lowp vec4 x_123;
      x_123 = (((vec4(mod (
        (((x_121 * 34.0) + 1.0) * x_121)
      , 289.0))) + tmpvar_117.x) + tmpvar_122);
      lowp vec4 tmpvar_124;
      tmpvar_124 = (vec4(mod (((
        (x_123 * 34.0)
       + 1.0) * x_123), 289.0)));
      lowp vec4 tmpvar_125;
      tmpvar_125 = (tmpvar_124 - (49.0 * floor(
        (0.02040816 * tmpvar_124)
      )));
      lowp vec4 tmpvar_126;
      tmpvar_126 = floor((tmpvar_125 * 0.1428571));
      lowp vec4 tmpvar_127;
      tmpvar_127 = ((tmpvar_126 * 0.2857143) + vec4(-0.9285714, -0.9285714, -0.9285714, -0.9285714));
      lowp vec4 tmpvar_128;
      tmpvar_128 = ((floor(
        (tmpvar_125 - (7.0 * tmpvar_126))
      ) * 0.2857143) + vec4(-0.9285714, -0.9285714, -0.9285714, -0.9285714));
      lowp vec4 tmpvar_129;
      tmpvar_129 = ((1.0 - abs(tmpvar_127)) - abs(tmpvar_128));
      lowp vec4 tmpvar_130;
      tmpvar_130.xy = tmpvar_127.xy;
      tmpvar_130.zw = tmpvar_128.xy;
      lowp vec4 tmpvar_131;
      tmpvar_131.xy = tmpvar_127.zw;
      tmpvar_131.zw = tmpvar_128.zw;
      lowp vec4 tmpvar_132;
      tmpvar_132 = -(vec4(greaterThanEqual (vec4(0.0, 0.0, 0.0, 0.0), tmpvar_129)));
      lowp vec4 tmpvar_133;
      tmpvar_133 = (tmpvar_130.xzyw + ((
        (floor(tmpvar_130) * 2.0)
       + 1.0).xzyw * tmpvar_132.xxyy));
      lowp vec4 tmpvar_134;
      tmpvar_134 = (tmpvar_131.xzyw + ((
        (floor(tmpvar_131) * 2.0)
       + 1.0).xzyw * tmpvar_132.zzww));
      lowp vec3 tmpvar_135;
      tmpvar_135.xy = tmpvar_133.xy;
      tmpvar_135.z = tmpvar_129.x;
      lowp vec3 tmpvar_136;
      tmpvar_136.xy = tmpvar_133.zw;
      tmpvar_136.z = tmpvar_129.y;
      lowp vec3 tmpvar_137;
      tmpvar_137.xy = tmpvar_134.xy;
      tmpvar_137.z = tmpvar_129.z;
      lowp vec3 tmpvar_138;
      tmpvar_138.xy = tmpvar_134.zw;
      tmpvar_138.z = tmpvar_129.w;
      lowp vec4 tmpvar_139;
      tmpvar_139.x = dot (tmpvar_135, tmpvar_135);
      tmpvar_139.y = dot (tmpvar_136, tmpvar_136);
      tmpvar_139.z = dot (tmpvar_137, tmpvar_137);
      tmpvar_139.w = dot (tmpvar_138, tmpvar_138);
      lowp vec4 tmpvar_140;
      tmpvar_140 = (1.792843 - (0.8537347 * tmpvar_139));
      lowp vec4 tmpvar_141;
      tmpvar_141.x = dot (tmpvar_109, tmpvar_109);
      tmpvar_141.y = dot (tmpvar_114, tmpvar_114);
      tmpvar_141.z = dot (tmpvar_115, tmpvar_115);
      tmpvar_141.w = dot (tmpvar_116, tmpvar_116);
      lowp vec4 tmpvar_142;
      tmpvar_142 = max ((0.6 - tmpvar_141), 0.0);
      m_107 = (tmpvar_142 * tmpvar_142);
      lowp vec4 tmpvar_143;
      tmpvar_143.x = dot ((tmpvar_135 * tmpvar_140.x), tmpvar_109);
      tmpvar_143.y = dot ((tmpvar_136 * tmpvar_140.y), tmpvar_114);
      tmpvar_143.z = dot ((tmpvar_137 * tmpvar_140.z), tmpvar_115);
      tmpvar_143.w = dot ((tmpvar_138 * tmpvar_140.w), tmpvar_116);
      lowp vec3 tmpvar_144;
      tmpvar_144.x = ((42.0 * dot (
        (m_31 * m_31)
      , tmpvar_67)) + 0.1);
      tmpvar_144.y = ((42.0 * dot (
        (m_69 * m_69)
      , tmpvar_105)) + 0.1);
      tmpvar_144.z = ((42.0 * dot (
        (m_107 * m_107)
      , tmpvar_143)) + 0.1);
      vel_14 = (vel_14 + (tmpvar_144 * noiseStrength));
      lowp vec3 tmpvar_145;
      tmpvar_145 = (tmpvar_16.xyz + vel_14);
      newPos_7.xz = tmpvar_145.xz;
      newPos_7.y = (tmpvar_145.y * 2.5);
      lowp float tmpvar_146;
      tmpvar_146 = sqrt(dot (newPos_7, newPos_7));
      if ((tmpvar_146 > 250.0)) {
        vel_14 = (vel_14 + ((
          pow ((tmpvar_146 - 250.0), 1.2)
         * 5e-05) * -(
          normalize(newPos_7)
        )));
      };
      lowp float tmpvar_147;
      tmpvar_147 = sqrt(dot (vel_14, vel_14));
      if ((tmpvar_147 > maxSpeed)) {
        vel_14 = (normalize(vel_14) * maxSpeed);
      } else {
        if ((tmpvar_147 < minSpeed)) {
          vel_14 = (normalize(vel_14) * minSpeed);
        };
      };
      lowp vec4 tmpvar_148;
      tmpvar_148.w = 1.0;
      tmpvar_148.xyz = vel_14;
      gl_FragColor = tmpvar_148;
    };
  } else {
    if ((vTextureCoord.x < 0.5)) {
      lowp vec3 posCurr_150;
      lowp vec3 colorTheta_151;
      lowp vec4 tmpvar_152;
      tmpvar_152 = texture2D (texture, tmpvar_4);
      colorTheta_151.yz = tmpvar_152.yz;
      highp vec2 tmpvar_153;
      tmpvar_153.x = tmpvar_4.x;
      tmpvar_153.y = (tmpvar_4.y - 0.5);
      posCurr_150 = texture2D (texture, tmpvar_153).xyz;
      colorTheta_151.x = (tmpvar_152.x + flashingSpeed);
      for (float y_149 = 0.0; y_149 < 64.0; y_149 += 1.0) {
        // float x_154;
        for (float x_154 = 0.0; x_154 < 64.0; x_154 += 1.0) {
        // while (true) {
          // if ((x_154 >= 64.0)) {
          //   break;
          // };
          if (((x_154 == gl_FragCoord.x) && ((y_149 + numParticles) == gl_FragCoord.y))) {
            // x_154 += 1.0;
            continue;
          };
          vec2 tmpvar_155;
          tmpvar_155.x = (x_154 / resolution_1.x);
          tmpvar_155.y = ((y_149 / resolution_1.y) + 0.5);
          vec2 tmpvar_156;
          tmpvar_156.x = (x_154 / resolution_1.x);
          tmpvar_156.y = (y_149 / resolution_1.y);
          lowp float tmpvar_157;
          lowp vec3 tmpvar_158;
          tmpvar_158 = (texture2D (texture, tmpvar_156).xyz - posCurr_150);
          tmpvar_157 = sqrt(dot (tmpvar_158, tmpvar_158));
          if ((tmpvar_157 < syncRadius)) {
            lowp float tmpvar_159;
            tmpvar_159 = (colorTheta_151.x - texture2D (texture, tmpvar_155).x);
            lowp float tmpvar_160;
            tmpvar_160 = abs(tmpvar_159);
            if ((tmpvar_160 > maxThetaDiff)) {
              lowp float tmpvar_161;
              if ((tmpvar_159 > 0.0)) {
                tmpvar_161 = 1.0;
              } else {
                if ((tmpvar_159 < 0.0)) {
                  tmpvar_161 = -1.0;
                } else {
                  tmpvar_161 = 0.0;
                };
              };
              colorTheta_151.x = (colorTheta_151.x + ((tmpvar_161 * catchingSpeed) * 0.01));
            };
          };
          // x_154 += 1.0;
        };
      };
      if ((colorTheta_151.x > 6.283185)) {
        colorTheta_151.x = (colorTheta_151.x - 6.283185);
      };
      lowp vec4 tmpvar_162;
      tmpvar_162.yzw = vec3(0.0, 0.0, 1.0);
      tmpvar_162.x = colorTheta_151.x;
      gl_FragColor = tmpvar_162;
    } else {
      lowp vec4 tmpvar_163;
      tmpvar_163 = texture2D (texture, tmpvar_4);
      gl_FragColor = tmpvar_163;
    };
  };
}
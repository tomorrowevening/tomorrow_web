# Web Utils

### Debug
```
import debug from 'tomorrow_web/debug';
const params = {
    seconds: 0,
    options: ['A', 'B', 'C'],
    clickCount: 0
};
debug.addInput(undefined, params, 'seconds', {
    label: 'Seconds'
}).listen();
debug.addOptions(undefined, params, 'options', params.options, (value: any, index: number) => {
    console.log(`Option: #${index}, ${value}');
});
debug.addButton(undefined, 'Click', () => {
    params.clickCount++;
    console.log(`Button clicked: ${params.clickCount}`);
});
```

### DOM
```
import {
    isiPad,
    isiPhone,
    isiOS,
    isChrome,
    isSafari,
    isFirefox,
    isOpera,
    isMobile,
    hasUserMedia,
    supportsWebp,
    delay,
    fileName,
    guid
} from 'tomorrow_web/dom';
console.log(
    'test browser support:\n',
    `isiPad: ${isiPad}\n`,
    `isiPhone: ${isiPhone}\n`,
    `isiOS: ${isiOS}\n`,
    `isChrome: ${isChrome}\n`,
    `isSafari: ${isSafari}\n`,
    `isFirefox: ${isFirefox}\n`,
    `isOpera: ${isOpera}\n`,
    `isMobile: ${isMobile}\n`,
    `hasUserMedia: ${hasUserMedia}\n`,
    `supportsWebp: ${supportsWebp}`
);
console.log(
    'test strings:\n',
    `fileName: ${fileName('http://www.website.com/myImage.png')}\n`,
    `guid: ${guid()}`
);
```

### Loader
```
import loader from 'tomorrow_web/loader';
import {
    GLTF,
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

// Custom loading function
const loadGLTF = (path: string) => {
    return new Promise<GLTF>((resolve, reject) => {
        const modelLoader = new GLTFLoader();
        modelLoader.load(
            path,
            (gltf: GLTF) => {
                resolve(gltf);
            },
            (event: ProgressEvent) => { },
            () => {
                reject();
            }
        );
    });
};

loader.supportsBlob = false;
loader.loadAssets(
    [
        {
            'type': 'json',
            'file': 'files/data.json'
        },
        {
            'type': 'image',
            'file': 'files/logo.png'
        },
        {
            'type': 'custom',
            'file': 'files/figure.glb',
            'load': loadGLTF
        }
    ],
    (progress: number) => {
        console.log(`load progress: ${Math.round(progress * 100)}`);
    }
).then((files: any) => {
    console.log('loaded', files);
}).catch((reason: any) => {
    console.log('error with load:', reason);
});
```

### Math
```
import {
    DEGREES,
    RADIANS,
    TWO_PI,
    HALF_PI,
    between,
    clamp,
    normalize,
    mix,
    map,
    roundTo,
    distance,
    distance2,
    distance3,
    random,
    getAngle,
    toRad,
    toDeg,
    cubicBezier,
    mixArrays
} from 'tomorrow_web/math';
console.log(
    'test math:\n',
    `DEGREES: ${DEGREES}\n`,
    `RADIANS: ${RADIANS}\n`,
    `TWO_PI: ${TWO_PI}\n`,
    `HALF_PI: ${HALF_PI}\n`,
    `between: ${between(0, 100, 50)}\n`,
    `clamp: ${clamp(0, 100, 150)}\n`,
    `normalize: ${normalize(0, 100, 50)}\n`,
    `mix: ${mix(100, 200, 0.5)}\n`,
    `map: ${map(100, 200, 0, 10, 150)}\n`,
    `roundTo: ${roundTo(0.123456789, 3)}\n`,
    `distance: ${distance(50, 150)}\n`,
    `distance2: ${distance2(0, 0, 100, 100)}\n`,
    `distance3: ${distance3(0, 0, 0, 100, 100, 100)}\n`,
    `random: ${random(100, 200)}\n`,
    `getAngle: ${getAngle(0, 0, 100, 100)}\n`,
    `toRad: ${toRad(180)}\n`,
    `toDeg: ${toDeg(Math.PI)}\n`,
    `cubicBezier: ${cubicBezier(0.25, 0.19, 1, 0.22, 1)}\n`,
    `mixArrays: ${mixArrays([0, 0, 0], [10, 20, 30], 0.5)}`
);
```

### RAF
```
import debug from 'tomorrow_web/debug';
import raf from 'tomorrow_web/raf';
raf.add(() => {
    debug.begin();
    // Update animation / render calls
    debug.end();
});
raf.play();
```

### Three
```
import {
    parseShader
} from 'tomorrow_web/three';
import { ShaderLib } from 'three/renderers/shaders/ShaderLib';

const fragment = parseShader(
    ShaderLib.phong.fragmentShader,
    [],
    []
);
console.log('Default Phong Fragment:');
console.log(fragment);
```

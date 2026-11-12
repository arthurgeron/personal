import type { Glyphs } from '../types/interfaces';
import { clamp, smoothstep } from './format';
import {
  count,
  light,
  maxGlyphs,
  pixelRatio,
  pointer,
  shock,
  still,
} from './session';

interface Shape {
  el: HTMLElement;
  lines: (() => string[]) | null;
  width: number;
  ascent: number;
  formIn: number;
  formOut: number;
  cy: number;
  pin: number;
  pout: number;
  rect: [left: number, top: number, width: number, height: number];
}

const CODE =
  "const site=useMemo(()=>({fps:60,years:13,stack:['React','ReactNative','Web3']}),[]);const ship=useCallback(pr=>merge(pr),[site]);if(slow(app))profile(app);for(const pr of open)ship(pr);".replace(
    / /g,
    '',
  );
const LAYERS = [22, 16, 12, 9, 7, 5, 4, 3];
const STACK_BELOW = 820;
const LINE_STEP = 92;
const PALETTE = {
  dark: [0.96, 0.5, 0.12, 0.98, 0.76, 0.32, 1, 0.93, 0.8, 0.55, 0.83, 1],
  light: [0.5, 0.36, 0.2, 0.62, 0.34, 0.02, 0.1, 0.1, 0.12, 0.04, 0.36, 0.76],
};
const BACKGROUND = { dark: [13, 10, 8], light: [238, 240, 242] };
const UNIFORMS = [
  'uRes',
  'uMouse',
  'uForm',
  'uClick',
  'uScroll',
  'uTime',
  'uRain',
  'uDpr',
  'uAlpha',
  'uC',
] as const;

// aP = x, y, size, kind. kind >= 0 is a word glyph (index of its word), kind < 0 is rain (minus the wrap height of its layer)
// aS = word: delay, locked character, seed, coverage. rain: column seed, column seed, seed, depth
const VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec4 aP;layout(location=1) in vec4 aS;
uniform vec2 uRes,uMouse,uForm[6];uniform vec4 uClick;uniform float uScroll,uTime,uRain,uDpr,uAlpha;uniform vec3 uC[4];
out vec4 vC;out float vF;flat out float vG;
float rnd(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 v;vec3 col;float a,scr=1.,rate;
  if(aP.w<0.){
    // rain: the glyph keeps its grid cell and the light travels down the column
    float H=-aP.w;
    v=vec2(aP.x,mod(aP.y-uScroll*mix(.4,.06,aS.w),H)-aP.z);
    float d=fract(uRain*mix(.06,.14,aS.y)*mix(1.,.6,aS.w)+aS.x*9.-aP.y/H);
    float on=step(.42,fract(aS.x*7.31)),head=smoothstep(.03,0.,d);
    a=uAlpha*mix(1.,.3,aS.w)*(.03+on*(pow(1.-d,7.)*.75+head*.6));
    col=mix(mix(uC[0],uC[1],aS.y),uC[2],head);
    rate=mix(.5,2.5,aS.z);vF=0.;
  }else{
    // word: falls down its own column into place, scrambling until it locks on its character, then drops away
    vec2 F=uForm[int(aP.w)];
    float ti=clamp(F.x*1.6-aS.x*.6,0.,1.),to=clamp(F.y*1.6-fract(aS.x*3.7)*.6,0.,1.);
    float e=1.-pow(1.-ti,3.),lock=step(.995,ti)*step(to,.005);
    v=vec2(aP.x,aP.y-(1.-e)*(240.+420.*aS.z)+to*to*(160.+280.*aS.z)-uScroll);
    float sheen=pow(1.-fract(uTime*.16+aS.x*2.-aP.y*.002),12.);
    scr=max(1.-lock,step(.994,rnd(vec2(aS.z,floor(uTime*4.)))));
    a=aS.w*smoothstep(0.,.2,ti)*(1.-smoothstep(.2,1.,to))*(.8+.2*lock+sheen*.5);
    col=mix(mix(uC[1],uC[2],aS.z*.5),uC[3],max((1.-lock)*.8,sheen*.6));
    rate=14.;vF=.3*smoothstep(.7,1.,ti)*(1.-smoothstep(0.,.3,to));
  }
  vec2 m=v-uMouse;float f=exp(-dot(m,m)/16000.);
  vec2 c=v-(uClick.xy-vec2(0.,uScroll));float rc=length(c)+.001,q=(rc-uClick.z*1100.)/70.,w=exp(-q*q)*exp(-uClick.z*2.)*uClick.w;
  v+=c/rc*w*46.;
  if(aP.w<0.)a+=uAlpha*(f*.55+w)*mix(1.,.4,aS.w);
  else{v+=m/(length(m)+.001)*f*14.;scr=max(scr,step(.35,f+w));}
  vG=scr>.5?floor(rnd(vec2(aS.z,floor(uTime*rate+aS.z*40.)))*94.):aS.y;
  gl_Position=vec4(v.x/uRes.x*2.-1.,1.-v.y/uRes.y*2.,0.,1.);
  gl_PointSize=aP.z*uDpr;
  vC=vec4(col,a);
}`;

// the point is 1.25 cells tall, so the cell itself is the middle .48 by .8 of it
const FRAGMENT = `#version 300 es
precision mediump float;
in vec4 vC;in float vF;flat in float vG;uniform sampler2D uT;out vec4 o;
void main(){vec2 p=abs(gl_PointCoord-.5);
  float a=min(1.,(texture(uT,(vec2(mod(vG,16.),floor(vG/16.))+gl_PointCoord)/vec2(16.,8.)).r+vF*step(p.x,.24)*step(p.y,.4))*vC.a);o=vec4(vC.rgb*a,a);}`;

const face = (size: number) => `800 ${size}px Geist, system-ui, sans-serif`;

const need = <T>(value: T | null | undefined, what: string): T => {
  if (value == null) throw new Error(`${what} is unavailable`);
  return value;
};

const toShape = (el: HTMLElement): Shape => ({
  el,
  lines:
    el.dataset.shape === 'chain'
      ? null
      : () => {
          const words = (el.textContent ?? '').trim();
          return 'stack' in el.dataset && innerWidth <= STACK_BELOW
            ? words.split(' ')
            : [words];
        },
  width: 1,
  ascent: 1,
  formIn: 0,
  formOut: 0,
  cy: 0,
  pin: 0.6,
  pout: 0.2,
  rect: [0, 0, 8, 8],
});

const drawChain = (x: CanvasRenderingContext2D, w: number, h: number) => {
  const blocks = 4;
  const gap = 0.5;
  const s = Math.min(h * 0.7, w / (blocks + (blocks - 1) * gap));
  const x0 = (w - (blocks * s + (blocks - 1) * gap * s)) / 2;
  const y0 = (h - s) / 2;
  x.lineWidth = Math.max(3, s * 0.09);
  x.lineJoin = 'round';
  for (let i = 0; i < blocks; i++) {
    const bx = x0 + i * (s + gap * s);
    x.beginPath();
    if (x.roundRect) x.roundRect(bx, y0, s, s, s * 0.16);
    else x.rect(bx, y0, s, s);
    x.stroke();
    x.fillRect(bx + s * 0.24, y0 + s * 0.27, s * 0.52, s * 0.08);
    x.fillRect(bx + s * 0.24, y0 + s * 0.46, s * 0.34, s * 0.08);
    x.fillRect(bx + s * 0.24, y0 + s * 0.65, s * 0.44, s * 0.08);
    if (i < blocks - 1) {
      x.beginPath();
      x.moveTo(bx + s, y0 + s / 2);
      x.lineTo(bx + s + gap * s, y0 + s / 2);
      x.stroke();
    }
  }
  return s;
};

const drawShape = (
  shape: Shape,
  x: CanvasRenderingContext2D,
  w: number,
  h: number,
) => {
  if (!shape.lines) return drawChain(x, w, h);
  const size = (w * 100) / shape.width;
  x.font = face(size);
  shape.lines().forEach((line, i) => {
    x.fillText(line, 0, ((shape.ascent + i * LINE_STEP) * size) / 100);
  });
  return size;
};

// every character is one GPU point sprite placed in the vertex shader, all in one draw call
export function initGlyphs(
  canvas: HTMLCanvasElement,
  dead: (message: string) => void,
): Glyphs | null {
  // opaque canvas: the page background is cleared into it, so nothing depends on how the browser composites a transparent one
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    powerPreference: 'high-performance',
  });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = need(gl.createShader(type), 'shader');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed');
    return shader;
  };
  const program = need(gl.createProgram(), 'program');
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed');
  gl.useProgram(program);
  const uniform = Object.fromEntries(
    UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)]),
  ) as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 32, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 32, 16);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.enable(gl.BLEND);
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    dead(
      'The browser took the GPU context back, so the headings fell back to HTML.',
    );
  });

  const shapes = [...document.querySelectorAll<HTMLElement>('.slot')].map(
    toShape,
  );
  const mask = document.createElement('canvas');
  const pen = need(
    mask.getContext('2d', { willReadFrequently: true }),
    '2d context',
  );
  const forms = new Float32Array(12);
  const max = maxGlyphs();
  let dpr = 1;
  let vw = 1;
  let vh = 1;
  let words = 0;
  let def = 3000;
  let ready = false;
  let last = 0;
  let rainTime = 0;
  let lastScroll = scrollY;
  let velocity = 0;
  let settled = 0;
  let checked = false;

  // printable ASCII in a 16 x 8 atlas of 64px cells
  const atlas = () => {
    const sheet = document.createElement('canvas');
    sheet.width = 1024;
    sheet.height = 512;
    const x = need(sheet.getContext('2d'), '2d context');
    x.fillStyle = '#000';
    x.fillRect(0, 0, 1024, 512);
    x.fillStyle = '#fff';
    x.font = '600 50px "Geist Mono", ui-monospace, Menlo, monospace';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    for (let i = 0; i < 94; i++)
      x.fillText(
        String.fromCharCode(33 + i),
        (i % 16) * 64 + 32,
        (i >> 4) * 64 + 34,
      );
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sheet);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR,
    );
  };

  // each text slot takes the exact proportions of its word in the display face
  const fitSlots = () => {
    pen.font = face(100);
    for (const shape of shapes) {
      if (!shape.lines) continue;
      const metrics = shape.lines().map((line) => pen.measureText(line));
      shape.width = Math.max(1, ...metrics.map((m) => m.width));
      shape.ascent = Math.max(...metrics.map((m) => m.actualBoundingBoxAscent));
      const descent = Math.max(
        ...metrics.map((m) => m.actualBoundingBoxDescent),
      );
      shape.el.style.aspectRatio = (
        shape.width /
        (shape.ascent + descent + LINE_STEP * (metrics.length - 1))
      ).toFixed(3);
    }
  };

  const place = () => {
    const top = scrollY;
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - innerHeight,
    );
    for (const shape of shapes) {
      const r = shape.el.getBoundingClientRect();
      shape.rect = [
        r.left,
        r.top + top,
        Math.max(8, r.width),
        Math.max(8, r.height),
      ];
      shape.cy = r.top + top + r.height / 2;
      // viewport fractions between which the word is fully formed, widened for words that cannot reach the middle of the screen
      shape.pin = Math.max(0.6, (shape.cy - maxScroll) / vh + 0.02);
      shape.pout = Math.min(0.2, shape.cy / vh - 0.04);
    }
  };

  // rasterise the word, then keep the monospace grid cells it covers. the cells read as one page of code
  const cells = (shape: Shape, index: number, out: number[]) => {
    const [left, top, width, height] = shape.rect;
    const scale = Math.min(1, 1000 / width);
    const mw = Math.ceil(width * scale);
    const mh = Math.ceil(height * scale);
    mask.width = mw;
    mask.height = mh;
    pen.fillStyle = '#000';
    pen.strokeStyle = '#000';
    const ch = clamp(drawShape(shape, pen, mw, mh) / scale / 24, 5.5, 9);
    const cw = ch * 0.6;
    const cols = Math.ceil(width / cw);
    const rows = Math.ceil(height / ch);
    const alpha = pen.getImageData(0, 0, mw, mh).data;
    for (let c = 0; c < cols; c++) {
      const delay = Math.random();
      for (let r = 0; r < rows; r++) {
        let cover = 0;
        for (let k = 0; k < 9; k++) {
          const py = Math.min(
            mh - 1,
            ((r + 0.2 + ((k / 3) | 0) * 0.3) * ch * scale) | 0,
          );
          const px = Math.min(
            mw - 1,
            ((c + 0.2 + (k % 3) * 0.3) * cw * scale) | 0,
          );
          if (alpha[(py * mw + px) * 4 + 3] > 110) cover++;
        }
        // columns start at random times and fill from the bottom row up
        if (cover > 3)
          out.push(
            left + (c + 0.5) * cw,
            top + (r + 0.5) * ch,
            ch * 1.25,
            index,
            delay * 0.65 + (1 - r / rows) * 0.35,
            CODE.charCodeAt((r * cols + c) % CODE.length) - 33,
            Math.random(),
            Math.min(1, cover / 5),
          );
      }
    }
  };

  // rain: layers of whole columns, nearest first, so any count draws complete columns
  const rain = (data: Float32Array, offset: number) => {
    let n = 0;
    const put = (
      x: number,
      y: number,
      size: number,
      wrap: number,
      a: number,
      b: number,
      layer: number,
    ) => {
      const k = offset + n++ * 8;
      data[k] = x;
      data[k + 1] = y;
      data[k + 2] = size * 1.25;
      data[k + 3] = -wrap;
      data[k + 4] = a;
      data[k + 5] = b;
      data[k + 6] = Math.random();
      data[k + 7] = layer / 7;
    };
    LAYERS.forEach((size, layer) => {
      const cw = size * 0.6;
      const cols = Math.ceil(vw / cw);
      const rows = Math.ceil(vh / size) + 2;
      const order = [...Array(cols).keys()].sort(() => Math.random() - 0.5);
      for (const c of order) {
        const a = Math.random();
        const b = Math.random();
        for (let r = 0; r < rows && n < max; r++)
          put((c + 0.5) * cw, r * size, size, rows * size, a, b, layer);
      }
      if (layer === 2) def = Math.max(3000, Math.round(n / 1000) * 1000);
    });
    const rows = Math.ceil(vh / 3) + 2;
    while (n < max)
      put(
        Math.random() * vw,
        ((Math.random() * rows) | 0) * 3,
        3,
        rows * 3,
        Math.random(),
        Math.random(),
        7,
      );
  };

  const build = () => {
    if (!ready) {
      atlas();
      ready = true;
    }
    fitSlots();
    place();
    const word: number[] = [];
    shapes.forEach((shape, i) => cells(shape, i, word));
    words = word.length / 8;
    const data = new Float32Array(word.length + max * 8);
    data.set(word);
    rain(data, word.length);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  };

  const fit = () => {
    dpr = pixelRatio();
    vw = canvas.clientWidth;
    vh = canvas.clientHeight || innerHeight;
    canvas.width = Math.max(1, (vw * dpr) | 0);
    canvas.height = Math.max(1, (vh * dpr) | 0);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const draw = (now: number) => {
    const top = scrollY;
    const paused = still();
    const dt = clamp(last ? now - last : 16, 1, 100);
    const ease = paused ? 1 : 1 - Math.exp(-dt / 200);
    const theme = light() ? 'light' : 'dark';
    const bg = BACKGROUND[theme];
    last = now;
    // the rain runs faster while the page is scrolling
    velocity += (Math.abs(top - lastScroll) / dt - velocity) * 0.2;
    lastScroll = top;
    if (!paused) rainTime += (dt / 1000) * (1 + Math.min(6, velocity * 1.5));
    // each word assembles as it comes up the screen and lets go near the top. eased in time, so jumps animate too
    let formed: Shape | undefined;
    shapes.forEach((shape, i) => {
      const p = (shape.cy - top) / vh;
      shape.formIn +=
        (1 - smoothstep(shape.pin, shape.pin + 0.4, p) - shape.formIn) * ease;
      shape.formOut +=
        (1 - smoothstep(shape.pout - 0.3, shape.pout, p) - shape.formOut) *
        ease;
      forms[i * 2] = shape.formIn;
      forms[i * 2 + 1] = shape.formOut;
      if (shape.formIn > 0.995 && shape.formOut < 0.005 && p > 0.1 && p < 0.9)
        formed = shape;
    });
    gl.clearColor(bg[0] / 255, bg[1] / 255, bg[2] / 255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // glow adds on dark, ink covers on light
    gl.blendFunc(gl.ONE, theme === 'light' ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE);
    gl.uniform2f(uniform.uRes, vw, vh);
    gl.uniform2f(
      uniform.uMouse,
      pointer.on ? pointer.sx : -9999,
      pointer.on ? pointer.sy : -9999,
    );
    gl.uniform2fv(uniform.uForm, forms);
    gl.uniform4f(
      uniform.uClick,
      shock.x,
      shock.y,
      (now - shock.t) / 1000,
      shock.k,
    );
    gl.uniform1f(uniform.uScroll, top);
    gl.uniform1f(uniform.uTime, paused ? 0 : now / 1000);
    gl.uniform1f(uniform.uRain, rainTime);
    gl.uniform1f(uniform.uDpr, dpr);
    gl.uniform1f(
      uniform.uAlpha,
      clamp(0.34 * (def / count()) ** 0.3, 0.1, 0.5) *
        (theme === 'light' ? 1.7 : 0.5),
    );
    gl.uniform3fv(uniform.uC, PALETTE[theme]);
    gl.drawArrays(gl.POINTS, 0, words + Math.min(count(), max));
    // once, with a finished word on screen: read the frame back and fall back to HTML headings if the GPU drew nothing
    if (!checked && formed && ++settled > 40) {
      checked = true;
      const band = Math.min(160, canvas.height);
      const y0 =
        clamp(
          canvas.height - (formed.cy - top) * dpr - band / 2,
          0,
          canvas.height - band,
        ) | 0;
      const pixels = new Uint8Array(canvas.width * band * 4);
      gl.readPixels(
        0,
        y0,
        canvas.width,
        band,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels,
      );
      let lit = 0;
      for (let j = 0; j < pixels.length; j += 4)
        if (Math.abs(pixels[j] - bg[0]) + Math.abs(pixels[j + 1] - bg[1]) > 14)
          lit++;
      if (lit < 40)
        dead(
          'The GPU canvas came back empty in this browser, so the headings fell back to HTML.',
        );
    }
  };

  const anchor = (id: string): [number, number] | undefined => {
    const shape = shapes.find((s) => s.el.id === id);
    return shape && [shape.rect[0] + shape.rect[2] * 0.15, shape.cy];
  };

  fit();
  return {
    build,
    place,
    fit,
    draw,
    anchor,
    get def() {
      return def;
    },
  };
}

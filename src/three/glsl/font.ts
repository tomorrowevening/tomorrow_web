export const TextVertex = `in vec2 uv;
in vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * position;
}`;

export const TextFragment = `#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

uniform float opacity;
uniform vec3 color;
uniform sampler2D map;
in vec2 vUv;

#define alphaTest 1.0 / 255.0

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  vec3 img = texture(map, vUv).rgb;
  float sigDist = median(img.r, img.g, img.b) - 0.5;
  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);
  pc_fragColor = vec4(color.xyz, alpha * opacity);
  if (pc_fragColor.a < alphaTest) discard;
}`;
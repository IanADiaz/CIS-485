#include <emscripten.h>
#include <complex>

extern "C" {

// Renders a w×h image into buf (RGBA, 4 bytes per pixel)
EMSCRIPTEN_KEEPALIVE
void render(unsigned char *buf, int w, int h,
            double x0, double y0, double x1, double y1) {
  for (int iy = 0; iy < h; iy++) {
    for (int ix = 0; ix < w; ix++) {
      std::complex<double> c(
        x0 + (x1 - x0) * ix / w,
        y0 + (y1 - y0) * iy / h
      );

      std::complex<double> z = 0;
      int iter = 0, maxIter = 100;

      while (abs(z) < 2.0 && iter < maxIter) {
        z = z * z + c;
        iter++;
      }

      int idx = 4 * (iy * w + ix);
      unsigned char color = (unsigned char)(255 * iter / maxIter);
      buf[idx + 0] = color;  // R
      buf[idx + 1] = color;  // G
      buf[idx + 2] = color;  // B
      buf[idx + 3] = 255;    // A
    }
  }
}
}

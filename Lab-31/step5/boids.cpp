#include <emscripten.h>
#include <stdlib.h>

struct Bird {
  float x, y, vx, vy;
};

extern "C" {

EMSCRIPTEN_KEEPALIVE
Bird* init_boids(int n) {
  Bird* flock = (Bird*)malloc(sizeof(Bird) * n);
  for (int i = 0; i < n; i++) {
    flock[i].x = rand() % 600;
    flock[i].y = rand() % 400;
    flock[i].vx = ((rand() % 100) / 50.0f) - 1;
    flock[i].vy = ((rand() % 100) / 50.0f) - 1;
  }
  return flock;
}

EMSCRIPTEN_KEEPALIVE
void update_boids(Bird* flock, int n, float dt) {
  for (int i = 0; i < n; i++) {
    flock[i].x += flock[i].vx * dt;
    flock[i].y += flock[i].vy * dt;

    if (flock[i].x < 0) flock[i].x += 600;
    if (flock[i].x > 600) flock[i].x -= 600;
    if (flock[i].y < 0) flock[i].y += 400;
    if (flock[i].y > 400) flock[i].y -= 400;
  }
}

} // end extern "C"

#include <stdlib.h>

int multiply(int x, int y) {
    return x * y;
}

void fill_array(int *arr, int len) {
    for (int i = 0; i < len; i++) {
        arr[i] = i * i;
    }
}

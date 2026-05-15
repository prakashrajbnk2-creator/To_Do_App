#include <stdio.h>
#include <string.h>

typedef struct {
    int id;
    char text[256];
    int is_completed;
} Task;

void calculate_progress(Task tasks[], int count) {
    if (count == 0) {
        printf("Progress: 0%%\n");
        return;
    }

    int completed = 0;
    for (int i = 0; i < count; i++) {
        if (tasks[i].is_completed) {
            completed++;
        }
    }

    float percentage = ((float)completed / (float)count) * 100;
    printf("Calculated Overall Progress: %.2f%%\n", percentage);
}

int main() {
    Task stack[2] = {
        {1, "Setup Database", 1},
        {2, "Push to Production", 0}
    };

    calculate_progress(stack, 2);
    return 0;
}

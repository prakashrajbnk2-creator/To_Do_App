package com.todo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class TodoService {
    private List<TodoItem> tasks = new ArrayList<>();

    public void addTask(String text, String category) {
        TodoItem item = new TodoItem(System.currentTimeMillis(), text, category);
        tasks.add(0, item);
    }

    public List<TodoItem> getCompletedTasks() {
        return tasks.stream()
            .filter(TodoItem::isCompleted)
            .collect(Collectors.toList());
    }

    public double calculateProgress() {
        if (tasks.isEmpty()) return 0.0;
        long completed = tasks.stream().filter(TodoItem::isCompleted).count();
        return (double) completed / tasks.size();
    }

    // Inner Model
    public static class TodoItem {
        public long id;
        public String text;
        public String category;
        public boolean isCompleted = false;

        public TodoItem(long id, String text, String category) {
            this.id = id;
            this.text = text;
            this.category = category;
        }

        public boolean isCompleted() { return isCompleted; }
    }
}

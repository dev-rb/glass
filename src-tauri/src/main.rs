#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Manager, Window};


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn add_decorations(window: Window) {
   window.set_decorations(true).expect("Decorations to be true");
}


fn main() {
    tauri::Builder::default()
   
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![add_decorations])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

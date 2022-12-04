#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Window};


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn toggle_always_on_top(window: Window, value: bool) {
        let value =  window.set_always_on_top(value);
    //     let hwnd = window.hwnd().unwrap().0;
    //   let _pre_val;
    //   let hwnd = windows::Win32::Foundation::HWND(hwnd);
    //   unsafe {
    //     use windows::Win32::Foundation::POINT;
    //     use windows::Win32::UI::WindowsAndMessaging::*;
    //     use windows::Win32::Graphics::Gdi::*;
    //     let nindex = GWL_EXSTYLE;
    //     let style =  WS_EX_LAYERED ;
    //     SetWindowPos(hwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);
    //     let point = POINT {x: 240, y: 240};
    //     UpdateLayeredWindow(hwnd, null, point, SIZENORMAL, null, );
    //     _pre_val = SetWindowLongA(hwnd, nindex, style.0 as i32);
    //   };
}


fn main() {
    tauri::Builder::default()
   
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![toggle_always_on_top])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

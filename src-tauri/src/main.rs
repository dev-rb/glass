#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Window};
use windows::Win32::Graphics::Gdi::{GetDC, CreateCompatibleDC, SelectObject};


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn toggle_always_on_top(window: Window, value: bool) {
        // let _value =  window.set_always_on_top(value);
        // let _value =  window.set_ignore_cursor_events(value);
        let hwnd = window.hwnd().unwrap().0;
      let _pre_val;
      let hwnd = windows::Win32::Foundation::HWND(hwnd);
      unsafe {
        use windows::Win32::UI::WindowsAndMessaging::*;
        use windows::Win32::Graphics::Gdi::*;
        use windows::Win32::Foundation::*;
        let nindex = GWL_EXSTYLE;
        let style =  WS_EX_LAYERED;
        // SetWindowRgn(hwnd, HRGN(32), BOOL(value as i32));
        let point = POINT {x: 0, y: 30};
        let hdc = GetDC(hwnd);
        let hdcMem = CreateCompatibleDC(hdc);
        // let old = SelectObject(hdcMem, hwnd);

        let blend = BLENDFUNCTION {BlendOp: 0, SourceConstantAlpha: 255, AlphaFormat: 1, BlendFlags: 0};
        let window_size =window.inner_size().unwrap();
        let zeroP = POINT{x: 0, y: 0};
        let size = SIZE{cx: window_size.width as i32, cy: window_size.height as i32};
        _pre_val = SetWindowLongA(hwnd, nindex, GetWindowLongA(hwnd, nindex) | style.0 as i32);
        UpdateLayeredWindow(hwnd, hdc, &point, &size, hdcMem, &zeroP, 0x0000FF00, &blend, ULW_ALPHA);

        // SetLayeredWindowAttributes(hwnd, 0x0000FF00, 255, LWA_COLORKEY);
        SetWindowPos(hwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);
      };
}


fn main() {
    tauri::Builder::default()
   
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![toggle_always_on_top])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

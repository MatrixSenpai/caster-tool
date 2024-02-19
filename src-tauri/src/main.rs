// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(unused, dead_code)]

use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

fn main() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![
          load_champions,
          load_champion_by_id,
      ])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}

#[tauri::command]
fn load_champions(app_handle: AppHandle) -> Vec<Champion> {
    let champion_path = app_handle.path_resolver()
        .resolve_resource("ddragon/en_US/champion.json")
        .unwrap();

    let champion_file = std::fs::File::open(&champion_path).unwrap();
    let champion_data: ChampionFile = serde_json::from_reader(champion_file).unwrap();

    champion_data.data
        .into_values()
        .collect()
}

#[tauri::command]
fn load_champion_by_id(id: &str, app_handle: AppHandle) -> Champion {
    let champion_path = app_handle.path_resolver()
        .resolve_resource("ddragon/en_US/championFull.json")
        .unwrap();

    let champion_file = std::fs::File::open(&champion_path).unwrap();
    let champion_data: ChampionFile = serde_json::from_reader(champion_file).unwrap();

    let mut matches = champion_data.data
        .into_iter()
        .filter(|(fid, champion)| &id.to_string() == fid)
        .map(|(_, c)| c)
        .collect::<Vec<Champion>>();

    matches.pop().unwrap()
}

#[derive(Deserialize)]
struct ChampionFile {
    data: HashMap<String, Champion>
}

#[derive(Serialize, Deserialize)]
struct Champion {
    id: String,
    name: String,
    title: String,
    image: ChampionImage,
    blurb: String,
    #[serde(default)]
    spells: Vec<ChampionSpell>,
    passive: Option<ChampionSpell>,
    #[serde(default)]
    skins: Vec<ChampionSkin>
}

#[derive(Serialize, Deserialize)]
struct ChampionImage {
    full: String
}

#[derive(Serialize, Deserialize)]
struct ChampionSkin {
    id: String,
    num: usize,
    name: String,
}

#[derive(Serialize, Deserialize)]
struct ChampionSpell {
    #[serde(default)]
    id: String,
    name: String,
    description: String,
    image: ChampionImage,
}
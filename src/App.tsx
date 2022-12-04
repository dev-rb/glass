import { createSignal, onMount } from 'solid-js';
import logo from './assets/logo.svg';
import { invoke } from '@tauri-apps/api/tauri';
import './App.css';

function App() {
	const [greetMsg, setGreetMsg] = createSignal('');
	const [name, setName] = createSignal('');

	async function greet() {
		// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
		setGreetMsg(await invoke('greet', { name: name() }));
	}

	onMount(() => {
		document
			.getElementById('titlebar')
			?.addEventListener('contextmenu', (e) => e.preventDefault());
	});

	return <div></div>;
}

export default App;

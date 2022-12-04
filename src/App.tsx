import { createSignal, JSX, onMount, Show } from 'solid-js';
import logo from './assets/logo.svg';
import { dialog, invoke } from '@tauri-apps/api';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import './App.css';
import { Portal } from 'solid-js/web';
import { createStore } from 'solid-js/store';

interface AppState {
	menuOpen: { x: number; y: number } | null;
	imageOpacity: number;
	windowOpacity: number;
	canClickThrough: boolean;
}

function App() {
	const [ref, setRef] = createSignal<HTMLElement>();

	const [state, setState] = createStore<AppState>({
		menuOpen: null,
		imageOpacity: 1,
		windowOpacity: 0.2,
		canClickThrough: false,
	});

	const closeMenu = () => setState('menuOpen', null);

	const openImage = async () => {
		const selectedImage = await dialog.open({
			multiple: false,
			filters: [{ name: 'Image', extensions: ['png', 'jpg'] }],
		});
		if (selectedImage && !Array.isArray(selectedImage)) {
			document.documentElement.style.setProperty(
				'--user-image',
				`url(${convertFileSrc(selectedImage)})`
			);
		}

		closeMenu();
	};

	const clearImage = () => {
		document.documentElement.style.setProperty('--user-image', '');
		closeMenu();
	};

	const updateImageOpacity: JSX.EventHandlerUnion<
		HTMLInputElement,
		InputEvent
	> = (e) => {
		const opacity = parseInt(e.currentTarget.value) / 100;
		document.documentElement.style.setProperty(
			'--image-opacity',
			opacity.toString()
		);
	};

	const updateWindowOpacity: JSX.EventHandlerUnion<
		HTMLInputElement,
		InputEvent
	> = (e) => {
		const opacity = parseInt(e.currentTarget.value) / 100;
		document.documentElement.style.setProperty(
			'--window-opacity',
			opacity.toString()
		);
	};

	const toggleAlwaysOnTop = () => {
		invoke('toggle_always_on_top', { value: state.canClickThrough });
		setState('canClickThrough', (c) => !c);
	};

	const clickOutside = (e: MouseEvent) => {
		if (e.target instanceof HTMLElement) {
			if (ref() && (ref()?.contains(e.target) || ref()?.isSameNode(e.target)))
				return;

			closeMenu();
		}
	};

	onMount(() => {
		document.addEventListener('mousedown', clickOutside);
		document
			.getElementById('titlebar')
			?.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				setState('menuOpen', { x: e.clientX, y: e.clientY });
			});
	});

	return (
		<div>
			<Show when={state.menuOpen}>
				<Portal mount={document.getElementById('titlebar')!}>
					<div
						ref={setRef}
						id="menu"
						class="context-menu"
						style={{
							top: `${state.menuOpen?.y ?? 0}px`,
							left: `${state.menuOpen?.x ?? 0}px`,
						}}
					>
						<button onClick={openImage}> Open Image </button>
						<button onClick={clearImage}> Clear Image </button>
						<button onClick={toggleAlwaysOnTop}> Toggle Always on Top </button>
						<hr class="divider" />
						<label id="opacity-label" for="image-opacity">
							Image Opacity
						</label>
						<input
							name="image-opacity"
							type="range"
							value={state.imageOpacity * 100}
							min={20}
							max={100}
							onInput={updateImageOpacity}
						/>
						<label id="opacity-label" for="window-opacity">
							Window Opacity
						</label>
						<input
							name="window-opacity"
							type="range"
							value={state.windowOpacity * 100}
							min={0}
							max={100}
							onInput={updateWindowOpacity}
						/>
					</div>
				</Portal>
			</Show>
		</div>
	);
}

export default App;

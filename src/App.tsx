import { createSignal, JSX, onMount, Show } from 'solid-js';
import logo from './assets/logo.svg';
import { invoke } from '@tauri-apps/api/tauri';
import './App.css';
import { Portal } from 'solid-js/web';

function App() {
	const [showMenu, setShowMenu] = createSignal<{ x: number; y: number } | null>(
		null
	);
	const [ref, setRef] = createSignal<HTMLElement>();

	const openImage = () => {};

	const clickOutside = (e: MouseEvent) => {
		if (e.target instanceof HTMLElement) {
			console.log(e.target);
			if (ref() && (ref()?.contains(e.target) || ref()?.isSameNode(e.target)))
				return;

			setShowMenu(null);
		}
	};

	onMount(() => {
		document.addEventListener('mousedown', clickOutside);
		document
			.getElementById('titlebar')
			?.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				setShowMenu({ x: e.clientX, y: e.clientY });
			});
	});

	return (
		<div>
			<Show when={showMenu()}>
				<Portal mount={document.getElementById('titlebar')!}>
					<div
						ref={setRef}
						id="menu"
						class="context-menu"
						style={{
							top: `${showMenu()?.y ?? 0}px`,
							left: `${showMenu()?.x ?? 0}px`,
						}}
					>
						<button onClick={openImage}> Open Image </button>
					</div>
				</Portal>
			</Show>
		</div>
	);
}

export default App;

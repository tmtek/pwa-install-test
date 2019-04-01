import { h, Component } from 'preact';
import installer from 'preact-pwa-install'

function App({ isStandalone, installPrompt }) {
	return (
		<div id="app">
			<h1>Install Test</h1>
			{
				installPrompt && <a href="#" onclick={installPrompt}>Install as PWA</a> 
				|| isStandalone && 'PWA is installed!'
			}
		</div>
	);
}

export default installer()(App);
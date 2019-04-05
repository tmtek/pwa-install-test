import { h, Component } from 'preact';
import { installer } from 'preact-pwa-install';

function App({ isStandalone, installPrompt }) {
	return (
		<div id="app">
			<h1>Installable Application</h1>
			{
				installPrompt && <a href="#" onclick={installPrompt}>Install as Standalone</a> 
				|| isStandalone && 'Installed as Standalone PWA!'
			}
		</div>
	);
}

export default installer()(App);
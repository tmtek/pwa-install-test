import { h, Component } from 'preact';
import installer from '../install'

function App({ isStandalone, installPrompt }) {
	return (
		<div id="app">
			<h1>Install Test</h1>
			{ installPrompt && <a href="#" onClick={installPrompt}>Do Install</a> || <p>Nothing to install</p>}
			<p>{ isStandalone && 'App is running locally' || 'App is not running locally' }</p>
		</div>
	);
}

export default installer()(App);

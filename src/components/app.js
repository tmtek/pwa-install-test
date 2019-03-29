import { h, Component } from 'preact';
import installer from '../install'

function App({isNative, installPrompt}) {
	return (
		<div id="app">
			<h1>Install Test</h1>
			{ installPrompt && <a href="#" onClick={installPrompt}>Do Install</a> || <p>Nothing to install</p>}
			<p>{ isNative && 'App is running locally' || 'App is not running locally' }</p>
		</div>
	);
}

export default installer(App);
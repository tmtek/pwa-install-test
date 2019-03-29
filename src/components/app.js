import { h, Component } from 'preact';

export default class App extends Component {

	componentDidMount() {
		window && window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			this.setState({ deferredInstallPrompt: e });
		});
	}

	handleInstallClick = () => {
		let { deferredInstallPrompt } = this.state;
		if (deferredInstallPrompt) {
			deferredInstallPrompt.prompt();
			deferredInstallPrompt.userChoice.then((choiceResult) => {
				let message = choiceResult.outcome === 'accepted' ? 'User accepted the A2HS prompt' : 'User dismissed the A2HS prompt';
				this.setState({ deferredInstallPrompt:null, message });
			});
		}
	}

	render({},{ deferredInstallPrompt , message}) {
		return (
			<div id="app">
				<h1>Install Test</h1>
				{ deferredInstallPrompt && <a href="#" onClick={this.handleInstallClick}>Do Install</a> || <p>{message || 'Not yet able to install'}</p>}
			</div>
		);
	}
}

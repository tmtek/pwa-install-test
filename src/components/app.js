import { h, Component } from 'preact';

export default class App extends Component {

	componentDidMount() {
		window && window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			this.setState({ deferredInstallPrompt: e });
		});

		window.addEventListener('appinstalled', (evt) => {
			this.setState({ wasInstalled: true });
		});

		if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
			this.setState({ runningLocally: true });
		}
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

	render({},{ deferredInstallPrompt , message, wasInstalled, runningLocally}) {
		return (
			<div id="app">
				<h1>Install Test</h1>
				{ deferredInstallPrompt && <a href="#" onClick={this.handleInstallClick}>Do Install</a> || <p>{message || 'Not yet able to install'}</p>}
				<p>{wasInstalled && 'App is installed' || 'App is not installed'}</p>
				<p>{runningLocally && 'App is running locally' || 'App is not running locally'}</p>
			</div>
		);
	}
}

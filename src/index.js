import './style';
import App from './components/app';
import { awaitInstallPrompt } from 'preact-pwa-install';

//Calling this early to ensure we capture the prompt:
awaitInstallPrompt();

export default App;

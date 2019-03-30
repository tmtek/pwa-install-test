import { h, Component } from 'preact';

/**
 * Returns true if the application is running as an installed PWA.
 */
export function isStandalone() {
    return window && (
        window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true
    );
}

/**
 * This function allows you to listen to the browser for the install prompt
 * that allows you to install the application standalone. 
 * 
 * Different browsers have different criteria for when this prompt is made available.
 * Currently Chrome requires that  the user "interact" with the content on your domain 
 * for at least 30 seconds.
 * 
 * More info can be found here: 
 * https://developers.google.com/web/fundamentals/app-install-banners/
 * 
 * listen offers the following capabilities:
 * * Listen to the browser for an install prompt.
 * * Stop listening at any time.
 * * Trigger the prompt to request app installation.
 * 
 * @param {Function} onPrompt (prompt, unlisten) => {} A function that will be called when 
 * the browser delivers a prompt that we can present. The first argument prompt is a function 
 * you can call at any time the triggers the install process. unlisten is another function 
 * that allows you to stop listening for prompts.
 * 
 * @returns {Function} An unlisten that when called, will stop listening for incoming prompts from the browser.
 */
export function listen(onPrompt) {
    if (!window) return null;
    let installPrompt;
    let installpromptListener;
    let appInstalledListener;

    let unlisten = () => installpromptListener && window.removeEventListener(installpromptListener);
    installpromptListener = window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        installPrompt = e;
        prompt = () =>  new Promise((resolve) => {
            installPrompt.prompt();
			installPrompt.userChoice.then((choiceResult) => {
				choiceResult.outcome !== 'accepted' && resolve(false);
            });
            appInstalledListener = window.addEventListener('appinstalled', () => {
                resolve(true);
            });
        }).then(success => {
            installPrompt = null;
            appInstalledListener && window.removeEventListener(appInstalledListener);
            return success;
        });
        onPrompt(prompt, unlisten);
    });
    return unlisten;
}

/**
 * A Higher Order Component that implements lthe listen() lifecycle and provides 
 * the wrapped component with only the meaning full artifacts as props:
 * 
 * Props:
 * * isStandalone - true if the app is running in standalone mode.
 * * prompt - the prompt function that you call at any time.
 */
export default function installer() {
    return Child => {
        class Installer extends Component {

            unlistentoken = null;
        
            unlisten() {
                this.setState({ prompt:null });
                this.unlistentoken && this.unlistentoken();
            }
        
            componentDidMount() {
                let standalone = isStandalone();
                this.setState({ isStandalone:standalone });
                if(!standalone) {
                    this.unlistentoken = listen(prompt => {
                        this.setState({ prompt: () => 
                            prompt().then(installed => {
                                installed && this.unlisten();
                                return installed;
                            })
                        });  
                    });
                }
            }
            
            componentWillUnmount() {
                unlisten();
            }
        
            render(props, { isStandalone, prompt }) {
                return h(Child, {...props, isStandalone, installPrompt:prompt} );
            }
        }
        return Installer;
    }
}
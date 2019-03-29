import { h, Component } from 'preact';

function isNative() {
    return window && (
        window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true
    );
}

function listen(handlePrompt) {
    if (!window) return null;
    let installPrompt;
    let installpromptListener;
    let appInstalledListener;

    let unlisten = () => installpromptListener && window.removeEventListener(installpromptListener);
    installpromptListener = window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        installPrompt = e;
        prompt = () =>  new Promise((resolve, reject) => {
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
        handlePrompt({prompt, unlisten});
    });

    return unlisten;

}

export default function () {
    return Child => {
        class PWAInstaller extends Component {

            unlistentoken = null;
        
            unlisten() {
                this.setState({ prompt:null });
                this.unlistentoken && this.unlistentoken();
            }
        
            componentDidMount() {
                let isN = isNative();
                this.setState({ isNative:isN });
                if(!isN) {
                    this.unlistentoken = listen(({ prompt }) => {
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
        
            render(props, { isNative, prompt }) {
                return h(Child, {...props, isNative, installPrompt:prompt} );
            }
        }
        return PWAInstaller;
    }
}
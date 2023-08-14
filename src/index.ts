import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

/**
 * Initialization data for the jupyterlab_remote_url extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_remote_url:plugin',
  description: 'A JupyterLab extension to help set up a remote connection to the Jupyter server.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_remote_url is activated!');

    requestAPI<any>('get-example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab_remote_url server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;

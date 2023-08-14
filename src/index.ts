import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {
  Dialog,
  ICommandPalette,
  Notification,
  showDialog
} from '@jupyterlab/apputils';

import { requestAPI } from './handler';

type InfoResponse = {
  base_url: string;
  token: string;
};

const id = 'jupyterlab_remote_url';
const commandCategory = 'Remote URL';

const getUrl = async () => {
  const { base_url, token } = await requestAPI<InfoResponse>('info');
  const url = new URL(base_url, window.location.origin);
  url.searchParams.set('token', token);
  return url;
};

const showErrorNotification = (message: string) =>
  Notification.error(message, { autoClose: 5000 });

const copyUrl = async () => {
  try {
    const url = await getUrl();
    await navigator.clipboard.writeText(url.toString());
  } catch (err) {
    showErrorNotification('Failed to retrieve Jupyter Server URL');
  }
};

const showUrl = async () => {
  try {
    const url = await getUrl();
    await showDialog({
      title: 'Jupyter server URL',
      body: url.toString(),
      buttons: [Dialog.okButton()]
    });
  } catch (err) {
    showErrorNotification('Failed to retrieve Jupyter Server URL');
  }
};

/**
 * Initialization data for the jupyterlab_remote_url extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: `${id}:plugin`,
  description:
    'A JupyterLab extension to help set up a remote connection to the Jupyter server.',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log(`JupyterLab extension ${id} is activated!`);

    const copyCommand = `${id}:copy`;
    const showCommand = `${id}:show`;

    app.commands.addCommand(copyCommand, {
      label: 'Copy Jupyter server URL',
      caption: 'Copy Jupyter server URL',
      execute: copyUrl
    });

    app.commands.addCommand(showCommand, {
      label: 'Show Jupyter server URL',
      caption: 'Show Jupyter server URL',
      execute: showUrl
    });

    palette.addItem({ command: copyCommand, category: commandCategory });
    palette.addItem({ command: showCommand, category: commandCategory });
  }
};

export default plugin;

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette } from "@jupyterlab/apputils";

import { requestAPI } from './handler';

type InfoResponse = {
  base_url: string;
  token: string;
}

/**
 * Initialization data for the jupyterlab_remote_url extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_remote_url:plugin',
  description: 'A JupyterLab extension to help set up a remote connection to the Jupyter server.',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log('JupyterLab extension jupyterlab_remote_url is activated!');

    const command = "jupyterlab-remote-url:copy";

    app.commands.addCommand(command, {
      label: "Copy Jupyter server URL",
      caption: "Copy Jupyter server URL",
      execute: async () => {
        const { base_url, token } = await requestAPI<InfoResponse>("info");
        const url = new URL(base_url, window.location.origin);
        url.searchParams.set("token", token);
        await navigator.clipboard.writeText(url.toString());
      }
    });

    palette.addItem({ command, category: "Remote URL" });
  }
};

export default plugin;

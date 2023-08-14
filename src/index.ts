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
        const response = await requestAPI<InfoResponse>("info");
        console.log(response);
        const url = window.location.href.split("/lab")[0];
        await navigator.clipboard.writeText(`${url}?token=${response.token}`);
      }
    });

    palette.addItem({ command, category: "Remote URL" });
  }
};

export default plugin;

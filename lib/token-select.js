'use babel';

import TokenSelectView from './token-select-view';
import { CompositeDisposable } from 'atom';

export default {

  tokenSelectView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.tokenSelectView = new TokenSelectView(state.tokenSelectViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.tokenSelectView.getElement(),
      visible: false
    });

    this.tokenSelectView.modalPanel = this.modalPanel;

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'token-select:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.tokenSelectView.destroy();
  },

  serialize() {
    return {
      tokenSelectViewState: this.tokenSelectView.serialize()
    };
  },

  toggle() {
      this.modalPanel.show();
      this.tokenSelectView.getColumnInput().value = '';
      this.tokenSelectView.getColumnInput().focus();
  }

};

'use babel';

export default class TokenSelectView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('token-select');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'Enter column to select (first column = 1)';
    message.classList.add('message');
    this.element.appendChild(message);

    // Create column input element
    this.columnInput = document.createElement('input');
    this.columnInput.type = 'text';
    this.columnInput.classList.add('native-key-bindings');
    this.columnInput.classList.add('atom-text-editor');
    this.element.appendChild(this.columnInput);

    var context = this;

    this.columnInput.addEventListener('keyup', function(e) {
        if (e.keyCode == 27) { // escape
            context.modalPanel.hide();
        } else
        if (e.keyCode == 13) { // enter
            let editor
            var target = parseInt(e.target.value);

            if (isNaN(target) || target < 1) {
                e.target.value = '';
                return;
            }

            target--; // change to zero offset

            // get the active editor
            if (editor = atom.workspace.getActiveTextEditor()) {
                var buffer = editor.getBuffer();
                var lines = buffer.getLines();

                // iterate over all lines in the buffer
                for (var i = 0; i<lines.length;i++) {
                    var delimiterPattern = /\s/g;
                    var start = 0;
                    var end = 0;
                    var toks = -1;
                    var inToken = false;

                    // Iterate over characters within the line, counting tokens
                    for (var j=0;j<lines[i].length && toks != target;j++) {
                        if (lines[i][j] == ' ') {
                            if (inToken) {
                                end++;
                                toks++;
                                inToken = false;
                            }
                        } else {
                            if (inToken) {
                                end++;
                            } else {
                                inToken = true;
                                start = j;
                                end = j;
                            }
                        }
                    }

                    // If we reach the final token in the line, it will often not be delimited on the
                    // right hand side, so we need to inc end and tok count here.
                    if (inToken) {
                        end++;
                        toks++;
                    }

                    // If our token count matches the target, add a selection to editor
                    if (toks == target) {
                        editor.addSelectionForBufferRange([[i,start],[i,end]]);
                    }

                }

                context.modalPanel.hide();
                atom.workspace.getActivePane().activate();
            }
        }
    });
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getColumnInput() {
      return this.columnInput;
  }

}


/* http://mathematicalcoffee.blogspot.com.br/2012/09/gnome-shell-extensions-getting-started.html */
/* https://www.abidibo.net/blog/2016/03/02/how-i-developed-my-first-gnome-shell-extension/ */
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Mainloop = imports.mainloop;

/******/
const Lang = imports.lang
const Meta = imports.gi.Meta
const Shell = imports.gi.Shell
const Pango = imports.gi.Pango;
/******/

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();

const DictionaryPanel = Extension.imports.DictionaryPanel;

let dictionaryPanel, timeout = null;

function _getTextAndSearch() {
  log('[EXTENSION_LOG]', '_getTextAndSearch');

  let clipboard = St.Clipboard.get_default();
  clipboard.get_text(St.ClipboardType.PRIMARY, Lang.bind(this, function(clipboard, text) {
    _showDictionary(text);
  }));
}

function _showDictionary(textToSearch) {
  log('[EXTENSION_LOG]', '_showDictionary');
  if (!dictionaryPanel) {
    dictionaryPanel = new DictionaryPanel.DictionaryPanel({
        reactive: true,
        style_class: 'dictionary-panel',
        vertical: 'true'},
      textToSearch);

    Main.layoutManager.addChrome(dictionaryPanel);

    let monitor = Main.layoutManager.primaryMonitor;

    dictionaryPanel.set_position(monitor.x + Math.floor(monitor.width / 2 - dictionaryPanel.width / 2),
    monitor.y + Math.floor(monitor.height / 2 - dictionaryPanel.height / 2));
  }

  dictionaryPanel.opacity = 255;

  enableTimeout();
}

function _hideDictionary() {
  if (dictionaryPanel) {
    Main.uiGroup.remove_actor(dictionaryPanel);
    dictionaryPanel = null;
  }

  disableTimeout();
}

function KeyManager() {
    this._init.apply(this, arguments);
}

KeyManager.prototype =  {
    __proto__: Lang.Class.prototype,

    _init: function() {
        this.grabbers = new Map()

        global.display.connect(
            'accelerator-activated',
            Lang.bind(this, function(display, action, deviceId, timestamp){
                log('Accelerator Activated: [display={}, action={}, deviceId={}, timestamp={}]',
                    display, action, deviceId, timestamp)
                this._onAccelerator(action)
            }))
    },

    listenFor: function(accelerator, callback){
        log('Trying to listen for hot key [accelerator={}]', accelerator)
        let action = global.display.grab_accelerator(accelerator)

        if(action == Meta.KeyBindingAction.NONE) {
            log('Unable to grab accelerator [binding={}]', accelerator)
        } else {
            log('Grabbed accelerator [action={}]', action)
            let name = Meta.external_binding_name_for_action(action)
            log('Received binding name for action [name={}, action={}]',
                name, action)

            log('Requesting WM to allow binding [name={}]', name)
            Main.wm.allowKeybinding(name, Shell.ActionMode.ALL)

            this.grabbers.set(action, {
                name: name,
                accelerator: accelerator,
                callback: callback
            })
        }

    },

    _onAccelerator: function(action) {
        let grabber = this.grabbers.get(action)

        if(grabber) {
            this.grabbers.get(action).callback()
        } else {
            log('No listeners [action={}]', action)
        }
    }
}

let focusCaretTracker;

function enable() {
  log('[EXTENSION_LOG]', 'enable');

  let keyManager = new KeyManager()
  keyManager.listenFor("<ctrl><shift>a", _getTextAndSearch);
}

function enableTimeout() {
  if (!timeout) {
    timeout = Mainloop.timeout_add(2000, function () {
      if (dictionaryPanel)
         log("Testando", dictionaryPanel, dictionaryPanel.mouseOn);
      if (dictionaryPanel && !dictionaryPanel.mouseOn) {
        _hideDictionary();
      }
      return true;
    });
  }
}

function disable() {
  disableTimeout();
}

function disableTimeout() {
  if (timeout) {
    Mainloop.source_remove(timeout);
    timeout = null;
  }
}

function main() {
  log('[EXTENSION_LOG]', 'main');
}

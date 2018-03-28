
/* http://mathematicalcoffee.blogspot.com.br/2012/09/gnome-shell-extensions-getting-started.html */
/* https://www.abidibo.net/blog/2016/03/02/how-i-developed-my-first-gnome-shell-extension/ */
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

/******/
const Lang = imports.lang
const Meta = imports.gi.Meta
const Shell = imports.gi.Shell
const Pango = imports.gi.Pango;
/******/

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();

const CustomLabel = Extension.imports.CustomLabel;

let dictionaryPanel, dictionaryTitle, dictionaryView,
  dictionaryWord;

function _showDictionary() {
  log('[EXTENSION_LOG]', '_showDictionary');
  if (!dictionaryPanel) {
    dictionaryPanel = new St.BoxLayout({ style_class: 'dictionary-panel', vertical: 'true'});


    // dictionaryTitle = new St.Label({ style_class: 'dictionary-title', text: 'Dicionario'});
    // dictionaryTitle.clutter_text.line_wrap = true;
    // dictionaryTitle.clutter_text.line_wrap_mode = Pango.WrapMode.WORD;
    // dictionaryTitle.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
    // dictionaryPanel.add_actor(dictionaryTitle);

    dictionaryTitle = new CustomLabel.CustomLabel({ style_class: 'dictionary-title dictionary-text', text: 'Dicionario'});
    dictionaryPanel.add_actor(dictionaryTitle.actor);

    dictionaryWord = new CustomLabel.CustomLabel({ style_class: 'dictionary-word dictionary-text', text: 'Teste de palavra'});
    dictionaryPanel.add_actor(dictionaryWord.actor);

    dictionaryView = new St.ScrollView({ hscrollbar_visible: 'false' });
    dictionaryPanel.add_actor(dictionaryView);

    Main.uiGroup.add_actor(dictionaryPanel);

    let monitor = Main.layoutManager.primaryMonitor;

    dictionaryPanel.set_position(monitor.x + Math.floor(monitor.width / 2 - dictionaryPanel.width / 2),
    monitor.y + Math.floor(monitor.height / 2 - dictionaryPanel.height / 2));
  }

  dictionaryPanel.opacity = 255;

  Tweener.addTween(dictionaryPanel,
                   { opacity: 0,
                     time: 2,
                     transition: 'easeOutQuad',
                     onComplete: _hideDictionary });
}

function _hideDictionary() {
  Main.uiGroup.remove_actor(dictionaryPanel);
  dictionaryPanel = null;
  dictionaryTitle = null;
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

function enable() {
  log('[EXTENSION_LOG]', 'enable');

  let keyManager = new KeyManager()
  keyManager.listenFor("<ctrl><shift>a", _showDictionary);
}

function disable() {

}

function main() {
  log('[EXTENSION_LOG]', 'main');
}

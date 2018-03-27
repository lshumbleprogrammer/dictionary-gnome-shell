const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

/******/
const Lang = imports.lang
const Meta = imports.gi.Meta
const Shell = imports.gi.Shell
/******/

let text, button;

// function _hideHello() {
//     Main.uiGroup.remove_actor(text);
//     text = null;
// }
//
// function _showHello() {
//     if (!text) {
//         text = new St.Label({ style_class: 'helloworld-label', text: "Hello, world!" });
//         Main.uiGroup.add_actor(text);
//     }
//
//     text.opacity = 255;
//
//     let monitor = Main.layout.primaryMonitor;
//
//     text.set_position(Math.floor(monitor.width / 2 - text.width / 2),
//                       Math.floor(monitor.height / 2 - text.height / 2));
//
//     Tweener.addTween(text,
//                      { opacity: 0,
//                        time: 2,
//                        transition: 'easeOutQuad',
//                        onComplete: _hideHello });
// }
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
  // button = new St.Bin({ style_class: 'panel-button',
  //                       reactive: true,
  //                       can_focus: true,
  //                       x_fill: true,
  //                       y_fill: false,
  //                       track_hover: true });
  // let icon = new St.Icon({ icon_name: 'system-run',
  //                          icon_type: St.IconType.SYMBOLIC,
  //                          style_class: 'system-status-icon' });
  //
  // button.set_child(icon);
  // button.connect('button-press-event', _showHello);
  // Main.panel._rightBox.insert_actor(button, 0);
  let keyManager = new KeyManager()
  keyManager.listenFor("<ctrl><shift>a", function(){
    var d = "Hot keys are working!!!";
    log('[EXTENSION_LOG]', d);
    global.log(d);
    Util.spawn(['echo',d]);
  });


  // global.display.connect("key-press-event", (widget, event, user_data) => {
  //   let [success, keyval] = event.get_keyval(); // integer
  //   let keyname = Gdk.keyval_name(keyval); // string keyname
  //
  //   console.log("Tecla pressionada " + keyname);
  //   if (keyname === "Control_L") {
  //     // Dialog code or eg. this.keys_array.push("<Ctrl>");
  //   }
  // });
}

function disable() {

}

function main() {
  log('[EXTENSION_LOG]', 'main');
}

const St = imports.gi.St;
const Pango = imports.gi.Pango;
const Lang = imports.lang;

const CustomLabel = new Lang.Class({
  Name: "CustomLabel",
  Extends: St.BoxLayout,

  _init: function (params) {
    this.parent();

    let newLabel = new St.Label(params);

    newLabel.clutter_text.line_wrap = true;
    newLabel.clutter_text.line_wrap_mode = Pango.WrapMode.WORD;
    newLabel.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;

    this.add_actor(newLabel);
  }
});

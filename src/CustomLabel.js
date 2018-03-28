const St = imports.gi.St;
const Pango = imports.gi.Pango;
const Lang = imports.lang;

const CustomLabel = new Lang.Class({
  Name: "CustomLabel",

  _init: function (params) {
    this.actor = new St.Label(params);
    this.actor.clutter_text.line_wrap = true;
    this.actor.clutter_text.line_wrap_mode = Pango.WrapMode.WORD;
    this.actor.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
  }
});

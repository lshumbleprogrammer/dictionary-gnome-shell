const St = imports.gi.St;
const Lang = imports.lang;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const CustomLabel = Extension.imports.CustomLabel;

const DictionaryPanel = new Lang.Class({
  Name: "DictionaryPanel",
  Extends: St.BoxLayout,

  _init: function (params, textToSearch) {
    this.parent(params);

    this.dictionaryTitle = new CustomLabel.CustomLabel({
      style_class: 'dictionary-title dictionary-text',
      text: 'Dicionario'
    });
    this.add_actor(this.dictionaryTitle);

    this.dictionaryWord = new CustomLabel.CustomLabel({
      style_class: 'dictionary-word dictionary-text',
      text: textToSearch
    });
    this.add_actor(this.dictionaryWord);

    this.dictionaryView = new St.ScrollView({
      style_class: 'vfade',
      hscrollbar_policy: Gtk.PolicyType.NEVER,
      vscrollbar_policy: Gtk.PolicyType.ALWAYS
    });
    this.add_actor(this.dictionaryView);

    this.dictionaryMeaning = new CustomLabel.CustomLabel({
      style_class: 'dictionary-meaning dictionary-text',
      text: 'Teste de palavra ieao iiea iea iaeo ieaoieamimdao aou daumd oumd oum dos oumdou rsdil risdiemadm dmeadm ilteao m,/hk/pwiea q/,.h miea ilw çklw ieaoieak /,.kh/t,.w mei kaovekao eaotjkb çu uitasieauie eadm iesadmo iearo sdmi rs  rsdm r esdm resdmao rsedam esdramo risdmeao sdema risedmao sidema o Teste de palavra ieao iiea iea iaeo ieaoieamimdao aou daumd oumd oum dos oumdou rsdil risdiemadm dmeadm ilteao m,/hk/pwiea q/,.h miea ilw çklw ieaoieak /,.kh/t,.w mei kaovekao eaotjkb çu uitasieauie eadm iesadmo iearo sdmi rs  rsdm r esdm resdmao rsedam esdramo risdmeao sdema risedmao sidema o'
    });
    this.dictionaryView.add_actor(this.dictionaryMeaning);

    let self = this;
    this.connect("enter-event", function (obj) {
      self.mouseOn = true;
    });
    this.connect("leave-event", function (obj) {
      self.mouseOn = false;
    });
    this.mouseOn = true;
  },

  show: function (textToSearch) {

  }


});

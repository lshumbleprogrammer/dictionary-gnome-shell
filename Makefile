PACKAGE_NAME=dictionary@lshumbleprogrammer.com

localinstall:
	$(MAKE) install_pkg FOLDER_TO_INSTALL=~/.local/share/gnome-shell/extensions/$(PACKAGE_NAME)

worldinstall:
	$(MAKE) install_pkg FOLDER_TO_INSTALL=/usr/share/gnome-shell/extensions/$(PACKAGE_NAME)

cleanall:
	rm -Rf ~/.local/share/gnome-shell/extensions/$(PACKAGE_NAME)
	rm -Rf /usr/share/gnome-shell/extensions/$(PACKAGE_NAME)

install_pkg:
	mkdir $(FOLDER_TO_INSTALL)

	cp src/* $(FOLDER_TO_INSTALL)/.

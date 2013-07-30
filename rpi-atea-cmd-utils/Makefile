PROJECT=ikastrola-atea-cmd-utils
VERSION=0.0.1

PACKAGE=$(PROJECT)-$(VERSION)

CC=cc
CFLAGS=

LSFLAGS=-L/usr/local/lib
LDFLAGS=-lwiringPi

ARCH:=$(shell uname -s)-$(shell uname -m)

ifndef DESTDIR
DESTDIR=/usr/local
endif


all: ireki-atea ikastrola-wiegand
.PHONY: all

ireki-atea:
	$(CC) -o ireki-atea ireki-atea.c $(LSFLAGS) $(LDFLAGS) $(CFLAGS)
ikastrola-wiegand:
	$(CC) -o ikastrola-wiegand ikastrola-wiegand.c $(LSFLAGS) $(LDFLAGS) $(CFLAGS)

install: install-files

.PHONY: install

install-files: all
	mkdir -p $(DESTDIR)/bin/
	install ireki-atea $(DESTDIR)/bin/
	install ikastrola-wiegand $(DESTDIR)/bin/
.PHONY: install-files

uninstall:
	rm -vf $(DESTDIR)/bin/ireki-atea $(DESTDIR)/bin/ikastrola-wiegand

.PHONY: uninstall

clean :
	rm -f ikastrola-wiegand
	rm -f ireki-atea
.PHONY: clean

again: clean all
.PHONY: again

 

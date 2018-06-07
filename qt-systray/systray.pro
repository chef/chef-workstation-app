HEADERS       = \
    traywindow.h

SOURCES       = main.cpp \
    traywindow.cpp
RESOURCES     = systray.qrc

QT += widgets network
requires(qtConfig(combobox))

# install
target.path = $$[QT_INSTALL_EXAMPLES]/widgets/desktop/systray
INSTALLS += target

FORMS += traywindow.ui

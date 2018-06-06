HEADERS       = window.h \
    traywindow.h
SOURCES       = main.cpp \
                window.cpp \
    traywindow.cpp
RESOURCES     = systray.qrc

QT += widgets
requires(qtConfig(combobox))

# install
target.path = $$[QT_INSTALL_EXAMPLES]/widgets/desktop/systray
INSTALLS += target

FORMS += \
    traywindow.ui

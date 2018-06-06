/********************************************************************************
** Form generated from reading UI file 'traywindow.ui'
**
** Created by: Qt User Interface Compiler version 5.11.0
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_TRAYWINDOW_H
#define UI_TRAYWINDOW_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QDialog>
#include <QtWidgets/QDialogButtonBox>

QT_BEGIN_NAMESPACE

class Ui_TrayWindow
{
public:
    QDialogButtonBox *buttonBox;

    void setupUi(QDialog *TrayWindow)
    {
        if (TrayWindow->objectName().isEmpty())
            TrayWindow->setObjectName(QStringLiteral("TrayWindow"));
        TrayWindow->resize(400, 346);
        buttonBox = new QDialogButtonBox(TrayWindow);
        buttonBox->setObjectName(QStringLiteral("buttonBox"));
        buttonBox->setGeometry(QRect(30, 240, 341, 32));
        buttonBox->setOrientation(Qt::Horizontal);
        buttonBox->setStandardButtons(QDialogButtonBox::Cancel|QDialogButtonBox::Ok);

        retranslateUi(TrayWindow);
        QObject::connect(buttonBox, SIGNAL(accepted()), TrayWindow, SLOT(accept()));
        QObject::connect(buttonBox, SIGNAL(rejected()), TrayWindow, SLOT(reject()));

        QMetaObject::connectSlotsByName(TrayWindow);
    } // setupUi

    void retranslateUi(QDialog *TrayWindow)
    {
        TrayWindow->setWindowTitle(QApplication::translate("TrayWindow", "Dialog", nullptr));
    } // retranslateUi

};

namespace Ui {
    class TrayWindow: public Ui_TrayWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_TRAYWINDOW_H

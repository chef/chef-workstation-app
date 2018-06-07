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
#include <QtGui/QIcon>
#include <QtWidgets/QApplication>
#include <QtWidgets/QDialog>
#include <QtWidgets/QDialogButtonBox>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_TrayWindow
{
public:
    QDialogButtonBox *buttonBox;
    QWidget *layoutWidget;
    QGridLayout *gridLayout;
    QLineEdit *lineEditCurrentVersion;
    QLabel *label_2;
    QLineEdit *lineEditStableVersion;
    QLabel *label;

    void setupUi(QDialog *TrayWindow)
    {
        if (TrayWindow->objectName().isEmpty())
            TrayWindow->setObjectName(QStringLiteral("TrayWindow"));
        TrayWindow->resize(400, 163);
        QIcon icon;
        icon.addFile(QStringLiteral("images/cws.png"), QSize(), QIcon::Normal, QIcon::Off);
        TrayWindow->setWindowIcon(icon);
        buttonBox = new QDialogButtonBox(TrayWindow);
        buttonBox->setObjectName(QStringLiteral("buttonBox"));
        buttonBox->setGeometry(QRect(20, 120, 341, 32));
        buttonBox->setOrientation(Qt::Horizontal);
        buttonBox->setStandardButtons(QDialogButtonBox::Close);
        buttonBox->setCenterButtons(true);
        layoutWidget = new QWidget(TrayWindow);
        layoutWidget->setObjectName(QStringLiteral("layoutWidget"));
        layoutWidget->setGeometry(QRect(60, 10, 255, 81));
        gridLayout = new QGridLayout(layoutWidget);
        gridLayout->setObjectName(QStringLiteral("gridLayout"));
        gridLayout->setContentsMargins(0, 0, 0, 0);
        lineEditCurrentVersion = new QLineEdit(layoutWidget);
        lineEditCurrentVersion->setObjectName(QStringLiteral("lineEditCurrentVersion"));
        lineEditCurrentVersion->setEnabled(true);
        lineEditCurrentVersion->setReadOnly(true);

        gridLayout->addWidget(lineEditCurrentVersion, 0, 1, 1, 1);

        label_2 = new QLabel(layoutWidget);
        label_2->setObjectName(QStringLiteral("label_2"));
        label_2->setTextFormat(Qt::AutoText);

        gridLayout->addWidget(label_2, 1, 0, 1, 1);

        lineEditStableVersion = new QLineEdit(layoutWidget);
        lineEditStableVersion->setObjectName(QStringLiteral("lineEditStableVersion"));
        lineEditStableVersion->setEnabled(true);
        lineEditStableVersion->setReadOnly(true);

        gridLayout->addWidget(lineEditStableVersion, 1, 1, 1, 1);

        label = new QLabel(layoutWidget);
        label->setObjectName(QStringLiteral("label"));
        label->setTextFormat(Qt::AutoText);

        gridLayout->addWidget(label, 0, 0, 1, 1);


        retranslateUi(TrayWindow);
        QObject::connect(buttonBox, SIGNAL(accepted()), TrayWindow, SLOT(accept()));
        QObject::connect(buttonBox, SIGNAL(rejected()), TrayWindow, SLOT(reject()));

        QMetaObject::connectSlotsByName(TrayWindow);
    } // setupUi

    void retranslateUi(QDialog *TrayWindow)
    {
        TrayWindow->setWindowTitle(QApplication::translate("TrayWindow", "Chef Workstation", nullptr));
        label_2->setText(QApplication::translate("TrayWindow", "Latest Current:", nullptr));
        lineEditStableVersion->setText(QString());
        label->setText(QApplication::translate("TrayWindow", "Latest Stable:", nullptr));
    } // retranslateUi

};

namespace Ui {
    class TrayWindow: public Ui_TrayWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_TRAYWINDOW_H

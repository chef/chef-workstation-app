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
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QDialog>
#include <QtWidgets/QDialogButtonBox>
#include <QtWidgets/QFrame>
#include <QtWidgets/QLabel>
#include <QtWidgets/QTabWidget>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_TrayWindow
{
public:
    QDialogButtonBox *buttonBox;
    QTabWidget *tabWidget;
    QWidget *preferencesTab;
    QFrame *line;
    QLabel *label_4;
    QLabel *labelActiveVersion;
    QLabel *label_7;
    QLabel *labelAvailableVersion;
    QWidget *widget;
    QVBoxLayout *verticalLayout_2;
    QLabel *label;
    QLabel *label_2;
    QLabel *label_5;
    QLabel *label_6;
    QWidget *widget1;
    QVBoxLayout *verticalLayout_3;
    QCheckBox *checkBoxEnableAutoStart;
    QCheckBox *checkBoxUpdateChecking;
    QCheckBox *checkBoxEnableTelemetry;
    QWidget *notificationsTab;
    QLabel *label_3;
    QWidget *widget2;
    QVBoxLayout *verticalLayout;
    QCheckBox *checkBoxNotifyUpdates;
    QCheckBox *checkBox;

    void setupUi(QDialog *TrayWindow)
    {
        if (TrayWindow->objectName().isEmpty())
            TrayWindow->setObjectName(QStringLiteral("TrayWindow"));
        TrayWindow->resize(502, 444);
        TrayWindow->setFocusPolicy(Qt::NoFocus);
        QIcon icon;
        icon.addFile(QStringLiteral("images/cws.png"), QSize(), QIcon::Normal, QIcon::Off);
        TrayWindow->setWindowIcon(icon);
        buttonBox = new QDialogButtonBox(TrayWindow);
        buttonBox->setObjectName(QStringLiteral("buttonBox"));
        buttonBox->setGeometry(QRect(80, 400, 341, 32));
        buttonBox->setOrientation(Qt::Horizontal);
        buttonBox->setStandardButtons(QDialogButtonBox::Close);
        buttonBox->setCenterButtons(true);
        tabWidget = new QTabWidget(TrayWindow);
        tabWidget->setObjectName(QStringLiteral("tabWidget"));
        tabWidget->setGeometry(QRect(10, 10, 481, 381));
        preferencesTab = new QWidget();
        preferencesTab->setObjectName(QStringLiteral("preferencesTab"));
        line = new QFrame(preferencesTab);
        line->setObjectName(QStringLiteral("line"));
        line->setGeometry(QRect(0, 200, 451, 20));
        line->setFrameShape(QFrame::HLine);
        line->setFrameShadow(QFrame::Sunken);
        label_4 = new QLabel(preferencesTab);
        label_4->setObjectName(QStringLiteral("label_4"));
        label_4->setGeometry(QRect(10, 220, 191, 17));
        label_4->setTextFormat(Qt::RichText);
        labelActiveVersion = new QLabel(preferencesTab);
        labelActiveVersion->setObjectName(QStringLiteral("labelActiveVersion"));
        labelActiveVersion->setGeometry(QRect(10, 250, 381, 17));
        label_7 = new QLabel(preferencesTab);
        label_7->setObjectName(QStringLiteral("label_7"));
        label_7->setGeometry(QRect(20, 270, 401, 30));
        label_7->setOpenExternalLinks(false);
        labelAvailableVersion = new QLabel(preferencesTab);
        labelAvailableVersion->setObjectName(QStringLiteral("labelAvailableVersion"));
        labelAvailableVersion->setGeometry(QRect(10, 310, 381, 17));
        widget = new QWidget(preferencesTab);
        widget->setObjectName(QStringLiteral("widget"));
        widget->setGeometry(QRect(50, 110, 359, 88));
        verticalLayout_2 = new QVBoxLayout(widget);
        verticalLayout_2->setObjectName(QStringLiteral("verticalLayout_2"));
        verticalLayout_2->setContentsMargins(0, 0, 0, 0);
        label = new QLabel(widget);
        label->setObjectName(QStringLiteral("label"));

        verticalLayout_2->addWidget(label);

        label_2 = new QLabel(widget);
        label_2->setObjectName(QStringLiteral("label_2"));

        verticalLayout_2->addWidget(label_2);

        label_5 = new QLabel(widget);
        label_5->setObjectName(QStringLiteral("label_5"));

        verticalLayout_2->addWidget(label_5);

        label_6 = new QLabel(widget);
        label_6->setObjectName(QStringLiteral("label_6"));

        verticalLayout_2->addWidget(label_6);

        widget1 = new QWidget(preferencesTab);
        widget1->setObjectName(QStringLiteral("widget1"));
        widget1->setGeometry(QRect(10, 20, 391, 83));
        verticalLayout_3 = new QVBoxLayout(widget1);
        verticalLayout_3->setObjectName(QStringLiteral("verticalLayout_3"));
        verticalLayout_3->setContentsMargins(0, 0, 0, 0);
        checkBoxEnableAutoStart = new QCheckBox(widget1);
        checkBoxEnableAutoStart->setObjectName(QStringLiteral("checkBoxEnableAutoStart"));
        checkBoxEnableAutoStart->setChecked(true);

        verticalLayout_3->addWidget(checkBoxEnableAutoStart);

        checkBoxUpdateChecking = new QCheckBox(widget1);
        checkBoxUpdateChecking->setObjectName(QStringLiteral("checkBoxUpdateChecking"));
        checkBoxUpdateChecking->setChecked(true);

        verticalLayout_3->addWidget(checkBoxUpdateChecking);

        checkBoxEnableTelemetry = new QCheckBox(widget1);
        checkBoxEnableTelemetry->setObjectName(QStringLiteral("checkBoxEnableTelemetry"));
        checkBoxEnableTelemetry->setChecked(true);

        verticalLayout_3->addWidget(checkBoxEnableTelemetry);

        tabWidget->addTab(preferencesTab, QString());
        notificationsTab = new QWidget();
        notificationsTab->setObjectName(QStringLiteral("notificationsTab"));
        label_3 = new QLabel(notificationsTab);
        label_3->setObjectName(QStringLiteral("label_3"));
        label_3->setGeometry(QRect(20, 30, 271, 17));
        widget2 = new QWidget(notificationsTab);
        widget2->setObjectName(QStringLiteral("widget2"));
        widget2->setGeometry(QRect(30, 60, 271, 54));
        verticalLayout = new QVBoxLayout(widget2);
        verticalLayout->setObjectName(QStringLiteral("verticalLayout"));
        verticalLayout->setContentsMargins(0, 0, 0, 0);
        checkBoxNotifyUpdates = new QCheckBox(widget2);
        checkBoxNotifyUpdates->setObjectName(QStringLiteral("checkBoxNotifyUpdates"));

        verticalLayout->addWidget(checkBoxNotifyUpdates);

        checkBox = new QCheckBox(widget2);
        checkBox->setObjectName(QStringLiteral("checkBox"));

        verticalLayout->addWidget(checkBox);

        tabWidget->addTab(notificationsTab, QString());

        retranslateUi(TrayWindow);
        QObject::connect(buttonBox, SIGNAL(accepted()), TrayWindow, SLOT(accept()));
        QObject::connect(buttonBox, SIGNAL(rejected()), TrayWindow, SLOT(reject()));

        tabWidget->setCurrentIndex(0);


        QMetaObject::connectSlotsByName(TrayWindow);
    } // setupUi

    void retranslateUi(QDialog *TrayWindow)
    {
        TrayWindow->setWindowTitle(QApplication::translate("TrayWindow", "Chef Workstation", nullptr));
#ifndef QT_NO_STATUSTIP
        tabWidget->setStatusTip(QApplication::translate("TrayWindow", "Configure which notifications Workstatoin provides.", nullptr));
#endif // QT_NO_STATUSTIP
        label_4->setText(QApplication::translate("TrayWindow", "<html><head/><body><p><span style=\" font-weight:600;\">About Chef Workstation</span></p></body></html>", nullptr));
        labelActiveVersion->setText(QApplication::translate("TrayWindow", "Version 0.1.120 from channel 'stable'", nullptr));
        label_7->setText(QApplication::translate("TrayWindow", "<html><head/><body><p><a href=\"localhost://switch\"><span style=\" text-decoration: underline; color:#0000ff;\">Switch to channel 'current' </span></a><img src=\":/images/heart.png\" width=\"16\" height=\"16\"/></p></body></html>", nullptr));
        labelAvailableVersion->setText(QApplication::translate("TrayWindow", "The latest available version is <<VERSION>>", nullptr));
        label->setText(QApplication::translate("TrayWindow", "- Chef commands (commands only, no arguments)", nullptr));
        label_2->setText(QApplication::translate("TrayWindow", "- Connection method (WinRM or SSH)", nullptr));
        label_5->setText(QApplication::translate("TrayWindow", "- Operating system and version", nullptr));
        label_6->setText(QApplication::translate("TrayWindow", "- Workstation operating system and version", nullptr));
        checkBoxEnableAutoStart->setText(QApplication::translate("TrayWindow", "Start Chef Workstation on system startup", nullptr));
        checkBoxUpdateChecking->setText(QApplication::translate("TrayWindow", "Automatically check for updates", nullptr));
        checkBoxEnableTelemetry->setText(QApplication::translate("TrayWindow", "Share my usage data with Chef", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(preferencesTab), QApplication::translate("TrayWindow", "Preferences", nullptr));
        label_3->setText(QApplication::translate("TrayWindow", "Notify me about...", nullptr));
        checkBoxNotifyUpdates->setText(QApplication::translate("TrayWindow", "Software updates", nullptr));
        checkBox->setText(QApplication::translate("TrayWindow", "Failures from Automate client runs", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(notificationsTab), QApplication::translate("TrayWindow", "Notifications", nullptr));
    } // retranslateUi

};

namespace Ui {
    class TrayWindow: public Ui_TrayWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_TRAYWINDOW_H

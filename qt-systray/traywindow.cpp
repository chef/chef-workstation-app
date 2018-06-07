#include "traywindow.h"
#include "ui_traywindow.h"
#include <QAction>
#include <QCoreApplication>
#include <QCloseEvent>
#include <QMessageBox>
#include <QtNetwork/QNetworkAccessManager>
#include <QtNetwork/QNetworkReply>

#include <QMenu>
TrayWindow::TrayWindow(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::TrayWindow),
    qnam(new QNetworkAccessManager(this))

{
    ui->setupUi(this);
    cwsIcon = QIcon(":/images/cws.png");
    createActions();
    createTrayIcon();
    timer = startTimer(3000);


    startVersionRequests();
//    ui->lineEditCurrentVersion
//            ui->lineEditStableVersion

    //  connect(trayIcon, &QSystemTrayIcon::messageClicked, this, &TrayWindow::messageClicked);
    connect(trayIcon, &QSystemTrayIcon::activated, this, &TrayWindow::iconActivated);
    trayIcon->show();
 }

TrayWindow::~TrayWindow()
{
    killTimer(timer);
    delete ui;
}

void TrayWindow::timerEvent(QTimerEvent * event)
{
    // Don't show recurring popup if the main window is visible. We should also
    // do this if the pop-up menu is shown.
    if (!isVisible()) {
        showBubbleMessage(tr("An event has occurred.\n\nDouble-click the icon to toggle event display."));

    }

}

void TrayWindow::showBubbleMessage(const QString & msg) {
    trayIcon->showMessage(tr("Chef Workstation"),
                          msg,
                          cwsIcon, 5000);

}

void TrayWindow::on_buttonBox_accepted()
{
    setVisible(false);
}
void TrayWindow::setVisible(bool visible)
{
    openAction->setEnabled(!visible);
    QDialog::setVisible(visible);
}
void TrayWindow::createActions()
{
    openAction = new QAction(tr("&Open"), this);
    connect(openAction, &QAction::triggered, this, &QWidget::showNormal);

    quitAction = new QAction(tr("&Quit"), this);
    connect(quitAction, &QAction::triggered, qApp, &QCoreApplication::quit);
}

void TrayWindow::createTrayIcon()
{
    trayIconMenu = new QMenu(this);
    trayIconMenu->addAction(openAction);
    trayIconMenu->addSeparator();
    trayIconMenu->addAction(quitAction);
    trayIcon = new QSystemTrayIcon(this);
    trayIcon->setIcon(cwsIcon);
    trayIcon->setContextMenu(trayIconMenu);
    trayIcon->setToolTip(tr("Chef Workstation"));
}

QString TrayWindow::extractVersion(const QString & data)
{
    QStringList r =  QString(data).split("\n").last().split(" ");
    QString versionLine = r.last();

    return versionLine.split(" ").last();
}
void TrayWindow::httpStableFinished()
{
    ui->lineEditStableVersion->setText(extractVersion(replyStable->readAll()));

}

void TrayWindow::httpCurrentFinished()
{

    ui->lineEditCurrentVersion->setText(extractVersion(replyCurrent->readAll()));
}
void TrayWindow::startVersionRequests()
{
    QUrl stableUrl =  QUrl("https://omnitruck.chef.io/stable/chef-workstation/metadata?p=ubuntu&pv=16.04&m=x86_64&v=latest&prerelease=false&nightlies=false");
    QUrl currentUrl =  QUrl("https://omnitruck.chef.io/current/chef-workstation/metadata?p=ubuntu&pv=16.04&m=x86_64&v=latest&prerelease=false&nightlies=false");


    replyCurrent = qnam->get(QNetworkRequest(currentUrl));
    replyStable = qnam->get(QNetworkRequest(stableUrl));
    connect(replyCurrent, &QNetworkReply::finished, this, &TrayWindow::httpCurrentFinished);
    connect(replyStable, &QNetworkReply::finished, this, &TrayWindow::httpStableFinished);


}
void TrayWindow::on_TrayWindow_rejected()
{
    setVisible(false);
}

void TrayWindow::iconActivated(QSystemTrayIcon::ActivationReason reason)
{
        switch (reason) {
        case QSystemTrayIcon::Trigger:
            setVisible(true);
            break;
//        case QSystemTrayIcon::DoubleClick:
//            iconComboBox->setCurrentIndex((iconComboBox->currentIndex() + 1) % iconComboBox->count());
//            break;
//        case QSystemTrayIcon::MiddleClick:
//            showMessage();
//            break;
        default:
            ;
        }

    setVisible(false);
}


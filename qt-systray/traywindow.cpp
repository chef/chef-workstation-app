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
 //   timer = startTimer(3000);
    startVersionRequests();
    connect(trayIcon, &QSystemTrayIcon::activated, this, &TrayWindow::iconActivated);
    trayIcon->show();
 }

TrayWindow::~TrayWindow()
{
 //   killTimer(timer);
    delete ui;
}

void TrayWindow::timerEvent(QTimerEvent * event)
{
    showBubbleMessage(tr("An event has occurred.\n\nDouble-click the icon to toggle event display."));
}

void TrayWindow::showBubbleMessage(const QString & msg) {
    // Notifications pause when the app is visible, or when the menu is displayed
    // to prevent popping something up under the mouse.
    if (isVisible() || trayIconMenu->isVisible()) {
        return;
    }
    trayIcon->showMessage(tr("Chef Workstation"), msg, cwsIcon);
}

void TrayWindow::on_buttonBox_accepted()
{
    setVisible(false);
}

void TrayWindow::setVisible(bool visible)
{
    preferencesAction->setEnabled(!visible);
    QDialog::setVisible(visible);
}

void TrayWindow::onUpdateMenu()
{
    showBubbleMessage(tr("This will soon mock out checking for updates"));
}

void TrayWindow::onLoginToAutomate()
{
    showBubbleMessage(tr("This will launch your browser to connect Workstation with Automate and unlock All The Potential"));
}

void TrayWindow::createActions()
{
    updateAction = new QAction(tr("Check for &Updates..."), this);
    connect(updateAction, &QAction::triggered, this, &TrayWindow::onUpdateMenu);

    preferencesAction  = new QAction(tr("&Preferences..."), this);
    connect(preferencesAction, &QAction::triggered, this, &QWidget::showNormal);

    loginAction  = new QAction(tr("&Log in to Chef Automate"), this);
    connect(preferencesAction, &QAction::triggered, this, &TrayWindow::onLoginToAutomate);

    quitAction = new QAction(tr("&Quit"), this);
    connect(quitAction, &QAction::triggered, qApp, &QCoreApplication::quit);
}

void TrayWindow::createTrayIcon()
{
    trayIconMenu = new QMenu(this);
    trayIconMenu->addAction(updateAction);
    trayIconMenu->addSeparator();
    trayIconMenu->addAction(loginAction);
    trayIconMenu->addSeparator();
    trayIconMenu->addAction(preferencesAction);
    trayIconMenu->addAction(quitAction);

    trayIcon = new QSystemTrayIcon(this);
    trayIcon->setIcon(cwsIcon);
    trayIcon->setContextMenu(trayIconMenu);
    trayIcon->setToolTip(tr("Chef Workstation"));
}

QString TrayWindow::extractVersion(const QString & data)
{
    QStringList r =  QString(data).split("\n").last().split(" ") ;
    QString versionLine = r.last();

    return versionLine.split("\t").last();
}
void TrayWindow::httpStableFinished()
{
    QString version = extractVersion(replyStable->readAll());
    ui->labelAvailableVersion->setText(tr("The latest available version is ") + version);

}

void TrayWindow::httpCurrentFinished()
{

  //  ui->lineEditCurrentVersion->setText(extractVersion(replyCurrent->readAll()));
}
void TrayWindow::startVersionRequests()
{
     QUrl stableUrl =  QUrl("https://omnitruck.chef.io/stable/chef-workstation/metadata?p=ubuntu&pv=16.04&m=x86_64&v=latest&prerelease=false&nightlies=false");
    replyStable = qnam->get(QNetworkRequest(stableUrl));
    connect(replyStable, &QNetworkReply::finished, this, &TrayWindow::httpStableFinished);
    //QUrl currentUrl =  QUrl("https://omnitruck.chef.io/current/chef-workstation/metadata?p=ubuntu&pv=16.04&m=x86_64&v=latest&prerelease=false&nightlies=false");
    //replyCurrent = qnam->get(QNetworkRequest(currentUrl));
   // connect(replyCurrent, &QNetworkReply::finished, this, &TrayWindow::httpCurrentFinished);


}
void TrayWindow::on_TrayWindow_rejected()
{
    setVisible(false);
}

void TrayWindow::iconActivated(QSystemTrayIcon::ActivationReason reason)
{
        switch (reason) {
          case QSystemTrayIcon::Trigger:
            // This doesn't shojw it at icone location, need to dig a little: trayIconMenu->show();
            break;
//            setVisible(true);
//            break;
        case QSystemTrayIcon::DoubleClick:
            setVisible(true);
//            iconComboBox->setCurrentIndex((iconComboBox->currentIndex() + 1) % iconComboBox->count());
//            break;
//        case QSystemTrayIcon::MiddleClick:
//            showMessage();
//            break;
        default:
            ;
        }

    //setVisible(false);
}


// TODO - rename label_7
void TrayWindow::on_label_7_linkActivated(const QString &link)
{
    // triggers when the switch-channel link is activated.
    showBubbleMessage(tr("If this were implemented, it would switch your channel to 'current'"));

}

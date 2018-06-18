#ifndef TRAYWINDOW_H
#define TRAYWINDOW_H

#include <QSystemTrayIcon>
#include <QtNetwork/QNetworkAccessManager>

#ifndef QT_NO_SYSTEMTRAYICON

#include <QDialog>

QT_BEGIN_NAMESPACE
class QAction;
class QMenu;
class QLineEdit;
class QNetworkReply;

QT_END_NAMESPACE

namespace Ui {
class TrayWindow;
}

class TrayWindow : public QDialog
{
    Q_OBJECT

public:
    explicit TrayWindow(QWidget *parent = 0);
    ~TrayWindow();

protected:
    void timerEvent(QTimerEvent *event);
    void setVisible(bool visible);

private slots:
    void on_buttonBox_accepted();
    void on_TrayWindow_rejected();
    void httpCurrentFinished();
    void httpStableFinished();
    void onUpdateMenu();
    void onLoginToAutomate();

  //  void setIcon(int index);
    void iconActivated(QSystemTrayIcon::ActivationReason _reason);
  //  void showMessage();
   // void messageClicked();

    void on_label_7_linkActivated(const QString &link);

private:
    Ui::TrayWindow *ui;
    QString extractVersion(const QString &);
    void startVersionRequests();
    void startRequest(const QUrl &requestedUrl);
    void createActions();
    void createTrayIcon();
    void setupTimer();
    void showBubbleMessage(const QString & msg);

    QAction *quitAction;
    QAction *updateAction;
    QAction *loginAction;
    QAction *preferencesAction;

    int timer;
    QIcon cwsIcon;

    QNetworkReply * replyStable;
    QNetworkReply * replyCurrent;
    QSystemTrayIcon *trayIcon;
    QMenu *trayIconMenu;
     QNetworkAccessManager * qnam;

  };

//! [0]

#endif // QT_NO_SYSTEMTRAYICON
#endif // TRAYWINDOW_H

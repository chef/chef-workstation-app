#ifndef TRAYWINDOW_H
#define TRAYWINDOW_H

#include <QDialog>

namespace Ui {
class TrayWindow;
}

class TrayWindow : public QDialog
{
    Q_OBJECT

public:
    explicit TrayWindow(QWidget *parent = 0);
    ~TrayWindow();

private:
    Ui::TrayWindow *ui;
};

#endif // TRAYWINDOW_H

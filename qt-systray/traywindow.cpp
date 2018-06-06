#include "traywindow.h"
#include "ui_traywindow.h"

TrayWindow::TrayWindow(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::TrayWindow)
{
    ui->setupUi(this);
}

TrayWindow::~TrayWindow()
{
    delete ui;
}

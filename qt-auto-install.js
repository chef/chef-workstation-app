function Controller() {
  installer.autoRejectMessageBoxes();
  installer.installationFinished.connect(function() {
      gui.clickButton(buttons.NextButton);
  })
}

Controller.prototype.WelcomePageCallback = function() {
  gui.clickButton(buttons.NextButton,3000);
}

Controller.prototype.CredentialsPageCallback = function() {
  gui.clickButton(buttons.NextButton);
}

Controller.prototype.IntroductionPageCallback = function() {
  gui.clickButton(buttons.NextButton);
}

Controller.prototype.TargetDirectoryPageCallback = function()
{
  gui.currentPageWidget().TargetDirectoryLineEdit.setText(installer.value("HomeDir") + "/Qt");
  gui.clickButton(buttons.NextButton);
}

Controller.prototype.ComponentSelectionPageCallback = function() {
  var widget = gui.currentPageWidget();

  widget.deselectAll();
  widget.selectComponent("qt.tools.ifw.30");
  widget.selectComponent("qt.tools.maintenance");
  widget.selectComponent("qt.tools.qtcreator");
  widget.selectComponent("qt.tools.qtcreatorcdbext");
  // Prebuilt Qt components for platforms & compilers
  // It's OK that they're all here. Selecting things that don't appear in a
  // particular platform's available components does not cause an error in
  // the installer.
  widget.selectComponent("qt.qt5.5111.clang64"); // macOS
  widget.selectComponent("qt.qt5.5111.gcc_64"); // Linux
  widget.selectComponent("qt.qt5.5111.win64_msvc2017_64"); // Windows

  gui.clickButton(buttons.NextButton);
}

Controller.prototype.LicenseAgreementPageCallback = function() {
  gui.currentPageWidget().AcceptLicenseRadioButton.setChecked(true);
  gui.clickButton(buttons.NextButton);
}

Controller.prototype.StartMenuDirectoryPageCallback = function() {
  gui.clickButton(buttons.NextButton);
}

Controller.prototype.ReadyForInstallationPageCallback = function()
{
  gui.clickButton(buttons.NextButton);
}

Controller.prototype.FinishedPageCallback = function() {
var checkBoxForm = gui.currentPageWidget().LaunchQtCreatorCheckBoxForm
if (checkBoxForm && checkBoxForm.launchQtCreatorCheckBox) {
  checkBoxForm.launchQtCreatorCheckBox.checked = false;
}
  gui.clickButton(buttons.FinishButton);
}

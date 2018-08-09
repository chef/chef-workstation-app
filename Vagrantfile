Vagrant.configure("2") do |config|
  config.ssh.forward_agent = true

  config.vm.define "ubuntu" do |node|
    node.vm.box = "ubuntu/bionic64"

    # Install xfce and virtualbox additions for GUI.
    # You must reboot this VM after provisioning to get windowed environment.
    node.vm.provision "shell", inline: "sudo apt-get update"
    node.vm.provision "shell", inline: "sudo apt-get install -y xfce4 virtualbox-guest-dkms virtualbox-guest-utils virtualbox-guest-x11"

    node.vm.provider "virtualbox" do |v|
      v.gui = true
      v.memory = 512
      v.cpus = 1
    end
  end

  config.vm.define "windows" do |node|
    node.vm.box = "chef/windows-server-2016-standard"
    node.vm.communicator = "winrm"

    node.vm.provision "shell", inline: <<~DEV_SETUP
      New-PSDrive -Name "V" -PSProvider FileSystem -Root "\\\\vboxsrv\\vagrant" -Persist
      [System.Net.WebRequest]::DefaultWebProxy.Credentials = [System.Net.CredentialCache]::DefaultCredentials; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
      choco install -y visualstudio2017community --package-parameters "
        --add Microsoft.VisualStudio.Workload.NativeDesktop
        --add Microsoft.VisualStudio.Component.VC.CoreIde
        --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64
        --add Microsoft.VisualStudio.Component.VC.CMake.Project
        --add Microsoft.VisualStudio.Component.Static.Analysis.Tools
        --add Microsoft.VisualStudio.Component.Debugger.JustInTime
        --add Microsoft.VisualStudio.Component.Windows10SDK.16299.Desktop
        --add Microsoft.VisualStudio.Component.Git
        --add Component.GitHub.VisualStudio
        --add Component.PowerShellTools.VS2017
      "
      $ProgressPreference = "silentlyContinue"
      [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
      wget http://download.qt.io/official_releases/online_installers/qt-unified-windows-x86-online.exe -OutFile C:\\Users\\vagrant\\Downloads\\qt-unified-windows-x86-online.exe
      C:\\Users\\vagrant\\Downloads\\qt-unified-windows-x86-online.exe --script V:\\qt-auto-install-win.js --platform windows --verbose
    DEV_SETUP

    # Admin user name and password
    node.winrm.username = "vagrant"
    node.winrm.password = "vagrant"

    node.vm.guest = :windows
    node.windows.halt_timeout = 15

    node.vm.network :forwarded_port, guest: 3389, host: 3389, id: "rdp", auto_correct: true
    node.vm.network :forwarded_port, guest: 22, host: 2231, id: "ssh", auto_correct: true

    node.vm.provider :virtualbox do |v, override|
      v.gui = true
      v.customize ["modifyvm", :id, "--memory", 2048]
      v.customize ["modifyvm", :id, "--cpus", 2]
      v.customize ["setextradata", "global", "GUI/SuppressMessages", "all" ]
      v.customize ['modifyvm', :id, '--clipboard', 'bidirectional']
    end
  end
end

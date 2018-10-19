Vagrant.configure("2") do |config|
  config.ssh.forward_agent = true

  config.vm.define "ubuntu" do |node|
    node.vm.box = "bento/ubuntu-18.04"

    # Install xfce and virtualbox additions for GUI.
    # You must reboot this VM after provisioning to get windowed environment.
    node.vm.provision "shell", inline: <<~DEV_SETUP
      curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
      apt-get install -y \
        nodejs xfce4 slim \
        virtualbox-guest-dkms virtualbox-guest-utils virtualbox-guest-x11
    DEV_SETUP

    node.vm.provider "virtualbox" do |v|
      v.gui = true
      v.memory = 512
      v.cpus = 1
    end
  end

  config.vm.define "centos" do |node|
    node.vm.box = "bento/centos-7"

    # Install xfce and virtualbox additions for GUI.
    node.vm.provision "shell", inline: <<~DEV_SETUP
      curl --silent --location https://rpm.nodesource.com/setup_10.x | bash -
      yum -y install nodejs
      yum install epel-release -y
      yum groupinstall "Server with GUI" -y
      systemctl set-default graphical.target
      yum install perl gcc dkms kernel-devel kernel-headers make bzip2 -y
      # https://linuxconfig.org/how-to-install-virtualbox-guest-additions-on-centos-7-linux
      systemctl isolate graphical.target
    DEV_SETUP

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
      choco install --yes --no-progress nodejs
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

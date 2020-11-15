# Chef Workstation Tray Application

**Umbrella Project**: [Workstation](https://github.com/chef/chef-oss-practices/blob/master/projects/chef-workstation.md)

* **[Project State](https://github.com/chef/chef-oss-practices/blob/master/repo-management/repo-states.md):** Active
* **Issues [Response Time Maximum](https://github.com/chef/chef-oss-practices/blob/master/repo-management/repo-states.md):** 14 days
* **Pull Request [Response Time Maximum](https://github.com/chef/chef-oss-practices/blob/master/repo-management/repo-states.md):** 14 days

This the the tray application for Chef Workstation. It's written in Electron and is where we implement the UI based features of Chef Workstation.

## Development

### Development Prerequisites

* [NodeJS LTS](https://nodejs.org/)

#### On macOS

##### [Homebrew](https://brew.sh)

```shell
brew install node@10
```

##### [ASDF](https://github.com/asdf-vm/asdf)

```shell
asdf install
```

#### On Windows

[Download NodeJS LTS](https://nodejs.org/en/download/)

### Running the Dev Environment

```shell
npm install
npm start
```

## Design

Designs and assets can be found in our [Zeplin project](https://zpl.io/Vqwx37m).

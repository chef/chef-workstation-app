
## Chef Workstation Tray Application PoC - QT


### Why Qt?
Qt offers a robust cross-platform C++ framework, with bindings for many other languages. The

### Setup and Build

#### Windows
* Install Visual Studio Community
* Install Qt. Recommend including the Qt creator component, which as an IDE that knows about Qt.

```
qmake systray.pro
nmake release
* cd release
* mt.exe -manifest systray.exe.manifest -outputresource: systray.exe

```
Then run 'systray.exe'


#### Linux
* Install the latest QT libraries for your operating system, and run `make` from the project directory.
* `./systray`


#### Mac OSX
* (Help Wanted)


### Findings

Initial exmaple of modifying the basic example tray application to include the Chef icon and different menu options
was trivial - about two hours including some time exploring the IDE.

THe Qt API is reasonable and consistent (at least as far as I used it). Some experimenting
showed extending functionality for common tasks (adding more menu items, adding REST API calls)
was relatively trivial. It was about 4 hours to level up the simple demo to a complete app that looked roughly
like the current design iterations.

Plus:
* Common code base across platforms
* The Qt Creator IDE includes tools for build UIs that are consistent across platforms.
* Qt provides bindings for multiple languages.
* Native code, small memory footprint (~55-66MB for the PoC app )
* Very complete and solid API from Qt

Minus:
* May not provide platform-specific look and feel (but L&F is consistent across platforms)
  * Did not explore the options here in depth.
* C++ is not a language in common usage at Chef, which means there's a double-learning curve to
  get enough knowledge of both Qt and C++.



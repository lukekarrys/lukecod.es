---
type: module
title: hid-mapper
gh:
  - lukekarrys/hid-mapper
npm:
  - hid-mapper
---

[node-gamepad](https://github.com/carldanley/node-gamepad) is a great module for using various gamepads within node. I had some 3rd party SNES and N64 controllers laying around but the library didn't support them at the time. I wrote [hid-mapper](https://github.com/lukekarrys/hid-mapper) as a CLI tool to take any controller and map the siginals sent from each button/joystick to a JSON config file that can be [consumed](https://github.com/carldanley/node-gamepad/pull/10) [by](https://github.com/carldanley/node-gamepad/pull/3) node-gamepad. Please use this to take a a USB gamepad and fly a drone with it.

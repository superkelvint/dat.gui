/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import Color from './color/Color';
import math from './color/math';
import interpret from './color/interpret';

import Controller from './controllers/Controller';
import BooleanController from './controllers/BooleanController';
import OptionController from './controllers/OptionController';
import StringController from './controllers/StringController';
import NumberController from './controllers/NumberController';
import NumberControllerBox from './controllers/NumberControllerBox';
import NumberControllerSlider from './controllers/NumberControllerSlider';
import FunctionController from './controllers/FunctionController';
import ColorController from './controllers/ColorController';
// import ImageController from './controllers/ImageController';

import dom from './dom/dom';
import GUI from './gui/GUI';

export default {
  color: {
    Color: Color,
    math: math,
    interpret: interpret
  },

  controllers: {
    Controller: Controller,
    BooleanController: BooleanController,
    OptionController: OptionController,
    StringController: StringController,
    NumberController: NumberController,
    NumberControllerBox: NumberControllerBox,
    NumberControllerSlider: NumberControllerSlider,
    FunctionController: FunctionController,
    ColorController: ColorController,
    // ImageController: ImageController,
  },

  dom: {
    dom: dom
  },

  gui: {
    GUI: GUI
  },

  GUI: GUI
};

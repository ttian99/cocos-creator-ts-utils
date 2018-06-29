/**
 * 工具类的入口
 * @example
 * 1.单独引入 import {eventMgr} from './utils';
 * 2.整体引入 import utils from "";
 */
import EventMgr from "./event/EventMgr";
import * as Lodash from "./libs/Lodash";
import Http from './net/Http';
import Fetch from './net/Fetch';
import Loc from "./libs/loc";
import stringTools from "./libs/StringTools";
import sysTools from "./libs/sysTools";
import WxTools from "./libs/wxTools";
import AudioTools from "./audio/audioTools";
import SpriteTools from "./libs/SpriteTools";


export let audioTools = AudioTools;
export let eventMgr = EventMgr;
export let http = Http;
export let fetch = Fetch;
export let loc = Loc;
export let lodash = Lodash;
export let _ = lodash;
export let stringEx = stringTools;
export let sys = sysTools;
export let wxTools = WxTools;
export let spriteTools = SpriteTools;

const utils = { audioTools, eventMgr, http, fetch, loc, lodash, _, stringEx, sys, wxTools, spriteTools };
export default utils;
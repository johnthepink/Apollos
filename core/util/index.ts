

import { inherit } from "./inherit"
import { base64Encode, base64Decode } from "./encode"
import Guid from "./guid"
import { parse } from "./xml"

import Error from "./error"
import format from "./format"
import regex from "./regex"
import rock from "./rock"
import validate from "./validate"
import Debouncer from "./debounce"

export default {
  inherit,
  base64Encode,
  base64Decode,
  Guid,
  parseXML: parse,
  Error,
  format,
  regex,
  rock,
  Debouncer,
  validate,
}

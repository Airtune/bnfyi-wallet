import * as process from "process";
import * as buffer from "buffer";

if (typeof window !== "undefined") {
  window["process"] = process;
  window["Buffer"] = buffer.Buffer;
}

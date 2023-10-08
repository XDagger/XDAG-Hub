import { merge } from "webpack-merge";
import configCommon from "./webpack.config.common";
import type { Configuration } from "webpack";

const configProd: Configuration = {
  mode: "production",
  devtool: "source-map",
};

async function getConfig() {
  return merge(await configCommon(), configProd);
}

export default getConfig;

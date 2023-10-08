import { injectDappInterface } from "./interface-inject";
import { init as keepAliveInit } from "./keep-bg-alive";
import { setupMessagesProxy } from "./messages-proxy";

injectDappInterface();
setupMessagesProxy();
keepAliveInit();

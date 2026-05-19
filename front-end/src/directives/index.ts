import { setupAuthDirective } from './auth';
import { setupHighlightDirective } from './highlight';
import { setupRippleDirective } from './ripple';
import type { App } from 'vue';

export function setupGlobDirectives(app: App<Element>) {
  setupAuthDirective(app); // 权限指令
  setupHighlightDirective(app); // 高亮指令
  setupRippleDirective(app); // 水波纹指令
}

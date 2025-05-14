import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export function getPrerenderConfig() {
  return {
    routes: {
      '/contest/:id': getPrerenderParams,
    },
  };
}

function getPrerenderParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default bootstrap;

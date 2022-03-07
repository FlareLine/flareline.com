import { App } from '@aws-cdk/core';
import { FrontendStack } from './stack';

const app = new App();
new FrontendStack(app, 'FrontendStack');

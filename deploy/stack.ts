import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { Frontend } from './frontend';

export class FrontendStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		new Frontend(this, 'Frontend');
	}
}

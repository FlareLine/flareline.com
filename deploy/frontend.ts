import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { OriginAccessIdentity, Distribution, AllowedMethods } from '@aws-cdk/aws-cloudfront';
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins';
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { BlockPublicAccess, Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { Construct, RemovalPolicy } from '@aws-cdk/core';

export class Frontend extends Construct {
	constructor(scope: Construct, id: string) {
		super(scope, id);

		const bucket = new Bucket(this, 'Bucket', {
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
			bucketName: 'web.flareline.com',
			removalPolicy: RemovalPolicy.RETAIN,
			websiteErrorDocument: 'index.html',
			websiteIndexDocument: 'index.html',
		});

		const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
			hostedZoneId: 'Z03308839UCKCOXZ5BOC',
			zoneName: 'flareline.com',
		});

		const certificate = new DnsValidatedCertificate(this, 'Certificate', {
			domainName: 'flareline.com',
			hostedZone,
			region: 'us-east-1',
			subjectAlternativeNames: [
				'www.flareline.com',
			],
		});

		const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity', {
			comment: 'Allows Cloudfront access to Frontend bucket.',
		});
		bucket.grantRead(originAccessIdentity);

		const distribution = new Distribution(this, 'Distribution', {
			certificate,
			defaultBehavior: {
				origin: new S3Origin(bucket, {
					originAccessIdentity,
				}),
				allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
			},
			defaultRootObject: 'index.html',
			domainNames: [
				'flareline.com',
				'www.flareline.com',
			],
		});

		const deployment = new BucketDeployment(this, 'AssetDeployment', {
			destinationBucket: bucket,
			sources: [
				Source.asset('dist'),
			],
			distribution,
			distributionPaths: [ '/*' ],
		});

		const record = new ARecord(this, 'AliasRecord', {
			target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
			zone: hostedZone,
		});
	}
}

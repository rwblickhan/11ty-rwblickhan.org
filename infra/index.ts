import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as cloudflare from "@pulumi/cloudflare";

const config = new pulumi.Config();
const awsRegion = config.get("awsRegion") || "us-west-2";
const siteDomain = config.get("siteDomain") || "rwblickhan.org";

const site = new aws.s3.BucketV2("site", {
    bucket: siteDomain,
    acl: "public-read",
    websites: [
        {
            indexDocument: "index.html",
            errorDocument: "index.html",
        },
    ],
});

const www = new aws.s3.BucketV2("www", {
    bucket: `www.${siteDomain}`,
    acl: "private",
    policy: "",
    websites: [
        {
            redirectAllRequestsTo: `https://${siteDomain}`,
        },
    ],
});

const backup = new aws.s3.BucketV2("backup", {
    bucket: `${siteDomain}-backup`,
    acl: "private",
    policy: "",
});

const publicRead = new aws.s3.BucketPolicy("publicRead", {
    bucket: site.id,
    policy: pulumi.all([site.arn, site.arn]).apply(([siteArn, siteArn1]) =>
        JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "PublicReadGetObject",
                    Effect: "Allow",
                    Principal: "*",
                    Action: "s3:GetObject",
                    Resource: [siteArn, `${siteArn1}/*`],
                },
            ],
        })
    ),
});

const domain = cloudflare.getZones({
    filter: {
        name: siteDomain,
    },
});

const cnameRecord = new cloudflare.Record("cnameRecord", {
    zoneId: domain.then(domain => domain.zones[0].id || ""),
    name: siteDomain,
    value: site.websiteEndpoint,
    type: "CNAME",
    ttl: 1,
    proxied: true,
});

const wwwRecord = new cloudflare.Record("wwwRecord", {
    zoneId: domain.then(domain => domain.zones[0].id || ""),
    name: "www",
    value: siteDomain,
    type: "CNAME",
    ttl: 1,
    proxied: true,
});

const https = new cloudflare.PageRule("https", {
    zoneId: domain.then(domain => domain.zones[0].id || ""),
    target: `*.${siteDomain}/*`,
    actions: {
        alwaysUseHttps: true,
    },
});

export const websiteBucketName = site.id;
export const bucketEndpoint = site.websiteEndpoint;
export const domainName = siteDomain;

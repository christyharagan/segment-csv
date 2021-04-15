#!/usr/bin/env node

import * as yargs from 'yargs'
import { config_for_s3, setup, SetupBasic, Setup } from './aws_setup'
import { write_to_aws } from './build_ui'
import { deploy } from './deploy'
import * as path from 'path'

yargs
  .command('deploy', 'Perform a full build and deploy.', {
    builder: {
      'lambdaS3Bucket': {
        description: 'The S3 bucket to store the lambda configuration. Must be in the same account as the lambdas',
        string: true,
        required: true
      },
      'lambdaAccessKeyId': {
        description: 'The Access Key ID of the account that will host the Lambdas',
        string: true,
        required: true
      },
      'lambdaSecretAccessKey': {
        description: 'The Secret Access Key of the account that will host the Lambdas',
        string: true,
        required: true
      },
      'region': {
        description: 'The region of the S3 bucket and lambdas',
        string: true,
        required: true
      },
      's3BucketName': {
        description: 'The name of the S3 bucket',
        string: true,
        required: true
      },
      's3AccountId': {
        description: 'The account ID of the S3 bucket',
        string: true,
        required: true
      }
    },
    handler: async args => {
      deploy(args as any as Setup & { lambdaS3Bucket: string })
    }
  })
  .command('setup_aws', 'Add extra configuration to the lambda set-up that CloudFoundry wont support. Run after "sam deploy"', {
    builder: {
      'lambdaAccessKeyId': {
        description: 'The Access Key ID of the account that will host the Lambdas',
        string: true,
        required: true
      },
      'lambdaSecretAccessKey': {
        description: 'The Secret Access Key of the account that will host the Lambdas',
        string: true,
        required: true
      },
      'region': {
        description: 'The region of the S3 bucket and lambdas',
        string: true,
        required: true
      },
      's3BucketName': {
        description: 'The name of the S3 bucket',
        string: true,
        required: true
      },
      's3AccountId': {
        description: 'The account ID of the S3 bucket',
        string: true,
        required: true
      }
    },
    handler: async args => {
      setup(args as any as Setup)
    }
  })
  .command('write_aws_ui', 'Update the compiled AWS UI lambda with the gzipped base64 encoded UI.', {
    builder: {
      'lambdaAccessKeyId': {
        description: 'The Access Key ID of the account that will host the Lambdas',
        string: true,
        required: true
      },
      'lambdaSecretAccessKey': {
        description: 'The Secret Access Key of the account that will host the Lambdas',
        string: true,
        required: true
      },
      'region': {
        description: 'The region of the S3 bucket and lambdas',
        string: true,
        required: true
      }
    },
    handler: async args => {
      write_to_aws((args as any).lambdaAccessKeyId, (args as any).lambdaSecretAccessKey, (args as any).region, path.join(__dirname, '..', 'built', 'ui.js'))
    }
  })
  .command('s3_assets', 'Fetch the Lambda ARN to use as the S3 notification target and the S3 policy. Should be run after a deploy.', {
    builder: {
      'lambdaAccessKeyId': {
        description: 'The Access Key ID of the account that will host the Lambdas',
        string: true,
        required: true
      },
      'lambdaSecretAccessKey': {
        description: 'The Secret Access Key of the account that will host the Lambdas',
        string: true,
        required: true
      },
      'region': {
        description: 'The region of the S3 bucket and lambdas',
        string: true,
        required: true
      },
      's3BucketName': {
        description: 'The name of the S3 bucket',
        string: true,
        required: true
      }
    },
    handler: async args => {
      config_for_s3(args as any as SetupBasic)
    }
  })
  .demandCommand()
  .argv
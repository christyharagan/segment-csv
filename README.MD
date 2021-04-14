# Segment CSV Importer

Easily import CSVs into Segment. Deploys AWS lambdas into one account that perform the work, whilst reading CSV files from an S3 bucket (that can sit in a different account). The only requirement is the lambdas and S3 buckets sit in the same region.

## Deployment

Install the deployer:

```
npm i -g segment-csv-setup
```

Then run the deployer

```
segcsv deploy --lambdaAccessKeyId=ACCESS_KEY_OF_ACCOUNT_HOSTING_LAMBDAS --lambdaSecretAccessKey=SECRET_KEY_OF_ACCOUNT_HOSTING_LAMBDAS --region=REGION_OF_LAMBDAS_AND_S3_BUCKETS --s3BucketName=S3_BUCKET_NAME --s3AccountId=ID_OF_ACCOUNT_HOSTING_S3_BUCKETS
--lambdaS3Bucket=S3_BUCKET_STORING_LAMBDA_DETAILS_IN_SAME_ACCOUNT_AS_LAMBDAS
```

At the end you'll see some final output in the terminal that gives you three things

 * The first is the URN of a lambda. You will need to add this as a 
 * A set of policies. You will need to add this
 * A URL to the config UI. This will be used to configure the CSVs.

## Usage

Each CSV "type" must be configured. A CSV file has a fixed number of columns, and in general those columns have the same type. Each "type" of CSV must be configured to have these columns mapped to properties in Segment. First you configure that type, and then to upload the CSV, simply write a .csv file into the configured S3 bucket with the prefix ```CSVType-```. As an example, if you've configured a type of CSV called "EmployeeData", then you would need to have files that looked like ```EmployeeData-X.csv``` (where X can be anything)

 * Open the config UI
 * Enter the name of the S3 bucket and type of CSV you want to configure in the form fields
 * Configure the JSON. You can hover over JSON properties to get hints on how to use them, and press Ctrl-space to get a pop-up list of suggested properties.

An example configuration would look like:

```json
{
  "segmentWriteKey": "adfj45jaf",
  "csvParseOptions": {
      "separator": "|"
  },
  "eventName": "My Segment Event",
  "fieldMappings": {
    "kind": "track",
    "userId": "EUCI",
    "properties": {
        "My CSV Column": {
            "name": "My Renamed Column",
            "type": "bool"
        }
    }
  }
}
```

This will write events to the Segment source with configured write key. The CSV files are expected to be pipe-delimited. All events fired will be track events with event name "My Segment Event". It will look to the "EUCI" column for the user ID (if you don't specify a anonymous or user ID column, a randomly generated anonymous ID will be used for each row). Finally, the "My CSV Column" will be renamed to "My Renamed Column" and parsed as a boolean value (mapping "true" or "1" to true, and "false" or "0" to false)

## Contributing

If you want to contribute to the CSV importer, clone this GitHub repository. 

If you want to change the lambdas, look in the aws folder. You'll need to compile any changes by running ```tsc -p``` in that folder

If you want to change to the UI, look in the ui folder. You'll need to compile any changes by running ```tsc -p``` in that folder, and then run ```node ./build.js```.

Once changes are made, you can run the deployer from the setup folder by running ```node ./out/cli.js```
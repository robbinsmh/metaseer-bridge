var dynamodbLocal = require("dynamodb-localhost");
// dynamodbLocal.install(); /* This is one time operation. Safe to execute multiple times which installs DynamoDB once. All the other methods depends on this. */
dynamodbLocal.start({port: 8000});

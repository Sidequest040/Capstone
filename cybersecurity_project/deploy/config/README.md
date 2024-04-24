# Deployment Instructions

This document outlines the steps required to deploy the cybersecurity project.

## Configuration

Before deploying, ensure that the environment configuration files located in `deploy/config` are set up correctly for your target environment.

## Building the Application

Run `deploy/scripts/build.sh` to build the Docker container for the application.

## Testing

To run tests, execute `deploy/scripts/test.sh`.

## Deploying

Use `deploy/scripts/deploy.sh` to deploy the application.

## Rollback

If needed, `deploy/scripts/rollback.sh` can be used to revert to a previous deployment.

## Database Migration

To migrate the database, use `deploy/scripts/migrate-database.sh`.

## Additional Information

More detailed instructions can be found within each script file.

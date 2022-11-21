# Justice Counts Publisher: Frontend

Welcome to the Justice Counts Publisher - a tool that allows agencies to record Justice Counts metrics.

The frontend of this application, which lives in this directory, was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), written in [TypeScript](https://www.typescriptlang.org/docs), and authenticated via [Auth0](https://auth0.com/). The backend of the application lives in the [`recidiviz-data`](https://github.com/Recidiviz/recidiviz-data) Github repo in the [`justice_counts/control_panel`](https://github.com/Recidiviz/recidiviz-data/tree/main/recidiviz/justice_counts/control_panel) directory.

To run the app locally, you have two choices:

1. Run our backend locally in a Docker container. Instructions for this can be found [here](https://github.com/Recidiviz/recidiviz-data/tree/main/recidiviz/justice_counts/control_panel).
2. Run the app against our deployed staging backend. To do this, modify the `REACT_APP_PROXY_HOST` environment variable, as described the "Running the app" section below.

## Initial setup

1. Make a copy of `.env.example` and rename it to `.env`

2. Install dependencies

   ##### For all Yarn installation options, see [Yarn Installation](https://yarnpkg.com/en/docs/install).

   ```sh
   yarn install
   ```

## Running the app

Run the local development server:

```sh
yarn run dev
```

By default, this will assume that you are running the backend locally at the same time on port `localhost:5001` (instructions for this can be found [here](https://github.com/Recidiviz/recidiviz-data/tree/main/recidiviz/justice_counts/control_panel)).

If you want to run against the staging backend, modify the environment variable `REACT_APP_PROXY_HOST`, either by changing the value in the `.env` file, or by running:

```sh
REACT_APP_PROXY_HOST=<staging backend URL> yarn run dev
```

## Testing and Linting

```sh
yarn test
yarn lint
```

# Justice Counts Publisher: Frontend

Welcome to the Justice Counts Publisher - a tool that allows agencies to report Justice Counts metrics.

The frontend of this application, which lives in this directory, was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), written in [TypeScript](https://www.typescriptlang.org/docs), and authenticated via [Auth0](https://auth0.com/). The backend of the application lives in the [`recidiviz-data`](https://github.com/Recidiviz/recidiviz-data) Github repo in the [`justice_counts/control_panel`](https://github.com/Recidiviz/recidiviz-data/tree/main/recidiviz/justice_counts/control_panel) directory.

To run the app locally, you need to spin up both the backend and frontend simultaneously. Instructions for spinning up the frontend are below; instructions for spinning up the backend can be found [here](https://github.com/Recidiviz/recidiviz-data/tree/main/recidiviz/justice_counts/control_panel).

## Running the app frontend

1. Install dependencies

   ##### For all Yarn installation options, see [Yarn Installation](https://yarnpkg.com/en/docs/install).

   ```sh
   yarn install
   ```

2. Run the local development server

   ```sh
   yarn run dev
   ```

3. Test your development environment

   ```sh
   yarn test
   yarn lint
   ```

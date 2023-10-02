## How to add, update or delete Help Center Guides


### If you'd like to UPDATE a Help Center guide:
  1. Go to the `Guides` folder in this directory
  2. Locate the guide file you'd like to update
  3. Update the body of the component directly (using HTML/JSX/styled-components)


  ###### ./Guides/Guide.tsx (for example)

```jsx
export const Guide = () => (
  <> 
    {/* Make edits within here */}
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        ...
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        ...
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
```

---

### If you'd like to ADD a Help Center guide:

  1. Go to the `Guides` folder in this directory
  2. Duplicate the `TEMPLATE.tsx` file
  3. Update the file name and component name (make sure they match) and update the body of the component with the desired JSX
  4. Then, go to the `HelpCenterSetup.tsx` file
  5. Import your newly created component
  6. Update the `helpCenterGuideStructure` object and create a guide object for your newly created guide under the `guides` property for either the Publisher/Dashboard app with the following properties:
        * **key**: a unique String that distinguishes this guide
        * **category**: the section that this guide falls under in the Publisher directory page (use the `PublisherGuideCategories` enum)
        * **title**: the display name (will be used to render the title)
        * **caption**: the description of the guide (will be used to render the caption)
        * **path**: URL pathname for this guide
        * **element**: the guide component you created
        * **relevantGuides**: a list of relevant guide keys (empty [] will not render any relevant guides)
          * **Important note to ensure proper linking**: if a relevant guide belongs to a different app guide, please prepend `<publisher or dashboard>/` to the key. For example, if the Dashboards guide (within the Dashboard app guide) links to the Explore Data guide (within the Publisher app guide) the relevant guide key would be `publisher/explore-data`. If it links to a guide within the same app guide (e.g. Agency Settings guide links to Explore Data guide - both Publisher guides), you can just add the guide key (e.g. `explore-data`) without prepending anything.


**NOTE**: The title, caption and relevant links will be automatically rendered based on the object created in `HelpCenterSetup.tsx`, so all you need to worry about in a guide component is the body of the guide.

###### ./Guides/TEMPLATE.tsx > ./Guides/NewGuide.tsx

```jsx
...

export const NewGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        ...
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        ...
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>...</Styled.SectionTitle>
      <Styled.SectionParagraph>
        ...
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
```

###### HelpCenterSetup.tsx
```jsx
...

import { NewGuide } from "./Guides/NewGuide";

export const helpCenterGuideStructure: HelpCenterGuideStructure = {
  publisher: {
    key: "publisher",
    title: "Publisher",
    path: "publisher",
    element: <HelpCenterPublisher />,
    thumbnail: <Thumbnail src={publisherThumbnail} alt="" width="461px" />,
    guides: {
      "explore-data": {
        category: "Interact with the Data",
        title: "Explore your Data",
        caption: "Interact with your data to discover insights.",
        path: "explore-data",
        element: <ExploreDataGuide />,
        relevantGuides: ["explore-data", "agency-settings"],
      },
      "agency-settings": {
        category: "Account Setup",
        title: "Agency Settings",
        caption: "See and edit information about your agency.",
        path: "agency-settings",
        element: <AccountSetupGuide />,
        relevantGuides: ["agency-settings", "explore-data"],
      },
      // The below object adds the `NewGuide` you created within Publisher's directory
      // Template:
      "new-guide-key": {
        category: "Add Data",
        title: "New Guide",
        caption: "Caption for the New Guide.",
        path: "new-guide",
        element: <NewGuide />,
        relevantGuides: ["relevant-guide-key", "relevant-guide-key"]
      }
    },
  },
  dashboard: {
    ...
  },
};
```
---

### If you'd like to remove a Help Center guide:
Please delete the relevant guide object from within the `helpCenterGuideStructure` object in `HelpCenterSetup.tsx` and the guide component in the `Guides` folder.

---

### Other helpful tips:

  - If you want to add an image within a paragraph, use the `<Styled.ImageWrapper><Styled.Image src={importedImage} alt="" width="300px" align="center" /><Styled.ImageWrapper>` tag where you can explicitly set the `width` (max width is 555px) and alignment of the image (left, center, right).
    - Important things to note:
      - When adding an image file, please add the file to the `justice-counts/publisher/src/components/assets` folder. Then, within the guide components (`justice-counts/publisher/src/components/HelpCenter/Guides`), you can import the image via this relative path `../../assets/your-image-here.png`.
      - Make sure you wrap all images within the `<Styled.ImageWrapper></Styled.ImageWrapper>`` tags to ensure proper spacing.
      - Make sure that the `Styled.ImageWrapper` is nested within a `Styled.SectionWrapper` to ensure proper spacing.
      - You can add a caption by adding a `<Styled.ImageCaption></Styled.ImageCaption>` directly after the image but still nested within the `Styled.ImageWrapper` (see example below)

        ```
        import testScreenshot from "../../assets/test-screenshot.png";
        import * as Styled from "../HelpCenter.styles";

        export const ExploreDataGuide = () => (
          <>
            <Styled.SectionWrapper>
              <Styled.SectionParagraph>
                The Explore Data tab allows you to visualize the data you have uploaded
                into Publisher. It displays both draft and published data.
              </Styled.SectionParagraph>
              <Styled.SectionParagraph>
                Click Explore Data, the fourth item
                on the navigation bar, to reach this page.
              </Styled.SectionParagraph>
              <Styled.ImageWrapper>
                <Styled.Image src={testScreenshot} alt="" width="300px" align="center" />
                <Styled.ImageCaption>Hello this is a caption</Styled.ImageCaption>
              </Styled.ImageWrapper>
            </Styled.SectionWrapper>
            ...
          </>
        );
        ```

- If you want to add a link from a guide to the Publisher app, the link will need to include the agency ID. All you need to do is import the `LinkToPublisher` component and wrap that around the word(s) you want to link.
  - `publisherPath` is a prop you need to define that will be the relative path (the path after the `.../agency/<agencyId>/` and before any query params `?=...`) you want to link to in Publisher.
    - E.g. linking to Agency Settings (Publisher URL is: `.../agency/149/settings/agency-settings`) the `publisherPath` would be `settings/agency-settings`
    - E.g. linking to Explore Data page (Publisher URL is: `.../agency/149/data?system=...`) the `publisherPath` would be `data`

  ```
  ...
          <Styled.SectionParagraph>
            Click{" "}
            <LinkToPublisher publisherPath="data">Explore Data</LinkToPublisher>,
            the fourth item on the navigation bar, to reach this page.
          </Styled.SectionParagraph>
  ...
  ```

- If Prettier is breaking the lines and components up and you end up noticing that wordshavenospacing to each other, feel free to add a {" "} at the end of the line above the break (see code example above).

- If apostrophes are causing issues within the components, please use `&apos;` (e.g. Don't -> Don`&apos;`t)

- If you want an app guide (Publisher or Dashboard) to be visible but not clickable (e.g. if a guide is not ready to be release yet, but we're OK with users seeing the guide and thumbnail for it), set the app guide `path` property to an empty string `""`.

  Example:
  ```
  export const helpCenterGuideStructure: HelpCenterGuideStructure = {
  publisher: {
    key: "publisher",
    title: "Publisher",
    path: "", // Now, you'll still see a button for it, but it won't be clickable
    element: <HelpCenterPublisher />,
    thumbnail: <Thumbnail src={publisherThumbnail} alt="" width="461px" />,
    guides: {
      ...
    },
    ...
    ```

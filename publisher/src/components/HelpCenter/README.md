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
        * **relevantGuides**: a list of relevant guide keys
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

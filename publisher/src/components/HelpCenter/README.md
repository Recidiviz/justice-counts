## How to add or update Help Center Guides

### If you'd like to UPDATE a Help Center guide:
  1. Go to the `HelpCenterGuides.tsx` file
  2. Locate & update the guide (functional component) directly


  ###### HelpCenterGuides.tsx

```jsx
... // Other guides

export const Guide = () => (
  // Make edits within here
  <> 
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

  1. Go to the `HelpCenterGuides.tsx` file
  2. Add a functional component guide that renders the desired JSX
  3. Then, go to the `HelpCenterSetup.tsx` file
  4. Import your newly created component
  5. Update the `helpCenterGuideStructure` object and create a guide object for your newly created guide under the `guides` property for either the Publisher/Dashboard app with the following properties:
        * **key**: a unique String that distinguishes this guide
        * **category**: the section that this guide falls under in the Publisher directory page (use the `PublisherGuideCategories` enum)
        * **label**: the display name
        * **caption**: the description of the guide
        * **path**: URL pathname for this guide
        * **element**: the guide component you created
        * **relevantGuides**: a list of relevant guide keys
          * **Important note to ensure proper linking**: if a relevant guide belongs to a different app guide, please prepend `<publisher or dashboard>/` to the key. For example, if the Dashboards guide (within the Dashboard app guide) links to the Explore Data guide (within the Publisher app guide) the relevant guide key would be `publisher/explore-data`. If it links to a guide within the same app guide (e.g. Agency Settings guide links to Explore Data guide - both Publisher guides), you can just add the guide key (e.g. `explore-data`) without prepending anything.

###### HelpCenterGuides.tsx

```jsx
... // Other guides

// New Guide Template
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
import {
  AccountSetupGuide,
  ExploreDataGuide,
  HelpCenterPublisher,
  NewGuide,
  ...
} from ".";

export const helpCenterGuideStructure: HelpCenterGuideStructure = {
  publisher: {
    key: "publisher",
    label: "Publisher",
    path: "publisher",
    element: <HelpCenterPublisher />,
    guides: {
      "explore-data": {
        category: "Interact with the Data",
        label: "Explore your Data",
        caption: "Interact with your data to discover insights.",
        path: "explore-data",
        element: <ExploreDataGuide />,
        relevantGuides: ["explore-data", "agency-settings"],
      },
      "agency-settings": {
        category: "Account Setup",
        label: "Agency Settings",
        caption: "See and edit information about your agency.",
        path: "agency-settings",
        element: <AccountSetupGuide />,
        relevantGuides: ["agency-settings", "explore-data"],
      },
      // Add a new guide within Publisher's directory
      // Template:
      "new-guide-key": {
        category: "Add Data",
        label: "New Guide",
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
Please delete the relevant guide object from within the `helpCenterGuideStructure` object in `HelpCenterSetup.tsx` and the guide component in `HelpCenterGuides.tsx`.

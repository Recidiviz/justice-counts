## How to add or update Help Center Guides

If you'd like to update one of the Help Center guides, please go to the `HelpCenterGuides.tsx` file, locate and update the guide (functional component) directly.

If you'd like to add a Help Center guide, please go to the `HelpCenterGuides.tsx` file, add a functional component guide that renders the desired JSX, then go to the `HelpCenterSetup.tsx` file, import your newly created component and update the `helpCenterGuideStructure` object.

###### HelpCenterGuides.tsx

```jsx
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
  </>
);
```

To add a guide within the `helpCenterGuideStructure` object, you'll need to create an object for the new guide that will go under the `guides` property for either the Publisher/Dashboard app with the following properties:

 * key: a unique String that distinguishes this guide
 * category: the section that this guide falls under in the Publisher directory page
 * label: the display name
 * caption: the description of the guide
 * path: URL pathname for this guide
 * element: the guide component you created
 * relevantGuides: a list of relevant guide keys

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

If you'd like to remove a guide, please delete the relevant guide object from within the `helpCenterGuideStructure` object in `HelpCenterSetup.tsx` and the guide component in `HelpCenterGuides.tsx`.

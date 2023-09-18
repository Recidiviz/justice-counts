## How to add or update Help Center Guides

If you'd like to update one of the Help Center guides, please go to the `HelpCenterGuides.tsx` file, find and update the guide (functional component) directly.

If you'd like to add a Help Center guide, please go to the `HelpCenterGuides.tsx` file, add a functional component guide that renders the desired JSX, and update the `helpCenterGuideStructure` object in `HelpCenterSetup.tsx` and import your newly created component.

###### HelpCenterGuides.tsx

```jsx
export const NewGuide = () => (
  <>
    <Styled.Title>...</Styled.Title>
    <Styled.Caption>
      ...
    </Styled.Caption>

    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        ...
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        ...
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
    ...

    <Styled.SectionTitle>Relevant Pages</Styled.SectionTitle>
    <Styled.RelevantPagesWrapper>
      ...
    </Styled.RelevantPagesWrapper>
  </>
);
```

To add a guide within the `helpCenterGuideStructure` object, you'll need to create an object for the new guide that will go under the `nestedGuides` for either the Publisher/Dashboard app with the following properties:

 * key: a unique String that distinguishes this guide
 * category: the section that this guide falls under in the Publisher directory page
 * label: the display name,
 * path: URL pathname for this guide,
 * element: the guide component you created,


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
    nestedGuides: [
      {
        key: "explore-data",
        category: "Interact with the Data",
        label: "Explore your Data",
        path: "explore-data",
        element: <ExploreDataGuide />,
      },
      {
        key: "agency-settings",
        category: "Account Setup",
        label: "Agency Settings",
        path: "agency-settings",
        element: <AccountSetupGuide />,
      },
      // Add a new guide within Publisher's directory
      {
        key: "new-guide",
        category: "Add Data",
        label: "New Guide",
        path: "new-guide",
        element: <NewGuide />,
      }
    ],
  },
  dashboard: {
    key: "dashboard",
    label: "Dashboard",
    path: "dashboard",
    element: <>Not implemented</>,
    nestedGuides: [],
  },
};
```

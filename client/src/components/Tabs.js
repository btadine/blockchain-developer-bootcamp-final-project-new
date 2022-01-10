import React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const TabComponent = (props) => {
  const [BrowseView, PostView] = props.children;

  return (
  <Tabs>
    <TabList>
      <Tab>Browse</Tab>
      <Tab>Post</Tab>
    </TabList>
    <TabPanel>
      <div>
      {BrowseView}
      </div>
    </TabPanel>
    <TabPanel>
      <div>
      {PostView}
      </div>
    </TabPanel>
  </Tabs>
);
}

export default TabComponent;